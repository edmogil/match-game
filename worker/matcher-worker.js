// Match engine for the party word game (Gemini version, v3: blind translation).
// Rules: same word or direct translation = match. Synonyms never match.
//
// How cross-language matching works (strict on purpose):
//   1. The AI is NOT shown both words. It translates each English word on its own
//      (standard dictionary translation only) and reduces each Russian word to its base form.
//   2. The code then checks whether the Russian word's base form is one of the translations.
//   Two different words in the SAME language never match, and every answer is remembered.
//
// Cloudflare setup this file expects:
//   - KV namespace bound as  CACHE
//   - Secret                 GEMINI_API_KEY
//   - (optional) variable    GEMINI_MODEL   (default below)
//   - (optional) secret      TEST_TOKEN     (lets you open /?token=... to test the AI link)

const VERSION = "7";
const MAX_WORD_LEN = 40;
const MAX_PLAYERS = 12;
const MAX_WORDS_PER_PLAYER = 3;
const MAX_WORDS_PER_CALL = 60;
const DAILY_AI_CALLS_GLOBAL = 300;   // hard stop for the whole app per day
const DAILY_AI_CALLS_PER_ROOM = 40;  // per room per day
const MAX_REMEMBERED_WORDS = 3000;
const DEFAULT_MODEL = "gemini-3.5-flash-lite";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });

export function normalize(raw) {
  let w = String(raw || "").toLowerCase().trim();
  w = w.replace(/ё/g, "е").replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s+/g, " ");
  return w.slice(0, MAX_WORD_LEN);
}

const isCyrillic = (w) => /[Ѐ-ӿ]/.test(w);

// Rough singular form so "apples" = "apple". Russian word forms are handled by the AI (base form).
export function stem(w) {
  if (isCyrillic(w)) return w;
  if (w.length > 3 && w.endsWith("ies")) return w.slice(0, -3) + "y";
  if (w.length > 3 && /(s|x|z|ch|sh)es$/.test(w)) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  return w;
}

// Typo forgiveness: one slip is OK on longer words.
//   - needs both words to be at least 5 letters
//   - missing / extra letter and swapped neighbours are forgiven from 5 letters
//   - a single wrong letter is forgiven only from 7 letters (so house/horse, scare/score stay different)
export function withinOneEdit(a, b) {
  if (a === b) return true;
  const la = a.length, lb = b.length;
  if (Math.abs(la - lb) > 1 || Math.min(la, lb) < 5) return false;
  if (la === lb) {
    let i = 0; while (i < la && a[i] === b[i]) i++;
    if (a.slice(i + 1) === b.slice(i + 1)) return la >= 7;
    return i + 1 < la && a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2);
  }
  const [sh, lo] = la < lb ? [a, b] : [b, a];
  let i = 0; while (i < sh.length && sh[i] === lo[i]) i++;
  return sh.slice(i) === lo.slice(i + 1);
}

const today = () => new Date().toISOString().slice(0, 10);

// One KV value holds counters and every remembered word: 1 read per request,
// 1 write per AI call (Cloudflare's free KV allows ~1,000 writes/day).
async function loadState(env) {
  const fresh = { day: today(), global: 0, rooms: {}, tr: {}, lem: {} };
  try {
    const s = await env.CACHE.get("state:v4", "json");
    if (!s) return fresh;
    if (s.day !== today()) { s.day = today(); s.global = 0; s.rooms = {}; }
    s.tr = s.tr || {}; s.lem = s.lem || {}; s.rooms = s.rooms || {};
    return s;
  } catch (_) { return fresh; }
}

async function saveState(env, state) {
  try {
    for (const bag of [state.tr, state.lem]) {
      const keys = Object.keys(bag);
      if (keys.length > MAX_REMEMBERED_WORDS) for (const k of keys.slice(0, keys.length - MAX_REMEMBERED_WORDS)) delete bag[k];
    }
    await env.CACHE.put("state:v4", JSON.stringify(state));
  } catch (_) { /* never let storage problems break a game */ }
}

const cleanList = (v) => (Array.isArray(v) ? v : [v]).map((x) => normalize(x)).filter(Boolean).slice(0, 3);

// Blind translation: English words -> standard Russian translation(s); Russian words -> base form.
async function aiTranslate(env, enWords, ruWords) {
  const model = env.GEMINI_MODEL || DEFAULT_MODEL;
  const prompt =
    "You are a strict bilingual dictionary. Work on each word independently.\n" +
    "ENGLISH WORDS: give the standard dictionary Russian translation. Give the single most common translation. " +
    "Add a second one ONLY if the English word has a clearly different meaning (bat -> \"летучая мышь\" and \"бита\"). " +
    "NEVER add synonyms, near-synonyms, or words with a stronger or softer shade of meaning " +
    "(big -> \"большой\", NOT \"огромный\"; house -> \"дом\", NOT \"здание\"; happy -> \"счастливый\", NOT \"радостный\"; " +
    "sad -> \"грустный\", NOT \"печальный\"; fast -> \"быстрый\", NOT \"скорый\"; dog -> \"собака\", NOT \"щенок\"). " +
    "If the Russian word has a masculine and a feminine form for the same creature or person (cat -> \"кошка\" and \"кот\"; teacher -> \"учитель\" and \"учительница\"), give both forms. " +
    "Write translations in lowercase base form.\n" +
    "RUSSIAN WORDS: give the lowercase dictionary base form (nouns: nominative singular; adjectives: masculine nominative singular; verbs: infinitive). " +
    "Do not translate and do not replace the word with a synonym.\n" +
    'Reply ONLY with JSON in this shape: {"en":{"<english word>":["<russian>", ...]},"ru":{"<russian word>":"<base form>"}}\n' +
    "ENGLISH WORDS: " + JSON.stringify(enWords) + "\n" +
    "RUSSIAN WORDS: " + JSON.stringify(ruWords);

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0, maxOutputTokens: 3000, responseMimeType: "application/json" },
      }),
    }
  );
  if (!res.ok) throw new Error("ai_http_" + res.status + ": " + (await res.text()).slice(0, 300));
  const data = await res.json();
  const text = (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("");
  const obj = JSON.parse(text.match(/\{[\s\S]*\}/)[0]);
  return { en: obj.en || {}, ru: obj.ru || {} };
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });

    if (request.method === "GET") {
      const url = new URL(request.url);
      // Optional link test: open  https://<worker>/?token=<TEST_TOKEN>
      if (env.TEST_TOKEN && url.searchParams.get("token") === env.TEST_TOKEN) {
        try {
          const t = await aiTranslate(env, ["apple", "big", "house"], ["яблоки", "огромный"]);
          const apple = cleanList(t.en.apple), big = cleanList(t.en.big), house = cleanList(t.en.house);
          const ok = apple.includes("яблоко") && big.includes("большой") && !big.includes("огромный") && !house.includes("здание");
          return json({ ok, version: VERSION, model: env.GEMINI_MODEL || DEFAULT_MODEL, translations: t });
        } catch (e) {
          return json({ ok: false, version: VERSION, error: String(e.message || e), model: env.GEMINI_MODEL || DEFAULT_MODEL }, 500);
        }
      }
      return json({ status: "matchgame matcher is running", version: VERSION });
    }
    if (request.method !== "POST") return json({ error: "POST only" }, 405);

    let body;
    try { body = await request.json(); } catch { return json({ error: "bad json" }, 400); }

    const roomId = String(body.roomId || "").slice(0, 8);
    const subs = Array.isArray(body.submissions) ? body.submissions.slice(0, MAX_PLAYERS) : [];
    if (!roomId || subs.length < 2) return json({ error: "need roomId and 2+ submissions" }, 400);

    // normalize, dedupe per player
    const players = subs.map((s) => {
      const seen = new Set();
      const words = [];
      for (const raw of (s.words || []).slice(0, MAX_WORDS_PER_PLAYER)) {
        const n = normalize(raw);
        if (!n || seen.has(stem(n))) continue;
        seen.add(stem(n));
        words.push({ raw, n, s: stem(n) });
      }
      return { player: String(s.player), words };
    });

    const uniq = [...new Set(players.flatMap((p) => p.words.map((w) => w.s)))];
    const cyr = uniq.filter(isCyrillic);
    const lat = uniq.filter((w) => !isCyrillic(w));

    const owner = (stemWord) => players.filter((p) => p.words.some((w) => w.s === stemWord)).map((p) => p.player);
    // only words that sit opposite a word from a DIFFERENT player can ever matter
    const crossPlayer = (a, b) => owner(a).some((x) => owner(b).some((y) => x !== y));
    const latUse = lat.filter((a) => cyr.some((b) => crossPlayer(a, b)));
    const cyrUse = cyr.filter((b) => lat.some((a) => crossPlayer(a, b)));
    // Russian words that another player wrote differently: they may be forms of the same word
    const cyrForms = cyr.filter((b) => cyr.some((c) => c !== b && crossPlayer(b, c)));
    const cyrNeed = [...new Set([...cyrUse, ...cyrForms])];

    let tr = {}, lem = {};
    if ((latUse.length && cyrUse.length) || cyrForms.length) {
      const state = await loadState(env);
      const needEn = latUse.filter((w) => state.tr[w] === undefined).slice(0, MAX_WORDS_PER_CALL);
      const needRu = cyrNeed.filter((w) => state.lem[w] === undefined).slice(0, MAX_WORDS_PER_CALL);

      if (needEn.length || needRu.length) {
        const roomCalls = state.rooms[roomId] || 0;
        if (state.global < DAILY_AI_CALLS_GLOBAL && roomCalls < DAILY_AI_CALLS_PER_ROOM) {
          state.global += 1; state.rooms[roomId] = roomCalls + 1;
          try {
            const t = await aiTranslate(env, needEn, needRu);
            for (const w of needEn) if (t.en[w] !== undefined) state.tr[w] = cleanList(t.en[w]);
            for (const w of needRu) if (t.ru[w] !== undefined) state.lem[w] = normalize(t.ru[w]) || w;
          } catch (_) { /* AI down or over its free limit: fall back to exact matching this round */ }
          await saveState(env, state);
        }
      }
      tr = state.tr; lem = state.lem;
    }

    // a Russian word is compared by its base form, so "яблоки" = "яблоко"
    const canon = (w) => (isCyrillic(w) ? lem[w] || w : w);

    const links = new Map(); // key -> set of keys it matches across languages
    const link = (a, b) => {
      if (!links.has(a)) links.set(a, new Set());
      if (!links.has(b)) links.set(b, new Set());
      links.get(a).add(b); links.get(b).add(a);
    };
    for (const a of latUse) {
      const translations = tr[a];
      if (!translations) continue;
      for (const b of cyrUse) {
        const base = canon(b);
        if (translations.includes(base) || translations.includes(b)) link(a, base);
      }
    }

    // score: a word matches if another player has the same word (base form), a linked translation, or a one-slip typo of it
    const entries = [];
    players.forEach((p, pi) => p.words.forEach((w, wi) => entries.push({ pi, wi, wk: canon(w.s) })));
    const isMatch = (a, b) =>
      a.pi !== b.pi && (a.wk === b.wk || (links.get(a.wk) && links.get(a.wk).has(b.wk)) || withinOneEdit(a.wk, b.wk));
    // union-find: words that match each other share a group id (used for the "Matches by word" card)
    const parent = entries.map((_, i) => i);
    const find = (i) => { while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i]; } return i; };
    for (let i = 0; i < entries.length; i++) for (let j = i + 1; j < entries.length; j++) {
      if (isMatch(entries[i], entries[j])) parent[find(i)] = find(j);
    }
    const result = players.map((p, pi) => {
      const scored = p.words.map((w, wi) => {
        const idx = entries.findIndex((e) => e.pi === pi && e.wi === wi);
        const matchedWith = players
          .filter((o, oi) => oi !== pi && entries.some((e, k) => e.pi === oi && isMatch(entries[idx], e)))
          .map((o) => o.player);
        return { word: w.raw, matched: matchedWith.length > 0, matchedWith, pts: 1 + matchedWith.length, group: matchedWith.length > 0 ? find(idx) : null };
      });
      // every word scores 1 for yourself plus 1 for each other player who matched it
      return { player: p.player, words: scored, points: scored.reduce((n, x) => n + 1 + x.matchedWith.length, 0) };
    });

    return json({ results: result });
  },
};

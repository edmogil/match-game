/* Match Game: phone client. Host's phone drives round transitions. */
const T = {
  en: {
    title: "Игра в Банальности", tagline: "Think alike. Score points.",
    yourName: "Your name", roomCode: "Room code", create: "Create a room", join: "Join room",
    players: "Players", start: "Start game", needPlayers: "Need at least 2 players", waitHost: "Waiting for the host to start...",
    round: "Round", of: "of", pickPrompt: "Pick a word or theme", promptPh: "e.g. Beach, Fruit, Summer",
    send: "Start round", waitPicker: "is choosing the word or theme...", yourWords: "Type 3 words or phrases", need3: "Fill in all 3 boxes",
    wordPh: "Word or phrase", submit: "Lock in", submitted: "Locked in!", waitOthers: "Waiting for others",
    results: "Results", matchedWith: "matched with", nobody: "no match", next: "Next round", finish: "See final scores",
    picksNext: "picks next", finalTitle: "Final scores", newGame: "Back to start", copyLink: "Copy invite link", copied: "Copied!",
    notFound: "Room not found", full: "Room is full", nameReq: "Enter your name", codeReq: "Enter the room code",
    scoreboard: "Scoreboard", pts: "pts", winnerIs: "Winner:", host: "host", err: "Something went wrong, try again",
    scanJoin: "Scan to join or enter the code",
    endRound: "Finish round now", byWord: "Matches by word", endGame: "End game & announce winner", endConfirm: "End the game now and announce the winner?",
    rounds: "Number of rounds", winnersAre: "Winners:", tie: "It's a tie!",
    manual: "Manual Mode", manualBadge: "Manual scoring", manualHint: "The host starts the round and you have 90 seconds to type 3 words. Words lock automatically when time runs out, and can't be changed after that. When everyone is locked in, the app tells you. Then read your words out loud one at a time and type how many matched next to each word.",
    matchCount: "Matches", startRound: "Start round", notStarted: "Waiting for the round to start...", waitHostStart: "Waiting for the host to start the round...", hostStartHint: "Press Start when everyone is ready. Everyone gets 90 seconds to type.", allLocked: "Everyone is locked in! Now read your words out loud, one at a time, then type your match counts.", typing: "Waiting for words...", unlock: "Edit my words", lockedIn: "Locked in:", finishGame: "Finish game & show final scores",
    roundTotal: "Round total", total: "Total", word: "Word", addRound: "+ Add a round", reopen: "Back to scoring", sheet: "Score sheet", player: "Player",
    hostEdits: "", lockedPrivate: "Locked in. Words stay private until read aloud.", onlyOwn: "You only see your own words. After you lock in, you can only change your match counts.", manualWord: "Word",
  },
  ru: {
    title: "Игра в Банальности", tagline: "Думай как все. Набирай очки.",
    yourName: "Твоё имя", roomCode: "Код комнаты", create: "Создать комнату", join: "Войти в комнату",
    players: "Игроки", start: "Начать игру", needPlayers: "Нужно минимум 2 игрока", waitHost: "Ждём, пока хозяин начнёт игру...",
    round: "Раунд", of: "из", pickPrompt: "Выбери слово или тему", promptPh: "напр. Пляж, Фрукты, Лето",
    send: "Начать раунд", waitPicker: "выбирает слово или тему...", yourWords: "Напиши 3 слова или фразы", need3: "Заполни все 3 поля",
    wordPh: "Слово или фраза", submit: "Готово", submitted: "Принято!", waitOthers: "Ждём остальных",
    results: "Результаты", matchedWith: "совпало с", nobody: "нет совпадений", next: "Следующий раунд", finish: "Итоговый счёт",
    picksNext: "выбирает следующее", finalTitle: "Итоговый счёт", newGame: "В начало", copyLink: "Скопировать ссылку", copied: "Скопировано!",
    notFound: "Комната не найдена", full: "Комната заполнена", nameReq: "Введи имя", codeReq: "Введи код комнаты",
    scoreboard: "Счёт", pts: "очк.", winnerIs: "Победитель:", host: "хозяин", err: "Что-то пошло не так, попробуй ещё раз",
    scanJoin: "Отсканируй QR или введи код",
    endRound: "Закончить раунд сейчас", byWord: "Совпадения по словам", endGame: "Закончить игру и объявить победителя", endConfirm: "Закончить игру сейчас и объявить победителя?",
    rounds: "Количество раундов", winnersAre: "Победители:", tie: "Ничья!",
    manual: "Ручной режим", manualBadge: "Ручной подсчёт", manualHint: "Хозяин начинает раунд, у тебя 90 секунд на 3 слова. Когда время выйдет, слова блокируются сами, и менять их нельзя. Когда все готовы, приложение сообщит. Тогда читайте слова вслух по очереди и вводите рядом с каждым словом число совпадений.",
    matchCount: "Совпадений", startRound: "Начать раунд", notStarted: "Ждём начала раунда...", waitHostStart: "Ждём, пока хозяин начнёт раунд...", hostStartHint: "Нажми «Начать», когда все готовы. У всех 90 секунд на ввод.", allLocked: "Все готовы! Читайте свои слова вслух по очереди, затем вводите числа совпадений.", typing: "Ждём слова...", unlock: "Изменить мои слова", lockedIn: "Готовы:", finishGame: "Закончить игру и показать итоги",
    roundTotal: "Итог раунда", total: "Всего", word: "Слово", addRound: "+ Добавить раунд", reopen: "Назад к подсчёту", sheet: "Таблица счёта", player: "Игрок",
    hostEdits: "", lockedPrivate: "Готово. Слова скрыты, пока их не прочитают вслух.", onlyOwn: "Ты видишь только свои слова. После «Готово» можно менять только числа совпадений.", manualWord: "Слово",
  },
};

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
let lang = localStorage.getItem("mg_lang") || ((navigator.language || "").startsWith("ru") ? "ru" : "en");
const t = (k) => (T[lang] && T[lang][k]) || k;

const sb = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
let uid = localStorage.getItem("mg_uid");
if (!uid) {
  uid = (crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 10));
  localStorage.setItem("mg_uid", uid);
}

const state = {
  room: null, players: [], subs: [], pid: null,
  name: localStorage.getItem("mg_name") || "",
  error: "", draft: ["", "", ""], draftRound: -1, lastKey: "", promptDraft: "", joinCode: "",
};
let channel = null, revealing = false, refreshTimer = null, busy = false;

/* ---------- matching (same-language fallback; worker adds EN/RU) ---------- */
const MAX_WORD = 40;
function normalize(raw) {
  let w = String(raw || "").toLowerCase().trim();
  w = w.replace(/ё/g, "е").replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s+/g, " ");
  return w.slice(0, MAX_WORD);
}
const isCyr = (w) => /[\u0400-\u04FF]/.test(w);
function stem(w) {
  if (isCyr(w)) return w;
  if (w.length > 3 && w.endsWith("ies")) return w.slice(0, -3) + "y";
  if (w.length > 3 && /(s|x|z|ch|sh)es$/.test(w)) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  return w;
}
// one-slip typo forgiveness on longer words (same rules as the matcher)
function withinOneEdit(a, b) {
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
function localMatch(input) {
  const players = input.map((s) => {
    const seen = new Set(), words = [];
    for (const raw of (s.words || []).slice(0, 3)) {
      const n = normalize(raw); if (!n) continue;
      const st = stem(n); if (seen.has(st)) continue;
      seen.add(st); words.push({ raw, s: st });
    }
    return { player: s.player, words };
  });
  // words that match each other share a group id (for the "Matches by word" card)
  const entries = [];
  players.forEach((p, pi) => p.words.forEach((w, wi) => entries.push({ pi, wi, s: w.s })));
  const isMatch = (e1, e2) => e1.pi !== e2.pi && (e1.s === e2.s || withinOneEdit(e1.s, e2.s));
  const parent = entries.map((_, i) => i);
  const find = (i) => { while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i]; } return i; };
  for (let i = 0; i < entries.length; i++) for (let j = i + 1; j < entries.length; j++) if (isMatch(entries[i], entries[j])) parent[find(i)] = find(j);
  return players.map((p, pi) => {
    const scored = p.words.map((w, wi) => {
      const idx = entries.findIndex((e) => e.pi === pi && e.wi === wi);
      const matchedWith = players.filter((o, oi) => oi !== pi && entries.some((e) => e.pi === oi && isMatch(entries[idx], e))).map((o) => o.player);
      return { word: w.raw, matched: matchedWith.length > 0, matchedWith, pts: 1 + matchedWith.length, group: matchedWith.length > 0 ? find(idx) : null };
    });
    return { player: p.player, words: scored, points: scored.reduce((n, x) => n + 1 + x.matchedWith.length, 0) };
  });
}

/* ---------- helpers ---------- */
const nameOf = (pid) => (state.players.find((p) => p.id === pid) || {}).name || "?";
const isHost = () => state.room && state.room.host === state.pid;
const mySub = () => state.subs.find((s) => s.player_id === state.pid);
const shareLink = () => location.origin + location.pathname + "?room=" + (state.room ? state.room.id : "");
function randomCode() {
  const L = "ABCDEFGHJKLMNPQRSTUVWXYZ"; let c = "";
  for (let i = 0; i < 4; i++) c += L[Math.floor(Math.random() * L.length)];
  return c;
}
function setErr(msg) { state.error = msg || ""; render(true); }

/* ---------- room actions ---------- */
async function createRoom(mode) {
  const name = ($("#name")?.value || "").trim().slice(0, 16);
  if (!name) return setErr(t("nameReq"));
  state.name = name; localStorage.setItem("mg_name", name);
  busy = true;
  try {
    for (let i = 0; i < 6; i++) {
      const code = randomCode(), pid = code + "_" + uid;
      const { error } = await sb.from("rooms").insert(mode === "manual" ? { id: code, host: pid, total_rounds: 5, mode: "manual" } : { id: code, host: pid, total_rounds: 7 });
      if (error) { if (error.code === "23505") continue; throw error; }
      const r2 = await sb.from("players").insert({ id: pid, room_id: code, name });
      if (r2.error) throw r2.error;
      return enterRoom(code, pid);
    }
    setErr(t("err"));
  } catch (e) { console.error(e); setErr(t("err")); } finally { busy = false; }
}

async function joinRoom(autoCode) {
  const name = ($("#name")?.value || state.name || "").trim().slice(0, 16);
  const code = (autoCode || $("#code")?.value || "").trim().toUpperCase();
  if (!name) return setErr(t("nameReq"));
  if (!code) return setErr(t("codeReq"));
  state.name = name; localStorage.setItem("mg_name", name);
  busy = true;
  try {
    const { data: room } = await sb.from("rooms").select("*").eq("id", code).maybeSingle();
    if (!room) return setErr(t("notFound"));
    const { data: existing } = await sb.from("players").select("*").eq("room_id", code).order("joined_at");
    const same = (existing || []).find((p) => p.name.toLowerCase() === name.toLowerCase());
    if (same) return enterRoom(code, same.id); // rejoin keeps score
    if ((existing || []).length >= CONFIG.MAX_PLAYERS) return setErr(t("full"));
    const pid = code + "_" + uid;
    const { error } = await sb.from("players").upsert({ id: pid, room_id: code, name }, { onConflict: "id" });
    if (error) throw error;
    enterRoom(code, pid);
  } catch (e) { console.error(e); setErr(t("err")); } finally { busy = false; }
}

async function enterRoom(code, pid) {
  state.pid = pid; state.error = "";
  state.room = { id: code };
  localStorage.setItem("mg_room", code); localStorage.setItem("mg_pid", pid);
  if (channel) sb.removeChannel(channel);
  channel = sb.channel("room-" + code)
    .on("postgres_changes", { event: "*", schema: "public", table: "rooms", filter: "id=eq." + code }, queueRefresh)
    .on("postgres_changes", { event: "*", schema: "public", table: "players", filter: "room_id=eq." + code }, queueRefresh)
    .on("postgres_changes", { event: "*", schema: "public", table: "submissions", filter: "room_id=eq." + code }, queueRefresh)
    .subscribe();
  clearInterval(refreshTimer);
  refreshTimer = setInterval(refresh, 4000); // safety net if a realtime message is missed
  await refresh();
}

function leaveRoom() {
  if (channel) sb.removeChannel(channel);
  channel = null; clearInterval(refreshTimer);
  localStorage.removeItem("mg_room"); localStorage.removeItem("mg_pid");
  state.room = null; state.players = []; state.subs = []; state.pid = null; state.lastKey = "";
  history.replaceState(null, "", location.pathname);
  render(true);
}

let rq = null;
function queueRefresh() { clearTimeout(rq); rq = setTimeout(refresh, 120); }

async function refresh() {
  const code = state.room && state.room.id; if (!code) return;
  const editsAtStart = manualEdits; // a score tap during this fetch makes its result stale
  const { data: room } = await sb.from("rooms").select("*").eq("id", code).maybeSingle();
  if (!room) { leaveRoom(); return; }
  const { data: players } = await sb.from("players").select("*").eq("room_id", code).order("joined_at");
  const { data: subs } = await sb.from("submissions").select("*").eq("room_id", code).eq("round", room.round);
  if (pendingSaves > 0 || manualEdits !== editsAtStart) return; // don't overwrite a score tap that is still saving
  state.room = room; state.players = players || []; state.subs = subs || [];
  render(); hostTick();
}

async function setRounds(n) {
  n = parseInt(n, 10);
  if (!isHost() || !(n >= 1 && n <= 30)) return;
  await sb.from("rooms").update({ total_rounds: n }).eq("id", state.room.id).eq("status", "lobby");
}

async function startGame() {
  if (isManual()) {
    if (state.players.length < 1) return;
    state.manualRound = 1;
    await sb.from("rooms").update({ status: "manual", round: 1, prompt: null, results: null }).eq("id", state.room.id).eq("status", "lobby");
    return;
  }
  if (state.players.length < 2) return;
  await sb.from("rooms").update({ status: "picking", round: 1, picker: state.room.host, prompt: null, results: null }).eq("id", state.room.id);
}

async function sendPrompt() {
  const text = ($("#prompt")?.value || "").trim().slice(0, 30);
  if (!text) return;
  const r = state.room;
  await sb.from("players").update({ last_picked_round: r.round }).eq("id", state.pid);
  const ends = new Date(Date.now() + CONFIG.ROUND_SECONDS * 1000).toISOString();
  await sb.from("rooms").update({ prompt: text, status: "entering", round_ends_at: ends, results: null }).eq("id", r.id).eq("status", "picking");
}

async function submitWords(auto) {
  if (mySub()) return;
  const words = state.draft.map((w) => w.trim().slice(0, MAX_WORD)).filter(Boolean);
  if (!words.length) return;
  if (auto !== true && words.length < 3) { const e = $("#werr"); if (e) e.textContent = t("need3"); return; }
  const r = state.room;
  await sb.from("submissions").upsert({ room_id: r.id, round: r.round, player_id: state.pid, words }, { onConflict: "room_id,round,player_id" });
  queueRefresh();
}

function hostTick() {
  const r = state.room;
  if (!r || !isHost() || revealing || r.status !== "entering") return;
  const allIn = state.players.length > 0 && state.subs.length >= state.players.length;
  const timeUp = r.round_ends_at && Date.now() >= new Date(r.round_ends_at).getTime() + 2500; // grace for auto-submits
  if (allIn || timeUp) reveal();
}

async function reveal() {
  revealing = true;
  try {
    const r = state.room;
    // Claim this round's reveal exactly once; if another tick already did, stop.
    const claim = await sb.from("rooms").update({ status: "revealing" }).eq("id", r.id).eq("status", "entering").select("id");
    if (claim.error || !claim.data || claim.data.length === 0) return;
    const { data: subs } = await sb.from("submissions").select("*").eq("room_id", r.id).eq("round", r.round);
    const input = (subs || []).map((s) => ({ player: s.player_id, words: s.words }));
    let results;
    try {
      if (!CONFIG.WORKER_URL || input.length < 2) throw new Error("local");
      const res = await fetch(CONFIG.WORKER_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ roomId: r.id, submissions: input }) });
      if (!res.ok) throw new Error("worker");
      results = (await res.json()).results;
    } catch (e) { results = localMatch(input); }

    const pts = {}; results.forEach((x) => (pts[x.player] = x.points));
    for (const p of state.players) {
      if (pts[p.id]) await sb.from("players").update({ score: p.score + pts[p.id] }).eq("id", p.id);
    }
    // round winner = most points; tie -> whoever picked least recently
    const ranked = [...state.players].sort((a, b) => (pts[b.id] || 0) - (pts[a.id] || 0) || a.last_picked_round - b.last_picked_round);
    const picker = ranked[0].id;
    await sb.from("rooms").update({ status: "results", results, picker }).eq("id", r.id).eq("status", "revealing");
  } catch (e) { console.error(e); } finally { revealing = false; }
}

async function endRoundNow() {
  if (!isHost() || !state.room || state.room.status !== "entering") return;
  await sb.from("rooms").update({ round_ends_at: new Date().toISOString() }).eq("id", state.room.id).eq("status", "entering");
}
const roundBtn = () => (isHost() && state.room && state.room.status === "entering" ? `<button class="alt" onclick="endRoundNow()">${t("endRound")}</button>` : "");

async function endGame() {
  if (!isHost() || !state.room || state.room.status === "finished") return;
  if (!confirm(t("endConfirm"))) return;
  await sb.from("rooms").update({ status: "finished" }).eq("id", state.room.id).neq("status", "finished");
}
const endBtn = () => (isHost() && state.room && !["lobby", "finished"].includes(state.room.status) ? `<button class="ghost" onclick="endGame()">${t("endGame")}</button>` : "");

async function nextRound() {
  const r = state.room;
  if (r.round >= r.total_rounds) await sb.from("rooms").update({ status: "finished" }).eq("id", r.id);
  else await sb.from("rooms").update({ status: "picking", round: r.round + 1, prompt: null, results: null }).eq("id", r.id).eq("status", "results");
}

/* ---------- manual mode: players write their words and enter their own match counts ---------- */
const isManual = () => !!(state.room && state.room.mode === "manual");
// one round of one player: { w: [3 words], n: [3 match counts], l: 1 when words are locked in }
function mr(p, rd) {
  const v = p.manual && p.manual[String(rd)];
  if (Array.isArray(v)) return { w: ["", "", ""], n: [0, 1, 2].map((i) => (v[i] ? 1 : 0)), l: 1 }; // older format
  const o = v || {};
  return { w: [0, 1, 2].map((i) => (o.w && o.w[i]) || ""), n: [0, 1, 2].map((i) => Math.max(0, parseInt(o.n && o.n[i], 10) || 0)), l: o.l ? 1 : 0 };
}
const manualRoundTotal = (p, rd) => mr(p, rd).n.reduce((s, x) => s + x, 0);
const manualTotal = (p) => { let s = 0; for (let i = 1; i <= state.room.total_rounds; i++) s += manualRoundTotal(p, i); return s; };
const scoreOf = (p) => (isManual() ? manualTotal(p) : p.score);
const canScore = (p) => p.id === state.pid; // everyone scores only their own words
let manualEdits = 0, pendingSaves = 0, saveTimers = {};

function editRound(pid, rd, fn) {
  const p = state.players.find((x) => x.id === pid); if (!p) return null;
  const cur = mr(p, rd); fn(cur);
  p.manual = { ...(p.manual || {}), [String(rd)]: cur };
  manualEdits++;
  return p;
}
function saveManual(pid, now) {
  const p = state.players.find((x) => x.id === pid); if (!p) return;
  const had = saveTimers[pid];
  clearTimeout(had);
  if (!had) pendingSaves++; // one pending save per player; later taps just replace the timer
  const go = async () => {
    saveTimers[pid] = null;
    const { error } = await sb.from("players").update({ manual: p.manual }).eq("id", pid);
    pendingSaves--;
    if (error) { console.error(error); setErr(t("err")); }
    queueRefresh();
  };
  if (now) go(); else saveTimers[pid] = setTimeout(go, 500);
}
function refreshTotals(pid, rd) {
  const p = state.players.find((x) => x.id === pid);
  const el = document.getElementById("rt-" + pid); if (el && p) el.textContent = t("roundTotal") + ": " + manualRoundTotal(p, rd);
  const sc = document.getElementById("sheetcard"); if (sc) sc.outerHTML = sheetTable();
}
function setWord(pid, rd, i, v) {
  if (pid !== state.pid || state.room.status !== "manual") return;
  const me = state.players.find((x) => x.id === pid);
  if (!me || mr(me, rd).l) return; // words are final once locked in
  editRound(pid, rd, (c) => { c.w[i] = String(v).slice(0, 40); });
  saveManual(pid);
}
function setNum(pid, rd, i, v) {
  const p = state.players.find((x) => x.id === pid);
  if (!p || !canScore(p) || state.room.status !== "manual") return;
  const n = Math.max(0, Math.min(99, parseInt(v, 10) || 0));
  editRound(pid, rd, (c) => { c.n[i] = n; });
  saveManual(pid); refreshTotals(pid, rd);
}
// shared round timer: the host starts it, the end time is stored in the room (results.t[round])
const mTimers = () => (state.room && state.room.results && state.room.results.t) || {};
const mEnds = (rd) => (mTimers()[String(rd)] ? new Date(mTimers()[String(rd)]).getTime() : null);
const mStarted = (rd) => mEnds(rd) !== null;
const mLeft = (rd) => (mStarted(rd) ? Math.max(0, Math.ceil((mEnds(rd) - Date.now()) / 1000)) : 0);
const allLocked = (rd) => state.players.length > 0 && state.players.every((p) => mr(p, rd).l);
async function setMTimer(rd, iso) {
  const results = { ...(state.room.results || {}), t: { ...mTimers(), [String(rd)]: iso } };
  state.room.results = results; render(true);
  await sb.from("rooms").update({ results }).eq("id", state.room.id);
}
async function startManualRound(rd) {
  if (!isHost() || mStarted(rd)) return;
  await setMTimer(rd, new Date(Date.now() + CONFIG.ROUND_SECONDS * 1000).toISOString());
}
async function endManualRoundNow(rd) {
  if (!isHost() || !mStarted(rd) || allLocked(rd)) return;
  await setMTimer(rd, new Date().toISOString());
}
function lockWords(rd, lock, auto) {
  const me = state.players.find((x) => x.id === state.pid); if (!me || !lock || mr(me, rd).l) return;
  if (!mStarted(rd)) return;
  if (!auto && mr(me, rd).w.some((w) => !w.trim())) { const e = document.getElementById("lockerr"); if (e) e.textContent = t("need3"); return; }
  editRound(state.pid, rd, (c) => { c.l = 1; c.w = c.w.map((w) => w.trim()); });
  saveManual(state.pid, true); render(true);
}
function showRound(n) { state.manualRound = n; render(true); }
async function addRound() {
  if (!isHost() || !isManual()) return;
  const n = state.room.total_rounds + 1; if (n > 30) return;
  state.room.total_rounds = n; render(true);
  await sb.from("rooms").update({ total_rounds: n }).eq("id", state.room.id);
}
async function reopenScoring() {
  if (!isHost() || !isManual()) return;
  await sb.from("rooms").update({ status: "manual" }).eq("id", state.room.id).eq("status", "finished");
}

function sheetTable() {
  const n = state.room.total_rounds, list = [...state.players].sort((a, b) => scoreOf(b) - scoreOf(a));
  const head = `<tr><th>${t("player")}</th>${Array.from({ length: n }, (_, i) => `<th>${i + 1}</th>`).join("")}<th>${t("total")}</th></tr>`;
  const rows = list.map((p) => `<tr><td>${esc(p.name)}${p.id === state.room.host ? " ⭐" : ""}</td>${Array.from({ length: n }, (_, i) => `<td>${manualRoundTotal(p, i + 1)}</td>`).join("")}<td class="t">${manualTotal(p)}</td></tr>`).join("");
  return `<div class="card" id="sheetcard"><h2>${t("sheet")}</h2><div class="sheetwrap"><table class="sheet">${head}${rows}</table></div></div>`;
}

function manualView() {
  const r = state.room, n = r.total_rounds;
  const cur = Math.min(Math.max(state.manualRound || 1, 1), n);
  state.manualRound = cur;
  const started = mStarted(cur), left = mLeft(cur), locked = allLocked(cur);
  const live = started && left > 0 && !locked; // words can be typed right now
  const tabs = `<div class="rtabs">${Array.from({ length: n }, (_, i) => `<button class="${i + 1 === cur ? "on" : ""}" onclick="showRound(${i + 1})">${i + 1}</button>`).join("")}</div>`;
  const ordered = [...state.players].sort((a, b) => (a.id === state.pid ? -1 : b.id === state.pid ? 1 : 0));
  const lockedCount = state.players.filter((p) => mr(p, cur).l).length;
  const cards = ordered.map((p) => {
    const m = mr(p, cur), mine = p.id === state.pid, ed = canScore(p);
    const head = `<div class="row"><b>${esc(p.name)}${mine ? " 👈" : ""}${m.l ? " 🔒" : ""}</b><span class="pts" id="rt-${esc(p.id)}">${t("roundTotal")}: ${manualRoundTotal(p, cur)}</span></div>`;
    let rows;
    if (mine) {
      rows = [0, 1, 2].map((i) => `<div class="mrow">
        <input class="mw" ${live && !m.l ? "" : "readonly"} maxlength="40" placeholder="${t("wordPh")} ${i + 1}" autocomplete="off" autocapitalize="off" value="${esc(m.w[i])}" oninput="setWord('${esc(p.id)}',${cur},${i},this.value)">
        <input class="mn" type="number" inputmode="numeric" min="0" max="99" placeholder="0" ${ed && locked && m.w[i] ? "" : "disabled"} value="${m.n[i] || ""}" oninput="setNum('${esc(p.id)}',${cur},${i},this.value)" aria-label="${t("matchCount")}">
      </div>`).join("");
    } else rows = `<p class="sub center">${m.l ? t("lockedPrivate") : started ? t("typing") : t("notStarted")}</p>`;
    const act = mine && !m.l ? `<div class="err" id="lockerr"></div><button ${live ? "" : "disabled"} onclick="lockWords(${cur},true)">${t("submit")}</button>` : "";
    return `<div class="card">${head}${rows}${act}</div>`;
  }).join("");
  const banner = locked && started ? `<div class="alllocked">✅ ${t("allLocked")}</div>`
    : started ? `<p class="sub center">${t("waitOthers")}: ${lockedCount}/${state.players.length}</p>`
    : `<p class="sub center">${isHost() ? t("hostStartHint") : t("waitHostStart")}</p>`;
  const hostBtn = isHost() && !started ? `<button class="alt" onclick="startManualRound(${cur})">▶ ${t("startRound")} ${cur} (${CONFIG.ROUND_SECONDS}s)</button>`
    : isHost() && started && !locked ? `<button class="alt" onclick="endManualRoundNow(${cur})">${t("endRound")}</button>` : "";
  const timer = started && !locked ? `<div class="timerbar${left <= 10 ? " urgent" : ""}" id="mtimer">⏱ ${left}</div>` : "";
  return `${timer}<p class="sub center"><span class="badge">${t("manualBadge")}</span></p>
  <p class="sub center">${t("round")} ${cur} ${t("of")} ${n}</p>${tabs}
  ${banner}${hostBtn}
  <p class="sub center">${t("manualHint")}<br>${t("onlyOwn")}</p>
  ${cards}${sheetTable()}
  ${isHost() ? `<button class="ghost" onclick="addRound()">${t("addRound")}</button>` : ""}${isHost() ? `<button class="alt" onclick="endGame()">${t("finishGame")}</button>` : ""}`;
}

async function copyLink() {
  try { await navigator.clipboard.writeText(shareLink()); const b = $("#copy"); if (b) { b.textContent = t("copied"); setTimeout(() => (b.textContent = t("copyLink")), 1500); } } catch (e) { prompt("", shareLink()); }
}
function setLang() { lang = lang === "en" ? "ru" : "en"; localStorage.setItem("mg_lang", lang); render(true); }

/* ---------- rendering ---------- */
function topBar() {
  return `<div class="top"><span>${state.room && state.room.status ? esc(state.room.id) : ""}</span><button class="ghost" onclick="setLang()">${lang === "en" ? "RU" : "EN"}</button></div>`;
}
function scoreboard() {
  const list = [...state.players].sort((a, b) => scoreOf(b) - scoreOf(a));
  return `<div class="card"><h2>${t("scoreboard")}</h2>${list.map((p) => `<div class="row"><span>${esc(p.name)}${p.id === state.room.host ? " ⭐" : ""}</span><span class="pts">${scoreOf(p)} ${t("pts")}</span></div>`).join("")}</div>`;
}

function render(force) {
  const app = $("#app");
  const r = state.room;
  // keep typing intact: while entering words, only update small bits
  if (r && r.status && r.status === "entering" && !mySub()) {
    const key = "entering|" + r.round;
    if (!force && state.lastKey === key) { updateEntering(); return; }
    state.lastKey = key;
    if (state.draftRound !== r.round) { state.draft = ["", "", ""]; state.draftRound = r.round; }
    state.lastHtml = ""; state.viewKey = "";
    app.innerHTML = topBar() + enteringView();
    return;
  }
  state.lastKey = "";
  // don't redraw the screen under someone who is typing (it closes the phone keyboard)
  const viewKey = r && r.status ? r.status + "|" + r.round + "|" + r.picker : "home";
  const ae = document.activeElement;
  if (!force && ae && ae.tagName === "INPUT" && app.contains(ae) && state.viewKey === viewKey) return;
  state.viewKey = viewKey;
  if (!r || !r.status) { const h = homeView(); if (force || h !== state.lastHtml) { state.lastHtml = h; app.innerHTML = h; } return; }
  let body = "";
  if (r.status === "lobby") body = lobbyView();
  else if (r.status === "manual") body = manualView();
  else if (r.status === "picking") body = pickingView();
  else if (r.status === "entering") body = waitingView();
  else if (r.status === "revealing") body = `${roundHeader()}<div class="prompt">${esc(r.prompt)}</div><div class="card center big">${t("results")}...</div>${endBtn()}`;
  else if (r.status === "results") body = resultsView();
  else if (r.status === "finished") body = finalView();
  const html = topBar() + body;
  if (!force && html === state.lastHtml) return;
  state.lastHtml = html;
  app.innerHTML = html;
  if (r.status === "lobby") { const q = $("#qr"); if (q && window.QRCode) new QRCode(q, { text: shareLink(), width: 150, height: 150 }); }
}

function homeView() {
  const prefill = new URLSearchParams(location.search).get("room") || state.joinCode || "";
  return `${topBar()}
  <h1>🎯 ${t("title")}</h1><p class="sub">${t("tagline")}</p>
  <div class="card">
    <input id="name" placeholder="${t("yourName")}" maxlength="16" value="${esc(state.name)}" autocomplete="off">
    <input id="code" placeholder="${t("roomCode")}" maxlength="4" value="${esc(prefill)}" autocapitalize="characters" autocomplete="off" style="text-transform:uppercase;letter-spacing:6px;text-align:center">
    <div class="err">${esc(state.error)}</div>
    <button onclick="joinRoom()">${t("join")}</button>
    <button class="alt" onclick="createRoom()">${t("create")}</button>
    <button class="ghost" onclick="createRoom('manual')">📝 ${t("manual")}</button>
  </div>`;
}

function lobbyView() {
  const host = isHost();
  return `${isManual() ? `<p class="center"><span class="badge">${t("manualBadge")}</span></p>` : ""}<div class="center"><p class="sub">${t("scanJoin")}</p><div class="code">${esc(state.room.id)}</div><div id="qr"></div>
  <button id="copy" class="ghost" onclick="copyLink()">${t("copyLink")}</button></div>
  <div class="card"><h2>${t("players")} (${state.players.length})</h2><div class="chips">${state.players.map((p) => `<span class="chip ${p.id === state.pid ? "me" : ""}">${esc(p.name)}${p.id === state.room.host ? " ⭐" : ""}</span>`).join("")}</div></div>
  <div class="card center big">${t("rounds")}: ${host ? `<select id="rounds" onchange="setRounds(this.value)" style="font-size:20px;padding:8px 12px;border-radius:12px;background:var(--card2);color:var(--ink);border:0">${[3, 4, 5, 7, 10, 15].map((n) => `<option value="${n}" ${n === state.room.total_rounds ? "selected" : ""}>${n}</option>`).join("")}</select>` : `<b>${state.room.total_rounds}</b>`}</div>
  ${host ? `<button ${state.players.length < (isManual() ? 1 : 2) ? "disabled" : ""} onclick="startGame()">${t("start")}</button>${state.players.length < (isManual() ? 1 : 2) ? `<p class="center sub">${t("needPlayers")}</p>` : ""}` : `<p class="center sub">${t("waitHost")}</p>`}
  <button class="ghost" onclick="leaveRoom()">←</button>`;
}

function roundHeader() { return `<p class="sub center">${t("round")} ${state.room.round} ${t("of")} ${state.room.total_rounds}</p>`; }

function pickingView() {
  const r = state.room, me = r.picker === state.pid;
  return `${roundHeader()}
  ${me ? `<div class="card"><h2>${t("pickPrompt")}</h2><input id="prompt" maxlength="30" placeholder="${t("promptPh")}" autocomplete="off" value="${esc(state.promptDraft)}" oninput="state.promptDraft=this.value"><button onclick="sendPrompt()">${t("send")}</button></div>`
    : `<div class="card center big"><b>${esc(nameOf(r.picker))}</b> ${t("waitPicker")}</div>`}
  ${scoreboard()}${endBtn()}`;
}

function timerHtml() {
  const r = state.room;
  const left = Math.max(0, Math.ceil((new Date(r.round_ends_at).getTime() - Date.now()) / 1000));
  return `<div class="timerbar${left <= 10 ? " urgent" : ""}" id="timer">⏱ ${left}</div>`;
}

function enteringView() {
  const r = state.room;
  return `${timerHtml()}${roundHeader()}<div class="prompt">${esc(r.prompt)}</div>
  <div class="card"><h2>${t("yourWords")}</h2>
    ${[0, 1, 2].map((i) => `<input data-i="${i}" maxlength="40" placeholder="${t("wordPh")} ${i + 1}" autocomplete="off" autocapitalize="off" value="${esc(state.draft[i])}" oninput="state.draft[${i}]=this.value">`).join("")}
    <div class="err" id="werr"></div><button onclick="submitWords()">${t("submit")}</button></div>
  <p class="center sub" id="counter">${state.subs.length}/${state.players.length}</p>${roundBtn()}${endBtn()}`;
}
function updateEntering() { const c = $("#counter"); if (c) c.textContent = `${state.subs.length}/${state.players.length}`; }

function waitingView() {
  const r = state.room;
  return `${timerHtml()}${roundHeader()}<div class="prompt">${esc(r.prompt)}</div>
  <div class="card center big">✅ ${t("submitted")}<br><span class="sub" id="counter">${t("waitOthers")}: ${state.subs.length}/${state.players.length}</span></div>${roundBtn()}${endBtn()}`;
}

function resultsView() {
  const r = state.room, res = r.results || [];
  const last = r.round >= r.total_rounds;
  // group every matched word with everyone who matched it
  const groups = new Map();
  res.forEach((x) => x.words.forEach((w) => {
    if (!w.matched) return;
    // each matched word has a group id from the matcher; older results fall back to the set of players
    const key = w.group !== undefined && w.group !== null ? "g" + w.group : [x.player, ...w.matchedWith].sort().join("|");
    if (!groups.has(key)) groups.set(key, { idSet: new Set(), words: [] });
    const g = groups.get(key), label = String(w.word).trim();
    g.idSet.add(x.player); w.matchedWith.forEach((id) => g.idSet.add(id));
    if (!g.words.some((y) => y.toLowerCase() === label.toLowerCase())) g.words.push(label);
  }));
  const byWordRows = [...groups.values()].map((g) => ({ ids: [...g.idSet], words: g.words })).sort((a, b) => b.ids.length - a.ids.length)
    .map((g) => `<div class="w"><b class="ok">${g.words.map(esc).join(" / ")}</b><br><small>${g.ids.map(nameOf).map(esc).join(", ")}</small></div>`).join("");
  const byWordCard = byWordRows ? `<div class="card"><h2>${t("byWord")}</h2>${byWordRows}</div>` : "";
  const cards = res.map((x) => `<div class="card"><div class="row"><b>${esc(nameOf(x.player))}</b><span class="pts">+${x.points}</span></div>
    ${x.words.map((w) => `<div class="w ${w.matched ? "ok" : "no"}">${w.matched ? "✔" : "•"} ${esc(w.word)} <b class="pts">+${1 + w.matchedWith.length}</b> <small>${w.matched ? "· " + t("matchedWith") + " " + w.matchedWith.map(nameOf).map(esc).join(", ") : "· " + t("nobody")}</small></div>`).join("")}</div>`).join("");
  return `${roundHeader()}<div class="prompt">${esc(r.prompt)}</div>${byWordCard}${cards}
  <div class="card center big">🏆 <b>${esc(nameOf(r.picker))}</b> ${t("picksNext")}</div>
  ${scoreboard()}
  ${isHost() ? `<button onclick="nextRound()">${last ? t("finish") : t("next")}</button>` : ""}${endBtn()}`;
}

function finalView() {
  const list = [...state.players].sort((a, b) => scoreOf(b) - scoreOf(a));
  const best = list.length ? scoreOf(list[0]) : 0;
  const winners = list.filter((p) => scoreOf(p) === best);
  return `<h1 class="center">🏆 ${t("finalTitle")}</h1>
  <div class="card center big">${winners.length > 1 ? t("tie") + "<br>" : ""}${winners.length > 1 ? t("winnersAre") : t("winnerIs")} <b>${winners.map((p) => esc(p.name)).join(" & ")}</b> — ${best} ${t("pts")}</div>
  ${scoreboard()}${isManual() ? sheetTable() : ""}${isManual() && isHost() ? `<button class="alt" onclick="reopenScoring()">${t("reopen")}</button>` : ""}<button onclick="leaveRoom()">${t("newGame")}</button>`;
}

/* ---------- timer + auto-submit ---------- */
let lastLockedKey = "", hostLockedFor = {};
function manualTick() {
  const r = state.room, rd = state.manualRound || 1;
  if (!r || !isManual() || r.status !== "manual" || !mStarted(rd)) return;
  const left = mLeft(rd), locked = allLocked(rd);
  const el = document.getElementById("mtimer"); if (el) { el.textContent = "⏱ " + left; el.classList.toggle("urgent", left <= 10); }
  const me = state.players.find((x) => x.id === state.pid);
  // time is up: lock in whatever is typed
  if (left === 0 && me && !mr(me, rd).l) lockWords(rd, true, true);
  // safety net: if someone's phone went to sleep, the host locks them in 3 seconds later so the round never gets stuck
  if (left === 0 && isHost() && Date.now() > mEnds(rd) + 3000 && !hostLockedFor[rd]) {
    hostLockedFor[rd] = true;
    state.players.filter((p) => !mr(p, rd).l && p.id !== state.pid).forEach((p) => { editRound(p.id, rd, (c) => { c.l = 1; }); saveManual(p.id, true); });
  }
  // everyone locked in: tell everybody (buzz + banner)
  const key = rd + "|" + locked + "|" + (left === 0); // redraw once when everyone locks in, and once when the timer ends
  if (key !== lastLockedKey) {
    const was = lastLockedKey; lastLockedKey = key;
    if (locked && !was.includes("|true|")) { try { navigator.vibrate && navigator.vibrate([200, 100, 200]); } catch (e) {} }
    render(true);
  }
}
setInterval(() => {
  manualTick();
  const r = state.room; if (!r || r.status !== "entering") return;
  const left = Math.max(0, Math.ceil((new Date(r.round_ends_at).getTime() - Date.now()) / 1000));
  const el = $("#timer"); if (el) { el.textContent = "⏱ " + left; el.classList.toggle("urgent", left <= 10); }
  if (left === 0 && !mySub()) submitWords(true); // time's up: lock in whatever is typed
  hostTick();
}, 500);

/* ---------- boot ---------- */
(async function boot() {
  render(true);
  const savedRoom = localStorage.getItem("mg_room"), savedPid = localStorage.getItem("mg_pid");
  const urlRoom = (new URLSearchParams(location.search).get("room") || "").toUpperCase();
  if (savedRoom && savedPid && (!urlRoom || urlRoom === savedRoom)) {
    const { data } = await sb.from("players").select("id").eq("id", savedPid).maybeSingle();
    if (data) return enterRoom(savedRoom, savedPid); // phone woke up: rejoin silently
    localStorage.removeItem("mg_room"); localStorage.removeItem("mg_pid");
  }
  render(true);
})();

// expose handlers for inline onclick
// reload the newest version of the page (your room and score are kept; the phone rejoins by itself)
async function hardRefresh() {
  try { if (window.caches) for (const k of await caches.keys()) await caches.delete(k); } catch (e) {}
  const u = new URL(location.href); u.searchParams.set("r", Date.now());
  location.replace(u.toString());
}
Object.assign(window, { hardRefresh, setWord, setNum, lockWords, showRound, addRound, reopenScoring, endRoundNow, endGame, setRounds, createRoom, joinRoom, startGame, sendPrompt, submitWords, nextRound, copyLink, setLang, leaveRoom, state });

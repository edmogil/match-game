MATCH GAME  -  HOW IT WORKS
===========================

A party word game played on everyone's own phone (iPhone or Android, no app to
install). English and Russian can be mixed. This file explains what each part
does and the logic behind it, so you can understand or change it later.

NOTE: this file is public if it is deployed with the site. It contains no
passwords or keys, only the names of the settings. Keep it that way.


1. THE GAME
-----------
Everyone joins one room with a 4-letter code (or by scanning the QR code).
Each round has a word or theme. Every player writes 3 words or phrases.
Words that match other players' words score points.

Matching rules (online mode)
  - Same word = match ("apple" and "apple").
  - A direct translation = match ("apple" and "яблоко").
  - Plural / word-form differences are forgiven ("dog" and "dogs",
    "яблоко" and "яблоки").
  - A small typo is forgiven on longer words ("elephent" = "elephant").
    Short words must be exact, so "house" and "horse" never match.
  - SYNONYMS NEVER MATCH ("big" and "huge", "car" and "automobile").
  - The order of your 3 words does not matter. Every word is compared with
    every other player's words.
  - Male/female forms of the same creature match ("cat" = "кошка" = "кот").

Scoring (online mode)
  - Each word scores 1 point for yourself, plus 1 point for each OTHER player
    who matched it.
      A word nobody else wrote ........ 1 point
      Matched by one other player ..... 2 points
      Matched by two other players .... 3 points
  - Your round score is the sum of your 3 words. Scores add up over rounds.

Who picks the next word
  - The player with the most points in the round picks the next word or theme.
  - If there is a tie, the player who picked the longest time ago goes first.
  - In round 1 the host picks.

Timer
  - 90 seconds per round (a sticky countdown at the top of the screen).
  - When it hits 0 whatever is typed is locked in automatically.
  - The round ends early when everyone has locked in.
  - The host can also press "Finish round now". Words typed but not locked
    are locked in for the players.

Ending
  - The host chooses the number of rounds in the lobby (3, 4, 5, 7, 10, 15).
  - The host can press "End game & announce winner" at any time.
  - The highest total wins. A tie is announced as a tie.


2. MANUAL MODE
--------------
Press "Manual Mode" on the start screen instead of "Create a room".
The app does NOT match words. Players keep score themselves.

  1. The host presses "Start round". Everyone gets 90 seconds (a countdown
     shows at the top) to type 3 words. A player can press Lock in early.
     When the time runs out, whatever is typed is locked in automatically.
     After locking, words cannot be changed.
  2. Players only ever see their OWN words. Other players' cards show only
     the name, a lock icon and the round total.
  3. The match-count boxes stay switched off until EVERYONE is locked in.
     Then a green message appears on every phone ("Everyone is locked in!")
     and the phones buzz. Only then do players read their words aloud, one
     at a time, and type how many matched next to each of their words
     (type 1 for a word nobody matched, 2 if one other person matched, etc.).
     The host can press "Finish round now" to end the timer early.
     If a phone is asleep when time is up, the host's phone locks that
     player in 3 seconds later so the round never gets stuck.
  4. The round total is the sum of the three numbers.
  5. The numbered tabs at the top let anyone go back to any round. Match counts
     can still be changed there (words cannot).
  6. A score sheet shows every player's total for every round.
  7. The host can add a round, and presses "Finish game & show final scores".
     The app adds up all rounds and announces the winner.
     After finishing, the host can press "Back to scoring" to fix a number.

Only you can change your own numbers. The host cannot change other players'.
(The words are hidden on screen only. They are still stored in the database.)


3. THE PARTS
------------
  Phones (browser)      The game itself: web page + JavaScript.
  Cloudflare (site)     Hosts the web page files for free.
  Supabase (database)   Stores rooms, players and words, and pushes live
                        updates to every phone, so all screens stay in sync.
  Cloudflare Worker     "matchgame-matcher": the matching brain for online
                        mode. Phones send it the round's words, it answers
                        with who matched what and the points.
  Gemini (Google AI)    Used only by the Worker to translate words. Free tier.
  Cloudflare KV         A small storage box the Worker uses to remember
                        translations and to count daily AI calls.

The phones talk to Supabase directly. Only the host's phone calls the Worker,
once per round.


4. THE FILES
------------
  index.html        Page layout and all the styling (dark party theme).
  app.js            All game logic on the phone (see section 5).
  config.js         Public settings: database address, public database key,
                    Worker address, round length (90), max players (12).
  readme.txt        This file.

  (kept outside the website, used when updating)
  matcher-worker.js The code you paste into the Cloudflare Worker.
  schema.sql        The database tables (run once in Supabase).


5. HOW THE GAME RUNS (app.js)
-----------------------------
Room status moves through these steps (stored on the "rooms" row):

  lobby -> picking -> entering -> revealing -> results -> picking -> ... -> finished
  lobby -> manual -> finished   (Manual Mode)

  - Every phone watches the database. When anything changes, every phone
    reloads the room and redraws. A safety refresh runs every 4 seconds in
    case a live message is missed.
  - The HOST'S PHONE drives the transitions in online mode (it notices when
    all words are in or the time is up, then scores the round). So the host
    should keep the app open and the phone awake.
  - "revealing" is a lock: the host's phone changes the status
    entering -> revealing in one atomic step. If it gets two ticks at once,
    only one wins, so a round can never be scored twice.
  - Joining again with the same name in the same room restores your score.
    Phones remember the room in local storage, so reopening the page after the
    phone sleeps puts you back in the game.
  - While you type, the screen does not redraw under you (that would close the
    phone keyboard).

Fallback: if the Worker or the AI is unavailable, the phone matches by itself
(same word, plurals, small typos). Only the English/Russian translation step
is lost. The game never stops.


6. THE MATCHER (matcher-worker.js)
----------------------------------
Blind translation. The AI is never shown pairs of words and asked "do these
match?". That tended to say yes to synonyms. Instead:

  1. Every English word is translated ON ITS OWN into its standard Russian
     dictionary translation (1 or 2 meanings; both genders for animals/people).
  2. Russian words are turned into their base form (so "яблоки" -> "яблоко").
  3. The program (not the AI) then compares: same word, a translation link,
     or a one-letter typo on longer words.
  4. Two different words in the same language are never sent to the AI. The
     exception is Russian words from different players that differ slightly
     (to check if they are forms of the same word).
  5. Words that match each other are grouped, which gives the "Matches by
     word" card and the per-word points.

Cost control (all built to stay free or tiny):
  - Translations are remembered in KV, so a word is looked up once, ever.
  - Daily cap: 300 AI calls for the whole app, 40 per room.
  - Max 60 words per call, 12 players, 3 words per player, 40 letters per word.
  - When a cap is hit, the game keeps working with exact matching only.
  - The AI key lives in Cloudflare as a secret, never in the web page.

Opening the Worker's address in a browser shows
{"status":"matchgame matcher is running","version":"N"}.
The version number is how you check that a pasted update really went live.


7. THE DATABASE (Supabase)
--------------------------
  rooms        One row per game: code, host, status, round, total rounds,
               prompt, who picks next, timer end time, last round's results,
               mode ("online" or "manual").
  players      One row per player: name, score, last time they picked,
               and "manual" (their words and match counts per round, used
               in Manual Mode).
  submissions  Each player's 3 words for each round (online mode).

The access rules are open (no logins), which suits a party game. Anyone who
knows a room code can join it. Do not put anything private in the game.


8. SETTINGS AND SECRETS (names only)
------------------------------------
In the Cloudflare Worker:
  GEMINI_API_KEY   Secret. Your Google AI key.
  TEST_TOKEN       Secret. Lets you run a self-test of the translator by
                   opening the Worker address with ?token=...
  GEMINI_MODEL     Optional. Defaults to gemini-3.5-flash-lite.
  CACHE            The KV storage binding.
In config.js (public, safe to expose):
  SUPABASE_URL, SUPABASE_KEY (the public "publishable" key), WORKER_URL,
  ROUND_SECONDS, MAX_PLAYERS.


9. UPDATING THE GAME
--------------------
  Automatic (current way): the code lives in GitHub (private repo
  edmogil/match-game). Cloudflare watches the "main" branch. Every change
  pushed to it rebuilds and deploys the website by itself (root directory:
  "site", deploy command: npx wrangler deploy). Check the version label at the
  bottom of the game to confirm which version is live.
  The matcher worker is NOT auto-deployed yet. It is still pasted in by hand
  (see "Matcher" below).

  Manual way (backup):
  Website:  Cloudflare dashboard -> your site project -> upload the new zip
            of index.html, app.js, config.js (and readme.txt).
  Matcher:  Cloudflare dashboard -> Workers -> matchgame-matcher -> Edit code
            -> paste matcher-worker.js -> Deploy. Check the version number.
  Database: Supabase -> SQL Editor -> paste and run the new lines.
            (The manual-mode lines are at the bottom of schema.sql.)

If the AI ever costs too much or is too loose, change GEMINI_MODEL, or lower
the daily caps at the top of matcher-worker.js.


10. KNOWN LIMITS
----------------
  - A word with two unrelated meanings only matches its first translation
    (example: "bat" will not match "бита").
  - Irregular English plurals do not match ("mice" and "mouse").
  - "ice-cream" and "ice cream" are treated as different.
  - The game depends on the host's phone staying awake (online mode).
  - The free Gemini tier can be slow if many rounds are scored in the same
    few seconds. The game falls back to exact matching if it fails.
  - Players can see the page's code and data if they know how. This is fine
    for a party, not for anything secret.


11. IF SOMETHING GOES WRONG
---------------------------
  - Players stuck on the wrong screen: have them close and reopen the page.
    They rejoin automatically.
  - Translations not working (apple does not match яблоко): open the Worker
    address and check it says "running" and the right version. Check the
    GEMINI_API_KEY secret and the daily cap.
  - "Something went wrong": the database could not be reached, or a
    database update (section 9) was skipped. Try again, then check Supabase.
  - A wrong match: it is almost always the AI's translation of a word that has
    several meanings. Tell the group and give or take the point by hand.

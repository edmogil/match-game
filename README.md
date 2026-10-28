# Match Game

A phone-based party word-matching game (English / Russian). See `site/public/readme.txt` for the full explanation of the rules and the logic.

- `site/public/`  the website (deployed to Cloudflare from the `site` folder)
- `worker/`       the matcher worker (Gemini translation + scoring)
- `supabase/`     database tables (run once in the Supabase SQL editor)

Never commit secrets (Gemini key, test token). They live in Cloudflare.

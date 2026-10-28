// Public values only. The publishable key is designed to be visible in the browser.
window.CONFIG = {
  SUPABASE_URL: "https://douccodnblucmexizhrk.supabase.co",
  SUPABASE_KEY: "sb_publishable_ZrSRfyv8X7WvKwKl_D6zwQ_RLji4TUR",
  // Fill in after deploying the Cloudflare Worker. Until then the game uses
  // same-language matching only (no English/Russian cross-matching).
  WORKER_URL: "https://matchgame-matcher.emogil.workers.dev/",
  ROUND_SECONDS: 90,
  MAX_PLAYERS: 12,
};

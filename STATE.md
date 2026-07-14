# Project State

## Current Implementations
* **QR Code Redirect:** Configured a permanent 308 redirect in `next.config.mjs` from `/quiz/quiz` to `/quiz`. This ensures that all printed QR codes resolve correctly.
* **Honeymoon Page Tab Selection Fix:** Corrected type mismatched string comparisons on the "Luna de miel" page, replacing `"itinerary"` with `"itinerario"`.
* **Production Deployment:** Authenticated with the primary Vercel account (`alcatamy`) and successfully deployed the correct Next.js project (`boda`) serving `https://nadiayadrian.vercel.app`.
* **Database Integration:** Configured and verified connection to the live Supabase database for saving and loading wedding quiz scores. Tested score submissions and verified they rank correctly. Cleaned up all test records afterwards.

## Technical Decisions
* **Redirect Level:** Kept Next.js `redirects` in `next.config.mjs` to resolve redirects at Vercel's edge routing level for maximum performance (< 10ms).
* **Tab Selection typing:** Unified tab values to Spanish keys (`"itinerario"`) to avoid compilation crashes.

## Next Focus
* Monitor wedding quiz responses and rankings when guests start playing.

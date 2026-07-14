# Project State

## Current Implementations
* **QR Code Redirect:** Configured a permanent 308 redirect in `next.config.mjs` from `/quiz/quiz` to `/quiz`. This ensures that all printed QR codes resolve correctly.
* **Honeymoon Page Tab Selection Fix:** Corrected type mismatched string comparisons on the "Luna de miel" page, replacing `"itinerary"` with `"itinerario"`.
* **Itinerary Updates (Vietnam & Bali):** Added detailed items requested by the user:
  - **July 28 (Hanoi):** Note Coffee/La Place breakfast, Ha Trung money change, Marionetas, Train street.
  - **July 29 (Hanoi):** Catedral de San José and alternative dinner suggestions.
  - **July 30 (Sapa):** Lao Cai pickup (sign "Nadia"), Fansipan 3-step route in the morning, waterfalls/spa in the afternoon.
  - **August 1 (Ninh Binh):** Bus via 12goasia, 14 min walk to hotel, Le Brick/Gao breakfast, motorbike rental map link, Bich Dong/Buffalo/Mua Cave split.
  - **August 2 (Ninh Binh):** Trang An departure boat ticket map link, takeaway breakfast recommendation.
  - **August 5 (Bali):** Optional Ubud Palace/Saraswati Temple illuminated walk, Pistachio/Donna dinner suggestions.
  - **August 6 (Bali):** Optional Melukat, optional Monkey Forest, and Gisella Spa map link.
* **Production Deployment:** Linked and successfully deployed to the `alcatamys-projects` Vercel account under project `boda` (serving `https://nadiayadrian.vercel.app`).

## Technical Decisions
* **Vercel CLI Scope:** Configured `.vercel/project.json` to link to `alcatamys-projects/boda` (projectId `prj_JkS9OQzuZ2z0EkKIv59doS40mt2t`), using a Vercel token to bypass the local CLI session scope.
* **Itinerary Links:** Embedded rich markdown links for Google Maps locations directly into the itinerary details.

## Next Focus
* Prepare for wedding guest RSVPs and monitor quiz scores.



# Collective Wedding Styling — Luxury NFC Card (V7 — Four Linked Captions)

This is a GitHub Pages-ready mobile NFC card based **exactly** on the provided gold-and-floral vertical poster.

## Files
- `index.html` — the card and interactive hotspots
- `styles.css` — responsive layout and fast-moving golden animated light waves
- `script.js` — save contact (VCF) button
- `assets/luxury-wedding-card.webp` — optimized artwork from the approved design
- `assets/luxury-wedding-card.jpg` — browser compatibility fallback
- `assets/original-cws-logo.png` — supplied business logo preserved as a separate resource for any later redesign

## Working clickable icons (left to right)
1. Calendar: Official consultation and enquiries page
2. Phone: Call 1300 003 040
3. Instagram: Collective Wedding Styling Instagram
4. WhatsApp icon: Message Collective Wedding Styling (using the mobile number listed by Wedding Expos Australia)
5. Person+ icon: Download company contact (.vcf)

The four images along the bottom open the official Wedding Florals, Centrepieces, Dance Floors and Home Styling pages respectively.

## Publish in the existing GitHub Pages repository
Upload the **contents** of this folder into the root of the WW repository (not the enclosing folder), keeping the `assets` folder intact. Replace `index.html`, `styles.css`, and `script.js` where needed. Commit and wait for GitHub Pages to deploy. Reload `https://iroves.github.io/WW/` with Ctrl+Shift+R if you see the old site.

The gold wave animations are real CSS/SVG animations; they are not frozen into the picture. They run quickly across the whole poster. The five action icons and four showcase images have invisible interactive overlays so the approved design stays *pixel-accurate* and fully clickable.

No favicon has been added, as requested.

### Important design limitation
Because the exact approved design is a flattened image, its logo, text, and portrait are part of that image rather than independently editable HTML. The original logo is provided separately for future editing. The founder's name **Liane** is shown in the approved artwork but has not been independently confirmed; changing that name requires changing the artwork.

This website needs an internet connection to open the linked wedding service pages, but the visual card and its gold animations work offline.

## V7: Labels and links beneath the four thumbnails
The approved full poster artwork and the existing fast-moving gold animations have not been modified. Immediately beneath the four original photographs is a four-column caption strip, aligned to each corresponding image, with elegant service descriptions. Both the photos and their captions can be tapped to open the real service pages:

- Wedding Florals — Bouquets & backdrops
- Wedding Centrepieces — Beautifully styled tables
- Dance Floors — Dance in style
- Bridal Home Styling — From home to celebration

The caption row is live HTML, not part of the flattened poster, so you can edit the wording in `index.html` later without editing the artwork. No favicon added.

V8: Removed white hover, focus and tap circles from all interactive poster buttons and thumbnails. Poster and animations unchanged.


## V9 — WhatsApp button
Replaced the fourth button's gallery icon with a champagne-gold WhatsApp icon. The button opens WhatsApp with a short prefilled enquiry. The other four buttons, service photos, captions and gold animations are unchanged.

**Important:** The WhatsApp destination is **+61 423 450 301**, the mobile number listed for Collective Wedding Styling by Wedding Expos Australia. We have not independently confirmed that this number is WhatsApp-enabled. Please confirm the correct WhatsApp number with the business before publishing. To change it, edit the `wa.me/61423450301` number in `index.html` (international format, digits only).

No favicon.

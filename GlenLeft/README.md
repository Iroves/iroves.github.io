# Glen Coxon — full-portrait, full-motion NFC card

This is a ready-to-publish replacement for the Glen Coxon NFC card.

## What changed

- Portrait starts **at the very top of the page and extends to the top of Call**, with **dark navy-blue fades at both the top and bottom** and softer side blending. The face stays bright and readable while the lower body fades smoothly behind the profile details.
- Moving blue/silver paint MP4 plays **under the entire profile**, including Call, Send a message, Save contact and Share. The buttons are translucent so the movement can be seen behind them.
- Keeps the vertical mobile layout on folded and unfolded screens.
- Retains Glen's GC monogram, original business details, Call, SMS, downloadable contact file, and sharing.
- Video is silent/looping; on devices that block autoplay or prefer reduced motion, a poster image remains.
- No third-party site, domain, external library or subscription required.

## Update the existing GitHub Pages website

1. Extract the ZIP.
2. Open your GitHub `Glenc` repository.
3. Upload **all files inside this folder**, including the entire `assets/` folder, in the repository root. Replace matching older files.
4. Commit. Wait for GitHub Pages deployment and refresh the webpage (force-refresh if cached).
5. The current URL remains `https://iroves.github.io/Glenc/index.html`; no NFC tag change is required.

## Edit contact details

Edit `config.js` only. Replace `assets/glen-portrait.webp` to use a new photo or update the `photo` filename in `config.js`.

## Design details

- The photo layer automatically measures the first Call button so its bottom edge sits exactly above the button on narrow, standard, and foldable phones.
- Top and bottom photo fades use navy (#061b33); the video remains behind the complete card, including the lower buttons.
- The video spans the entire profile element, not just the portrait panel.
- Contact functionality is local to the browser and requires no backend.

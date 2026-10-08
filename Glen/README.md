# Glen Coxon — full-portrait, full-motion NFC card

This is a ready-to-publish replacement for the Glen Coxon NFC card.

## What changed

- Portrait fills **from the very top of the card down to just above Call**, fading gradually into the dark blue paint-motion background.
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

- The photo layer automatically measures the position of the first contact button so it fades to the correct spot on narrow or foldable phones.
- The video spans the entire profile element, not just the portrait panel.
- Contact functionality is local to the browser and requires no backend.

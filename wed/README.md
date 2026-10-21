# Collective Wedding Styling — mobile NFC card

A compact, luxury, mobile-first digital business card. It works as a static site on GitHub Pages or another static host. Just upload the contents of this folder and open `index.html`.

## Design features

- **Real official logo**: `assets/cws-official-logo.png`, derived directly from the logo supplied by the card designer, preserving its proportions and shape.
- **Founder's portrait**: warm floral composition, saved locally. `assets/founder-original.jpg` is the original provided photo.
- **Fast animated golden wave lines**: real CSS/SVG animation (not just a picture). Respects reduced-motion accessibility settings.
- **Five compact icon-only buttons**, in order: book a consultation, call, Instagram, view portfolio, save contact. Accessible labels appear to assistive technologies and as desktop tooltips, not visible beside the icons.
- **Four examples** below the poster: Wedding Florals, Centrepieces, Dance Floors, Bridal Home Styling, each leading to the correct service page from the official company website. Remote photo previews use the company's website imagery when available; local decorative fallbacks ensure the layout still works without them.
- **Fully static** and no login needed. Google Fonts and official portfolio images require internet. Icon buttons and local portrait/logo display without external assets.

## Important before publishing

1. **Confirm the spelling of the founder's name.** “Liane” is provisional, based on the client's best guess. It appears in `index.html` inside `<h1 id="founder-name">Liane</h1>`. Change that once verified.
2. Confirm business contact number and Instagram destination with the client before publicly distributing this card.
3. The portrait scene is a previous stylised concept image, not an unedited photographic record; the original supplied photo is kept in `assets/founder-original.jpg`.
4. Images from `static.wixstatic.com` depend on their availability and the client's permission to reuse them. The portfolio/service source links point to the company's public website.
5. This is a **website version sized like an NFC card on a phone screen**, not a physical NFC-chip manufacturing design. An NFC chip/tag can be encoded with the final hosted URL.

## Deployment to GitHub Pages

Upload `index.html`, `styles.css`, `script.js`, and the `assets` folder to the publishing directory of a GitHub repository. Enable **Settings → Pages → Deploy from a branch**. Test all contact links and check the site on a phone. No server or build process is required.

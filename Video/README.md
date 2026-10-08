# VIDEO INSIDE CARD ONLY — NFC DIGITAL BUSINESS CARD TEMPLATE

This is a mobile-friendly static website. **animated neon video INSIDE the profile card, with STATIC page surroundings, 7 seconds**. The example avatar and client information are placeholders.

## Folder contents

- `index.html` — upload this file at the **root** of your GitHub Pages repo.
- `style.css` — layout and visual style; edit for bespoke clients.
- `config.js` — the ONLY file you usually need to edit with your client's name, contact details, title, description and optional social links.
- `app.js` — functional calls, email, optional contact/social links, downloaded .vcf contact card and Share button.
- `assets/avatar.webp` — example avatar; replace with a real client photo. Edit the `photo` path in `config.js` if using another filename.
- `assets/neon-motion.mp4` — silent looping video background.
- `assets/neon-poster.jpg` — static image displayed until the video loads, or when reduced motion is enabled.
- `assets/favicon.svg` — browser tab icon.
- `PREVIEW-mobile.png` and `PREVIEW-desktop.png` — preview screenshots; optional for publication.

## GitHub Pages setup

1. Create a repository, e.g. `Client-NFC-Card`.
2. Extract this ZIP to a folder on your PC.
3. Open that folder and upload **all the contents** to the repository's **root** (not the enclosing folder or the ZIP).
4. Under **Settings → Pages**, select **Deploy from a branch**, `main`, `/ (root)`, and save.
5. Open `https://YOUR-USERNAME.github.io/Client-NFC-Card/` on your phone.
6. Program that public HTTPS URL into your NFC tag using an NFC writing app.

## Change your client's information

Open `config.js` in Notepad, VS Code, or another editor. Update the placeholder name, employer, job title, photo, phone numbers and email. You can remove optional links by leaving the corresponding values empty (`""`).

To customise the animated background, replace `assets/neon-motion.mp4` with a **muted H.264 MP4** (keep the same filename), and replace `assets/neon-poster.jpg` with an image from the replacement video.

## User experience and notes

- **Call** and visible phone numbers open the phone dialer.
- **Email** opens the phone's configured email app.
- **Save to Contacts** produces a `.vcf` file using the client's current details.
- **Share this card** opens native sharing or copies the public URL where supported.
- Autoplay is muted and plays inline; browsers can disable it, in which case the poster image remains visible.
- No subscription, backend, database, or purchased domain is needed. Each client's NFC tag stores only the published web URL.
- Placeholder contact details are not real; replace them before delivering a client card.

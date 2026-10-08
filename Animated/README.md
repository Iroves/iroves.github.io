# Animated NFC Digital Business Card — Client Template

A real, mobile-friendly digital business-card website for a physical NFC tag, inspired by a colourful magenta / purple / orange / blue palette.

It runs on **free GitHub Pages** without a paid card platform or your own domain. Your NFC sticker/tag stores the **public website URL**, not the site files.

## What's included

```
NFC-Client-Card-Template/
│
├── index.html                ← actual website / landing page
├── config.js                 ← EDIT THIS ONE FILE for each client
├── style.css                 ← responsive styling and colours
├── app.js                    ← click actions, social links, vCard download
├── assets/
│   ├── avatar.webp           ← temporary professional avatar (replace it)
│   ├── neon-motion.mp4       ← 7-second animated background, silent + looping
│   ├── neon-poster.jpg       ← backup still image while video loads
│   └── favicon.svg
├── PREVIEW-mobile.png        ← screenshot of the finished example
├── PREVIEW-desktop.png       ← desktop screenshot
└── README.md
```

## 1. Change your client's details

Open **config.js** with Notepad, Notepad++, or VS Code. Change the demo content to the client's actual name, qualifications, role, company, telephone, mobile and email. For example:

```js
name: "Jane Example",
credentials: "B.Sc., M.Sc.",
jobTitle: "Business Consultant",
organization: "Jane Example Consulting",
telephone: { display: "+61 2 9123 4567", dial: "+61291234567" },
mobile: { display: "+61 400 111 222", dial: "+61400111222" },
email: "jane@example.com",
```

The `display` phone string is what visitors see. The `dial` phone string becomes the clickable `tel:` link. Ensure both are correct before giving a card to a client.

**No need to edit HTML or JavaScript code for normal client details.**

### Hide information you don't want

For any optional string, set it to `""` (empty):

```js
credentials: "",
website: "",
address: "",
mapUrl: "",
socials: { Instagram: "", LinkedIn: "", WhatsApp: "" }
```

Unused rows disappear automatically. The template includes no location, LinkedIn, or WhatsApp links by default.

To hide the phone or fax row, remove the display **and** dial values:

```js
fax: { display: "", dial: "" },
```

## 2. Replace the client's picture

Replace `assets/avatar.webp` with a new file of the **same name** (square image recommended, around 500 × 500 pixels), or change the `photo` path in `config.js` to point to a JPG, PNG, or WebP image.

Example for a JPG named `client-photo.jpg` placed in `assets/`:

```js
photo: "assets/client-photo.jpg",
```

## 3. Replace the moving video background (optional)

The ready-made video is `assets/neon-motion.mp4` — a **7-second muted, looping MP4**. It's lightweight and designed for mobile viewing.

To use your own video, replace it with an MP4 file named **exactly** `neon-motion.mp4` in `assets/`, or edit the video source in `index.html` if changing the filename. Use standard H.264 MP4, portrait orientation where possible, without sound, and keep the file small so NFC visitors don't wait for it to load.

The file `assets/neon-poster.jpg` is the fallback image displayed before the video begins or when reduced motion is preferred. Replace it with a matching frame if you change the video.

The background has `autoplay muted loop playsinline`, which is important for autoplay on phones. Some users' browser/device preferences may prevent videos from playing; the fallback is intentional.

## 4. Upload to GitHub Pages (free)

1. In GitHub, create a new repository for a client, such as `Jane-Example-NFC-Card`.
2. Open the extracted `NFC-Client-Card-Template` folder on your computer.
3. Upload **the contents of that folder**, not the outer folder, to the GitHub repository's **main/root directory**. `index.html` must be visible in the repository root.
4. In the repository go to **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
6. Once published, your URL will normally look like:

   `https://YOUR-USERNAME.github.io/Jane-Example-NFC-Card/`

7. Open that URL on your mobile phone to check the client details, phone/email buttons, video and **Save to Contacts**.
8. Write that **HTTPS URL** to the NFC tag using your NFC app. Optionally put the same URL into a QR code on the physical card.

You don't need a domain name, a business-card service, a database, paid hosting, or any external JavaScript libraries.

## 5. Reuse for your next customer

Duplicate the template folder, edit `config.js`, change the photo, optionally switch the video and publish to a new GitHub repository. Each client's site has its own URL for their own NFC tag.

## Buttons: what they do

- **Call** — phone dialer opens using the mobile number, or office number as a fallback.
- **Email** — opens the user's default mail app addressed to your client's email.
- **Telephone / Mobile / Fax** — visible phone values that can be tapped.
- **Website / Location / social links** — optional; shown only when set in `config.js`.
- **Save to Contacts** — creates a `.vcf` vCard from `config.js` at the moment someone taps the button; no separate vCard file needs manual updating.
- **Share this card** — opens native mobile sharing when supported; otherwise copies the URL or offers manual copying.

## Notes

- All details in the included example are placeholders — replace them before publishing a real customer's page.
- The `PREVIEW` images are screenshots only; the **real site** is `index.html` plus the linked files.
- No analytics, forms, cookies, tracking scripts, paid subscriptions or server are included.
- On browsers with reduced-motion settings, the background video is hidden; the still poster remains visible.
- If previewing with a file manager doesn't play the video, upload to GitHub Pages and test the HTTPS version in a phone browser.

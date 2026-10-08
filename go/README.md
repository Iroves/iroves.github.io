# GoLabour Solutions — End-of-Shift Timesheet

**NEW DESIGN: no NFC, no clock-in/out, no accounts or backend required.**

Workers open a single webpage after their shift, enter the job location, date, start and finish times, unpaid break, and an optional note. The website calculates paid hours automatically. The supervisor enters their name and signs directly on the worker's phone with a finger or stylus. The worker then shares a signed PNG image to their WhatsApp work group, or previews and saves their signed image using their phone's built-in Share/Save controls, or saves the timesheet as a PDF.

## Files

```
index.html       ← The webpage (must be in repository root)
style.css        ← Mobile/desktop design
app.js           ← Calculator, signature capture, PNG creation, share and print
PREVIEW-mobile.png   ← Preview screenshot
PREVIEW-image.png    ← Example downloaded timesheet
README.md
```

## Upload to GitHub Pages

1. Create (or open) a GitHub repository.
2. **Remove the old clock-in timesheet files** before uploading this version. In particular, the old `Index.html` and `Code.gs` are not required.
3. Upload `index.html`, `style.css`, and `app.js` directly to the **root** of your repository (not inside another folder).
4. Go to **Settings > Pages**; set **Deploy from a branch**, **main**, **/(root)** and save.
5. Wait for deployment, then open `https://YOUR-USERNAME.github.io/YOUR-REPO/` on your mobile phone.
6. Give workers that URL as a bookmark, a WhatsApp group description link, or a QR code. **No NFC tags are needed.**

## How the worker uses it

1. Enter **name**, **location**, **shift date**, **start**, **finish** and **unpaid break in minutes**.
2. The paid hours calculate immediately, including shifts ending after midnight. Example: 07:00 to 15:30 with 30 minutes break = 8h 00m / 8.00 decimal hours.
3. Add an optional **message / comment** (up to 650 characters).
4. Ask the supervisor to enter their full name and draw their signature using the worker's device.
5. Tap **Share to WhatsApp**. On supported phones, a share menu opens: choose **WhatsApp > your work group**. The worker must manually choose the group and press send. If the phone/browser cannot share an image file, the website downloads it as a PNG so the worker can attach it manually.
6. Alternatively, select **Save signed photo** to see a preview of the completed signed image. On iPhone, tap **Save to Photos / Share** and choose **Save Image** (when offered), or touch and hold the image to save it to Photos. On Android, use the share menu or the **Download PNG** button; downloads may appear in Files / Downloads rather than Gallery.
7. The photo preview also has **Download PNG**, which generates a standard image file. If the browser does not display it in Photos automatically, save from the preview using the device's own controls. **Print / Save as PDF** is unchanged.

## Important limitations

- This is a **worker-completed timesheet form**, not an automated clock or authenticated payroll system. Times are self-entered and signatures are not independently verified.
- It does not send data to an office or a WhatsApp group on its own. A user must share/upload the generated file through WhatsApp.
- Browser drafts are saved **on that device only** (to help with accidental refreshes). The signature is NOT saved across reloads; the supervisor must re-sign after reloading. Clearing browser storage or using another phone loses the draft. Workers should share their completed image before leaving the job site.
- There is **no central database, login or server**, and nothing is uploaded to GoLabour by this website. Treat shared timesheets as personal information and use an authorised work group.
- The GoLabour logo loads from the official site at `https://golabour.com.au/images/logo.png`, with a matching text fallback if unavailable. The generated timesheet PNG uses branded text rather than embedding the remote image, so it works without cross-origin image access.
- For a genuine business payroll workflow, add secure authentication, management access, immutable records, audit history and an appropriate retention policy. Do not use this demo as independent proof of hours or signature authenticity.

## Customisation

- Change the titles, labels and website in `index.html`.
- Change colours in `style.css` (`:root` theme variables).
- Change default shift times (`07:00`, `15:30`) or break (`30` min) directly in `index.html`.
- The image generator is in `app.js` → `makeImage`.

No installation, database, Google Apps Script or paid service is required. Works as a static website on GitHub Pages.

## Photo-saving fix — v2 (October 2026)

The old download button made an `a.download` link from a canvas data URL. Browsers, especially Safari on iPhone, don't reliably put that file in the Photos library. It could seem that nothing happened. The new flow opens an actual PNG photo preview, then has a separate user-initiated Save to Photos / Share button. This lets the mobile browser show its native file-sharing sheet when supported. A direct PNG download remains available, and on iPhones the photo can be long-pressed to save.

**There is no browser API that silently writes a website image into the Photos album.** Workers must confirm Save Image / Photos themselves.

### Update an existing GitHub Pages website

Replace your existing **`app.js` and `index.html` in the root of the repo**, leaving `style.css` and everything else intact. The updated HTML says “Save signed photo” and uses `app.js?v=2` to refresh cached JavaScript. Both files are included in this ZIP. For a single-file patch, replacing only `app.js` also adds the preview, but the old button wording may remain and phones may use their cached old version.

Do not upload a ZIP file directly to GitHub Pages; upload the extracted files. GitHub Pages can take a minute to publish the updated assets. Test on a phone after deployment, preferably with a completed sample timesheet and supervisor signature.

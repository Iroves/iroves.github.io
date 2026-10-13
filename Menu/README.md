# Ember — interactive menu demo

A buildless mobile-first restaurant showcase. Prices and food content are fictional. Photography from Unsplash is illustrative. Fonts use Google Fonts with local fallbacks.

## GitHub Pages
Upload index.html, style.css, app.js and the assets folder into your repository root. In Settings → Pages select Deploy from a branch, main, /(root). No build or dependencies are required. Keep the folder structure intact. NFC tags and QR codes can point to the published URL.

## Try it
Swipe/scroll through dishes, filter categories, save favourites, choose extras, add items, change quantities and send a demo order. Open About (i) → Demo staff view to change its status. About → Menu studio edits prices, names, descriptions, sold-out flags and media links.

Menu studio changes and orders are stored only in that browser's localStorage. They are not shared between devices. Clearing browser data removes them. The studio is a public demo UI, not a secured admin panel. Exported menu JSON is a backup for manual development; uploading it alone does not change the website. To change initial content for everyone, update the defaults array in app.js and redeploy. Existing local overrides can be cleared with Restore sample menu.

## Videos
Burger and pizza include bundled short stock sample clips. Each begins muted after the dish is at least 70% visible for one second. Swiping away, opening a dialog or hiding the tab pauses playback and cancels pending starts. A visible play/pause button supports manual playback if autoplay is blocked. Salad and dessert retain photos. Enter a direct HTTPS MP4 URL for muted inline playback, or a YouTube URL for the embedded video viewer. YouTube videos must allow embedding. Network, browser autoplay settings and provider restrictions can affect playback. Native MP4 playback retains the underlying poster if unavailable. YouTube requires tapping Watch dish video. Do not put secret credentials in URLs or source.

## Production scope
Real orders, cross-device staff notifications, secure administrator access, shared inventory and payments require backend services and production hosting. GitHub Pages has commercial-use restrictions; use this as a non-transactional project demo and choose appropriate hosting before using it as a live ordering business. Verify menu imagery, prices and allergens with each business. No payments or real orders are sent here.

## Files
index.html — layout
style.css — responsive styling
app.js — sample menu and interactions
assets/ — bundled sample photos

Verification: JavaScript syntax, media decoding and automated playback timing/state tests completed. Interactive browser QA was unavailable in the build environment; test on your phone before presenting to clients.

## Sample video credits
Burger: Ron Lach / Pexels — https://www.pexels.com/video/close-up-shot-of-hamburger-8879534/
Pizza: ROMAN ODINTSOV / Pexels — https://www.pexels.com/video/pepperoni-pizza-close-up-6092984/
Bundled clips are shortened and compressed for this illustrative demo. Replace with each client’s own food footage.

# Iro — animated NFC card

Deep blue, champagne gold, softly blended portrait, sunset and Sydney motorbike photographs. Animated gold curves run across the photos. Mobile-friendly, no paid service or build step.

## Add your contact details

Open `contact.js` in any text editor. Add your mobile number inside the phone quotes and your Instagram username inside the instagram quotes (without @). Keep the quotes. Both links and Save contact are active. Your supplied number and Instagram username are already configured.

## Upload to GitHub

1. Extract the ZIP first.
2. Upload `index.html`, `style.css`, `app.js`, `contact.js`, and the complete `assets` folder to your repository's main directory. Upload the extracted contents, not the ZIP or an extra enclosing folder.
3. In GitHub, open Settings → Pages. Choose Deploy from a branch, select main and / (root), then Save.
4. Wait for GitHub to give you the Pages URL. Open that URL on your phone.
5. Write the Pages URL to your NFC sticker as a URL using your NFC-writing app. Use the website address, not the GitHub repository address.

You can preview locally by opening index.html. Photos, icons and scripts are included. Internet is required for Instagram and the hosted page; calling uses your device's dialler. A desktop may open a calling app instead.

## Design and motion

The circle at the top right pauses/resumes the moving gold lines. Reduced-motion preferences are respected. Animations are decorative; contact buttons remain still.

All three original photos are preserved and blended with CSS overlays. No third-party fonts, analytics or tracking. A Save contact button downloads a vCard after you add your details.

The layout adapts to the phone’s available screen height, including Safari controls and safe areas. The portrait remains large while the name and contact rows overlay its lower fade. Seventeen gold curves and six travelling highlights animate across the photographs.

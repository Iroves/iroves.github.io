CIPHER — two original green-code motion concepts for digital cards

DIGITAL RAIN
  Cascading green characters, glowing leading symbols, subtle scan texture.
  Classic code-rain mood, with softer contrast through the central area.
  assets/digital-rain.mp4 + assets/digital-rain-poster.jpg

CODE TUNNEL
  Glowing characters flowing through a three-dimensional perspective tunnel.
  A more spatial, futuristic alternative; softer lower area for contact text.
  assets/code-tunnel.mp4 + assets/code-tunnel-poster.jpg

Each video is 8 seconds, silent, 720 × 1280 pixels, portrait 9:16, 30 fps,
H.264 / yuv420p. Both are optimised for web playback with fast-start metadata.
Their calculated endpoints return exactly to their starting states.
All motion and glyph compositions are original; no movie footage is included.

PREVIEW
  Extract the whole ZIP, then open index.html.
  Select Digital rain or Code tunnel, then use Play/Pause motion.
  Alex Morgan is illustrative sample content; edit the HTML for your profile.
  The sample card has not been checked in a live browser in this session.

ADD TO YOUR EXISTING CARD
  See integration.txt. Copy either MP4 and its poster into your assets folder.
  Keep the name, role, contact information and buttons in live HTML above it.
  Use the dark overlay to preserve contrast. Provide a Pause control.
  Use the video as a full background or inside a smaller hero area.
  Upload the assets folder alongside your HTML when publishing on GitHub Pages.

MOBILE
  Muted + playsinline support inline playback where the browser allows it.
  Phones can block autoplay, especially in power-saving mode. A poster and
  manual Play button are provided. Reduced-motion starts on a still image.
  The example pauses while the page is hidden or the card is off-screen.

CUSTOMISE
  index.html — name, role, profile wording.
  style.css — fonts, spacing, overlay intensity and green accents.
  script.js — animation switching and playback behaviour.
  source/render_matrix_motion.py — re-render or recolour the original effects.
  The renderer requires Python 3, numpy, Pillow, DejaVu Sans Mono and ffmpeg.
  Run it from a separate working folder; it writes Matrix_Cards_Pack/assets.

style-comparison.mp4 shows the two video backgrounds together.

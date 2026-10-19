NATHA.TAT — NFC DIGITAL CARD

A poster-led digital card for Nathaly, inspired by the integrated photo-and-art
collage on the Gus reference page. It has a large artist poster, flowing colour
and light overlays, a gallery, a searchable shop and Shopify checkout.

OPEN THE CARD
Open index.html to review the design. Keep all files and folders together.
Booking, social links and the shop use an internet connection.

PUBLISH WITH GITHUB PAGES
1. Unzip this folder.
2. Upload index.html, the CSS and JavaScript files, natha-tat.vcf and assets to
   the root of your chosen repository. Keep the assets subfolders together.
3. In the repository, open Settings > Pages and publish from the main branch.
4. Open the published address on a phone.
5. Write that published address to the NFC tag as a website URL.

The exported card is a static website. It has no sign-in system or subscription.
The separate design-review preview is private to its owner.

EDIT THE CARD
- index.html: visible text, booking and social links, phone and studio address.
- styles.css: shared layout and dialogs.
- poster.css: poster composition, circular links and flowing motion.
- POSTER-DESIGN.txt: generation mode, reference images and final poster prompt.
- assets/natha-poster-v1.png: generated promotional poster.
- card-data.js: gallery images, categories and descriptive captions.
- natha-tat.vcf: contact details saved to the visitor's phone.
- assets/: bundled photos, artwork, logo and fonts.

When publishing under a different address, update or remove the og:url metadata
in index.html and point og:image at a publicly reachable image on that address.

GALLERY
The four circular buttons open the built-in work gallery and shop, Instagram
and WhatsApp. Tap the main poster to view the built-in gallery of original photos.
The main poster is a generated promotional composite.
Tap an image to enlarge it. Swipe left or right, use the arrows, or use keyboard
arrow keys to browse. Escape or the close button returns to the gallery.
Tap MEET NATHALY to read about Nathaly and open studio directions.

PAYID
The Pay by PayID button opens bank-transfer instructions for art purchases.
The WhatsApp button prepares a message asking Nathaly to confirm the item,
price, delivery, registered PayID and order reference. The customer sends it.
Nathaly confirms each payment after checking her bank account.
Her phone number is used for contact; it has not been presented as a registered
PayID. Direct copy-and-pay details can be added after her PayID is confirmed.

ACCESSIBILITY
Colour overlays and highlights flow continuously across the poster. The card follows the phone's reduced-motion setting. Dialogs
use native focus management, and controls include labels for screen readers.

CREDITS AND SOURCES
Nathaly / Natha.tat — photographs, original logo, tattoos and artwork.
https://nathatat.com/
https://nathadotstore.com/
The image source links are retained in ASSET-SOURCES.json.
Gallery captions describe the visible work; they are not official product titles.
DM Sans and Cormorant Garamond: font licences are included in assets/fonts/.

VERIFICATION
Local asset references, images, JavaScript syntax, gallery data, and contact
file structure were checked. A mobile-browser visual check is still needed.

SHOPIFY SHOP
The shop includes all 25 public products captured from nathadotstore.com and
refreshes from its public Shopify product catalogue when online. A saved
catalogue with bundled product photos is included if refresh is unavailable.
Shopify confirms final stock, prices, taxes, shipping and payment options.
Product selection and the bag use the real Shopify variant IDs. Buy now and
checkout redirect to her existing store using Shopify cart permalinks.
There is no payment processing or order confirmation in this static card.
Bag selections are stored locally on each visitor's device.
The T shirt listing currently has no merchant product photo.

SHOP FILES
hub.css: shop/gallery layout and the Gus flash-line and light-sweep animation.
hub.js: browsing, live catalogue refresh, product details and shopping bag.
shop-core.js: prices, catalogue normalisation and checkout-link validation.
shop-data.js: saved public catalogue and local product-image mapping.

This update was checked with source validation and checkout/price unit checks.
An end-to-end browser/payment test has not been performed.

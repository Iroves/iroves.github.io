NATHA.TAT — TATTOOS, ART & THE ARTIST

A tattoo-first NFC website with separate pages for the portfolio, Nathaly’s
background, art and products. The NFC tag opens index.html at its hosted URL.

PAGES
index.html — poster, introduction, selected tattoos and clear routes onward.
tattoos.html — 24 tattoo photographs across 7 style filters.
about.html — Nathaly’s technical drawing background, studies and art practice.
art.html — 6 selected artworks, separate from the products for sale.
shop.html — 25 saved public products, refreshed from the live Shopify catalogue.

BACKGROUND
The biography follows Nathaly’s own messages supplied on 20 October 2026.
It describes three years studying engineering and one year studying architecture.
It does not claim completed degrees, professional registration or completed
large installations. Larger installations are a future creative ambition.
No dates, qualifications, commissions or testimonials were invented.

DESIGN & PERFORMANCE
The existing colourful artist poster and Gus-style flash lines are preserved.
The original 3.3 MB poster is served as responsive WebP files of roughly
221 KB (640px) or 409 KB (941px), selected according to screen and resolution.
Gallery and product grids use small thumbnails with lazy loading. Full photos
load when opened. Decorative background images are tiny blurred variants.
The shop catalogue and shopping scripts load only on shop.html.
The high-resolution poster master is preserved in the source repository under
source-assets/natha-poster-v1.png and is not part of the served download.

TATTOO STYLES
Botanical & colour, Cover-up, Cross hatching, Fine line, Fine old school,
Fun & meaningful, Pets & symbolism. Categories follow the original portfolio.
Captions are descriptive labels and do not claim to be official artwork titles.
All work photographs are separate from the generated promotional poster.
Gallery images open in a lightbox with arrows, keyboard and swipe navigation.

CONTACT
Instagram: https://www.instagram.com/Natha.tat
Booking: https://venue.ink/@natha.tat
Phone/SMS: +61 426 930 105
WhatsApp: https://wa.me/61426930105
Contact buttons open a form inside the card. FormSubmit delivers enquiries
independently of Shopify to nathalymelomanso@gmail.com.
The address is not printed in the interface but is visible in source.

CONTACT ACTIVATION — STILL REQUIRED
No real enquiry or activation email was sent during development. Submit one
clearly labelled setup test through the hosted site. Nathaly must confirm the
FormSubmit activation email in her inbox (check spam). Verify delivery and
reply before sharing the form with clients, then remove the contact-setup note
in each HTML file and update the activation wording in contact.js.
A different hosted domain may require activation again.
FormSubmit documentation: https://formsubmit.co/help

SHOP & PAYMENTS
The existing Shopify account handles stock, order processing and checkout.
The custom card sends the actual variant IDs and quantities to her checkout.
Shopify confirms current prices, availability, taxes, shipping and payment.
Saved catalogue fallback is included if the live refresh is unavailable.
The T shirt listing currently has no merchant product photo.
The bag is stored locally on each visitor’s device. No payment is processed
or marked as successful by the card itself.
PayID is a secondary manual enquiry in the shop. No registered PayID is assumed.

PUBLISHING
Keep every HTML, CSS, JavaScript, contact file and assets folder together.
Publish the contents of this ZIP on static hosting that permits commercial
sites. GitHub can store the source; GitHub Pages restricts ecommerce hosting.
Connect the chosen domain and update og:url and og:image in all five pages.
Write that final public website URL to the NFC tag.
The separate design-review preview remains private to its owner.
Previously shared #tattoos, #shop, #about and #art home links redirect to the
corresponding new page. Internal navigation uses direct page links.

MAINTENANCE
card-data.js — portfolio photographs and styles.
portfolio-core.js / portfolio.js — filtering, previews and lightbox.
app.js — dialogs, sharing and legacy links.
portfolio.css — new page structure and typography.
styles.css / poster.css / hub.css — shared theme, poster and shop.
shop-data.js / shop-core.js / hub.js — catalogue, bag and checkout.
contact.js — enquiry submission and service-response handling.
ASSET-SOURCES.json / SHOP-SOURCES.json — photography and catalogue provenance.
POSTER-DESIGN.txt — original generated-poster brief.

CHECKS
All local routes, fragment links, labels, dialog targets and image references
were checked. The 7 style filters, category separation, lightbox wraparound,
product thumbnail paths, AUD totals and multi-item checkout URLs were checked.
JavaScript syntax and all WebP files passed validation.
Browser visual QA, real message delivery and payment completion remain untested.
No form submission or payment was made during checks.

CREDITS
Nathaly / Natha.tat — photographs, original art and tattoos.
https://nathatat.com/portfolio/
https://nathadotstore.com/
DM Sans and Cormorant Garamond licences are included in assets/fonts/.

OFFICIAL LOGO
The white logo supplied by Iro is used in the home introduction, inner-page
headers and footer. It is the original unmodified transparent PNG.
Source and provenance are recorded in ASSET-SOURCES.json.
The promotional poster is preserved as previously approved.

STUDIO ADDRESS
Understairs Ink
Shop 7 & 8, 60 Applebee Street, St Peters NSW 2044
https://maps.app.goo.gl/4BwaLYTXd6XYP9GZA?g_st=ic
Updated across contact sections and Save contact.

POSTER LOGO UPDATE
The official white logo is now integrated into the main poster’s lower black
brush band. The separate duplicate logo above the home introduction was removed.
Inner page headers and all footers retain the original official PNG.
Source masters are preserved; the site serves small responsive WebP variants.

The final poster uses a cleaned black brush band with the actual official PNG
layered into it responsively in HTML/CSS. The white logo is not a generated
approximation; it remains the original image file.

SELF-SERVICE PRODUCT EDITING
Nathaly can edit photos, title, price, description, variants and availability
in Shopify Admin > Products, then Save. The shop reads the public catalogue
on opening and when Refresh is pressed. New products must be published to
the Online Store sales channel to appear in that public catalogue.
Live listings use current image URLs with appropriately sized thumbnails.
Bundled photographs are used only with the saved fallback catalogue if the
live refresh fails. Name, price and description changes require no code edits.
The poster, biography, art/tattoo portfolio and layout do not have an admin
editor in this version.

LATEST POSTER REFINEMENT
The shirt now has a small dark X emblem on the wearer’s left chest.
The original official white wordmark is larger and angled into the black
brush shadow, with subtle pink and turquoise accents. The source PNG is
rendered through an SVG viewBox so the real lettering stays unchanged.
The site uses assets/natha-poster-shirt-640.webp and -941.webp; prior masters
remain preserved in source control.

CLIENT BRAND FILES — LATEST
The shirt symbol is now the exact uploaded X.jpg, blended with the shirt
fabric. The lower poster branding uses the complete uploaded natha.png,
including its emblem and serif name, at a -9 degree angle matching the nearby
lettering. Screen blending keeps its dark field seamless in the black brush
shadow. The same uploaded logo is used in inner-page headers and footers.
The earlier logo assets are retained but no longer displayed.

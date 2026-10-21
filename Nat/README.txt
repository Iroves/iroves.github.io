NATHA.TAT — COMPLETE NFC WEBSITE
Updated 21 October 2026 — direct tattoo requests and attachments

The NFC tag opens the final public website URL. The complete static site is
included: eight HTML pages, CSS, JavaScript, images, fonts and English guides.

PAGES
index.html      The approved poster and clear routes for clients.
tattoos.html    24 tattoo photographs, 7 style filters and a lightbox.
book.html       On-site tattoo request form and Shopify/PayID payment guidance.
aftercare.html  Session preparation and tattoo-care guidance.
shop.html       Art, prints, stickers, bag and real Shopify checkout links.
art.html        6 portfolio artworks, separate from products for sale.
projects.html   Party scenography, commissions and creative collaborations.
about.html      Nathaly’s drafting, study and artistic background.

DIRECT BOOKING REQUESTS
There are no external booking-platform links in the client pages.
The request form collects contact details, idea, placement, approximate size,
one to three preferred dates, reference links, optional photos/PDFs and a payment
preference. An anonymous request reference identifies the enquiry. The reference
is not a payment receipt, authorisation token or guaranteed appointment.
Requests are sent to Nathaly for manual review. She agrees on the date, price
range and deposit and confirms the booking after verifying the payment.
This site does not provide a private calendar, conflict checking, automatic
reminders, an availability feed or a customer/booking database.
No existing appointments or deposits were migrated or cancelled.

ENQUIRY ATTACHMENTS
The general enquiry form on all eight pages and the tattoo request form allow
up to three photos or PDFs, with a 9 MB combined client-side size limit.
Named file inputs are submitted as multipart/form-data to FormSubmit using its
documented native file-upload route. Submission with attachments continues on
the message service. Text-only general enquiries retain in-page status handling.
The tattoo email request uses the same native route for a consistent form.
WhatsApp creates a text draft only; selected files must be attached in WhatsApp
by the client before sending. No files are silently transferred to WhatsApp.
Supported selections: JPG, JPEG, PNG, WEBP, HEIC/HEIF and PDF.
The site does not store customer files or reference images in its public assets.

EMAIL ACTIVATION — STILL REQUIRED
All enquiry email is addressed to nathalymelomanso@gmail.com through FormSubmit.
Inbox activation and a real delivery check on the final hosted domain remain
necessary. Nathaly must submit a labelled setup test, confirm the activation
email and verify delivery and attachments before advertising the email route.
No enquiry, activation request, booking, invoice or payment was sent in testing.
The site clearly shows pending email setup and provides WhatsApp, SMS and calls.
After activation, update the setup/status wording in the HTML files and contact.js
to reflect verified operation. FormSubmit is a form-delivery service, not a
booking system or payment processor.

PAYMENTS
PayID: receiving details have NOT been inferred from Nathaly’s phone or email.
booking-settings.js has empty payid and recipientName fields. When she confirms
both, enter the registered PayID and the exact name displayed by her bank.
The payment panel will then display the details and enable Copy PayID.
Until then, clients request the receiving details with an agreed proposal.
Clients pay in their banking app using the agreed amount and booking reference.
Nathaly checks her bank account manually and confirms the appointment.
A screenshot or an enquiry does not mark a payment as received.
The site does not access a bank API or automatically verify a bank transfer.

Shopify: Nathaly creates an invoice/draft order for the agreed deposit, balance
or creative-service fee and sends the specific checkout link. This version does
not create invoices automatically, request Shopify Admin access or expose API
secrets. Available payment options, fees and payout timing depend on the provider
and her account. It does not promise Afterpay or next-day payouts for every order.
Products in the shop retain real variant IDs and Shopify checkout URLs.

PRODUCT UPDATES AND LANGUAGE
Edit products in Shopify Admin > Products, save, and publish new items to the
Online Store channel. The shop fetches the current public catalogue on opening
and when Refresh is pressed. A labelled saved catalogue is used if refresh fails.
Live images use current Shopify CDN URLs; local photos are fallback only.
All eight pages and included guides use English. Known Portuguese terms in the
existing catalogue are displayed in English. Write future product text in English;
the local wording map is not a general translation service.
The poster, biography and tattoo/art portfolio do not have an admin editor.

DESIGN AND CONTENT
The approved poster, pink NATHA.TAT, white INK & ART, @natha.tat on teal, exact
supplied shirt X, moving lines and current studio address are preserved.
Party scenography is grounded in Nathaly’s voice message. Its current photograph
is labelled as a painting from her portfolio, rather than an event-project photo.
The background describes three years studying engineering and one year studying
architecture. It does not claim completed degrees or completed large installations.

PUBLISHING
Publish the CONTENTS of this ZIP to suitable static hosting with index.html and
assets/ at the root. Keep all files together. Update og:url and og:image in the
eight pages for the final domain and write that public URL to the NFC tag.
The Sites design-review deployment remains owner-private.
No domains, subscriptions, DNS, payout settings or external accounts were changed.
GitHub may store source. Check current GitHub Pages commercial-use restrictions
before using it as hosting for a site focused on ecommerce or transactions.

MAINTENANCE
OWNER-GUIDE.txt       Owner instructions in English.
booking-settings.js  Confirmed public PayID receiving details, initially empty.
booking.js           Request reference, date validation and WhatsApp text draft.
enquiry-files.js     Shared attachment count/type/size checks.
contact.js           General email submission and service-response handling.
unified.css          Client routes, booking form, attachments and new page layouts.
card-data.js         Portfolio photographs and styles.
portfolio-core.js,
portfolio.js         Portfolio selection, filters and lightbox.
shop-data.js         Saved product catalogue and fallback image map.
shop-core.js, hub.js Live shop catalogue, product options, bag and checkout.
app.js               Dialogs, sharing and legacy section redirects.
styles.css, poster.css, hub.css, portfolio.css, fonts.css — existing theme/assets.
ASSET-SOURCES.json and SHOP-SOURCES.json — original asset/catalogue provenance.

CONTACT AND STUDIO
Understairs Ink, Shop 7 & 8, 60 Applebee Street, St Peters NSW 2044
https://maps.app.goo.gl/4BwaLYTXd6XYP9GZA?g_st=ic
Instagram: https://www.instagram.com/Natha.tat
Phone/SMS: +61 426 930 105

SOURCES AND CREDITS
Nathaly’s supplied messages and voice recording.
https://nathatat.com/portfolio/
https://nathatat.com/tips/
https://www.betterhealth.vic.gov.au/health/conditionsandtreatments/tattoos
https://help.shopify.com/en/manual/fulfillment/managing-orders/create-orders
https://www.auspayplus.com.au/solutions/payid-for-business
https://formsubmit.co/documentation
The care page links its sources. Individual dressing instructions take priority.
Nathaly / Natha.tat — original photography, paintings and tattoos.
Promotional poster — generated collage; original masters retained in source.
Font licences are included in assets/fonts/.

VERIFICATION FOR THIS UPDATE
JavaScript syntax and the existing portfolio/catalogue/checkout checks passed.
New checks covered allowed file selections, the three-file and 9 MB limits,
preferred-date validation, request summaries, unique IDs, local assets and
multipart form encoding on all eight pages. Browser review confirmed the
attachment field and additional-file controls, generated request reference,
English labels and mobile request/payment layouts at 390px content width.
Email delivery, attachment arrival, real bank receipt and live invoice payment
still require owner setup and verification. They were not tested by sending.

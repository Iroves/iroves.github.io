# Emergency Medical ID — Privacy-first website concept

This ZIP is an **interactive DESIGN PROTOTYPE**, not a live clinical service, verified medical record, medical alert service or a substitute for emergency services.

## How to preview

Open `preview-demo.html` or `index.html?demo=1` on a locally running web server to view a clearly labelled fictional example, with placeholder alerts and contact information. Open `index.html` to see the blank version that should be completed only after consent, data protection and safety review.

For a local preview, you can also use `python -m http.server 8000` in the folder and visit `http://localhost:8000/index.html?demo=1`.

## What is included

- `index.html` — main read-only emergency medical ID template
- `preview-demo.html` — directs to fictional design example
- `style.css` — responsive visual design, including paper printing
- `profile.js` — blank editable data fields, plus labelled fictional demo information
- `app.js` — renders data safely and enables phone/print links
- `RESEARCH_AND_PRODUCT_PLAN.md` — researched fields, prioritisation, safety, architecture and official source URLs

## Key warning: public hosting is not secure storage

Publishing real medical information in `profile.js` to a public GitHub repository or GitHub Pages publishes it to ANYONE who finds the link. An NFC tag is **not authentication**. Do not put real personal health information, phone numbers of relatives, Medicare numbers, membership numbers, date of birth, address or advance care documents into this demo and publish it as-is. The included `noindex` meta tag is only a request to search engines and **does not** restrict access.

## Proposed real-world version

Use an explicit-consent, minimalist **public emergency view** (critical allergies, essential medical alerts, emergency contacts) and a securely managed, access-controlled **private detail view** (more extensive medicine list and care plan details). Use verified identity checks and involve a healthcare professional to review the medical fields. No guarantee of clinical acceptance should be made.

## Using the editor file

The `window.EMERGENCY_PROFILE` object in `profile.js` contains all potential information. Leave unknown fields empty; they will display as **Not provided**, not **None**. For medicines use `{ name, dose, schedule, purpose }`, and allergies `{ substance, reaction }`. Phone links only activate for plausibly formatted phone numbers, never the demo contacts (which have empty phone fields).

Dates in `reviewedOn` should be YYYY-MM-DD and only populated following an actual review. The date reports user-entered review metadata; it is not proof of clinician verification. If the person has **no known allergy** after confirmation, choose an explicit and accurate phrase rather than leaving ambiguous blanks; the prototype currently expects individual allergen records and shows missing status if none are entered.

The blood group field is optional, and MUST never guide a transfusion without hospital testing. The advance care planning information is informational only: genuine legal documents and decision-making authority must be verified under local rules.

## Recommended physical card

Front: clear 'MEDICAL ID / EMERGENCY' label, QR code and NFC mark, optional first name, and printed 'For a medical emergency call 000'. Reverse: a minimal non-sensitive emergency contact, and an instruction to 'Scan or tap for medical information'. Include a paper/wallet copy as a fallback if phone coverage, NFC, or scanning is unavailable. Never rely solely on the link for critical details.

## Accessibility / assurance before launch

Test with seniors and carers: 320px–400px phones, screen readers, 200% text, touch targets, outdoor light, iOS/Android scan and call, offline fallback, slow networks, and printing. Run a clinician review and accessibility audit. The current prototype is not certified to WCAG standards. No analytics, third-party libraries, trackers, or external font downloads are included.

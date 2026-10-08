/*
 * EDIT THIS ONE FILE FOR EACH CLIENT.
 * Keep empty strings ("") to hide any unused fields.
 * No account, paid service, database, or domain is required.
 */
window.CARD_CONFIG = {
  name: "Alex Morgan",                 // Full name printed on the card
  credentials: "",                  // e.g. "M.B.B.S., F.R.A.N.Z.C.R." — leave blank to hide
  jobTitle: "Managing Director",       // e.g. "Diagnostic Radiologist"
  organization: "Atelier Group",         // Company / workplace
  bio: "Thoughtfully connected. Exceptionally presented.",
  label: "EXCLUSIVE CONTACT",      // Small top label
  greeting: "A PERSONAL INTRODUCTION",        // Small line above name
  footer: "Made to be remembered.",

  photo: "assets/avatar.webp",         // Replace this file with the client's photograph

  // IMPORTANT: change these demo details before giving a card to a client.
  telephone: {
    display: "+61 2 9000 0000",       // What visitors see
    dial: "+61290000000"             // Digits used in the tap-to-call link
  },
  mobile: {
    display: "+61 400 000 000",
    dial: "+61400000000"
  },
  fax: { display: "", dial: "" },       // Leave blank to hide the fax row
  email: "alex@example.com",
  website: "",                      // e.g. "https://yourcompany.com.au"
  address: "",                      // e.g. "St Leonards NSW 2065"
  mapUrl: "",                       // optional Google Maps URL (requires address)

  // All social links are optional. Delete their URLs or leave blank to hide.
  socials: {
    Instagram: "",
    LinkedIn: "",
    WhatsApp: ""
  }
};

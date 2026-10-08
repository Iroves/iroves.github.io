# GoLabour Solutions — NFC Crew Timesheet

A mobile-first digital timesheet using the GoLabour logo and a charcoal / sand / off-white palette inspired by https://golabour.com.au/.

**IMPORTANT: There are two modes.**

- **DEMO:** `index.html` works locally and on GitHub Pages without setup. It creates sample shifts and saves all data in **that browser only** (`localStorage`). It cannot sync across workers' phones. Supervisor PIN in this preview accepts any non-empty value. Do **not** use GitHub Pages demo mode as a real payroll timesheet.
- **SHARED LIVE VERSION:** `Index.html` + `Code.gs` run together as a **Google Apps Script Web App attached to a Google Sheet**. All workers open the deployed web app on their phones and save into one Sheet. Workers record check-in/out; only a supervisor with the server-side `SUPERVISOR_PIN` can read daily timesheets or sign them. This is a functional PILOT, not a hardened payroll system.

## 1 — Open the demo on GitHub Pages

1. Create a public GitHub repo, e.g. `GoLabour-NFC-Timesheet-Demo`.
2. Upload `index.html` to the root. (You can also include this README.)
3. Under **Settings > Pages**, choose **Deploy from branch**, `main`, `/(root)`, Save.
4. Open `https://YOUR-GITHUB-USERNAME.github.io/GoLabour-NFC-Timesheet-Demo/`.
5. Choose **Supervisor sign-off**, enter the job site (default `EXPO-001`), today's date and any non-empty demo PIN, then click **View timesheet**. Three sample completed worker rows are included. Draw on the signature pad and approve.
6. Clock in a test worker under the Worker tab, and clock them out using the same worker code. The page will keep demo records on your own device only.

The official logo is linked from the company website at `https://golabour.com.au/images/logo.png`. An Internet connection is needed to display this logo. Ask the brand owner for an approved local PNG/SVG if you want the package to be fully self-contained.

## 2 — Turn it into a shared Google Sheets timesheet (recommended pilot)

**Set up with a Google account which will own your work records.** Do not use a personal Google Sheet for employee data if your organisation requires a company-owned account.

1. Go to https://sheets.google.com and make a new Sheet: `GoLabour — NFC Timesheets`.
2. In the Sheet, select **Extensions > Apps Script**. This ensures the script is *bound to the Sheet*.
3. Replace the starter `Code.gs` content with everything in this package's **`Code.gs`**.
4. Choose **+ (Add a file) > HTML**, name the file **`Index`** (Apps Script supplies `.html`). Paste the contents of **`Index.html`**.
5. In the Apps Script editor, choose function **`setupSheets`** and click **Run**. Grant the requested Google Sheet permissions. It creates `Shifts`, `Approvals`, and `Audit` tabs.
6. Go to **Project Settings > Script Properties > Add script property**. Set the name to `SUPERVISOR_PIN` and the value to a private 6+-character PIN/passphrase (e.g., a random 12+ character phrase). **Never add this PIN to HTML, GitHub or the NFC tag.**
7. In **Project Settings**, select your site's time zone or keep the default `Australia/Sydney`; if changing time zone, also update `CFG_.timezone` in `Code.gs` and the JavaScript `timezone` constant in the HTML.
8. Click **Deploy > New deployment > Type: Web app**. Set **Execute as: Me**, **Who has access: Anyone** (may depend on your Workspace restrictions), and deploy. Authorize if prompted.
9. Copy the published Web App URL ending `/exec` (not the editor URL or the test `/dev` URL).
10. Open that URL on a different phone. The **DEMO MODE** banner should be absent. Perform a test clock-in and clock-out, then confirm a new record appears in the Sheet. Load it in Supervisor view using the PIN and sign it.

**Set this published `/exec` URL as the NFC tag destination.** No GitHub Pages step is required for the live version; Apps Script hosts the page directly.

To update the live app's code, save changes and use **Deploy > Manage deployments > Edit** to deploy a new version. Ensure the live `/exec` URL is still the one used by the NFC tag.

## 3 — Set up NFC tags by site

Use the *same web app deployment* but a different `?site=` value per physical site, e.g.:

`https://script.google.com/macros/s/DEPLOYMENT_ID/exec?site=ICC-SYDNEY`

`https://script.google.com/macros/s/DEPLOYMENT_ID/exec?site=EXPO-001`

Anyone can edit the job site box, so `?site=` is a convenience value, not an access-control feature. For stronger control, associate NFC tags with server-registered site IDs.

## Workflow

**Workers**
- Open the web app by tapping the tag or following its URL.
- Enter site, name and worker code; click **Clock in now**.
- When finishing, return to the URL, enter the same site and code, enter unpaid break in minutes, and click **Clock out now**.
- One open shift per worker code per site; overnight shifts stay on the start date. Net hours = elapsed hours minus break.

**Supervisors**
- Open **Supervisor sign-off**.
- Enter job site, date and private supervisor PIN; click **View timesheet**.
- Review names, start/end times, breaks and net hours. Any open shifts must be clocked out before approval.
- Enter full name, draw signature, click **Approve and sign completed shifts** and confirm.
- The signature is stored as pen-stroke coordinates in the private `Approvals` sheet, with shift IDs, site and date.
- **Download CSV** or **Print / Save PDF** (system print dialog). Signed shifts are marked `APPROVED` in `Shifts`.

## Security and operational limitations

**READ BEFORE DEPLOYING FOR REAL EMPLOYEES**

- The published Web App is accessible to anyone with the URL. A **worker code is not authentication**; a person who knows another worker's code could clock them out. NFC tags alone **do not prove physical attendance or identity**.
- Supervisor PIN is stored only in Google Apps Script Script Properties and checked by the backend before *loading* or *approving* records. However, a single shared PIN is less secure than individual supervisor Google logins + MFA. The pilot has **no rate limiting** on PIN attempts.
- This is a prototype/pilot. Before using data for actual payroll, add authenticated employee identities, supervisor-specific accounts, an admin corrections process, a reviewed audit trail, retention/access policies, automated backups and applicable employment-law checks.
- Google Sheet data includes names, working hours and signatures, which are personal information. Keep the sheet private, use an organisation account and define proper access/retention rules. Publishing the GitHub demo does not publish your Google Sheet; do not paste keys or worker information into GitHub.
- Timestamps are recorded by the Google Apps Script server, not the employee's device. Make sure the configured time zone matches the site. For cross-country jobs, use a separate deployment or add site-specific time-zone configuration.
- The end-of-day approval covers shifts **clocked in on the selected date**. A late-arriving record after an approval can be signed in a new approval batch. Corrections need an administrator to update the private Sheet manually and document the change in `Audit`.
- Script/Sheets quotas depend on your Google account and could become a limitation for large crews. Plan a proper database for scale.
- The company logo currently loads from the official website. If that image URL changes, the page displays a styled fallback wordmark. Ask permission before using the logo commercially.

## Files

- `index.html` — self-contained GitHub Pages/local demo (browser-only data)
- `Index.html` — same UI, required filename for Apps Script (`google.script.run` enables real storage automatically)
- `Code.gs` — Google Apps Script backend, Google Sheet logging, private PIN verification and supervisor sign-off
- `README.md` — these instructions

## Customisation

- Brand colours: edit CSS variables at the top of `Index.html` (and `index.html`, if you maintain a demo).
- Timezone: change `CFG_.timezone` in `Code.gs` AND `timezone` in HTML JavaScript.
- Site default: include `?site=SITE-NAME` in the NFC URL.
- Official logo: change the `<img src="https://golabour.com.au/images/logo.png">` reference to your approved hosted logo file.
- Text, company name, worker columns: edit HTML and, when altering stored data, update Sheet headers and `Code.gs` together.

This package is an independent demonstration built to the requested brief, not an official company product.

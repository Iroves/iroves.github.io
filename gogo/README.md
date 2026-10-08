# GoLabour — Blank Timesheet + Invoice WhatsApp Reminder (v3)

This is the updated version of the **working photo-save GoLabour end-of-shift timesheet**.

## Changes

- All worker and supervisor input fields start empty: worker name, location, shift date, start time, finish time, unpaid break and message.
- No previous worker draft is restored from the device (safer on shared phones). An accidental refresh will lose the form, so save or share before leaving.
- The signature pad starts blank.
- The calculated hours display `—` until start, finish and break minutes are entered.
- Added to the **end of the WhatsApp tip**: **“Important: Send your completed, signed timesheet together with your invoice to the GoLabour WhatsApp work group.”**
- Kept the working **Save signed photo**, **Share to WhatsApp**, **Print / Save as PDF**, signature, and automatic hour calculation.

## Update the existing GitHub Pages repository

1. Download the ZIP and extract it.
2. Open your GitHub repository: https://github.com/iroves/go
3. Replace the following files **in the repository root**:
   - `index.html`
   - `app.js`
   - `style.css` (unchanged but included for convenience)
4. Commit changes and allow GitHub Pages to publish.
5. Test https://iroves.github.io/go/index.html on your phone.

Do **not** upload the ZIP directly or place the files in a new nested folder. The website URL remains the same.

## Notes

The hours calculator handles overnight shifts and subtracts unpaid breaks. To record no break, workers should type `0` in the break box. The supervisor's name and hand-drawn signature are required before a signed timesheet can be produced.

Workers must manually choose and send to their WhatsApp work group, with the invoice. The webpage does not automatically send the timesheet or invoice, store a central copy, or independently verify signatures.

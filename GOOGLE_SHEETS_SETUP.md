# Google Sheets Setup — Step by Step
# After this, every new member registration automatically appears in a Google Sheet

---

## STEP 1 — Create the Google Sheet

1. Open Google Drive: https://drive.google.com
2. Click **+ New** → **Google Sheets** → **Blank spreadsheet**
3. At the top, rename it from "Untitled spreadsheet" to: **Gym Members**
4. Leave it open — you'll come back to it

---

## STEP 2 — Open Apps Script

With the Google Sheet open, click the menu:
**Extensions → Apps Script**

A new tab opens with a code editor.

---

## STEP 3 — Paste the script

1. Delete everything currently in the editor (Ctrl+A then Delete)
2. Open the file **GOOGLE_APPS_SCRIPT.js** from your GYM project folder
3. Copy everything in it (Ctrl+A then Ctrl+C)
4. Paste it into the Apps Script editor (Ctrl+V)
5. Click the **Save** button (floppy disk icon) or press Ctrl+S

---

## STEP 4 — Run setup once

1. In the Apps Script editor, find the dropdown that says **"Select function"**
2. Click it and choose **setupSheetManually**
3. Click the **▶ Run** button
4. A popup will ask for permissions — click **Review permissions**
5. Choose your Google account
6. You'll see "Google hasn't verified this app" — click **Advanced** → **Go to Gym Members (unsafe)**
   (This is safe — it's your own script)
7. Click **Allow**
8. Go back to your Google Sheet — you should now see a "Members" tab with headers

---

## STEP 5 — Deploy as Web App

This is the most important step — it gives the website a URL to send data to.

1. In Apps Script, click **Deploy** (top right blue button)
2. Click **New deployment**
3. Click the gear icon ⚙ next to "Select type" → choose **Web app**
4. Fill in these settings:
   - Description: `Gym website webhook`
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**
6. Copy the **Web app URL** — it looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`

---

## STEP 6 — Add the URL to your project

Open your `.env.local` file in VS Code and add this line:

```
VITE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_ACTUAL_ID/exec
```

Replace the URL with the one you copied in Step 5.

---

## STEP 7 — Test it

Run your website locally (`npm run dev`), register a test member,
and within 5 seconds check your Google Sheet — the member should appear.

---

## What your uncle will see in the Sheet

| Column | What it shows |
|--------|--------------|
| Membership ID | FFBC-202506-1234 |
| Name | Member's full name |
| Phone | +91XXXXXXXXXX |
| Age | 25 |
| Gym | Fitness First Boxing Club |
| Plan | 3 Months |
| Amount | ₹2699 |
| Join Date | 06/06/2026 |
| Expiry Date | 04/09/2026 |
| Payment Status | pending / paid |
| Emergency Contact | +91XXXXXXXXXX |
| Registered At | date and time |

### Colour coding (automatic):
- 🟢 **Green** = paid and active
- 🟡 **Yellow** = payment pending OR expiring within 7 days
- 🔴 **Red** = membership expired

---

## OPTIONAL: WhatsApp alert when someone joins

To get a WhatsApp message on your phone every time someone registers:

1. Go to https://callmebot.com/whatsapp.php
2. Send the activation message to the CallMeBot contact
3. You'll receive your API key
4. In the Apps Script, find these two lines near the bottom:
   ```
   const PHONE  = '';
   const APIKEY = '';
   ```
5. Fill them in:
   ```
   const PHONE  = '919876543210';  // your number with country code, no +
   const APIKEY = 'your_api_key';
   ```
6. Save and redeploy (Deploy → Manage deployments → Edit → New version → Deploy)

Now every new registration sends a WhatsApp message instantly to your uncle's phone.

---

## If the sheet stops receiving data

Redeploy the script:
1. Apps Script → Deploy → Manage deployments
2. Click the pencil ✏ icon
3. Change version to **New version**
4. Click **Deploy**
5. The URL stays the same — no changes needed in .env.local

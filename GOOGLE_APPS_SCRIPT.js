// ============================================================
// GYM WEBSITE — Google Apps Script
// Paste this entire file into script.google.com
// It receives member data from the website and writes it to
// your Google Sheet automatically on every new registration
// ============================================================

const SHEET_NAME_MEMBERS = 'Members';
const SHEET_NAME_TRIALS  = 'Trial Requests';

// Column headers for the Members sheet
const MEMBER_HEADERS = [
  'Membership ID',
  'Name',
  'Phone',
  'Age',
  'Gym',
  'Plan',
  'Amount',
  'Join Date',
  'Expiry Date',
  'Payment Status',
  'Emergency Contact',
  'Registered At',
];

// ============================================================
// MAIN ENTRY POINT — called by the website on every registration
// ============================================================
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss   = SpreadsheetApp.getActiveSpreadsheet();

    writeToMembersSheet(ss, data);
    sendWhatsAppAlert(data); // optional — see below

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================
// WRITE MEMBER ROW TO SHEET
// If member already exists (same Membership ID), update the row
// If new, append a new row
// ============================================================
function writeToMembersSheet(ss, data) {
  let sheet = ss.getSheetByName(SHEET_NAME_MEMBERS);

  // Create the sheet if it doesn't exist yet
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME_MEMBERS);
    setupMembersSheet(sheet);
  }

  const row = [
    data.membershipId    || '',
    data.name            || '',
    data.phone           || '',
    data.age             || '',
    data.gym             || '',
    data.plan            || '',
    data.amount          || '',
    data.joinDate        || '',
    data.expiryDate      || '',
    data.paymentStatus   || 'pending',
    data.emergencyContact || '',
    data.createdAt       || new Date().toLocaleString('en-IN'),
  ];

  // Check if this membership ID already exists (for updates like marking paid)
  const lastRow    = sheet.getLastRow();
  const idColumn   = sheet.getRange(2, 1, Math.max(lastRow - 1, 1), 1).getValues();
  let existingRow  = -1;

  for (let i = 0; i < idColumn.length; i++) {
    if (idColumn[i][0] === data.membershipId) {
      existingRow = i + 2; // +2 because row 1 is header, array is 0-indexed
      break;
    }
  }

  if (existingRow > -1) {
    // Update existing row
    sheet.getRange(existingRow, 1, 1, row.length).setValues([row]);
  } else {
    // Append new row
    sheet.appendRow(row);
    const newRow = sheet.getLastRow();
    applyRowFormatting(sheet, newRow, data.paymentStatus);
  }

  // Re-apply colour coding on the whole sheet
  colourCodeSheet(sheet);
}

// ============================================================
// SHEET FORMATTING — headers, column widths, frozen row
// ============================================================
function setupMembersSheet(sheet) {
  // Write header row
  sheet.appendRow(MEMBER_HEADERS);

  const header = sheet.getRange(1, 1, 1, MEMBER_HEADERS.length);
  header.setBackground('#1a1a2e');
  header.setFontColor('#ffffff');
  header.setFontWeight('bold');
  header.setFontSize(11);

  // Freeze header row
  sheet.setFrozenRows(1);

  // Column widths
  sheet.setColumnWidth(1, 160);  // Membership ID
  sheet.setColumnWidth(2, 180);  // Name
  sheet.setColumnWidth(3, 140);  // Phone
  sheet.setColumnWidth(4, 60);   // Age
  sheet.setColumnWidth(5, 200);  // Gym
  sheet.setColumnWidth(6, 140);  // Plan
  sheet.setColumnWidth(7, 100);  // Amount
  sheet.setColumnWidth(8, 120);  // Join Date
  sheet.setColumnWidth(9, 120);  // Expiry Date
  sheet.setColumnWidth(10, 130); // Payment Status
  sheet.setColumnWidth(11, 160); // Emergency Contact
  sheet.setColumnWidth(12, 160); // Registered At
}

// ============================================================
// COLOUR CODE ROWS BY PAYMENT STATUS AND EXPIRY
// Green  = paid + active
// Orange = pending payment
// Red    = expired
// Yellow = expiring within 7 days
// ============================================================
function colourCodeSheet(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const data = sheet.getRange(2, 1, lastRow - 1, 12).getValues();
  const today = new Date();

  for (let i = 0; i < data.length; i++) {
    const rowNum       = i + 2;
    const payStatus    = (data[i][9] || '').toLowerCase();
    const expiryStr    = data[i][8] || '';
    const range        = sheet.getRange(rowNum, 1, 1, 12);

    // Parse expiry date (format: DD/MM/YYYY from en-IN locale)
    let expiryDate = null;
    if (expiryStr) {
      const parts = expiryStr.split('/');
      if (parts.length === 3) {
        expiryDate = new Date(parts[2], parts[1] - 1, parts[0]);
      }
    }

    const daysLeft = expiryDate
      ? Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))
      : 999;

    let bgColor = '#ffffff';

    if (payStatus === 'pending') {
      bgColor = '#fff3cd'; // amber — payment pending
    } else if (daysLeft < 0) {
      bgColor = '#f8d7da'; // red — expired
    } else if (daysLeft <= 7) {
      bgColor = '#fff3cd'; // yellow — expiring soon
    } else if (payStatus === 'paid') {
      bgColor = '#d4edda'; // green — active and paid
    }

    range.setBackground(bgColor);
  }
}

function applyRowFormatting(sheet, rowNum, payStatus) {
  const range = sheet.getRange(rowNum, 1, 1, 12);
  if (payStatus === 'pending') {
    range.setBackground('#fff3cd');
  } else {
    range.setBackground('#d4edda');
  }
}

// ============================================================
// WhatsApp alerts via CallMeBot (free API)
// Sends to uncle (Boxing) and aunty (Nisha) automatically
// Set up each number at callmebot.com/whatsapp.php to get an API key
// ============================================================
function sendWhatsAppAlert(data) {
  // ── Fill these in ──────────────────────────────────────────
  const UNCLE_PHONE  = '';  // TODO: e.g. 919876543210 — gets Boxing Club alerts
  const UNCLE_APIKEY = '';  // TODO: CallMeBot API key for uncle's number

  const AUNTY_PHONE  = '';  // TODO: e.g. 919876543211 — gets Nisha Fitness alerts
  const AUNTY_APIKEY = '';  // TODO: CallMeBot API key for aunty's number
  // ────────────────────────────────────────────────────────────

  const isBoxing = (data.gym || '').toLowerCase().includes('boxing');

  const phone  = isBoxing ? UNCLE_PHONE  : AUNTY_PHONE;
  const apikey = isBoxing ? UNCLE_APIKEY : AUNTY_APIKEY;

  if (!phone || !apikey) return; // disabled until filled in

  const emoji = data.paymentStatus === 'paid' ? '✅' : '🆕';

  const msg = encodeURIComponent(
    `${emoji} ${data.gym}\n` +
    `Name: ${data.name}\n` +
    `Phone: ${data.phone}\n` +
    `Plan: ${data.plan} (₹${data.amount})\n` +
    `ID: ${data.membershipId}\n` +
    `Expiry: ${data.expiryDate}\n` +
    `Payment: ${data.paymentStatus}`
  );

  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${msg}&apikey=${apikey}`;
  UrlFetchApp.fetch(url);
}

// ============================================================
// MANUAL TRIGGER — run this once to set up the sheet
// In Apps Script editor: Run → setupSheetManually
// ============================================================
function setupSheetManually() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let sheet   = ss.getSheetByName(SHEET_NAME_MEMBERS);
  if (sheet) {
    SpreadsheetApp.getUi().alert('Members sheet already exists!');
    return;
  }
  sheet = ss.insertSheet(SHEET_NAME_MEMBERS);
  setupMembersSheet(sheet);
  SpreadsheetApp.getUi().alert('Members sheet created successfully!');
}
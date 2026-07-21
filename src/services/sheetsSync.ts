// src/services/sheetsSync.ts
// SRP: Only responsible for syncing member data to Google Sheets
// Sends data via Google Apps Script webhook — completely free
// If sync fails, registration still completes (non-blocking)

import type { Member } from '../types';

const WEBHOOK_URL = import.meta.env.VITE_SHEETS_WEBHOOK_URL || '';

export async function syncMemberToSheets(member: Member): Promise<void> {
  if (!WEBHOOK_URL) {
    console.warn('[SheetsSync] VITE_SHEETS_WEBHOOK_URL not set — skipping');
    return;
  }

  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors', // Apps Script doesn't send CORS headers
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formatForSheets(member)),
    });
    console.log('[SheetsSync] Member synced:', member.membershipId);
  } catch (err) {
    // NEVER block a registration because Sheets failed
    console.error('[SheetsSync] Failed (non-blocking):', err);
  }
}

function formatForSheets(member: Member) {
  const gymName =
    member.gym === 'boxing' ? 'Fitness First Boxing Club' : 'Nisha Fitness';

  const joinDate  = new Date(member.joinDate).toLocaleDateString('en-IN');
  const expiryDate = new Date(member.expiryDate).toLocaleDateString('en-IN');
  const createdAt  = new Date(member.createdAt).toLocaleString('en-IN');

  return {
    membershipId:     member.membershipId,
    name:             member.name,
    phone:            member.phone,
    age:              member.age,
    gym:              gymName,
    plan:             member.planName,
    amount:           `₹${member.paymentAmount}`,
    joinDate,
    expiryDate,
    paymentStatus:    member.paymentStatus,
    emergencyContact: member.emergencyContact,
    createdAt,
  };
}

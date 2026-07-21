// src/services/whatsappNotify.ts
// SRP: Sends WhatsApp payment notifications to uncle
// Uses wa.me deep link — opens WhatsApp with pre-filled message
// No API key needed, no cost, works on any phone

import { NOTIFY_WHATSAPP } from '../constants/plans';
import type { GymType } from '../types';

interface PaymentNotifyParams {
  gym:          GymType;
  memberName:   string;
  membershipId: string;
  planName:     string;
  amount:       number;
  phone:        string;
  type:         'new_registration' | 'renewal';
}

// Opens WhatsApp on uncle's phone with payment details pre-filled
// Called after member submits payment
export function sendPaymentWhatsAppAlert(params: PaymentNotifyParams): void {
  const notifyNumber = params.gym === 'boxing'
    ? NOTIFY_WHATSAPP.boxing
    : NOTIFY_WHATSAPP.nisha;

  if (!notifyNumber || notifyNumber === '91XXXXXXXXXX' || notifyNumber === '') {
    console.warn('[WhatsApp] Notify number not set for', params.gym);
    return;
  }

  const gymName = params.gym === 'boxing'
    ? 'Fitness First Boxing Club'
    : 'Nisha Fitness';

  const emoji = params.type === 'new_registration' ? '🆕' : '🔄';
  const typeLabel = params.type === 'new_registration' ? 'New Registration' : 'Renewal Request';

  const message = encodeURIComponent(
    `${emoji} *${typeLabel}*\n\n` +
    `*Gym:* ${gymName}\n` +
    `*Name:* ${params.memberName}\n` +
    `*ID:* ${params.membershipId}\n` +
    `*Phone:* ${params.phone}\n` +
    `*Plan:* ${params.planName}\n` +
    `*Amount:* ₹${params.amount.toLocaleString('en-IN')}\n\n` +
    `Please verify payment and approve in admin panel.\n` +
    `Admin: ${window.location.origin}/admin`
  );

  // Open WhatsApp with pre-filled message to uncle's number
  window.open(`https://wa.me/${notifyNumber}?text=${message}`, '_blank');
}

// Build a clickable WhatsApp link (for use in buttons)
export function buildPaymentWhatsAppLink(params: PaymentNotifyParams): string {
  const notifyNumber = params.gym === 'boxing'
    ? NOTIFY_WHATSAPP.boxing
    : NOTIFY_WHATSAPP.nisha;

  if (!notifyNumber || notifyNumber === '91XXXXXXXXXX') return '#';

  const gymName = params.gym === 'boxing'
    ? 'Fitness First Boxing Club'
    : 'Nisha Fitness';

  const message = encodeURIComponent(
    `🆕 *Payment Submitted*\n\n` +
    `*Gym:* ${gymName}\n` +
    `*Name:* ${params.memberName}\n` +
    `*ID:* ${params.membershipId}\n` +
    `*Plan:* ${params.planName} — ₹${params.amount.toLocaleString('en-IN')}\n\n` +
    `Please verify and approve.`
  );

  return `https://wa.me/${notifyNumber}?text=${message}`;
}

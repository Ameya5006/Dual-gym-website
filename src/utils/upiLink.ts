// src/utils/upiLink.ts
// SRP: Build UPI deep links to open payment apps directly with amount pre-filled

interface UpiLinkParams {
  upiId: string;
  payeeName: string;
  amount: number;
  note: string;
}

// Standard UPI deep link — works with GPay, PhonePe, Paytm, BHIM, etc.
export function buildUpiLink({ upiId, payeeName, amount, note }: UpiLinkParams): string {
  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: amount.toString(),
    cu: 'INR',
    tn: note,
  });
  return `upi://pay?${params.toString()}`;
}

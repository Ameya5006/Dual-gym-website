// src/firebase/db.ts
// Repository layer — all Firestore operations (SRP)

import {
  collection, doc, setDoc, getDoc, getDocs, deleteDoc,
  updateDoc, arrayUnion, query, where, orderBy,
} from 'firebase/firestore';
import { db } from './config';
import { createMemberAuth } from './auth';
import { syncMemberToSheets } from '../services/sheetsSync';
import type { Member, TrialRequest, GymType, PaymentRecord } from '../types';

// ── ID generator ─────────────────────────────────────────────
function generateMembershipId(gym: GymType): string {
  const prefix = gym === 'boxing' ? 'FFBC' : 'NF';
  const now    = new Date();
  const yyyymm = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${yyyymm}-${random}`;
}

function generatePaymentId(): string {
  return 'PAY-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

// ── CREATE MEMBER ─────────────────────────────────────────────
// Creates Firebase Auth account + Firestore record
// Signs out any existing session first to avoid auth conflicts
export async function createMember(
  data: Omit<Member, 'uid' | 'membershipId' | 'createdAt' | 'paymentHistory'>
): Promise<Member> {
  const membershipId = generateMembershipId(data.gym);
  const now          = new Date().toISOString();

  // Sign out any existing session before creating new account
  // This prevents "auth/email-already-in-use" false positives
  const { signOut } = await import('firebase/auth');
  const { auth }    = await import('./config');
  try { await signOut(auth); } catch {}

  // Create Firebase Auth account using membershipId + phone
  const uid = await createMemberAuth(membershipId, data.phone);

  const member: Member = {
    uid,
    membershipId,
    createdAt: now,
    paymentHistory: [],
    ...data,
  };

  await setDoc(doc(db, 'members', uid), member);
  syncMemberToSheets(member);
  return member;
}


// ── CHECK IF PHONE ALREADY REGISTERED ────────────────────────
export async function getMemberByPhone(phone: string): Promise<Member | null> {
  const q    = query(collection(db, 'members'), where('phone', '==', phone));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as Member;
}

// ── GET MEMBER BY UID ─────────────────────────────────────────
export async function getMember(uid: string): Promise<Member | null> {
  const snap = await getDoc(doc(db, 'members', uid));
  if (!snap.exists()) return null;
  return snap.data() as Member;
}

// ── GET MEMBER BY MEMBERSHIP ID ──────────────────────────────
export async function getMemberByMembershipId(
  membershipId: string
): Promise<Member | null> {
  const q    = query(collection(db, 'members'), where('membershipId', '==', membershipId));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as Member;
}

// ── GET ALL MEMBERS (admin) ───────────────────────────────────
export async function getAllMembers(gym?: GymType): Promise<Member[]> {
  const ref = collection(db, 'members');
  const q   = gym
    ? query(ref, where('gym', '==', gym), orderBy('createdAt', 'desc'))
    : query(ref, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Member);
}
// ── ADMIN: DELETE MEMBER (Firestore record only) ──────────────
export async function deleteMember(uid: string): Promise<void> {
  await deleteDoc(doc(db, 'members', uid));
}
// ── DELETE SINGLE RENEWAL REQUEST ────────────────────────────
export async function deleteRenewalRequest(requestId: string): Promise<void> {
  await deleteDoc(doc(db, 'renewalRequests', requestId));
}

// ── DELETE SINGLE NOTIFICATION ───────────────────────────────
export async function deleteAdminNotification(notifId: string): Promise<void> {
  await deleteDoc(doc(db, 'adminNotifications', notifId));
}

// ── ADMIN: MARK PAID ─────────────────────────────────────────
export async function markAsPaid(uid: string, note?: string): Promise<void> {
  const member = await getMember(uid);
  if (!member) throw new Error('Member not found');

  const payRecord: PaymentRecord = {
    id:            generatePaymentId(),
    planId:        member.planId,
    planName:      member.planName,
    amount:        member.paymentAmount,
    paidAt:        new Date().toISOString(),
    newExpiryDate: member.expiryDate,
    verifiedBy:    'admin',
    note:          note ?? 'Initial payment confirmed',
  };

  await updateDoc(doc(db, 'members', uid), {
    paymentStatus:  'paid',
    paymentHistory: arrayUnion(payRecord),
  });

  syncMemberToSheets({ ...member, paymentStatus: 'paid' });
  await createAdminNotification({
    type:         'payment_confirmed',
    gym:          member.gym,
    memberName:   member.name,
    memberPhone:  member.phone,
    membershipId: member.membershipId,
    amount:       member.paymentAmount,
    plan:         member.planName,
    message:      `✅ Payment confirmed\n${member.name} | ${member.membershipId}\n${member.gym === 'boxing' ? 'Boxing Club' : 'Nisha Fitness'}\nPlan: ${member.planName} — ₹${member.paymentAmount}`,
  });
}

// ── ADMIN: PROCESS RENEWAL ────────────────────────────────────
export async function processRenewal(
  uid: string,
  planId: string,
  planName: string,
  amount: number,
  durationDays: number,
  note?: string
): Promise<string> {
  const member = await getMember(uid);
  if (!member) throw new Error('Member not found');

  const baseDate = new Date(member.expiryDate) > new Date()
    ? new Date(member.expiryDate)
    : new Date();
  baseDate.setDate(baseDate.getDate() + durationDays);
  const newExpiryDate = baseDate.toISOString();

  const payRecord: PaymentRecord = {
    id: generatePaymentId(),
    planId, planName, amount,
    paidAt:        new Date().toISOString(),
    newExpiryDate,
    verifiedBy:    'admin',
    note:          note ?? 'Renewal confirmed',
  };

  await updateDoc(doc(db, 'members', uid), {
    planId, planName,
    paymentAmount:  amount,
    paymentStatus:  'paid',
    expiryDate:     newExpiryDate,
    paymentHistory: arrayUnion(payRecord),
  });

  await createAdminNotification({
    type:         'renewal_confirmed',
    gym:          member.gym,
    memberName:   member.name,
    memberPhone:  member.phone,
    membershipId: member.membershipId,
    amount,
    plan:         planName,
    message:      `🔄 Renewal confirmed\n${member.name} | ${member.membershipId}\nNew expiry: ${new Date(newExpiryDate).toLocaleDateString('en-IN')}\nPlan: ${planName} — ₹${amount}`,
  });

  syncMemberToSheets({ ...member, planId, planName, paymentAmount: amount, expiryDate: newExpiryDate });
  return newExpiryDate;
}

// ── MEMBER SUBMITS RENEWAL REQUEST ───────────────────────────
export async function submitRenewalRequest(
  uid: string,
  planId: string,
  planName: string,
  amount: number,
  transactionId?: string,
): Promise<void> {
  await setDoc(doc(collection(db, 'renewalRequests'), uid + '_' + Date.now()), {
    uid, planId, planName, amount,
    transactionId: transactionId ?? '',
    submittedAt: new Date().toISOString(),
    status:      'pending',
  });

  const member = await getMember(uid);
  if (member) {
    await createAdminNotification({
      type:         'renewal_request',
      gym:          member.gym,
      memberName:   member.name,
      memberPhone:  member.phone,
      membershipId: member.membershipId,
      amount,
      plan:         planName,
      message:      `⏳ Renewal request\n${member.name} | ${member.membershipId}\n${member.gym === 'boxing' ? 'Boxing Club' : 'Nisha Fitness'}\nPlan: ${planName} — ₹${amount}`,
    });
  }
}

// ── GET RENEWAL REQUESTS ──────────────────────────────────────
export async function getRenewalRequests() {
  const snap = await getDocs(
    query(collection(db, 'renewalRequests'),
      where('status', '==', 'pending'),
      orderBy('submittedAt', 'desc'))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Array<{
    id: string; uid: string; planId: string; planName: string;
    amount: number; submittedAt: string; status: string;
  }>;
}

// ── ADMIN NOTIFICATIONS ───────────────────────────────────────
export interface AdminNotification {
  id?: string;
  type: 'payment_confirmed' | 'renewal_confirmed' | 'renewal_request' | 'expiry_warning';
  gym: GymType;
  memberName: string;
  memberPhone: string;
  membershipId: string;
  amount?: number;
  plan?: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export async function createAdminNotification(
  data: Omit<AdminNotification, 'id' | 'createdAt' | 'read'>
): Promise<void> {
  const ref = doc(collection(db, 'adminNotifications'));
  await setDoc(ref, { ...data, id: ref.id, createdAt: new Date().toISOString(), read: false });
}

export async function getAdminNotifications(unreadOnly = false): Promise<AdminNotification[]> {
  const ref = collection(db, 'adminNotifications');
  const q   = unreadOnly
    ? query(ref, where('read', '==', false), orderBy('createdAt', 'desc'))
    : query(ref, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as AdminNotification);
}

export async function markNotificationRead(id: string): Promise<void> {
  await updateDoc(doc(db, 'adminNotifications', id), { read: true });
}

// ── TRIAL REQUESTS ────────────────────────────────────────────
export async function saveTrialRequest(
  data: Omit<TrialRequest, 'id' | 'createdAt' | 'contacted'>
): Promise<void> {
  const ref = doc(collection(db, 'trials'));
  await setDoc(ref, { ...data, id: ref.id, createdAt: new Date().toISOString(), contacted: false });
}

export async function getTrialRequests(): Promise<TrialRequest[]> {
  const snap = await getDocs(query(collection(db, 'trials'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => d.data() as TrialRequest);
}

export async function markTrialContacted(id: string): Promise<void> {
  await updateDoc(doc(db, 'trials', id), { contacted: true });
}

export async function markWhatsAppJoined(uid: string): Promise<void> {
  await updateDoc(doc(db, 'members', uid), { whatsappJoined: true });
}


// ── SAVE INITIAL PAYMENT PROOF ───────────────────────────────
// Member submits transaction ID after paying for first registration
export async function savePaymentProof(
  uid: string,
  transactionId: string,
): Promise<void> {
  await updateDoc(doc(db, 'members', uid), {
    transactionId,
    paymentProofSubmittedAt: new Date().toISOString(),
  });

  const member = await getMember(uid);
  if (member) {
    await createAdminNotification({
      type:         'payment_confirmed',
      gym:          member.gym,
      memberName:   member.name,
      memberPhone:  member.phone,
      membershipId: member.membershipId,
      amount:       member.paymentAmount,
      plan:         member.planName,
      message:      `💳 Payment proof submitted\n${member.name} | ${member.membershipId}\nTransaction ID: ${transactionId}\nPlan: ${member.planName} — ₹${member.paymentAmount}\n\nPlease verify and mark as paid.`,
    });
  }
}

// ── HELPERS ───────────────────────────────────────────────────
export function daysUntilExpiry(member: Member): number {
  const diff = new Date(member.expiryDate).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function isMemberExpired(member: Member): boolean {
  return daysUntilExpiry(member) < 0;
}

export function getRenewalWhatsAppLink(member: Member): string {
  const days   = daysUntilExpiry(member);
  const status = days < 0
    ? `expired ${Math.abs(days)} day(s) ago`
    : `expires in ${days} day(s)`;
  const msg = encodeURIComponent(
    `Hello ${member.name}! 👋\nYour membership at ${member.gym === 'boxing' ? 'Fitness First Boxing Club' : 'Nisha Fitness'} (ID: ${member.membershipId}) ${status}.\nRenew now to continue your training! 💪`
  );
  return `https://wa.me/${member.phone.replace('+', '')}?text=${msg}`;
}

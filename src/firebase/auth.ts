// src/firebase/auth.ts
// Simple auth using Email/Password via Firebase
// Members login with MembershipID + phone as credentials
// No OTP, no SMS, no billing required — 100% free

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth } from './config';

// We convert membershipId to a fake email so Firebase Auth works
// e.g. FFBC-202506-1234 → ffbc-202506-1234@gymapp.local
function toFakeEmail(membershipId: string): string {
  return `${membershipId.toLowerCase()}@gymapp.local`;
}

// Password = phone number (10 digits) — member knows this
// Simple, no SMS needed
function toPassword(phone: string): string {
  // Strip +91 if present, use last 10 digits
  return phone.replace('+91', '').replace(/\D/g, '').slice(-10);
}

// Called when member registers for the first time
export async function createMemberAuth(
  membershipId: string,
  phone: string
): Promise<string> {
  const email    = toFakeEmail(membershipId);
  const password = toPassword(phone);
  const cred     = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user.uid;
}

// Called when existing member logs in
export async function loginMember(
  membershipId: string,
  phone: string
): Promise<string> {
  const email    = toFakeEmail(membershipId);
  const password = toPassword(phone);
  const cred     = await signInWithEmailAndPassword(auth, email, password);
  return cred.user.uid;
}

// Admin login — uses real email/password
export async function loginAdmin(
  email: string,
  password: string
): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

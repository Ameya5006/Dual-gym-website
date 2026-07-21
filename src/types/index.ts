// ============================================================
// EQUIPMENT TYPE
// ============================================================

export interface GymEquipment {
  name: string;
  description: string;
  imageUrl: string;
  category: 'boxing' | 'machine' | 'cardio' | 'freeweight';
}

// ============================================================
// MEMBER TYPES
// ============================================================

export type GymType = 'boxing' | 'nisha';

export type PlanDuration = 'monthly' | '3month' | '6month' | 'annual';
export type Gender = 'male' | 'female' | 'other' | 'prefer-not-to-say';
export interface PaymentRecord {
  date: string;
  amount: number;
  planName: string;
  note?: string;
  id: string;
  planId: string;
}
export interface AdminNotification {
  id?: string;
  message: string;
  gym: GymType;
  createdAt: string;
  read: boolean;
  memberId?: string;
}

export interface MembershipPlan {
  id: string;
  gym: GymType;
  name: string;
  duration: PlanDuration;
  durationDays: number;
  price: number; // in INR
  features: string[];
  isPersonalTraining: boolean;
  highlight?: boolean; // show as "popular"
}

export interface Member {
  uid: string;             // Firebase Auth UID
  membershipId: string;    // e.g. FFBC-202506-0042
  gym: GymType;
  name: string;
  phone: string;           // +91XXXXXXXXXX
  age: number;
  emergencyContact: string;
  planId: string;
  planName: string;
  joinDate: string;        // ISO date string
  expiryDate: string;      // ISO date string
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentAmount: number;
  whatsappJoined: boolean;
  photoConsent: boolean;
  createdAt: string;
  gender: Gender;
  paymentHistory: PaymentRecord[];
  govtIdType: string;
  govtIdNumber: string;
  medicalCertificate: boolean;
}

export interface TrialRequest {
  id?: string;
  gym: GymType;
  name: string;
  phone: string;
  preferredTime: string;
  createdAt: string;
  contacted: boolean;
}

// ============================================================
// REGISTRATION FLOW STATE
// ============================================================

export type RegistrationStep = 
  | 'select-plan'
  | 'personal-details'
  | 'otp-send'
  | 'otp-verify'
  | 'payment'
  | 'success';

export interface RegistrationState {
  gym: GymType;
  step: RegistrationStep;
  selectedPlan: MembershipPlan | null;
  name: string;
  phone: string;
  age: string;
  emergencyContact: string;
  photoConsent: boolean;
  verificationId: string | null; // Firebase OTP confirmation
  memberId: string | null;
}

// ============================================================
// ADMIN TYPES
// ============================================================

export interface AdminStats {
  totalBoxing: number;
  totalNisha: number;
  activeBoxing: number;
  activeNisha: number;
  expiringThisWeek: number;
  pendingPayments: number;
}

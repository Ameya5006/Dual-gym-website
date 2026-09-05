# 🥊 GymFlow — Multi-Gym Membership Management Platform

A full-stack web application built for **Fitness First Boxing Club** and **Nisha Fitness** — two real gyms under the same family. The platform handles everything from member registration to payment tracking, admin management, and automated notifications — replacing pen-and-paper record keeping entirely.

> Built as a freelance project. Currently in production use.

---

## 🌐 Live Demo

> [[Link to deployed site]](https://boxingguruji.vercel.app/)

**Test credentials (read-only demo):**
- Member login: `FFBC-202506-DEMO` / `9999999999`
- Admin login: contact me

---

## 📸 Screenshots

| Landing Page | Member Dashboard | Admin Panel |
|---|---|---|
| ![Landing](screenshots/landing.png) | ![Dashboard](screenshots/dashboard.png) | ![Admin](screenshots/admin.png) |

---

## 🏗️ What It Does

### For Members
- Register with plan selection, personal details, and govt ID verification
- Receive a unique **Membership ID** (e.g. `FFBC-202506-1234`) used for login
- Login with Membership ID + phone number — no OTP, no email required
- View membership status, expiry date, and days remaining
- Renew membership by scanning a UPI QR code or tapping "Pay via UPI App" (deep link opens GPay/PhonePe/Paytm directly on mobile)

### For Gym Staff (Admin Dashboard)
- See all members across both gyms with colour-coded status (active/expiring/expired)
- Search and filter by name, ID, or gym
- Mark payments as paid, approve renewals, delete members
- View and manage renewal requests and payment notifications
- Delete individual notifications and requests

### Automated
- Every registration/renewal syncs to a **Google Sheet** in real time
- **WhatsApp notifications** via CallMeBot — uncle gets Boxing Club alerts, aunty gets Nisha Fitness alerts
- **Daily expiry reminders** — automatic WhatsApp message listing memberships expiring the next day

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Auth | Firebase Authentication (Email/Password) |
| Database | Cloud Firestore |
| Hosting | Firebase Hosting |
| Notifications | Google Apps Script + CallMeBot WhatsApp API |
| Records | Google Sheets (via webhook) |
| Payments | UPI deep links + QR codes (per-gym) |

---

## 🎯 Key Technical Decisions

**No OTP authentication** — Firebase Phone Auth requires billing. Instead, members authenticate via a generated Membership ID (fake email) + phone number as password. Zero cost, zero friction.

**Duplicate prevention** — Phone numbers are checked in Firestore before registration. Existing sessions are signed out before creating new accounts to prevent `email-already-in-use` false positives.

**Per-gym UPI** — Each gym has its own UPI ID and QR code. Payment deep links pre-fill the amount, payee name, and member reference note automatically.

**Firestore-first, Sheet as backup** — All live data lives in Firestore (real-time, queryable). Google Sheets sync runs non-blocking — if it fails, registration still succeeds.

**Split notification routing** — Boxing Club events go to uncle's WhatsApp, Nisha Fitness events go to aunty's — handled by a single Apps Script function with gym-based routing.

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── layout/          # BoxingLayout, NishaLayout, shared navbar/footer
│   └── ui/              # PlanCard, NoDiscountBanner, ProtectedRoute
├── constants/
│   └── plans.ts         # All plan data, UPI config, contact info, GYM_UPI
├── firebase/
│   ├── auth.ts          # createMemberAuth, loginMember, loginAdmin
│   ├── config.ts        # Firebase init
│   └── db.ts            # All Firestore operations (SRP)
├── pages/
│   ├── admin/           # AdminDashboard
│   ├── auth/            # Register, MemberLogin
│   ├── boxing/          # BoxingHome, About, Equipment, Gallery, Plans
│   ├── member/          # MemberDashboard
│   ├── nisha/           # NishaHome, About, Equipment, Gallery, Plans
│   └── payment/         # PaymentPortal
├── services/
│   ├── sheetsSync.ts    # Google Sheets webhook sync
│   └── whatsappNotify.ts
├── types/
│   └── index.ts         # Member, GymType, Gender, PaymentRecord etc.
└── utils/
    └── upiLink.ts       # UPI deep link builder
```

---

## 🚀 Running Locally

```bash
# Clone the repo
git clone https://github.com/YOURUSERNAME/gym-membership-platform.git
cd gym-membership-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Firebase config and other keys

# Start dev server
npm run dev
```

### Environment Variables

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_SHEETS_WEBHOOK_URL=
VITE_BOXING_NOTIFY_WHATSAPP=
VITE_NISHA_NOTIFY_WHATSAPP=
```

---

## 📋 Firebase Setup

1. Create a Firebase project
2. Enable **Email/Password** authentication
3. Create a **Firestore** database
4. Set up Firestore rules (see `firestore.rules`)
5. Enable **Firebase Hosting**
6. Add your config to `.env.local`

---

## 📊 Google Sheets Integration

The `GOOGLE_APPS_SCRIPT.js` file in the project root contains the full Apps Script code. Deploy it as a Web App and add the URL to `VITE_SHEETS_WEBHOOK_URL`. See `GOOGLE_SHEETS_SETUP.md` for step-by-step instructions.

---

## 🔮 Potential Future Features

- [ ] Daily/weekly member report email to admin
- [ ] Member photo upload on registration
- [ ] Attendance tracking via QR scan
- [ ] Multi-branch support beyond 2 gyms
- [ ] PWA — installable on member phones
- [ ] Automated payment verification via UPI webhook

---



## 📄 License

This project was built as a freelance client project. The codebase is shared for portfolio purposes. Please do not clone and deploy for commercial use without permission.

# GYM Website — Complete Setup Guide
# Run these steps inside your existing GYM folder in VS Code terminal

## STEP 1 — Install all dependencies

```bash
npm install react-router-dom firebase
npm install -D tailwindcss postcss autoprefixer @types/node
npx tailwindcss init -p
```

---

## STEP 2 — Final folder structure (create all these folders)

```
GYM/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/          ← your actual gym photos go here
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── PlanCard.tsx
│   │   │   ├── MemberCard.tsx
│   │   │   └── NoDiscountBanner.tsx
│   │   └── shared/
│   │       ├── SocialSidebar.tsx
│   │       └── WhatsAppButton.tsx
│   ├── pages/
│   │   ├── Landing.tsx          ← split screen entry
│   │   ├── boxing/
│   │   │   ├── BoxingHome.tsx
│   │   │   ├── BoxingAbout.tsx
│   │   │   ├── BoxingEquipment.tsx
│   │   │   ├── BoxingPlans.tsx
│   │   │   ├── BoxingGallery.tsx
│   │   │   └── BoxingContact.tsx
│   │   ├── nisha/
│   │   │   ├── NishaHome.tsx
│   │   │   ├── NishaAbout.tsx
│   │   │   ├── NishaEquipment.tsx
│   │   │   ├── NishaPlans.tsx
│   │   │   ├── NishaGallery.tsx
│   │   │   └── NishaContact.tsx
│   │   ├── auth/
│   │   │   ├── Register.tsx     ← OTP flow (both gyms)
│   │   │   └── PaymentSuccess.tsx
│   │   └── admin/
│   │       ├── AdminLogin.tsx
│   │       └── AdminDashboard.tsx
│   ├── firebase/
│   │   ├── config.ts            ← your Firebase keys go here
│   │   ├── auth.ts              ← OTP functions
│   │   └── db.ts                ← Firestore functions
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── types/
│   │   └── index.ts             ← TypeScript interfaces
│   ├── constants/
│   │   └── plans.ts             ← membership plan data
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.local                   ← your Firebase secrets
├── tailwind.config.js
└── vite.config.ts
```

---

## STEP 3 — Create .env.local file

Create a file called `.env.local` in your GYM root folder:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# WhatsApp group invite links (get from WhatsApp group → Invite via link)
VITE_BOXING_WHATSAPP_GROUP=https://chat.whatsapp.com/YOUR_BOXING_GROUP_LINK
VITE_NISHA_WHATSAPP_GROUP=https://chat.whatsapp.com/YOUR_NISHA_GROUP_LINK

# Admin WhatsApp number (for direct contact button)
VITE_ADMIN_WHATSAPP_NUMBER=91XXXXXXXXXX
```

NEVER commit .env.local to git. It's already in .gitignore by default with Vite.

---

## STEP 4 — Firebase Console Setup

1. Go to https://console.firebase.google.com
2. Create new project: "gym-website" (or any name)
3. Enable these FREE services:
   - Authentication → Sign-in method → Phone (enable it)
   - Firestore Database → Start in test mode (change rules later)
4. Go to Project Settings → Your apps → Add web app
5. Copy the config values into your .env.local above

### Firestore Security Rules (paste in Firebase Console → Firestore → Rules):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Members can only read their own record
    match /members/{memberId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null;
    }
    // Trial requests - anyone can create
    match /trials/{trialId} {
      allow create: if true;
    }
    // Admin only
    match /admin/{document=**} {
      allow read, write: if request.auth != null && request.auth.token.email == "your-admin-email@gmail.com";
    }
  }
}
```

---

## STEP 5 — tailwind.config.js

Replace the generated tailwind.config.js with this:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Boxing Club palette
        boxing: {
          red: '#C0392B',
          dark: '#0A0A0A',
          gray: '#1A1A1A',
          light: '#F5F5F5',
        },
        // Nisha Fitness palette  
        nisha: {
          rose: '#C2185B',
          pink: '#FCE4EC',
          gold: '#F9A825',
          dark: '#1A0010',
          cream: '#FFF8F9',
        },
      },
      fontFamily: {
        // Boxing: military/bold feel
        boxing: ['Barlow Condensed', 'sans-serif'],
        // Nisha: elegant/modern
        nisha: ['Cormorant Garamond', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
```

---

## STEP 6 — Add Google Fonts to index.html

Add these lines inside the `<head>` of your `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
```

---

## STEP 7 — src/index.css

Replace with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', sans-serif; }
}

@layer utilities {
  .text-shadow { text-shadow: 0 2px 20px rgba(0,0,0,0.8); }
  .text-shadow-sm { text-shadow: 0 1px 8px rgba(0,0,0,0.6); }
  .overlay-dark::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%);
    z-index: 0;
  }
}
```

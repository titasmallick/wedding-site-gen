# 💍 Wedding Website Generator v3.0 (AI-Powered)

[![NPM Version](https://img.shields.io/npm/v/next-wedding-generator?color=pink)](https://www.npmjs.com/package/next-wedding-generator)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/titasmallick/wedding-site-gen)

> **The ultimate digital companion for your special day.** Scaffold, personalize, and deploy a feature-rich wedding application in minutes.

---

## 🚀 Phase 1: Rapid Generation

### Initialize Your Project
Run the command below to start the interactive CLI:
```bash
npx next-wedding-generator
```

### CLI Prompt Reference
Answer the prompts to pre-configure your site's identity:

| Prompt | Example Input | Purpose |
| :--- | :--- | :--- |
| **Groom's Names** | `Titas`, `Titas Mallick` | Sets URLs and bios. |
| **Bride's Names** | `Sukanya`, `Sukanya Saha` | Sets URLs and bios. |
| **Wedding Dates** | `January 23, 2026`, `2026-01-23` | Powers UI text and countdown logic. |
| **Admin Email** | `admin@wedding.com` | **Vital**: Log in with this email for admin tools. |
| **UPI ID** | `wedding@okaxis` | Generates the gift QR code. |
| **Website URL** | `https://our-wedding.com` | Used for SEO and email links. |
| **Wedding Hashtag** | `#TitasWedsSukanya` | Branding across the site. |
| **Visual Theme** | `1` (Pink & Gold) | Sets initial primary colors. |

---

## 🛠️ Phase 2: System Infrastructure

### 1. Environment Configuration
A structured template is provided in `.env.example`. Duplicate this to `.env.local` and populate the values.

### 2. Firebase (Database & Auth)
1.  Create a project at [Firebase Console](https://console.firebase.google.com/).
2.  **Authentication**: Enable "Email/Password".
3.  **Firestore**: Create a database in "Production Mode".
4.  **Admin SDK**: Go to **Project Settings** > **Service Accounts** > **Generate New Private Key**. Use these values for `FIREBASE_ADMIN` env vars.

### 2. Firestore Security Rules
Deploy these rules in the Firebase console to ensure data integrity:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /wishes/{wishId} { allow read, write: if true; }
    match /song_requests/{requestId} { allow read, write: if true; }
    match /guestbook/{entryId} { allow read, write: if true; }
    match /rsvps/{rsvpId} { allow read, write: if true; }
    match /email-reminders/{reminderId} { allow read: if true; allow write: if request.auth != null; }
    match /{document=**} { allow read: if true; allow write: if request.auth != null; }
  }
}
```

### 3. Media & Automation
- **Cloudinary**: Create an "Unsigned" upload preset named `wedding`.
- **Resend**: Generate an API key for automated email reminders.
- **Google Gemini**: Get an API key from [Google AI Studio](https://aistudio.google.com/).

---

## 🎨 Phase 3: Theming & Personalization

### 1. Visual Theming (Tailwind)
The site's colors are centralized in `tailwind.config.js`. You can change the primary wedding palette here:
```javascript
// tailwind.config.js
colors: {
  wedding: {
    pink: {
      500: '#ec4899', // Change this to your primary color
    },
    gold: {
      400: '#d99e43', // Change this to your accent color
    }
  }
}
```

### 2. Asset Mapping (`/public/`)
Replace placeholders with your own media. **Maintain exact filenames.**

| File | Context |
| :--- | :--- |
| `bride.jpg` | Main Bride portrait (used in /couple). |
| `groom.jpg` | Main Groom portrait (used in /couple). |
| `qr.png` | Your UPI QR code. |
| `/Images/19.jpg` - `22.jpg` | Specific timeline milestones. |
| `/Images/Patipatra.jpeg` | Date-fixing ceremony photo. |
| `/Images/*.jpg` | **Bulk Upload**: Any extra images here auto-populate the masonry gallery. |

---

## 💻 Phase 4: Code-Level Customization

### 1. Modifying the "Our Story" Section
The narrative is located in `components/OurStory.tsx`. It uses standard React/Tailwind. Edit the `<p>` tags to write your own journey.

### 2. Adding/Removing Navigation Items
Update `config/site.ts` to add new routes or hide existing ones from the navbar and mobile menu.

### 3. Tweaking AI Bot Behavior
Go to `components/ConciergeBot.tsx` and find the `systemInstruction` variable. You can change the bot's "personality" or add more specific wedding facts.

---

## 🎮 Phase 5: Admin & Management

### Guest Management Dashboard (`/invitation/maker`)
Log in with your **Admin Email** to access:
- **Login Secret**: To log in as admin, scroll to the footer and click the small **"Celebrate" heart icon** next to the author's name. This will trigger the login modal.
- **Guest List**: Create unique invitation IDs.
- **Personalized Links**: Give every family a unique URL: `yoursite.com/invitation/[guest-id]`.
- **RSVP Tracking**: Live view of attendance and meal choices.

### OBS Live Overlay (`/updates/overlay`)
Use this route as a "Browser Source" in OBS for your venue screens:
- **Real-time News**: Scroling updates posted via `/updates/maker`.
- **Clock**: Synchronized event time.
- **Background**: Chroma-key green for transparency.

---

## 🚀 Phase 6: Deployment

### Vercel (Recommended)
1. Push your code to GitHub.
2. Import project to Vercel.
3. Add all variables from `.env.local` to Vercel **Environment Variables**.

### Automated Guest Reminders
Set up a Cron Job (Vercel or GitHub Actions) to trigger:
- **URL**: `YOUR_SITE/api/email-reminders`
- **Method**: `GET`
- **Header**: `Authorization: Bearer YOUR_CRON_SECRET`
- **Cron**: `0 10 10-26 1 *` (10 AM daily during Jan).

---

## 📜 License
MIT License. Built with ❤️ for the community.

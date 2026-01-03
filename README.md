# 💍 Wedding Website Generator v2.0 (AI-Powered)

Transform your wedding journey with a sophisticated, AI-driven digital experience. This generator scaffolds a production-ready Next.js application featuring an AI concierge, digital guestbook, real-time song requests, and automated guest reminders.

---

## 🚀 Phase 1: Generation (The A-B-C Guide)

### Step A: Initialize Your Project
Run the following command in your terminal to start the interactive setup:
```bash
npx @titas_mallick/wedding-site-gen
```

### Step B: CLI Prompt Reference
The generator will ask you several questions. Here is how to answer them:

| Prompt | Example Input | Purpose |
| :--- | :--- | :--- |
| **Groom's First Name** | `Titas` | Used for URLs and short mentions. |
| **Groom's Full Name** | `Titas Mallick` | Used in official bio and certificate pages. |
| **Bride's First Name** | `Sukanya` | Used for URLs and short mentions. |
| **Bride's Full Name** | `Sukanya Saha` | Used in official bio and certificate pages. |
| **Wedding Date** | `January 23, 2026` | Displayed text on the countdown and hero. |
| **Wedding Date ISO** | `2026-01-23` | Powers the technical countdown logic. |
| **Admin Email** | `admin@wedding.com` | **CRITICAL**: Log in with this email to manage content. |
| **UPI ID** | `wedding@okaxis` | Used for the "Sagun" (Gift) QR code generator. |
| **Website URL** | `https://our-wedding.com` | Used for email links and SEO. |
| **Wedding Hashtag** | `#TitasWedsSukanya` | Displayed across the site. |
| **Visual Theme** | `1` (Pink & Gold) | Sets the primary color palette (Pink, Blue, Green, or Red). |
| **Target Directory** | `my-wedding` | The name of the folder where code will be saved. |

---

## 🛠️ Phase 2: Infrastructure Setup

### 1. Firebase (Database & Auth)
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  **Create a Project**: Give it a name (e.g., `wedding-project`).
3.  **Authentication**: Enable "Email/Password" provider in the Auth tab.
4.  **Firestore**: Create a Database in "Production Mode".
5.  **Project Settings**: 
    - Click the **Web Icon (</>)** to register a web app. Copy the `firebaseConfig` keys for your `.env.local`.
    - Go to **Service Accounts** > **Generate New Private Key**. This downloads a JSON file. Use these values for the `FIREBASE_ADMIN` variables.

### 2. Firestore Security Rules
Copy the following into the **Rules** tab of your Firestore console to allow guests to post wishes/songs while keeping admin functions secure:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /wishes/{wishId} { allow read, write: if true; }
    match /song_requests/{requestId} { allow read, write: if true; }
    match /guestbook/{entryId} { allow read, write: if true; }
    match /rsvps/{rsvpId} { allow read, write: if true; }
    match /email-reminders/{reminderId} { 
      allow read: if true; 
      allow write: if request.auth != null; 
    }
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 3. Cloudinary (Guestbook Uploads)
1.  Sign up at [Cloudinary](https://cloudinary.com/).
2.  In the **Dashboard**, copy your `Cloud Name`.
3.  Go to **Settings** > **Upload** > **Upload Presets** and create a new preset named `wedding` with "Unsigned" signing mode.

### 4. Resend (Email Automation)
1.  Sign up at [Resend.com](https://resend.com/).
2.  Generate an **API Key** and add it to `.env.local`.

---

## 🔐 Phase 3: Environment Configuration

Create a `.env.local` file in your generated project root and populate it:

```bash
# --- Firebase Client ---
NEXT_PUBLIC_APIKEY=AIza...
NEXT_PUBLIC_AUTHDOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_PROJECTID=your-project
NEXT_PUBLIC_STORAGEBUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_SENDERID=...
NEXT_PUBLIC_APPID=...
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=...

# --- Firebase Admin (Secrets) ---
FIREBASE_ADMIN_PROJECT_ID=your-project
FIREBASE_ADMIN_PRIVATE_KEY_ID=...
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-...
FIREBASE_ADMIN_CLIENT_ID=...

# --- AI & Content ---
NEXT_PUBLIC_GEMINI_API_KEY=AIza... # Get from Google AI Studio
NEXT_PUBLIC_ADMIN_EMAIL=your-email@gmail.com # Must match login for admin powers

# --- Media & Email ---
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=wedding
RESEND_API_KEY=re_...
CRON_SECRET=a-secure-random-string
```

---

## 🎨 Phase 4: Asset Personalization

Replace the files in `/public/` keeping the exact filenames:

| Location | Filename | Purpose |
| :--- | :--- | :--- |
| `/public/` | `bride.jpg` | Main portrait of the Bride (3:4 ratio). |
| `/public/` | `groom.jpg` | Main portrait of the Groom (3:4 ratio). |
| `/public/` | `qr.png` | Your UPI QR code for the Sagun page. |
| `/public/Images/` | `19.jpg` - `22.jpg` | Milestone images for the "Mark the Dates" timeline. |
| `/public/Images/` | `Patipatra.jpeg` | Image for the traditional date-fixing milestone. |
| `/public/Images/` | `* (any name)` | All other images in this folder automatically populate the **Memories** gallery. |

---

## 🚀 Phase 5: Deployment & Automation

### Vercel Deployment
1.  Push your code to **GitHub**.
2.  Connect your repository to [Vercel](https://vercel.com/).
3.  **Important**: Add all your `.env.local` variables into the Vercel **Environment Variables** settings.

### Automated Reminders (Cron Job)
To send daily reminders to guests (e.g., from Jan 10th to Jan 26th):
1.  In Vercel, go to the **Cron** tab (or use GitHub Actions).
2.  Set up a job to call: `GET /api/email-reminders`
3.  Header: `Authorization: Bearer YOUR_CRON_SECRET`
4.  Schedule: `0 10 10-26 1 *` (10 AM daily).

---

## 📜 License
MIT License. Created with ❤️ for your special day.

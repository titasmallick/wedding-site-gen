# 💍 Say "I Do" to Automation: Building an AI-Powered Wedding Experience with Next.js & Gemini

In the era of digital transformation, the traditional paper wedding invitation is becoming a relic of the past. But while digital invitations are rising, most are just static landing pages. I wanted something more—something interactive, intelligent, and truly helpful for both the couple and the guests.

That’s why I built **Wedding Website Generator v2.0**, a production-ready CLI tool that scaffolds a complete, high-end wedding application in minutes.

---

## 🚀 The Vision: Beyond the Static Page

Most wedding websites provide a map and a date. My goal was to build a **digital concierge**. Guests always have questions: *"Where is the parking?"*, *"What time does the ceremony start?"*, *"What is the dress code?"*. 

By integrating **Google Gemini 2.5-flash**, I’ve created a sitewide AI assistant that is trained on the couple's specific wedding data. It doesn't just display info; it talks to your guests.

## ✨ Core Features at a Glance

### 🤖 AI-Powered Intelligence
*   **Wedding Concierge**: A floating chatbot that answers guest queries about venues, schedules, and the couple's story in real-time.
*   **Sentiment Wall**: AI analysis that summarizes guest wishes into a beautiful "Collective Blessing" paragraph.

### 📸 Interactive Guest Experience
*   **Personalized Invitations**: Every guest gets a unique ID and URL. They only see the events they are specifically invited to.
*   **Digital Guestbook**: A masonry-style gallery where guests can upload photos directly from their phones (powered by Cloudinary).
*   **Reception Playlist**: A real-time queue where guests can request songs they want to hear.

### 🎮 The "Control Center" (Admin Dashboard)
Managing a guest list of 500 people is a nightmare. The generator includes a secure dashboard where the couple can:
*   Add/Edit guest details and invitation types.
*   Track RSVPs and food preferences in real-time.
*   Generate pre-filled WhatsApp messages for one-click sharing.

### 🎥 Live Event Broadcast
The site includes a dedicated `/updates/overlay` route designed for **OBS**. You can display scrolling "Live News" updates and a synchronized clock on the venue's big screens during the event.

---

## 🛠️ The Tech Stack

Building a scalable, real-time app required a modern stack:
*   **Framework**: Next.js 15 (App Router)
*   **UI/UX**: HeroUI (formerly NextUI) + Framer Motion for elegant animations.
*   **Database**: Firebase Firestore for real-time updates.
*   **Auth**: Firebase Authentication.
*   **AI**: Google Gemini AI.
*   **Media**: Cloudinary (Image resizing and storage).
*   **Email**: Resend API for automated guest reminders.

---

## 🚀 Quick Start: Make it Yours

One of the best parts about this project is that it is an **npm utility**. You don't need to clone a repo and manually search-and-replace strings. 

### 1. Generate
Simply run:
```bash
npx @titas_mallick/wedding-site-gen
```
The CLI will ask for the couple's names, the wedding date, and your preferred theme. It then generates a sanitized, personalized codebase.

### 2. Configure
Fill in your `.env.local` with your Firebase and Gemini keys. Deploy the included Firestore rules, and you are ready to go.

### 3. Personalize
Replace the placeholder images in the `/public/` folder with your own pre-wedding portraits and milestone photos. The masonry gallery will automatically detect and display them.

---

## 📜 Final Thoughts

Weddings are about stories. By using AI and modern web tech, we can tell those stories in a way that is engaging, modern, and stress-free. Whether you're a developer looking to build a site for a friend or a tech-savvy couple, this tool provides a professional foundation to build upon.

**Explore the Project:**
*   📦 **NPM Package**: [@titas_mallick/wedding-site-gen](https://www.npmjs.com/package/@titas_mallick/wedding-site-gen)
*   💻 **GitHub Repository**: [titasmallick/wedding-site-gen](https://github.com/titasmallick/wedding-site-gen)

**Happy Building, and Happy Wedding!** 💍✨

---
*If you find this tool useful, feel free to contribute to the project or share your feedback!*

# 💍 Digital Invitations & AI: A Small Effort to Make Wedding Planning a Bit Easier

Weddings are beautiful, but they can also be incredibly overwhelming. Between managing guest lists, answering the same questions about venues a hundred times, and trying to keep everyone updated, the "joy" of planning can sometimes feel like a second job.

While preparing for my own journey, I realized that most digital invitations were just static pages that didn't really solve these problems. I wanted to build something that could actually help—both the couple and their guests. What started as a personal project evolved into **next-wedding-generator**, a small CLI tool I’ve shared on NPM to help others scaffold their own interactive wedding sites.

---

## 🍃 Why a "Generator"?

I know how busy things get. Most of us don't have weeks to code a custom site from scratch. My goal was to create a "Quick Start" foundation. By running a single command, you get a full Next.js application that is already set up with the features I found most useful.

## 🤖 Bringing in a Helping Hand: AI Concierge

The most helpful part of this project, in my humble opinion, is the AI integration. By using **Google Gemini 2.5-flash**, I've included a simple floating assistant. 

It’s not just a chatbot; it’s a way to give your guests instant answers. Once you provide it with your wedding details, it can tell guests where to park, what time the snacks are served, or even share a bit about the couple's story. It's a small way to ensure no guest feels lost.

## ✨ Some Features I Thought Might Help:

*   **Personalized Links**: I wanted every guest to feel special. The system generates unique IDs so guests only see the events they are invited to.
*   **Digital Guestbook**: A place for friends to share photos from their phones directly to a masonry wall (via Cloudinary).
*   **A Shared Playlist**: A simple queue where guests can request the songs they want to dance to at the reception.
*   **Admin Control**: A basic dashboard to manage the guest list and track RSVPs without needing to look at complex databases.

---

## 🛠️ The Simple Tech Behind It

I chose these tools because they are reliable and relatively easy to set up for anyone with a bit of web knowledge:
*   **Next.js & HeroUI**: For a clean, modern look that works well on mobile.
*   **Firebase**: To handle real-time wishes and RSVPs.
*   **Resend**: For those helpful "day-before" email reminders.

---

## 🚀 How to Use It (If You’d Like)

If you or a friend are planning a wedding, feel free to try it out. It’s a simple process:

1.  **Generate**: Run `npx next-wedding-generator` in your terminal.
2.  **Setup**: Fill in your own API keys in the `.env` file (I’ve included a guide in the README).
3.  **Personalize**: Swap the placeholder photos in the `public` folder with your own.

---

## 📜 Closing Thoughts

I'm still learning, and this tool is just a small contribution to the community. My hope is that it saves a few couples some stress and adds a little bit of digital magic to their big day. 

If you find it useful, or have ideas on how to make it better, I’d love to hear from you. 

**Explore the Project:**
*   📦 **NPM**: [next-wedding-generator](https://www.npmjs.com/package/next-wedding-generator)
*   💻 **GitHub**: [titasmallick/wedding-site-gen](https://github.com/titasmallick/wedding-site-gen)

Wishing you a stress-free and beautiful celebration! 💍✨
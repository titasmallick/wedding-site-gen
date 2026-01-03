import { NextRequest, NextResponse } from "next/server";
import * as admin from "firebase-admin";
import { Resend } from "resend";
import adminCred from "@/config/firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(adminCred as admin.ServiceAccount),
  });
}

const db = admin.firestore();
const resend = new Resend(process.env.RESEND_API_KEY);

const EVENTS: Record<string, { title: string; date: string; venue: string; isoDate: string; details: string; startTime: string; endTime: string; location: string }> = {
  registration: {
    title: "Engagement Ceremony",
    date: "23rd November 2025",
    venue: "Venue City",
    isoDate: "2025-11-23",
    details: "Join us for the Engagement Ceremony of the couple",
    startTime: "20251123T043000Z",
    endTime: "20251123T083000Z",
    location: "Venue Name, City"
  },
  wedding: {
    title: "Wedding Ceremony",
    date: "23rd January 2026",
    venue: "Venue City",
    isoDate: "2026-01-23",
    details: "The Wedding Ceremony",
    startTime: "20260123T123000Z",
    endTime: "20260123T163000Z",
    location: "Venue Name, City"
  },
  reception: {
    title: "Reception Celebration",
    date: "25th January 2026",
    venue: "Venue City",
    isoDate: "2026-01-25",
    details: "Reception Party for the couple",
    startTime: "20260125T123000Z",
    endTime: "20260125T163000Z",
    location: "Venue Name, City"
  },
};

const getCalendarLink = (event: any) => {
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.startTime}/${event.endTime}&details=${encodeURIComponent(event.details)}&location=${encodeURIComponent(event.location)}`;
};

const getDaysToGo = (isoDate: string) => {
  const eventDate = new Date(isoDate);
  // Get current time in IST
  const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  
  eventDate.setHours(0, 0, 0, 0);
  nowIST.setHours(0, 0, 0, 0);
  
  const diffTime = eventDate.getTime() - nowIST.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "TODAY! 🎉";
  if (diffDays === 1) return "TOMORROW! ⏳";
  if (diffDays < 0) return "Completed ✔️";
  return `${diffDays} days to go`;
};

const emailTemplate = (guestName: string, invitedFor: string[] = []) => {
  const eventDetailsHtml = invitedFor
    .map((eventKey) => {
      const event = EVENTS[eventKey.toLowerCase()];
      if (!event) return "";
      
      const daysMessage = getDaysToGo(event.isoDate);
      const calendarLink = getCalendarLink(event);

      return `
        <div class="detail-item">
            <strong>${event.title}</strong> 
            <span class="days-badge" style="background-color: #fce7f3; color: #db2777; padding: 2px 8px; border-radius: 10px; font-size: 12px; font-weight: bold; margin-left: 8px;">${daysMessage}</span>
        </div>
        <div class="detail-item">📅 ${event.date}</div>
        <div class="detail-item">📍 ${event.venue}</div>
        <div class="detail-item" style="margin-top: 8px;">
            <a href="${calendarLink}" style="color: #ec4899; text-decoration: underline; font-size: 14px;">📅 Add to Calendar</a>
        </div>
        <br>
      `;
    })
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Helvetica', 'Arial', sans-serif; background-color: #fdf2f8; color: #4a4a4a; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 30px; border-radius: 16px; border: 1px solid #fbcfe8; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
  .header { text-align: center; color: #ec4899; font-family: 'Brush Script MT', cursive; font-size: 36px; margin-bottom: 24px; border-bottom: 2px solid #fce7f3; padding-bottom: 16px; }
  .content { font-size: 16px; line-height: 1.6; color: #374151; }
  .details { background-color: #fffbeb; padding: 20px; border-radius: 12px; margin: 24px 0; border: 1px solid #edd5a3; }
  .detail-item { margin-bottom: 8px; }
  .footer { text-align: center; font-size: 12px; color: #9ca3af; margin-top: 32px; border-top: 1px solid #f3f4f6; padding-top: 16px; }
  .btn { display: inline-block; background-color: #ec4899; color: #ffffff !important; padding: 12px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; margin-top: 16px; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">Groom & Bride</div>
    <div class="content">
      <p>Dear <strong>${guestName}</strong>,</p>
      <p>We are counting down the days and are so excited to celebrate our union with you! This is a gentle reminder that our big day is just around the corner.</p>
      ${eventDetailsHtml ? `<div class="details">${eventDetailsHtml}</div>` : ''}
      <p>Please visit our wedding website for the full schedule, maps, and travel guide.</p>
      <div style="text-align: center;">
        <a href="https://www.your-wedding-site.com" class="btn">View Wedding Details</a>
      </div>
      <p style="text-align: center; margin-top: 30px;">With Love,<br>Groom & Bride</p>
    </div>
    <div class="footer">
      <p>You received this email because you signed up for reminders on our wedding website.</p>
    </div>
  </div>
</body>
</html>
`;
};

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const snapshot = await db.collection("email-reminders").get();
    
    if (snapshot.empty) {
      return NextResponse.json({ message: "No email reminders found." });
    }

    // Deduplicate by email
    const uniqueRecipients = new Map<string, any>();
    snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.email) {
            uniqueRecipients.set(data.email, data); 
        }
    });

    const results = [];
    const recipients = Array.from(uniqueRecipients.values());
    
    // Get current time in IST
    const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

    const isFutureOrToday = (isoDateStr: string) => {
        const eventDate = new Date(isoDateStr);
        // Set event date to end of day in IST
        eventDate.setHours(23, 59, 59, 999);
        return eventDate >= nowIST;
    };

    for (const recipient of recipients) {
      const { email, guestName, invitedFor } = recipient;
      
      const upcomingEvents = (invitedFor || []).filter((eventKey: string) => {
          const evt = EVENTS[eventKey.toLowerCase()];
          return evt && isFutureOrToday(evt.isoDate);
      });

      if (upcomingEvents.length === 0) {
          results.push({ email, status: 'skipped', reason: 'No upcoming events' });
          continue;
      }

      try {
        const { data: emailData, error } = await resend.emails.send({
          from: 'Groom & Bride <wedding@your-wedding-site.com>',
          to: [email],
          subject: "Reminder: Wedding Celebration! 🎉",
          html: emailTemplate(guestName || "Guest", upcomingEvents),
        });

        if (error) {
          console.error(`Failed to send to ${email}:`, error);
          results.push({ email, status: 'failed', error });
        } else {
            results.push({ email, status: 'sent', id: emailData?.id });
        }
      } catch (err) {
        console.error(`Exception sending to ${email}:`, err);
        results.push({ email, status: 'failed', error: err });
      }
    }

    const sentCount = results.filter(r => r?.status === 'sent').length;
    const failedCount = results.length - sentCount;

    // Send Report to Admin
    const reportHtml = `
      <h1>Email Reminder Report</h1>
      <p><strong>Total Unique Recipients:</strong> ${results.length}</p>
      <p><strong>Successfully Sent:</strong> ${sentCount}</p>
      <p><strong>Failed:</strong> ${failedCount}</p>
      <hr/>
      <h3>Details:</h3>
      <ul>
        ${results.map(r => `<li>${r.email}: <strong>${r.status}</strong> ${r.error ? `(${JSON.stringify(r.error)})` : ''}</li>`).join('')}
      </ul>
    `;

    try {
        await resend.emails.send({
            from: 'Wedding Bot <bot@your-wedding-site.com>',
            to: [process.env.ADMIN_EMAIL || 'admin@example.com'],
            subject: `Wedding Reminder Report: ${sentCount}/${results.length} Sent`,
            html: reportHtml,
        });
    } catch (reportError) {
        console.error("Failed to send admin report:", reportError);
    }

    return NextResponse.json({ 
      success: true, 
      total: results.length,
      sent: sentCount,
      failed: failedCount,
      results 
    });

  } catch (error) {
    console.error("Error processing email reminders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
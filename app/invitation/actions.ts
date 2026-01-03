"use server";

import * as admin from "firebase-admin";
import adminCred from "@/config/firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(adminCred as admin.ServiceAccount),
  });
}

const db = admin.firestore();

export async function sendEmailReminder(formData: FormData) {
  const email = formData.get("email") as string;
  const slug = formData.get("slug") as string;

  console.log("Received email reminder request:", { email, slug });

  try {
    const docRef = db.collection("invitation").doc(slug);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const guestData = docSnap.data();
      
      await db.collection("email-reminders").add({
        email,
        guestId: slug,
        guestName: guestData?.name || "Unknown",
        familySide: guestData?.familySide || "Unknown",
        invitedFor: guestData?.invitedFor || [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      
      console.log("Email reminder saved for:", email);
    } else {
        console.log("Invitation not found for slug:", slug);
    }
  } catch (error) {
    console.error("Error fetching invitation:", error);
  }

  // In the future, we will use 'resend' here to send the email.
  // const { Resend } = require("resend");
  // const resend = new Resend(process.env.RESEND_API_KEY);

  return { success: true };
}

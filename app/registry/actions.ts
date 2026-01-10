"use server";

import * as admin from "firebase-admin";
import adminCred from "@/config/firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(adminCred as admin.ServiceAccount),
  });
}

const db = admin.firestore();

export async function addContribution(data: {
  itemId: string;
  itemName: string;
  slug: string;
  guestName: string;
  amount: number;
}) {
  const { itemId, itemName, slug, guestName, amount } = data;

  try {
    await db.runTransaction(async (transaction) => {
      const itemRef = db.collection("registry_items").doc(itemId);
      const itemDoc = await transaction.get(itemRef);

      if (!itemDoc.exists) {
        throw new Error("Item does not exist!");
      }

      const itemData = itemDoc.data()!;
      const currentTotal = itemData.totalContributed || 0;
      const newTotal = currentTotal + amount;
      const targetPrice = itemData.price || 0;

      transaction.update(itemRef, {
        totalContributed: newTotal,
        status: newTotal >= targetPrice ? "completed" : "available",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      const contribRef = db.collection("registry_contributions").doc();
      transaction.set(contribRef, {
        itemId,
        itemName,
        guestId: slug,
        guestName,
        amount,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    return { success: true };
  } catch (error: any) {
    console.error("Contribution error:", error);
    return { success: false, error: error.message };
  }
}

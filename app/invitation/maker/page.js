"use client";

import { useEffect, useState } from "react";
import AddGuestModal from "./guestAdder";
import GuestTable from "./guestShower";
import Dash from "./dashboard";
import RSVPViewer from "./rsvpViewer";
import Auth from "./auth";
import firebaseApp from "@/config/firebase";
import {
  getFirestore,
  doc,
  addDoc,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { addToast } from "@heroui/react";
import { fontCursive } from "@/config/fonts";

const InvitationMaker = () => {
  const [user, setUser] = useState(null);
  const [guests, setGuests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);

  const db = getFirestore(firebaseApp());

  useEffect(() => {
    if (!user) return;

    // const invitationRef = collection(db, "invitation");
    const q = query(collection(db, "invitation"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const guests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGuests(guests);
    });

    return () => unsubscribe(); // cleanup on unmount
  }, [db, user]);

  const handleAddGuest = async (guestData) => {
    console.log("Saving Guest:", guestData);
    const cleanedData = {
      ...guestData,
      invitedGuests: Number(guestData.invitedGuests), // ensure number type
      createdAt: serverTimestamp(),
    };

    try {
      if (guestData.id) {
        // Update existing guest by doc ID with merge
        const guestRef = doc(db, "invitation", guestData.id);
        await setDoc(guestRef, cleanedData, { merge: true });
        console.log("🔁 Guest updated in Firestore");
        addToast({
          title: "Guest Updated",
          description: "Guest details have been updated successfully.",
          color: "success",
          variant: "solid",
          radius: "lg",
          closeIcon: true,
          timeout: 2000,
        });
      } else {
        // Add new guest
        await addDoc(collection(db, "invitation"), cleanedData);
        console.log("✅ Guest added to Firestore");
        addToast({
          title: "Guest Added",
          description: "Guest has been added successfully.",
          color: "success",
          variant: "solid",
          radius: "lg",
          closeIcon: true,
          timeout: 2000,
        });
      }
    } catch (error) {
      console.error("❌ Error saving guest:", error);
      addToast({
        title: "Error",
        description: "An error occurred while saving the guest.",
        color: "danger",
        variant: "solid",
        radius: "lg",
        closeIcon: true,
        timeout: 2000,
      });
    }

    setIsModalOpen(false);
    setEditingGuest(null);
  };

  const handleDeleteGuest = async (guestToDelete) => {
    try {
      const guestRef = doc(db, "invitation", guestToDelete.id);
      await deleteDoc(guestRef);
      console.log("🗑️ Guest deleted from Firestore");
      addToast({
        title: "Guest deleted",
        description: "Guest has been deleted successfully.",
        color: "danger",
        variant: "solid",
        radius: "lg",
        closeIcon: true,
        timeout: 2000,
      });
    } catch (error) {
      console.error("❌ Error deleting guest:", error);
    }
  };

  const handleEditClick = (guest) => {
    setEditingGuest(guest);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingGuest(null);
    setIsModalOpen(true);
  };

  return (
    <>
      <h1
        className={`${fontCursive.className} text-center text-3xl md:text-5xl leading-snug bg-cover bg-center bg-no-repeat pt-2 pb-10`}
      >
        Guest Management System
      </h1>
      <Auth userSet={setUser} />
      {guests && <Dash guests={guests} />}
      {user && guests && (
        <div className="mt-10 px-4">
          <RSVPViewer guests={guests} />
        </div>
      )}
      {user && (
        <AddGuestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddGuest}
          existingGuest={editingGuest}
        />
      )}
      <br />
      {guests && user && (
        <div className="px-4">
          <GuestTable
            guests={guests}
            onEdit={handleEditClick}
            onDelete={handleDeleteGuest}
            onAdd={handleAddClick}
          />
        </div>
      )}
    </>
  );
};

export default InvitationMaker;

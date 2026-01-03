"use client";

import { useState, useEffect } from "react";
import {
  Textarea,
  Button,
  Card,
  CardHeader,
  CardBody,
  addToast,
  Chip,
  Divider,
} from "@heroui/react";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

import firebaseApp from "@/config/firebase";
import { fontCursive, fontSans, fontMono } from "@/config/fonts";
import { HeartFilledIcon } from "@/components/icons";
import Auth from "../../invitation/maker/auth.js";

const auth = getAuth(firebaseApp());
const db = getFirestore(firebaseApp());

const UpdateMaker = () => {
  const [user, setUser] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleRefine = async () => {
    if (!text.trim()) {
      addToast({
        title: "Nothing to refine",
        description: "Please write something first.",
        color: "warning",
      });
      return;
    }

    setIsRefining(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error("Gemini API Key is missing. Please check your .env.local file and restart the server.");
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Task: Rewrite the following wedding update message to be more elegant, heartwarming, and professional.
                Context: This is for a wedding celebration.
                Constraint 1: Output ONLY the refined message in PLAIN TEXT. 
                Constraint 2: Do NOT use any Markdown formatting, bolding (**), or symbols.
                Constraint 3: Do not include any introductory text, titles (like "For the couple:"), or quotes.

                Message to rewrite: "${text}"`
              }]
            }],
            generationConfig: {
              maxOutputTokens: 300,
              temperature: 0.7,
            }
          })
        }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || "API Error");
      }

      const refinedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (refinedText) {
        setText(refinedText);
        addToast({
          title: "Refined ✨",
          description: "Message polished successfully!",
          color: "success",
          variant: "solid",
        });
      } else {
        throw new Error("AI returned an empty response. Try rephrasing your input.");
      }
    } catch (err) {
      console.error("AI Refinement error:", err);
      addToast({
        title: "Refinement Failed",
        description: err.message || "An unexpected error occurred.",
        color: "danger",
      });
    } finally {
      setIsRefining(false);
    }
  };

  const handleSave = async () => {
    if (text.trim().length === 0 || text.length > 300) {
      addToast({
        title: "Invalid input",
        description: "Please enter 1–300 characters.",
        color: "warning",
        variant: "solid",
        radius: "lg",
      });
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "updates"), {
        text: text.trim(),
        createdAt: serverTimestamp(),
        uid: user.uid,
        email: user.email,
      });
      setText("");
      addToast({
        title: "Success",
        description: "Your update has been shared with everyone!",
        color: "success",
        variant: "solid",
        radius: "lg",
      });
    } catch (err) {
      addToast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        color: "danger",
        variant: "solid",
        radius: "lg",
      });
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      addToast({
        title: "Signed Out",
        description: "Session closed successfully.",
        color: "default",
        variant: "flat",
        radius: "lg",
      });
    } catch (error) {
      console.error("Sign out error", error);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-transparent to-wedding-pink-50/20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl"
      >
        <Card className="w-full bg-white/80 dark:bg-black/60 backdrop-blur-xl border border-wedding-gold-200 dark:border-wedding-gold-800 shadow-2xl overflow-visible">
          {/* Decorative Top Border */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-wedding-pink-500 via-wedding-gold-500 to-wedding-pink-500 rounded-t-xl" />

          <CardHeader className="flex flex-col items-center pt-10 pb-4 text-center">
            <motion.div
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", damping: 10 }}
              className="bg-wedding-pink-100 dark:bg-wedding-pink-900/30 p-4 rounded-full mb-4"
            >
              <HeartFilledIcon className="w-8 h-8 text-wedding-pink-500" />
            </motion.div>
            <h1 className={`${fontCursive.className} text-5xl md:text-6xl text-wedding-pink-600 dark:text-wedding-pink-400`}>
              Post an Update
            </h1>
            <p className={`${fontMono.className} mt-2 text-xs uppercase tracking-widest text-default-500`}>
              Share a moment with your guests
            </p>
          </CardHeader>

          <Divider className="mx-8 w-auto opacity-50" />

          <CardBody className="px-8 py-10">
            <AnimatePresence mode="wait">
              {user ? (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Chip
                        variant="flat"
                        color="warning"
                        className="bg-wedding-gold-50 dark:bg-wedding-gold-900/20 text-wedding-gold-700 dark:text-wedding-gold-300"
                        size="sm"
                      >
                        Admin: {user.email}
                      </Chip>
                    </div>
                    <Button
                      size="sm"
                      variant="light"
                      color="danger"
                      className="font-semibold"
                      onPress={handleSignOut}
                    >
                      Sign Out
                    </Button>
                  </div>

                  <div className="relative">
                    <Textarea
                      label="Your Message"
                      placeholder="What's happening?"
                      variant="bordered"
                      className="w-full"
                      classNames={{
                        input: "text-lg h-32 py-2 outline-none",
                        label: "text-wedding-pink-600 font-semibold",
                        inputWrapper: "border-wedding-gold-100 hover:border-wedding-gold-300 focus-within:!border-wedding-pink-500 transition-colors",
                      }}
                      maxLength={300}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                    <div className={`absolute bottom-2 right-3 text-xs font-mono ${text.length >= 280 ? 'text-danger' : 'text-default-400'}`}>
                      {text.length}/300
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      variant="flat"
                      color="secondary"
                      size="sm"
                      className="w-fit self-end font-semibold bg-wedding-pink-50 dark:bg-wedding-pink-900/20 text-wedding-pink-600 dark:text-wedding-pink-400"
                      onPress={handleRefine}
                      isLoading={isRefining}
                      startContent={!isRefining && <span>✨</span>}
                    >
                      Refine with AI
                    </Button>

                    <Button
                      isLoading={loading}
                      color="danger"
                      size="lg"
                      className="w-full bg-gradient-to-r from-wedding-pink-500 to-wedding-gold-500 text-white font-bold shadow-lg hover:opacity-90 transition-opacity"
                      onPress={handleSave}
                      isDisabled={text.trim().length === 0 || isRefining}
                    >
                      Share Update
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center gap-6"
                >
                  <p className="text-default-600 dark:text-gray-400 text-center font-medium italic">
                    You need to be signed in to post updates to the timeline.
                  </p>
                  <div className="w-full border-2 border-dashed border-wedding-pink-100 dark:border-wedding-pink-900/30 rounded-2xl p-4 bg-default-50/50">
                    <Auth userSet={setUser} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardBody>
        </Card>
      </motion.div>

      {/* Helper links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex flex-wrap justify-center gap-4"
      >
        <Button
          as="a"
          href="/updates"
          variant="light"
          color="primary"
          className="text-wedding-pink-600 hover:text-wedding-pink-700"
        >
          View Public Feed →
        </Button>
      </motion.div>
    </div>
  );
};

export default UpdateMaker;
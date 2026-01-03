"use client";

import Image from "next/image";
import {
  Card,
  CardBody,
  Button,
  Snippet,
  Input,
  Textarea,
  Divider,
  Spinner,
  Avatar,
  addToast,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  limit,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";

import firebaseApp from "@/config/firebase";
import { fontCursive, fontSans, fontMono } from "@/config/fonts";
import { HeartFilledIcon, TrashIcon } from "@/components/icons";

const db = getFirestore(firebaseApp());

export default function SagunPage() {
  const [wishes, setWishes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    captcha: "",
  });
  const [sentiment, setSentiment] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [wishToDelete, setWishToDelete] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth(firebaseApp());
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const q = query(
      collection(db, "wishes"),
      orderBy("createdAt", "desc"),
      limit(20),
    );
    const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setWishes(data);
      setLoading(false);

      if (data.length >= 3) {
        generateSentimentSummary(data.slice(0, 10));
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeFirestore();
    };
  }, []);

  const handleDeleteWish = async () => {
    if (!wishToDelete) return;
    
    try {
      await deleteDoc(doc(db, "wishes", wishToDelete));
      addToast({
        title: "Wish Deleted",
        description: "The blessing has been removed.",
        color: "warning",
      });
      setWishToDelete(null);
    } catch (err) {
      console.error("Error deleting wish", err);
    }
  };

  const confirmDelete = (id: string) => {
    setWishToDelete(id);
    onOpen();
  };

  const generateSentimentSummary = async (recentWishes: any[]) => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) return;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a wedding storyteller. Summarize the following guest wishes into a single, beautiful, and poetic paragraph (max 250 characters) that captures the collective love and blessings for the couple. Output ONLY the paragraph in PLAIN TEXT.`,
                  },
                  {
                    text: `Wishes: ${recentWishes.map((w) => w.message).join(" | ")}`,
                  },
                ],
              },
            ],
            generationConfig: { temperature: 0.7, maxOutputTokens: 150 },
          }),
        },
      );
      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) setSentiment(text);
    } catch (err) {
      console.error("Sentiment error", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple Wedding-Themed Bot Protection
    if (formData.captcha.trim() !== "10") {
      addToast({
        title: "Security Check",
        description:
          "Please answer the question correctly (Hint: It is a number!).",
        color: "warning",
      });

      return;
    }

    if (!formData.name || !formData.message) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, "wishes"), {
        name: formData.name,
        message: formData.message,
        createdAt: serverTimestamp(),
      });
      setFormData({ name: "", message: "", captcha: "" });
      addToast({
        title: "Wish Sent",
        description: "Thank you for your beautiful blessings!",
        color: "success",
      });
    } catch (err) {
      console.error("Error adding wish", err);
      addToast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        color: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full pb-20">
      {/* Header */}
      <section className="relative py-16 md:py-24 text-center px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-wedding-pink-100/40 dark:bg-wedding-pink-900/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <HeartFilledIcon className="text-wedding-pink-500 w-10 h-10 mx-auto mb-6 animate-pulse" />
          <h1
            className={`${fontCursive.className} text-6xl md:text-7xl bg-gradient-to-r from-wedding-pink-600 to-wedding-gold-600 bg-clip-text text-transparent mb-6 py-4 leading-normal`}
          >
            Blessings & Sagun
          </h1>
          <p
            className={`${fontSans.className} text-lg md:text-xl text-default-600 dark:text-gray-100 leading-relaxed`}
          >
            Your love and presence are the greatest gifts we could ask for.
            Share your blessings and wishes with us as we begin our new journey
            together.
          </p>
        </div>
      </section>

      {/* QR & UPI Section */}
      <section className="container mx-auto px-4 max-w-5xl mb-24">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-wedding-gold-100 dark:border-wedding-gold-900/20 shadow-xl">
          {/* QR Card */}
          <div className="flex justify-center order-2 md:order-1">
            <Card className="w-full max-w-[280px] md:max-w-sm bg-white dark:bg-zinc-900 shadow-2xl border-4 border-wedding-gold-100 dark:border-wedding-gold-900/30 overflow-hidden">
              <CardBody className="p-6 md:p-8 flex flex-col items-center">
                <div className="relative w-48 h-48 md:w-64 md:h-64 bg-white p-2 rounded-xl shadow-inner">
                  <Image
                    fill
                    alt="Sagun QR Code"
                    className="object-contain rounded-lg"
                    src="/qr.png"
                  />
                </div>
                <div className="mt-4 md:mt-6 text-center">
                  <p
                    className={`${fontMono.className} text-xs md:text-sm text-default-400 uppercase tracking-[0.3em]`}
                  >
                    Scan to Bless
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* UPI Details */}
          <div className="text-center md:text-left space-y-6 md:space-y-8 order-1 md:order-2">
            <div>
              <h2
                className={`${fontCursive.className} text-4xl md:text-5xl text-wedding-gold-600 dark:text-wedding-gold-400 mb-2 md:mb-4`}
              >
                UPI Details
              </h2>
              <p className="text-default-600 dark:text-gray-200 mb-6 md:mb-8 text-base md:text-lg">
                You can use any UPI app to send your token of love directly.
              </p>

              <div className="flex flex-col items-center md:items-start gap-4 md:gap-6">
                <Snippet
                  className="bg-wedding-gold-50 dark:bg-wedding-gold-900/10 text-wedding-gold-700 dark:text-wedding-gold-400 font-mono text-base md:text-xl py-2 px-4 md:py-3 md:px-6 rounded-2xl border border-wedding-gold-100/50 max-w-full"
                  symbol=""
                >
                  your-upi-id@upi
                </Snippet>

                <Button
                  as="a"
                  className="bg-wedding-pink-500 text-white font-bold shadow-lg shadow-wedding-pink-500/30 hover:bg-wedding-pink-600 h-12 md:h-14 px-8 md:px-10 text-base md:text-lg rounded-full w-full md:w-auto"
                  href="upi://pay?pa=your-upi-id@upi&pn=Groom"
                  startContent={
                    <HeartFilledIcon className="w-5 h-5 md:w-6 md:h-6" />
                  }
                >
                  Open UPI App
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wishes Section */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Wish Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <h2
                className={`${fontCursive.className} text-5xl text-wedding-pink-600 dark:text-wedding-pink-400`}
              >
                Leave a Wish
              </h2>
              <p className="text-default-500 dark:text-default-400">
                Your words will be cherished forever. Write a small message for
                the couple.
              </p>
            </div>

            <Card className="p-6 bg-white dark:bg-zinc-900 border border-wedding-pink-100 dark:border-wedding-pink-900/30 shadow-xl">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <Input
                  isRequired
                  classNames={{
                    label: "text-wedding-pink-600 font-semibold",
                    inputWrapper:
                      "border-wedding-pink-100 focus-within:!border-wedding-pink-500",
                    input: "outline-none",
                  }}
                  label="Your Name"
                  labelPlacement="outside-top"
                  placeholder="E.g. Rahul & Priya"
                  value={formData.name}
                  variant="bordered"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <Textarea
                  isRequired
                  classNames={{
                    label: "text-wedding-pink-600 font-semibold",
                    input: "outline-none p-2",
                    inputWrapper:
                      "border-wedding-pink-100 focus-within:!border-wedding-pink-500 h-32",
                  }}
                  label="Message"
                  labelPlacement="outside-top"
                  placeholder="Share your love and blessings..."
                  value={formData.message}
                  variant="bordered"
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />

                {/* Bot Protection */}
                <div className="p-4 bg-wedding-pink-50 dark:bg-wedding-pink-900/10 rounded-xl border border-wedding-pink-100 dark:border-wedding-pink-800/30">
                  <p className="text-xs font-bold text-wedding-pink-600 dark:text-wedding-pink-400 uppercase tracking-widest mb-2">
                    Security Question
                  </p>
                  <Input
                    isRequired
                    classNames={{
                      label: "text-default-600 text-xs",
                      input: "text-center font-bold outline-none",
                    }}
                    label="How many years have we been together?"
                    labelPlacement="outside-top"
                    placeholder="Enter the number"
                    value={formData.captcha}
                    variant="underlined"
                    onChange={(e) =>
                      setFormData({ ...formData, captcha: e.target.value })
                    }
                  />
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-wedding-pink-500 to-wedding-gold-500 text-white font-bold h-12"
                  isLoading={submitting}
                  type="submit"
                >
                  Send Blessing
                </Button>
              </form>
            </Card>
          </div>

          {/* Sentiment Wall & Feed */}
          <div className="lg:col-span-3 space-y-12">
            {/* AI Sentiment Wall */}
            <AnimatePresence>
              {sentiment && (
                <motion.div
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative p-8 rounded-[32px] overflow-hidden group"
                  initial={{ opacity: 0, scale: 0.9 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-wedding-pink-50 to-wedding-gold-50 dark:from-wedding-pink-900/20 dark:to-wedding-gold-900/20" />

                  <div className="relative z-10 space-y-4 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3">
                      <span className="p-2 bg-white dark:bg-zinc-800 rounded-full shadow-sm">
                        ✨
                      </span>
                      <h3
                        className={`${fontMono.className} text-xs uppercase tracking-[0.4em] text-wedding-gold-600 font-black`}
                      >
                        A Collective Blessing
                      </h3>
                    </div>
                    <p
                      className={`${fontCursive.className} text-3xl md:text-4xl text-default-800 dark:text-white leading-snug`}
                    >
                      {sentiment}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Wishes Feed */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3
                  className={`${fontSans.className} text-xl font-bold text-default-800 dark:text-white`}
                >
                  Recent Wishes
                </h3>
                <span className="text-xs font-mono text-default-400 bg-default-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
                  {wishes.length} Blessings
                </span>
              </div>

              <Divider className="opacity-50" />

              <div className="grid gap-6">
                {loading ? (
                  <div className="flex justify-center py-10">
                    <Spinner color="danger" />
                  </div>
                ) : wishes.length === 0 ? (
                  <p className="text-center py-10 text-default-400 italic">
                    No wishes yet. Be the first to bless the couple!
                  </p>
                ) : (
                  wishes.map((wish, i) => (
                    <motion.div
                      key={wish.id}
                      animate={{ opacity: 1, x: 0 }}
                      initial={{ opacity: 0, x: 20 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm border border-default-100 dark:border-zinc-800/50 hover:border-wedding-pink-200 transition-colors group relative">
                        <CardBody className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar
                              className="bg-wedding-pink-100 text-wedding-pink-600 font-bold flex-shrink-0"
                              name={wish.name}
                            />
                            <div className="space-y-1 flex-grow">
                              <p className="font-bold text-default-900 dark:text-white">
                                {wish.name}
                              </p>
                              <p className="text-default-600 dark:text-gray-100 italic">
                                &quot;{wish.message}&quot;
                              </p>
                            </div>
                            
                            {user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                color="danger"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => confirmDelete(wish.id)}
                              >
                                <TrashIcon size={18} />
                              </Button>
                            )}
                          </div>
                        </CardBody>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-danger">
                Delete Blessing?
              </ModalHeader>
              <ModalBody>
                <p className="text-default-600">
                  Are you sure you want to remove this beautiful blessing? This action cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Keep it
                </Button>
                <Button 
                  color="danger" 
                  onPress={() => {
                    handleDeleteWish();
                    onClose();
                  }}
                >
                  Delete Forever
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

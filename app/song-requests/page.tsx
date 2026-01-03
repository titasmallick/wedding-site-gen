"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardBody,
  Input,
  Button,
  addToast,
  Divider,
  Spinner,
  Chip,
  Tooltip,
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import firebaseApp from "@/config/firebase";
import { fontCursive, fontSans, fontMono } from "@/config/fonts";
import { HeartFilledIcon } from "@/components/icons";

const db = getFirestore(firebaseApp());
const auth = getAuth(firebaseApp());

export default function SongRequestsPage() {
  const [formData, setFormData] = useState({
    name: "",
    song: "",
    artist: "",
    captcha: "",
  });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [listLoading, setListLoading] = useState(true);

  // Delete Confirmation States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "song_requests"),
      orderBy("createdAt", "desc"),
    );
    const unsubscribeData = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRequests(data);
      setListLoading(false);
    });

    return () => unsubscribeData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.captcha.trim() !== "10") {
      addToast({
        title: "Security Check",
        description: "Please answer the question correctly (Hint: 10 years!).",
        color: "warning",
      });

      return;
    }

    if (!formData.name || !formData.song) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "song_requests"), {
        ...formData,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setFormData({ name: "", song: "", artist: "", captcha: "" });
      addToast({
        title: "Song Requested!",
        description:
          "We'll try our best to play your favorite track at the Reception.",
        color: "success",
      });
    } catch (err) {
      console.error("Song request error", err);
      addToast({
        title: "Error",
        description: "Could not save your request. Please try again.",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setRequestToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!requestToDelete) return;
    try {
      await deleteDoc(doc(db, "song_requests", requestToDelete));
      addToast({
        title: "Deleted",
        description: "Request removed.",
        color: "success",
      });
    } catch (err) {
      addToast({ title: "Error", color: "danger" });
    } finally {
      setIsDeleteModalOpen(false);
      setRequestToDelete(null);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      await updateDoc(doc(db, "song_requests", id), {
        status: currentStatus === "played" ? "pending" : "played",
      });
      addToast({ title: "Status Updated", color: "success" });
    } catch (err) {
      addToast({ title: "Error", color: "danger" });
    }
  };

  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  return (
    <div className="min-h-screen pb-20 pt-10 px-4 max-w-6xl mx-auto flex flex-col items-center">
      {/* Header */}
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 mb-12"
        initial={{ opacity: 0, scale: 0.95 }}
      >
        <div className="bg-wedding-pink-100 dark:bg-wedding-pink-900/30 p-4 rounded-full w-fit mx-auto">
          <svg
            className="text-wedding-pink-500"
            fill="none"
            height="32"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="32"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>
        <h1
          className={`${fontCursive.className} text-5xl md:text-7xl text-wedding-pink-600 dark:text-wedding-pink-400 py-2`}
        >
          Reception Playlist
        </h1>
        <p className="text-default-500 max-w-xl mx-auto italic">
          &quot;Music is the soul of our celebration. Tell us which song makes
          you want to hit the dance floor!&quot;
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12 w-full items-start">
        {/* Left: Request Form */}
        <Card className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-wedding-gold-200 dark:border-wedding-gold-800 shadow-2xl p-6 md:p-8 rounded-[40px]">
          <h2
            className={`${fontSans.className} text-2xl font-bold mb-6 text-default-800 dark:text-white`}
          >
            Request a Song
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              isRequired
              classNames={{
                label: "text-wedding-pink-600 font-bold",
                input: "outline-none",
                inputWrapper:
                  "border-wedding-pink-100 focus-within:!border-wedding-pink-500 h-14",
              }}
              label="Your Name"
              labelPlacement="outside-top"
              placeholder="Who are we dancing with?"
              value={formData.name}
              variant="bordered"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                isRequired
                classNames={{
                  label: "text-wedding-pink-600 font-bold",
                  input: "outline-none",
                  inputWrapper:
                    "border-wedding-pink-100 focus-within:!border-wedding-pink-500 h-14",
                }}
                label="Song Title"
                labelPlacement="outside-top"
                placeholder="E.g. Kesariya"
                value={formData.song}
                variant="bordered"
                onChange={(e) =>
                  setFormData({ ...formData, song: e.target.value })
                }
              />
              <Input
                classNames={{
                  label: "text-wedding-pink-600 font-bold",
                  input: "outline-none",
                  inputWrapper:
                    "border-wedding-pink-100 focus-within:!border-wedding-pink-500 h-14",
                }}
                label="Artist (Optional)"
                labelPlacement="outside-top"
                placeholder="E.g. Arijit Singh"
                value={formData.artist}
                variant="bordered"
                onChange={(e) =>
                  setFormData({ ...formData, artist: e.target.value })
                }
              />
            </div>

            <Divider className="opacity-50" />

            <div className="p-4 bg-wedding-pink-50 dark:bg-wedding-pink-900/10 rounded-2xl border border-wedding-pink-100 dark:border-wedding-pink-800/30">
              <p className="text-[10px] font-bold text-wedding-pink-600 dark:text-wedding-pink-400 uppercase tracking-widest mb-2">
                Bot Protection
              </p>
              <Input
                isRequired
                classNames={{
                  label: "text-default-600 text-xs",
                  input: "text-center font-bold text-xl outline-none",
                }}
                label="How many years have we been together?"
                labelPlacement="outside-top"
                placeholder="Answer in numbers"
                value={formData.captcha}
                variant="underlined"
                onChange={(e) =>
                  setFormData({ ...formData, captcha: e.target.value })
                }
              />
            </div>

            <Button
              className="w-full bg-gradient-to-r from-wedding-pink-500 to-wedding-gold-500 text-white font-black h-14 text-lg shadow-xl shadow-wedding-pink-500/20"
              isLoading={loading}
              type="submit"
            >
              Submit Song Request
            </Button>
          </form>
        </Card>

        {/* Right: Requests Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2
              className={`${fontSans.className} text-2xl font-bold text-default-800 dark:text-white`}
            >
              The Queue
            </h2>
            <Chip
              className={fontMono.className}
              color="secondary"
              size="sm"
              variant="flat"
            >
              {requests.length} Total
            </Chip>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {listLoading ? (
              <div className="flex justify-center py-10">
                <Spinner color="danger" />
              </div>
            ) : requests.length === 0 ? (
              <p className="text-center py-10 text-default-400 italic font-medium bg-default-50 dark:bg-zinc-900/30 rounded-3xl border border-dashed border-default-200">
                The playlist is waiting for your touch!
              </p>
            ) : (
              <AnimatePresence>
                {requests.map((item, i) => (
                  <motion.div
                    key={item.id}
                    animate={{ opacity: 1, x: 0 }}
                    initial={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card
                      className={`border ${item.status === "played" ? "bg-default-50/50 dark:bg-zinc-900/20 opacity-60" : "bg-white dark:bg-zinc-900 shadow-lg"} transition-all`}
                    >
                      <CardBody className="p-4 flex flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 overflow-hidden">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${item.status === "played" ? "bg-green-100 text-green-600" : "bg-wedding-pink-100 text-wedding-pink-600"}`}
                          >
                            {item.status === "played" ? (
                              <svg
                                fill="none"
                                height="20"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                viewBox="0 0 24 24"
                                width="20"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : (
                              <svg
                                fill="none"
                                height="20"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                                width="20"
                              >
                                <path d="M9 18V5l12-2v13" />
                                <circle cx="6" cy="18" r="3" />
                              </svg>
                            )}
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <p
                              className={`font-bold truncate ${item.status === "played" ? "line-through text-default-400" : "text-default-800 dark:text-white"}`}
                            >
                              {item.song}
                            </p>
                            <p className="text-xs text-default-500 truncate italic">
                              {item.artist || "Unknown Artist"} • Requested by{" "}
                              {item.name}
                            </p>
                          </div>
                        </div>

                        {isAdmin && (
                          <div className="flex gap-1">
                            <Tooltip
                              content={
                                item.status === "played"
                                  ? "Mark Pending"
                                  : "Mark Played"
                              }
                            >
                              <Button
                                isIconOnly
                                color={
                                  item.status === "played"
                                    ? "warning"
                                    : "success"
                                }
                                size="sm"
                                variant="flat"
                                onPress={() =>
                                  toggleStatus(item.id, item.status)
                                }
                              >
                                {item.status === "played" ? "↺" : "✓"}
                              </Button>
                            </Tooltip>
                            <Tooltip content="Delete">
                              <Button
                                isIconOnly
                                color="danger"
                                size="sm"
                                variant="flat"
                                onPress={() => handleDeleteClick(item.id)}
                              >
                                ✕
                              </Button>
                            </Tooltip>
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      <div className="mt-16 text-center text-default-400 space-y-2">
        <HeartFilledIcon className="w-6 h-6 mx-auto text-wedding-pink-200" />
        <p
          className={`${fontMono.className} text-[10px] uppercase tracking-widest`}
        >
          Let the music play
        </p>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        backdrop="blur"
        className="dark:bg-zinc-900 border border-default-100 dark:border-zinc-800"
        isOpen={isDeleteModalOpen}
        size="xs"
        onOpenChange={setIsDeleteModalOpen}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="pt-8 pb-4 text-center space-y-4">
                <div className="w-16 h-16 bg-danger-50 dark:bg-danger-900/20 rounded-full flex items-center justify-center mx-auto text-danger animate-bounce">
                  <svg
                    fill="none"
                    height="32"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="32"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-default-900 dark:text-white">
                    Delete Request?
                  </h3>
                  <p className="text-sm text-default-500 mt-2">
                    Are you sure you want to remove this song from the queue?
                  </p>
                </div>
              </ModalBody>
              <ModalFooter className="flex-col gap-2 pb-8">
                <Button
                  className="w-full font-bold h-12"
                  color="danger"
                  onPress={handleConfirmDelete}
                >
                  Yes, Remove Request
                </Button>
                <Button
                  className="w-full font-semibold h-12"
                  variant="flat"
                  onPress={onClose}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

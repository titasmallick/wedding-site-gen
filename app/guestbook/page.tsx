"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardBody,
  Button,
  Input,
  Image,
  addToast,
  Spinner,
  Divider,
  Avatar,
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc,
  vector,
  getDocs,
  where,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import firebaseApp from "@/config/firebase";
import { fontCursive, fontSans } from "@/config/fonts";
import FaceRecognition from "@/app/guestbook/components/FaceRecognition";

const db = getFirestore(firebaseApp());
const auth = getAuth(firebaseApp());

// --- CLOUDINARY CONFIGURATION ---
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
// ---------------------------------

const timeAgo = (timestamp: any) => {
  if (!timestamp?.toDate) return "Just now";
  const now = new Date();
  const diff = (now.getTime() - timestamp.toDate().getTime()) / 1000;

  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

  return `${Math.floor(diff / 86400)}d ago`;
};

export default function GuestbookPage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    file: null as File | null,
    captcha: "",
  });
  const [faceData, setFaceData] = useState<any[]>([]);
  const [isDetecting, setIsDetecting] = useState<boolean | string>(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<any>(null);

  // Delete Confirmation States
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribeAuth();
  }, []);

  const handleDeleteClick = (id: string) => {
    setImageToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!imageToDelete) return;

    // Find the photo object to get the URL
    const photo = photos.find((p) => p.id === imageToDelete);
    if (!photo) return;

    try {
      // 1. Delete from Guestbook Collection
      await deleteDoc(doc(db, "guestbook", imageToDelete));

      // 2. Delete from Facedata Collection (all faces associated with this photo)
      const q = query(collection(db, "facedata"), where("imageUrl", "==", photo.imageUrl));
      const querySnapshot = await getDocs(q);

      const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      addToast({
        title: "Deleted",
        description: "Memory and associated face data removed.",
        color: "success",
      });
    } catch (err) {
      console.error("Delete error:", err);
      addToast({
        title: "Error",
        description: "Failed to delete completely.",
        color: "danger",
      });
    } finally {
      setIsConfirmOpen(false);
      setImageToDelete(null);
    }
  };

  const resizeImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();

        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");

          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
            },
            "image/jpeg",
            0.7, // Compression quality
          );
        };
      };
    });
  };

  const openLightbox = (image: any) => {
    setSelectedImage(image);
    onOpen();
  };

  useEffect(() => {
    const q = query(collection(db, "guestbook"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setPhotos(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file || !formData.name) return;

    // Bot Protection
    if (formData.captcha.trim() !== "10") {
      addToast({
        title: "Security Check",
        description: "Please answer the question correctly (Hint: 10 years!).",
        color: "warning",
      });

      return;
    }

    setUploading(true);
    try {
      // 1. Resize and compress image
      setUploadStatus("Resizing Photo...");
      const resizedBlob = await resizeImage(formData.file);

      // 2. Upload to Cloudinary
      setUploadStatus("Uploading to Cloud...");
      const data = new FormData();

      data.append("file", resizedBlob, "upload.jpg");
      data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET!);

      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: data,
      });
      const file = await res.json();

      if (file.secure_url) {
        // 2. Save URL to Firestore
        setUploadStatus("Saving Memory...");
        await addDoc(collection(db, "guestbook"), {
          name: formData.name,
          imageUrl: file.secure_url,
          createdAt: serverTimestamp(),
        });

        // 3. Save Face Data to Firestore (One document per face for Vector Search)
        if (faceData.length > 0) {
          setUploadStatus("Finalizing Face Data...");
          const facePromises = faceData.map((face) => {
            return addDoc(collection(db, "facedata"), {
              photoId: file.secure_url, // Using URL as ID linkage for simplicity, or we could use the doc ref id from above if we awaited it
              imageUrl: file.secure_url,
              name: formData.name,
              createdAt: serverTimestamp(),
              embedding: vector(face.descriptor), // Top-level vector field
              descriptor: face.descriptor, // Backup raw array
              metadata: {
                detectionScore: face.detection.score,
                // other metadata if needed
              },
            });
          });

          await Promise.all(facePromises);
        }

        addToast({
          title: "Memory Shared!",
          description: "Your photo has been added to our guestbook.",
          color: "success",
        });
        setFormData({ name: "", file: null, captcha: "" });
        setFaceData([]);
      }
    } catch (err) {
      console.error("Upload error", err);
      addToast({
        title: "Upload Failed",
        description: "Something went wrong. Please try again.",
        color: "danger",
      });
    } finally {
      setUploading(false);
      setUploadStatus("");
    }
  };

  return (
    <div className="min-h-screen pb-20 pt-10 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <section className="text-center mb-16 space-y-4">
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="bg-wedding-pink-50 dark:bg-wedding-pink-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
        >
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
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </motion.div>
        <h1
          className={`${fontCursive.className} text-5xl md:text-7xl text-wedding-pink-600 dark:text-wedding-pink-400 py-2`}
        >
          Digital Guestbook
        </h1>
        <p className="text-default-500 max-w-xl mx-auto">
          Capture a moment and share it with us! Upload a selfie or a memory to
          be part of our wedding gallery forever.
        </p>
        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <Button
            as="a"
            className="bg-wedding-pink-100 text-wedding-pink-600 dark:bg-wedding-pink-900/30 dark:text-wedding-pink-300 font-bold"
            href="/guestbook/search"
            startContent={
              <svg
                fill="none"
                height="18"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="18"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" x2="16.65" y1="21" y2="16.65" />
              </svg>
            }
            variant="flat"
          >
            Find My Photos
          </Button>

          {user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
            <Button
              as="a"
              className="bg-default-100 text-default-600 dark:bg-zinc-800 dark:text-default-400 font-bold"
              href="/guestbook/bulkupload"
              startContent={
                <svg
                  fill="none"
                  height="18"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="18"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" x2="12" y1="3" y2="15" />
                </svg>
              }
              variant="flat"
            >
              Bulk Upload
            </Button>
          )}
        </div>
      </section>

      {/* Upload Section */}
      <Card className="max-w-xl mx-auto mb-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-wedding-gold-200 dark:border-wedding-gold-800 p-8 rounded-[40px] shadow-2xl">
        <form className="space-y-6" onSubmit={handleUpload}>
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
            placeholder="Who's behind the camera?"
            value={formData.name}
            variant="bordered"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="relative">
            <input
              accept="image/*"
              className="hidden"
              id="photo-upload"
              multiple={false}
              type="file"
              onChange={handleFileChange}
            />
            <input
              accept="image/*"
              capture="user"
              className="hidden"
              id="camera-upload"
              multiple={false}
              type="file"
              onChange={handleFileChange}
            />
            {formData.file ? (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="relative">
                  <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-wedding-pink-500 shadow-xl">
                    <img
                      alt="Upload Preview"
                      className="object-cover w-full h-full"
                      src={URL.createObjectURL(formData.file)}
                    />
                  </div>
                  <Button
                    isIconOnly
                    className="absolute -bottom-2 -right-2 rounded-full shadow-lg bg-danger text-white z-10"
                    size="sm"
                    onPress={() => {
                      setFormData({ ...formData, file: null });
                      setFaceData([]);
                    }}
                  >
                    <svg
                      fill="none"
                      height="16"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="16"
                    >
                      <line x1="18" x2="6" y1="6" y2="18" />
                      <line x1="6" x2="18" y1="6" y2="18" />
                    </svg>
                  </Button>
                </div>
                <p className="text-xs text-default-400 font-medium">
                  {formData.file.name}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 w-full">
                {/* Take Selfie - Mobile Only */}
                <Button
                  className="md:hidden w-full h-32 flex-col gap-2 bg-gradient-to-br from-wedding-pink-50 to-white dark:from-wedding-pink-900/20 dark:to-zinc-900 border-2 border-dashed border-wedding-pink-200 dark:border-wedding-pink-900/30 rounded-2xl transition-all group hover:border-wedding-pink-400"
                  variant="flat"
                  onPress={() => document.getElementById("camera-upload")?.click()}
                >
                  <svg
                    className="text-wedding-pink-400 group-hover:scale-110 transition-transform"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <span className="text-xs text-default-600 font-bold uppercase tracking-wider">
                    Take Selfie
                  </span>
                </Button>

                {/* From Gallery - Desktop version (Big Button) */}
                <Button
                  className="hidden md:flex w-full h-32 flex-col gap-2 bg-gradient-to-br from-wedding-pink-50 to-white dark:from-wedding-pink-900/20 dark:to-zinc-900 border-2 border-dashed border-wedding-pink-200 dark:border-wedding-pink-900/30 rounded-2xl transition-all group hover:border-wedding-pink-400"
                  variant="flat"
                  onPress={() => document.getElementById("photo-upload")?.click()}
                >
                  <svg
                    className="text-wedding-pink-400 group-hover:scale-110 transition-transform"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <rect height="18" rx="2" ry="2" width="18" x="3" y="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="text-xs text-default-600 font-bold uppercase tracking-wider">
                    Choose from Gallery
                  </span>
                </Button>

                {/* From Gallery - Mobile version (Text link) */}
                <button
                  className="md:hidden text-xs text-default-400 hover:text-wedding-pink-500 underline transition-colors py-2"
                  type="button"
                  onClick={() => document.getElementById("photo-upload")?.click()}
                >
                  Or upload from gallery
                </button>
              </div>
            )}
          </div>

          <div className="p-4 bg-wedding-pink-50 dark:bg-wedding-pink-900/10 rounded-2xl border border-wedding-pink-100 dark:border-wedding-pink-800/30">
            <p className="text-xs font-bold text-wedding-pink-600 dark:text-wedding-pink-400 uppercase tracking-widest mb-2">
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

          {!isDetecting && formData.file && faceData.length === 0 && (
            <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                ⚠️ No face detected. This photo won&apos;t be found via selfie
                search.
              </p>
            </div>
          )}

          <Button
            className="w-full bg-gradient-to-r from-wedding-pink-500 to-wedding-gold-500 text-white font-black h-14 text-lg rounded-full"
            isDisabled={!formData.file || !formData.name || !!isDetecting || uploading}
            type="submit"
          >
            {isDetecting || uploading ? (
              <div className="flex items-center gap-2">
                <Spinner color="white" size="sm" />
                <span>
                  {uploading
                    ? uploadStatus
                    : typeof isDetecting === "string"
                      ? isDetecting
                      : "Scanning for Faces..."}
                </span>
              </div>
            ) : (
              "Share Memory"
            )}
          </Button>
        </form>
      </Card>

      <Divider className="mb-16 opacity-50" />

      <FaceRecognition
        file={formData.file}
        onFacesDetected={setFaceData}
        onProcessingStatus={setIsDetecting}
      />

      {/* Photos Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        <AnimatePresence>
          {loading ? (
            <div className="col-span-full flex justify-center py-20">
              <Spinner color="danger" />
            </div>
          ) : (
            photos.map((photo, i) => (
              <motion.div
                key={photo.id}
                animate={{ opacity: 1, scale: 1 }}
                className="break-inside-avoid"
                initial={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className="border-none shadow-md bg-white dark:bg-zinc-900 rounded-[24px] overflow-hidden relative cursor-pointer group active:scale-[0.98] transition-transform"
                  onClick={(e) => {
                    // Only open lightbox if NOT clicking the delete button
                    if (!(e.target as HTMLElement).closest(".delete-btn")) {
                      openLightbox(photo);
                    }
                  }}
                >
                  <CardBody className="p-0">
                    <Image
                      removeWrapper
                      alt={`Memory by ${photo.name}`}
                      className="w-full h-auto object-cover z-0"
                      radius="none"
                      src={photo.imageUrl}
                    />

                    {/* Expand Icon Indicator */}
                    <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        isIconOnly
                        className="bg-black/60 backdrop-blur-md rounded-full border border-white/20 text-white min-w-0 h-8 w-8"
                        size="sm"
                        variant="flat"
                        onPress={() => openLightbox(photo)}
                      >
                        <svg
                          fill="none"
                          height="16"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                          width="16"
                        >
                          <polyline points="15 3 21 3 21 9" />
                          <polyline points="9 21 3 21 3 15" />
                          <line x1="21" x2="14" y1="3" y2="10" />
                          <line x1="3" x2="10" y1="21" y2="14" />
                        </svg>
                      </Button>
                    </div>

                    {/* Info Overlay */}
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 flex items-end justify-between">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <Avatar
                            className="w-6 h-6 text-[10px] bg-wedding-pink-500 text-white font-bold"      
                            name={photo.name}
                            size="sm"
                          />
                          <p className="text-white text-xs font-black tracking-tight truncate">
                            {photo.name}
                          </p>
                        </div>
                        <p className="text-white/80 text-[9px] font-mono ml-8 uppercase tracking-wider">  
                          {timeAgo(photo.createdAt)}
                        </p>
                      </div>

                      {/* Admin Delete Button */}
                      {user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                        <Button
                          isIconOnly
                          className="min-w-0 p-0 h-auto delete-btn"
                          color="danger"
                          size="sm"
                          variant="light"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(photo.id);
                          }}
                        >
                          <svg
                            fill="none"
                            height="14"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                            width="14"
                          >
                            <polyline points="3 6 5 3 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </Button>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox Modal */}
      <Modal
        backdrop="blur"
        classNames={{
          wrapper: "z-[200]",
          backdrop: "bg-black/80 backdrop-blur-md",
          base: "bg-transparent shadow-none border-none",
          closeButton:
            "hover:bg-white/20 active:bg-white/10 text-white text-2xl z-50",
        }}
        isOpen={isOpen}
        size="full"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <ModalBody
              className="p-4 flex items-center justify-center h-screen w-screen overflow-hidden cursor-pointer"
              onClick={onClose}
            >
              {selectedImage && (
                <motion.div
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative flex flex-col items-center max-w-full max-h-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                >
                  <Image
                    alt={`Memory by ${selectedImage.name}`}
                    className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl"
                    src={selectedImage.imageUrl}
                  />
                  <div className="mt-6 bg-black/60 backdrop-blur-md px-8 py-3 rounded-full border border-white/20">
                    <p
                      className={`${fontSans.className} text-white text-base md:text-lg font-bold`}       
                    >
                      Memory by {selectedImage.name}
                    </p>
                  </div>
                </motion.div>
              )}
            </ModalBody>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        backdrop="blur"
        className="dark:bg-zinc-900 border border-default-100 dark:border-zinc-800"
        isOpen={isConfirmOpen}
        size="xs"
        onOpenChange={setIsConfirmOpen}
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
                    Delete Memory?
                  </h3>
                  <p className="text-sm text-default-500 mt-2">
                    This action cannot be undone. This memory will be gone
                    forever.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter className="flex-col gap-2 pb-8">
                <Button
                  className="w-full font-bold h-12"
                  color="danger"
                  onPress={handleConfirmDelete}
                >
                  Yes, Delete Forever
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

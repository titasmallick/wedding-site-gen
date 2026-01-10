"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardBody,
  Button,
  Image,
  addToast,
  Spinner,
  Divider,
  Avatar,
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import firebaseApp from "@/config/firebase";
import { fontCursive, fontSans } from "@/config/fonts";
import FaceRecognition from "@/app/guestbook/components/FaceRecognition";

const db = getFirestore(firebaseApp());

// --- UTILS ---
const timeAgo = (timestamp: any) => {
  if (!timestamp?.toDate) return "Just now";
  const now = new Date();
  const diff = (now.getTime() - timestamp.toDate().getTime()) / 1000;

  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

  return `${Math.floor(diff / 86400)}d ago`;
};

// Euclidean Distance for FaceAPI (Standard metric)
// Threshold typically < 0.6 for a match
const euclideanDistance = (a: number[], b: number[]) => {
  if (a.length !== b.length) return 100; // Mismatch dimension

  return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
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

export default function GuestbookSearchPage() {
  const [allPhotos, setAllPhotos] = useState<any[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState<string | boolean>(false);

  const [searchFile, setSearchFile] = useState<File | null>(null);
  const [faceData, setFaceData] = useState<any[] | null>(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<any>(null);

  // Load all photos with face data initially
  useEffect(() => {
    const q = query(collection(db, "facedata"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched faces from Firestore:", data.length);

        setAllPhotos(data);
        if (!searchFile) {
          // Deduplicate by photoId/imageUrl for initial view
          const uniquePhotos = Array.from(
            new Map(data.map((item: any) => [item.photoId || item.imageUrl, item])).values()
          );
          console.log(`Initial View: Deduplicated ${data.length} faces to ${uniquePhotos.length} photos.`);
          setFilteredPhotos(uniquePhotos);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching facedata:", error);
        addToast({
          title: "Database Error",
          description: "Could not load photos. Check console for details.",
          color: "danger",
        });
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [searchFile]);

  // Handle Face Detection & Search
  useEffect(() => {
    if (faceData !== null && searchFile) {
      performSearch(faceData);
    }
  }, [faceData, searchFile]);

  const performSearch = async (queryFaces: any[]) => {
    setSearching(true);
    try {
      if (!queryFaces || queryFaces.length === 0) {
        addToast({
          title: "No face detected",
          description: "Try another photo.",
          color: "warning",
        });
        setSearching(false);
        setFilteredPhotos([]);

        return;
      }

      // Use the first detected face as the query vector
      const queryDescriptor = queryFaces[0].descriptor;

      console.log("Starting search. Total photos in DB:", allPhotos.length);

      // --- CLIENT-SIDE SEARCH ---
      // We already have all face data in 'allPhotos'
      const results = allPhotos.map((photo) => {
        let targetVector = photo.descriptor || photo.embedding;

        // Handle Firestore vector object format if present
        if (
          targetVector &&
          typeof targetVector === "object" &&
          !Array.isArray(targetVector)
        ) {
          if ("values" in targetVector) {
            targetVector = targetVector.values;
          } else if ("_values" in targetVector) {
            targetVector = targetVector._values;
          } else if (
            "toArray" in targetVector &&
            typeof targetVector.toArray === "function"
          ) {
            targetVector = targetVector.toArray();
          }
        }

        // Convert to array if it's not already (Firestore arrays)
        const targetArray = Array.isArray(targetVector) ? targetVector : [];

        // Calculate Distance
        // If no vector, return high distance
        const distance =
          targetArray.length > 0
            ? euclideanDistance(queryDescriptor, targetArray)
            : 100;

        return { ...photo, distance };
      });

      // Filter by threshold (Lower is better for Euclidean)
      // Standard FaceAPI threshold is around 0.6
      const MATCH_THRESHOLD = 0.6;
      const matches = results.filter(
        (photo) => photo.distance < MATCH_THRESHOLD,
      );

      console.log(
        `Found ${matches.length} matches below threshold ${MATCH_THRESHOLD}`,
      );

      // Sort by distance (asc)
      matches.sort((a, b) => a.distance - b.distance);

      // Deduplicate by photo URL, keeping the best match (first one)
      const uniqueMap = new Map();
      matches.forEach((item) => {
        const key = item.photoId || item.imageUrl;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, item);
        }
      });
      const uniqueResults = Array.from(uniqueMap.values());

      setFilteredPhotos(uniqueResults);

      if (uniqueResults.length === 0) {
        addToast({
          title: "No matches found",
          description: "We couldn't find anyone looking like this.",
          color: "default",
        });
      } else {
        addToast({
          title: "Found matches!",
          description: `Found ${uniqueResults.length} photos.`,
          color: "success",
        });
      }
    } catch (err: any) {
      console.error("Search error", err);
      addToast({
        title: "Search failed",
        description: "Something went wrong.",
        color: "danger",
      });
    } finally {
      setSearching(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSearching(true); // Indicate loading immediately
      setFaceData(null); // Reset face data
      setFilteredPhotos([]); // Clear previous results while scanning

      const originalFile = e.target.files[0];
      try {
        const resizedBlob = await resizeImage(originalFile);
        const resizedFile = new File([resizedBlob], originalFile.name, {
          type: "image/jpeg",
        });
        setSearchFile(resizedFile);
      } catch (err) {
        console.error("Resize error", err);
        // Fallback to original if resize fails
        setSearchFile(originalFile);
      }
    }
  };

  const openLightbox = (image: any) => {
    setSelectedImage(image);
    onOpen();
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
            <circle cx="11" cy="11" r="8" />
            <line x1="21" x2="16.65" y1="21" y2="16.65" />
          </svg>
        </motion.div>
        <h1
          className={`${fontCursive.className} text-5xl md:text-7xl text-wedding-pink-600 dark:text-wedding-pink-400 py-2`}
        >
          Find Your Photos
        </h1>
        <p className="text-default-500 max-w-xl mx-auto">
          Upload a selfie to instantly find photos you&apos;re in! We use AI
          face matching to search the guestbook.
        </p>
      </section>

      {/* Search Input Section */}
      <Card className="max-w-xl mx-auto mb-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-wedding-gold-200 dark:border-wedding-gold-800 p-8 rounded-[40px] shadow-2xl">
        <div className="space-y-6">
          <div className="relative">
            <input
              accept="image/*"
              className="hidden"
              id="search-upload"
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
            {searchFile ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="relative">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-wedding-pink-500 shadow-xl">
                    <img
                      alt="Search Preview"
                      className="object-cover w-full h-full"
                      src={URL.createObjectURL(searchFile)}
                    />
                  </div>
                  <Button
                    isIconOnly
                    className="absolute -bottom-2 -right-2 rounded-full shadow-lg bg-danger text-white z-10"
                    size="sm"
                    onPress={() => {
                      setSearchFile(null);
                      setFaceData(null);
                      setSearchStatus(false);
                      // Deduplicate allPhotos for reset view
                      const uniquePhotos = Array.from(
                        new Map(allPhotos.map((item) => [item.photoId || item.imageUrl, item])).values()  
                      );
                      setFilteredPhotos(uniquePhotos);
                      setSearching(false);
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
                <div className="text-center">
                  <p className="text-wedding-pink-600 font-bold text-lg">
                    {searchStatus
                      ? searchStatus
                      : searching
                        ? "Searching Gallery..."
                        : filteredPhotos.length > 0
                          ? "Found You!"
                          : "No Matches"}
                  </p>
                  <p className="text-default-400 text-xs">
                    {searchStatus || searching
                      ? "Finding your best angles"
                      : filteredPhotos.length > 0
                        ? `Found ${filteredPhotos.length} photos`
                        : "Try a different photo"}
                  </p>
                </div>
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
                  onPress={() => document.getElementById("search-upload")?.click()}
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
                  onClick={() => document.getElementById("search-upload")?.click()}
                >
                  Or upload from gallery
                </button>
              </div>
            )}
          </div>

          {(searching || searchStatus) && (
            <div className="text-center text-sm text-default-400 animate-pulse">
              {searchStatus || "Matching faces against guestbook..."}
            </div>
          )}
        </div>
      </Card>

      <Divider className="mb-16 opacity-50" />

      {/* Logic Component (Hidden) */}
      <FaceRecognition
        file={searchFile}
        onFacesDetected={setFaceData}
        onProcessingStatus={setSearchStatus}
      />

      {/* Results Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        <AnimatePresence>
          {loading ? (
            <div className="col-span-full flex justify-center py-20">
              <Spinner color="danger" />
            </div>
          ) : allPhotos.length === 0 ? (
            <div className="col-span-full text-center py-10 space-y-4">
              <p className="text-default-400 text-lg">
                The photo gallery is empty.
              </p>
              <Button
                as="a"
                className="bg-wedding-pink-500 text-white font-bold"
                href="/guestbook"
              >
                Go to Guestbook to Upload
              </Button>
            </div>
          ) : filteredPhotos.length === 0 && !searching ? (
            <div className="col-span-full text-center py-10 text-default-400 space-y-2">
              <p>No matching photos found.</p>
              <p className="text-xs">
                Try a different selfie or ensure you have uploaded photos to the
                Guestbook.
              </p>
            </div>
          ) : (
            filteredPhotos.map((photo, i) => (
              <motion.div
                key={photo.id}
                animate={{ opacity: 1, scale: 1 }}
                className="break-inside-avoid"
                initial={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className="border-none shadow-md bg-white dark:bg-zinc-900 rounded-[24px] overflow-hidden relative cursor-pointer group active:scale-[0.98] transition-transform"
                  onClick={() => openLightbox(photo)}
                >
                  <CardBody className="p-0">
                    <Image
                      removeWrapper
                      alt={`Memory by ${photo.name}`}
                      className="w-full h-auto object-cover z-0"
                      radius="none"
                      src={photo.imageUrl}
                    />

                    {/* Score Badge */}
                    {photo.distance !== undefined && (
                      <div className="absolute top-3 left-3 z-20 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/20">
                        <p className="text-[10px] font-bold text-white">
                          {Math.round(Math.max(0, 1 - photo.distance) * 100)}%
                          Match
                        </p>
                      </div>
                    )}

                    {/* Expand Icon */}
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
    </div>
  );
}
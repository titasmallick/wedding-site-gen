"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as faceapi from "face-api.js";
import {
  Card,
  CardBody,
  Button,
  Input,
  Image,
  addToast,
  Spinner,
  Divider,
  Progress,
  Chip,
} from "@heroui/react";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  vector,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

import firebaseApp from "@/config/firebase";
import { fontCursive, fontSans } from "@/config/fonts";

const db = getFirestore(firebaseApp());
const auth = getAuth(firebaseApp());

// --- CLOUDINARY CONFIGURATION ---
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
// ---------------------------------

interface UploadJob {
  file: File;
  status: "pending" | "processing" | "success" | "error";
  error?: string;
  progress: number;
}

export default function BulkUploadPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [uploaderName, setUploaderName] = useState("");
  const [jobs, setJobs] = useState<UploadJob[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [captcha, setCaptcha] = useState("");

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    const loadModels = async () => {
      const MODEL_URL = "/models";
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        console.log("FaceAPI models loaded for Bulk Upload");
      } catch (error) {
        console.error("Error loading FaceAPI models:", error);
        addToast({ title: "Model Error", description: "Could not load AI models.", color: "danger" });    
      }
    };

    loadModels();
    return () => unsubscribeAuth();
  }, []);

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
          canvas.toBlob((blob) => { if (blob) resolve(blob); }, "image/jpeg", 0.7);
        };
      };
    });
  };

  const detectFaces = async (file: File) => {
    return new Promise<any[]>((resolve, reject) => {
      const imageUrl = URL.createObjectURL(file);
      const img = document.createElement("img");
      img.src = imageUrl;
      img.crossOrigin = "anonymous";
      img.onload = async () => {
        try {
          const detections = await faceapi
            .detectAllFaces(img)
            .withFaceLandmarks()
            .withFaceDescriptors();

          const serializedDetections = detections.map((d) => ({
            detection: {
              score: d.detection.score,
              box: {
                x: d.detection.box.x,
                y: d.detection.box.y,
                width: d.detection.box.width,
                height: d.detection.box.height,
              },
            },
            landmarks: d.landmarks.positions.map((p) => ({ x: p.x, y: p.y })),
            descriptor: Array.from(d.descriptor),
          }));
          resolve(serializedDetections);
        } catch (error) {
          reject(error);
        } finally {
          URL.revokeObjectURL(imageUrl);
        }
      };
      img.onerror = () => reject("Image load error");
    });
  };

  const processJob = async (index: number) => {
    const job = jobs[index];
    setJobs(prev => prev.map((j, i) => i === index ? { ...j, status: "processing", progress: 10 } : j));  

    try {
      // 1. Resize
      const resizedBlob = await resizeImage(job.file);
      setJobs(prev => prev.map((j, i) => i === index ? { ...j, progress: 30 } : j));

      // 2. Detect Faces
      const faceData = await detectFaces(job.file);
      setJobs(prev => prev.map((j, i) => i === index ? { ...j, progress: 50 } : j));

      // 3. Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", resizedBlob, "upload.jpg");
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET!);

      const res = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
      const cloudFile = await res.json();

      if (!cloudFile.secure_url) throw new Error("Cloudinary upload failed");
      setJobs(prev => prev.map((j, i) => i === index ? { ...j, progress: 80 } : j));

      // 4. Save to Firestore
      await addDoc(collection(db, "guestbook"), {
        name: uploaderName,
        imageUrl: cloudFile.secure_url,
        createdAt: serverTimestamp(),
      });

      if (faceData.length > 0) {
        const facePromises = faceData.map((face) => {
          return addDoc(collection(db, "facedata"), {
            photoId: cloudFile.secure_url,
            imageUrl: cloudFile.secure_url,
            name: uploaderName,
            createdAt: serverTimestamp(),
            embedding: vector(face.descriptor),
            descriptor: face.descriptor,
            metadata: { detectionScore: face.detection.score },
          });
        });
        await Promise.all(facePromises);
      }

      setJobs(prev => prev.map((j, i) => i === index ? { ...j, status: "success", progress: 100 } : j));  
    } catch (error: any) {
      console.error(`Error processing ${job.file.name}:`, error);
      setJobs(prev => prev.map((j, i) => i === index ? { ...j, status: "error", error: error.message } : j));
    }
  };

  const handleStartBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploaderName || jobs.length === 0 || isProcessing) return;
    if (captcha.trim() !== "10") {
      addToast({ title: "Security Check", description: "Answer correctly!", color: "warning" });
      return;
    }

    setIsProcessing(true);
    for (let i = 0; i < jobs.length; i++) {
      if (jobs[i].status !== "success") {
        await processJob(i);
      }
    }
    setIsProcessing(false);
    addToast({ title: "Bulk Upload Complete", color: "success" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newJobs: UploadJob[] = newFiles.map(file => ({
        file,
        status: "pending",
        progress: 0
      }));
      setJobs(prev => [...prev, ...newJobs]);
    }
  };

  if (authLoading) return <div className="flex justify-center p-20"><Spinner color="danger" /></div>;     

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <h1 className={`${fontCursive.className} text-4xl text-danger mb-4`}>Access Restricted</h1>     
          <p className="text-default-500">This tool is for administrators only.</p>
          <Button as="a" href="/guestbook" className="mt-6 bg-wedding-pink-500 text-white font-bold">Go to Guestbook</Button>
        </Card>
      </div>
    );
  }

  const stats = {
    total: jobs.length,
    success: jobs.filter(j => j.status === "success").length,
    error: jobs.filter(j => j.status === "error").length,
    processing: jobs.filter(j => j.status === "processing").length,
    pending: jobs.filter(j => j.status === "pending").length,
  };

  return (
    <div className="min-h-screen pb-20 pt-10 px-4 max-w-4xl mx-auto">
      <section className="text-center mb-12 space-y-4">
        <h1 className={`${fontCursive.className} text-5xl md:text-7xl text-wedding-pink-600 dark:text-wedding-pink-400 py-2`}>
          Bulk Upload
        </h1>
        <p className="text-default-500">Add multiple memories to the guestbook at once.</p>
      </section>

      <Card className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-wedding-gold-200 dark:border-wedding-gold-800 p-8 rounded-[40px] shadow-2xl mb-8">
        <form className="space-y-6" onSubmit={handleStartBulkUpload}>
          <Input
            isRequired
            classNames={{
              label: "text-wedding-pink-600 font-bold",
              input: "outline-none",
              inputWrapper:
                "border-wedding-pink-100 focus-within:!border-wedding-pink-500 h-14",
            }}
            label="Uploader Name"
            labelPlacement="outside-top"
            placeholder="Who is uploading these?"
            value={uploaderName}
            variant="bordered"
            onChange={(e) => setUploaderName(e.target.value)}
          />

          <div className="p-4 bg-default-50 dark:bg-zinc-800/50 rounded-2xl border-2 border-dashed border-default-200">
            <input
              multiple
              accept="image/*"
              className="hidden"
              id="bulk-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label
              className="flex flex-col items-center justify-center cursor-pointer py-4"
              htmlFor="bulk-upload"
            >
              <svg
                className="text-wedding-pink-400 mb-2"
                fill="none"
                height="32"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="32"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" x2="12" y1="3" y2="15" />
              </svg>
              <span className="text-sm font-bold text-default-600">
                Select Multiple Photos
              </span>
              <span className="text-xs text-default-400">
                {jobs.length} files selected
              </span>
            </label>
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
              placeholder="Answer"
              value={captcha}
              variant="underlined"
              onChange={(e) => setCaptcha(e.target.value)}
            />
          </div>

          <Button
            className="w-full bg-gradient-to-r from-wedding-pink-500 to-wedding-gold-500 text-white font-black h-14 text-lg rounded-full"
            isDisabled={
              jobs.length === 0 || !uploaderName || isProcessing || !modelsLoaded
            }
            isLoading={isProcessing}
            type="submit"
          >
            {!modelsLoaded
              ? "Loading AI Models..."
              : `Process ${jobs.length} Photos`}
          </Button>
        </form>
      </Card>

      {jobs.length > 0 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-end px-2">
              <h2 className="text-xl font-bold text-default-800 dark:text-white">
                Total Progress
              </h2>
              <span className="text-xs font-mono font-bold text-wedding-pink-600">
                {Math.round(((stats.success + stats.error) / stats.total) * 100)}
                %
              </span>
            </div>
            <Progress
              classNames={{
                indicator:
                  "bg-gradient-to-r from-wedding-pink-500 to-wedding-gold-500",
                track: "bg-default-100 dark:bg-zinc-800",
              }}
              radius="full"
              size="md"
              value={((stats.success + stats.error) / stats.total) * 100}
            />
          </div>

          <div className="flex justify-between items-center px-2 pt-2">
            <h2 className="text-lg font-bold text-default-700">Queue Status</h2>
            <div className="flex gap-2">
              <Chip color="success" size="sm" variant="flat">
                {stats.success} Done
              </Chip>
              <Chip color="danger" size="sm" variant="flat">
                {stats.error} Failed
              </Chip>
              <Chip color="primary" size="sm" variant="flat">
                {stats.processing + stats.pending} Remaining
              </Chip>
            </div>
          </div>

          <div className="grid gap-3">
            <AnimatePresence>
              {jobs.map((job, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="border-none shadow-sm bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                    <CardBody className="p-4 flex flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-default-100 flex-shrink-0 border border-default-200">
                          <img className="w-full h-full object-cover" src={URL.createObjectURL(job.file)} alt="preview" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-bold truncate text-default-800 dark:text-zinc-200">{job.file.name}</p>
                            {job.status === "processing" && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-warning-50 text-warning-600 font-bold animate-pulse">
                                {job.progress < 30 ? "Resizing..." : job.progress < 50 ? "Scanning..." : "Uploading..."}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress className="max-w-md h-1.5" color={job.status === "error" ? "danger" : "success"} value={job.progress} />
                            <span className="text-[10px] text-default-400 font-mono">{job.progress}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {job.status === "pending" && <Chip size="sm" variant="dot" className="border-default-200">Pending</Chip>}
                        {job.status === "processing" && <Spinner size="sm" color="warning" />}
                        {job.status === "success" && <Chip color="success" size="sm" className="font-bold">Success</Chip>}
                        {job.status === "error" && <Chip color="danger" size="sm" className="font-bold" title={job.error}>Failed</Chip>}
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

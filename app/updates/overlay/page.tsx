"use client";

import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import firebaseApp from "@/config/firebase";
import { fontCursive, fontSans, fontMono } from "@/config/fonts";
import { HeartFilledIcon } from "@/components/icons";

const db = getFirestore(firebaseApp());

export default function UpdateOverlay() {
  const [latestUpdate, setLatestUpdate] = useState<any>(null);
  const [time, setTime] = useState(new Date());
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    const q = query(
      collection(db, "updates"),
      orderBy("createdAt", "desc"),
      limit(1),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setLatestUpdate({
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data(),
        });
      }
    });

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col justify-between p-16 pointer-events-none">
      {/* Global CSS for OBS Chroma Keying */}
      <style>{`
        nav,
        footer {
          display: none !important;
        }
        main {
          padding: 0 !important;
          max-width: none !important;
          margin: 0 !important;
          background: #00ff00 !important;
        }
        body {
          background: #00ff00 !important;
          overflow: hidden;
        }
      `}</style>

      {/* Top Bar: Clock & Brand */}
      <div className="flex justify-between items-start">
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#18181b] border-2 border-wedding-pink-500 p-4 rounded-2xl"
          initial={{ opacity: 0, x: -50 }}
        >
          <p
            className={`${fontMono.className} text-5xl font-black text-white tabular-nums tracking-tighter`}
          >
            {hasMounted
              ? time.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              : "--:--:--"}
          </p>
          <p
            className={`${fontMono.className} text-wedding-gold-400 text-xs uppercase tracking-[0.3em] mt-1 font-bold`}
          >
            Event Time
          </p>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-3 rounded-2xl flex items-center gap-4 border-2 border-wedding-pink-500"
          initial={{ opacity: 0, x: 50 }}
        >
          <div className="text-right">
            <p className={`${fontCursive.className} text-2xl text-zinc-900`}>
              Follow Live
            </p>
            <p
              className={`${fontSans.className} text-[9px] font-black text-wedding-pink-600 uppercase tracking-widest leading-none`}
            >
              Scan for Updates
            </p>
          </div>
          <Image
            alt="QR Code"
            className="w-16 h-16 rounded-lg"
            height={64}
            src="/pubqr.png"
            width={64}
          />
        </motion.div>
      </div>

      {/* Bottom Bar: Latest News */}
      <AnimatePresence mode="wait">
        {latestUpdate && (
          <motion.div
            key={latestUpdate.id}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex justify-center"
            exit={{ opacity: 0, y: 100 }}
            initial={{ opacity: 0, y: 150 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
          >
            <div className="relative w-full max-w-5xl">
              {/* Solid outline instead of glow */}
              <div className="absolute -inset-1 border border-wedding-pink-500/20 rounded-[30px]" />

              <div className="relative bg-[#09090b] border-4 border-wedding-pink-500 rounded-[28px] p-6 md:p-8 flex items-center gap-8">
                <div className="flex-shrink-0 flex flex-col items-center gap-2">
                  <div className="bg-wedding-pink-500 p-4 rounded-full">
                    <HeartFilledIcon className="w-8 h-8 text-white" />
                  </div>
                  <span
                    className={`${fontMono.className} text-[10px] uppercase tracking-[0.4em] text-wedding-gold-400 font-black`}
                  >
                    LIVE
                  </span>
                </div>

                <div className="flex-1 space-y-2">
                  <p
                    className={`${fontCursive.className} text-4xl text-wedding-pink-400`}
                  >
                    Wedding News
                  </p>
                  <p
                    className={`${fontSans.className} text-3xl md:text-4xl font-black text-white leading-tight tracking-tight`}
                  >
                    {latestUpdate.text}
                  </p>
                </div>

                <div className="hidden lg:flex flex-col items-end justify-center border-l-2 border-zinc-800 pl-8 space-y-1">
                  <p
                    className={`${fontCursive.className} text-4xl text-wedding-gold-200`}
                  >
                    Titas & Sukanya
                  </p>
                  <p
                    className={`${fontMono.className} text-[10px] uppercase tracking-[0.5em] text-zinc-500 font-bold`}
                  >
                    Jan 2026
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

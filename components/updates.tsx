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
import Link from "next/link";

import { ClockIcon } from "./icons";

import firebaseApp from "@/config/firebase";

const db = getFirestore(firebaseApp());

const timeAgo = (timestamp: any) => {
  if (!timestamp?.toDate) return "Just now";
  const now = new Date();
  const diff = (now.getTime() - timestamp.toDate().getTime()) / 1000;

  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

  return `${Math.floor(diff / 86400)}d ago`;
};

const Updates = () => {
  const [latestUpdate, setLatestUpdate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading || !latestUpdate) return null;

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl mx-auto px-4 z-50"
        exit={{ opacity: 0, y: -20 }}
        initial={{ opacity: 0, y: -20 }}
      >
        <div className="relative group">
          {/* Animated Background Glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-wedding-pink-500 to-wedding-gold-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

          <Link
            className="relative flex items-center gap-2 sm:gap-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-wedding-gold-200/50 dark:border-wedding-gold-800/50 p-1 sm:p-1.5 pr-4 sm:pr-6 rounded-full shadow-xl transition-all duration-300 group-hover:border-wedding-pink-400"
            href="/updates"
          >
            <div className="flex items-center bg-wedding-pink-500 text-white px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black tracking-widest shadow-lg shadow-wedding-pink-500/20">
              UPDATE
            </div>

            <p className="flex-1 text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate">
              {latestUpdate.text}
            </p>

            <div className="hidden sm:flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-zinc-400 font-mono whitespace-nowrap border-x border-default-200 dark:border-default-800 px-4">
                <ClockIcon className="text-wedding-gold-500" size={12} />
                {timeAgo(latestUpdate.createdAt)}
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-wedding-pink-500 whitespace-nowrap group-hover:translate-x-1 transition-transform">
                View All
                <svg
                  fill="none"
                  height="14"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                  width="14"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>

            {/* Mobile Arrow */}
            <div className="sm:hidden text-wedding-pink-500 flex-shrink-0">
              <svg
                fill="none"
                height="16"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                width="16"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Updates;

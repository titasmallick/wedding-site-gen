"use client";

import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import {
  Spinner,
  Divider,
  Chip,
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Button,
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";

import firebaseApp from "@/config/firebase";
import { fontCursive, fontSans, fontMono } from "@/config/fonts";
import { HeartFilledIcon, ClockIcon } from "@/components/icons";

const db = getFirestore(firebaseApp());

const formatDateTime = (timestamp) => {
  if (!timestamp?.toDate) return "Just now";
  const date = timestamp.toDate();
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const timeAgo = (timestamp) => {
  if (!timestamp?.toDate) return "Just now";
  const now = new Date();
  const diff = (now.getTime() - timestamp.toDate().getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const ExpandableText = ({ text, limit = 150 }) => {
  const [expanded, setExpanded] = useState(false);
  const toggle = () => setExpanded(!expanded);
  const isLong = text.length > limit;
  const displayText = expanded || !isLong ? text : text.slice(0, limit) + "...";

  return (
    <div className="space-y-2">
      <p className={`${fontSans.className} text-default-700 dark:text-gray-200 leading-relaxed text-lg`}>
        {displayText}
      </p>
      {isLong && (
        <Button
          size="sm"
          variant="light"
          color="danger"
          onPress={toggle}
          className="p-0 h-auto min-w-0 font-semibold"
        >
          {expanded ? "Show less" : "Read more"}
        </Button>
      )}
    </div>
  );
};

const UpdateFeed = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "updates"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUpdates(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner color="danger" size="lg" label="Loading latest updates..." />
      </div>
    );
  }

  if (updates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <HeartFilledIcon className="text-wedding-pink-200 w-16 h-16" />
        <p className={`${fontCursive.className} text-3xl text-default-500`}>
          No updates yet. Stay tuned!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${fontCursive.className} text-5xl md:text-7xl text-wedding-pink-600 dark:text-wedding-pink-400`}
        >
          Wedding Updates
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`${fontMono.className} text-sm uppercase tracking-[0.2em] text-default-500`}
        >
          The latest news from Titas & Sukanya
        </motion.p>
      </div>

      <div className="space-y-8">
        <AnimatePresence mode="popLayout">
          {updates.map((update, index) => (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              layout
            >
              <Card 
                className={`w-full overflow-hidden border ${
                  index === 0 
                    ? "border-wedding-gold-300 dark:border-wedding-gold-700 bg-wedding-gold-50/50 dark:bg-wedding-gold-900/10 shadow-xl" 
                    : "border-default-100 dark:border-default-800 bg-white/60 dark:bg-black/40"
                } backdrop-blur-md`}
              >
                {index === 0 && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-wedding-pink-500 via-wedding-gold-500 to-wedding-pink-500" />
                )}
                
                <CardHeader className="flex gap-3 px-6 pt-6">
                  <Avatar
                    isBordered
                    color={index === 0 ? "warning" : "danger"}
                    radius="full"
                    size="md"
                    src={update.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? "/groom.jpg" : undefined}
                    name={update.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? "T" : update.email?.charAt(0).toUpperCase()}
                  />
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-md font-bold text-default-800 dark:text-white">
                        {update.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? "Titas Mallick" : update.email}
                      </p>
                      {index === 0 && (
                        <Chip
                          size="sm"
                          variant="shadow"
                          color="warning"
                          className="animate-pulse bg-wedding-gold-500 text-white"
                        >
                          LATEST
                        </Chip>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-default-500">
                      <ClockIcon className="w-3 h-3" />
                      <span>{formatDateTime(update.createdAt)}</span>
                      <span className="mx-1">•</span>
                      <span className="font-medium text-wedding-pink-500">{timeAgo(update.createdAt)}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardBody className="px-6 py-4">
                  <ExpandableText text={update.text} />
                </CardBody>
                
                <Divider className="opacity-50" />
                
                <div className="px-6 py-3 flex items-center justify-end">
                   <HeartFilledIcon className={`w-5 h-5 ${index === 0 ? "text-wedding-pink-500" : "text-wedding-pink-200"}`} />
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UpdateFeed;
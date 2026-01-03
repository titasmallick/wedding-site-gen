"use client";

import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { motion } from "framer-motion";

import firebaseApp from "@/config/firebase";
import { title } from "@/components/primitives";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export const AdminLinks = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(firebaseApp());
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading || !user || user.email !== ADMIN_EMAIL) {
    return null;
  }

  const adminTools = [
    {
      name: "Invitation Maker",
      description: "Create and manage guest invitations",
      href: "/invitation/maker",
      icon: "✉️",
      color: "gold",
    },
    {
      name: "Updates Maker",
      description: "Post new announcements for guests",
      href: "/updates/maker",
      icon: "📢",
      color: "pink",
    },
    {
      name: "Guestbook",
      description: "Review wishes and messages",
      href: "/guestbook",
      icon: "📖",
      color: "blue",
    },
  ];

  return (
    <section className="container mx-auto px-4 pt-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-white/50 dark:bg-zinc-900/50 backdrop-blur-2xl border border-white dark:border-white/10 shadow-2xl"
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-wedding-gold-200/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-wedding-pink-200/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        <div className="relative z-10 p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="flex h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-default-400">
                  Secure Admin Access
                </span>
              </div>
              <h2 className={title({ size: "sm", color: "foreground" })}>
                Control Center&nbsp;
              </h2>
              <p className="text-default-500 mt-2 font-medium">
                Welcome, <span className="text-wedding-pink-500">{user.email}</span>. What would you like to manage today?
              </p>
            </div>
            <div className="bg-default-100 dark:bg-white/5 px-4 py-2 rounded-2xl border border-default-200 dark:border-white/10">
              <p className="text-[10px] uppercase tracking-wider text-default-400 font-bold mb-1">Last Sync</p>
              <p className="text-sm font-mono">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {adminTools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link href={tool.href} className="w-full block">
                  <div className="group p-6 rounded-[2rem] bg-white dark:bg-zinc-800/50 border border-default-200 dark:border-white/5 hover:border-wedding-pink-300 dark:hover:border-wedding-pink-900 transition-all duration-300 shadow-sm hover:shadow-xl">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{tool.icon}</div>
                      <div className="p-2 rounded-full bg-default-50 dark:bg-white/5 group-hover:bg-wedding-pink-500 group-hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-default-900 mb-1">{tool.name}</h4>
                    <p className="text-sm text-default-500 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

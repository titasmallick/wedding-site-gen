"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@heroui/button";
import { useEffect, useState } from "react";

import ImportantNews from "./importantNews";
import CertificatePage from "./certificate";
import WeddingCard from "./weddingcard";
import WeddingCard2 from "./weddingcard2";
import { HeartFilledIcon } from "./icons";
import Updates from "./updates";
import CountdownTimer from "./CountdownTimer";
import LiveVideos from "./LiveVideos";

import { fontCursive, fontMono } from "@/config/fonts";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8 },
};

const Herohome = () => {
  const [showReception, setShowReception] = useState(false);

  useEffect(() => {
    const now = new Date();
    const weddingDate = new Date("2026-01-23");

    weddingDate.setHours(23, 59, 59, 999);

    if (now > weddingDate) {
      setShowReception(true);
    }
  }, []);

  return (
    <div className="flex flex-col gap-16 md:gap-32 pb-20 overflow-hidden">
      {/* Latest Update Bar */}
      <div className="mt-8">
        <Updates />
      </div>

      {/* 1. Hero Banner */}
      <section className="relative min-h-[50vh] md:min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        {/* Abstract Background Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-wedding-pink-100/30 dark:bg-wedding-pink-900/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          {...fadeInUp}
          className={`${fontCursive.className} text-6xl md:text-8xl lg:text-9xl leading-tight z-10`}
        >
          <span className="block text-default-800 dark:text-default-900">
            A Journey of
          </span>
          <span className="block mt-2 bg-gradient-to-r from-wedding-pink-400 via-purple-400 to-wedding-gold-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(236,72,153,0.3)] dark:drop-shadow-[0_0_20px_rgba(236,72,153,0.5)]">
            Forever
          </span>
          <span className="block text-default-800 dark:text-default-900 mt-4">
            Begins.
          </span>
        </motion.div>

        <motion.p
          animate={{ opacity: 1 }}
          className="mt-8 text-lg md:text-xl text-default-500 uppercase tracking-[0.2em] font-light"
          initial={{ opacity: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          Groom & Bride
        </motion.p>
      </section>

      {/* Countdown Section */}
      <section className="container mx-auto px-4">
        <motion.div {...fadeInUp}>
          <CountdownTimer />
        </motion.div>
      </section>

      {/* 2. The Invitation */}
      <section className="container mx-auto px-4">
        <motion.div {...fadeInUp}>
          <div className="text-center mb-10">
            <h2
              className={`${fontCursive.className} text-4xl text-wedding-gold-600 dark:text-wedding-gold-400`}
            >
              The Invitation
            </h2>
          </div>
          <div className="relative z-10">
            {showReception ? <WeddingCard2 /> : <WeddingCard />}
          </div>
        </motion.div>
      </section>

      {/* Live Videos Section */}
      <LiveVideos />

      {/* 3. The Couple Intro */}
      <section className="relative py-20 bg-wedding-pink-50/50 dark:bg-white/5 rounded-3xl mx-4 md:mx-0">
        <motion.div
          {...fadeInUp}
          className="container mx-auto px-4 flex flex-col items-center text-center max-w-4xl"
        >
          <HeartFilledIcon className="text-wedding-pink-500 w-12 h-12 mb-6" />

          <p
            className={`${fontMono.className} text-lg md:text-xl leading-relaxed text-default-600 dark:text-white`}
          >
            From college classmates to soulmates, our journey of ten beautiful
            years has been filled with shared laughter, quiet strength, and a
            deep love for the mountains. Now, we are ready to write the next
            chapter as one.
          </p>

          <Button
            as={Link}
            className="mt-10 bg-wedding-pink-500 text-white font-medium shadow-lg hover:bg-wedding-pink-600 hover:shadow-wedding-pink-500/30 transition-all transform hover:-translate-y-1"
            href="/couple"
            radius="full"
            size="lg"
          >
            Read Our Story
          </Button>
        </motion.div>
      </section>

      {/* 4. Important News / Events */}
      <section>
        <ImportantNews />
      </section>

      {/* 5. Mini Game Section */}
      <section className="container mx-auto px-4 py-20 bg-wedding-gold-50/30 dark:bg-white/5 rounded-3xl mx-4 md:mx-0">
        <motion.div
          {...fadeInUp}
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
        >
          <h2
            className={`${fontCursive.className} text-4xl text-wedding-gold-600 dark:text-wedding-gold-400 mb-6`}
          >
            A Little Fun
          </h2>
          <p
            className={`${fontMono.className} text-lg mb-8 text-default-600 dark:text-white`}
          >
            Take a moment to enjoy a small wedding-themed memory game while you
            are here!
          </p>
          <Button
            as={Link}
            className="bg-wedding-gold-500 text-white font-medium shadow-lg hover:bg-wedding-gold-600 transition-all transform hover:-translate-y-1"
            href="/game"
            radius="full"
            size="lg"
          >
            Play the Game
          </Button>
        </motion.div>
      </section>

      {/* 6. Official Record */}
      <section className="container mx-auto px-4 pb-10">
        <motion.div
          {...fadeInUp}
          className="opacity-90 hover:opacity-100 transition-opacity"
        >
          <CertificatePage />
        </motion.div>
      </section>
    </div>
  );
};

export default Herohome;

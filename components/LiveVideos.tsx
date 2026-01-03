"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { fontCursive } from "@/config/fonts";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8 },
};

const LiveVideos = () => {
  const [weddingStatus, setWeddingStatus] = useState({
    show: false,
    isLive: false,
  });
  const [receptionStatus, setReceptionStatus] = useState({
    show: false,
    isLive: false,
  });

  useEffect(() => {
    const today = new Date();
    // Normalize today to start of day for accurate comparison
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    // Dates from CountdownTimer: Wedding Jan 23, Reception Jan 25 (2026)
    const weddingDate = new Date(2026, 0, 23);
    const receptionDate = new Date(2026, 0, 25);

    setWeddingStatus({
      show: startOfToday >= weddingDate,
      isLive: startOfToday.getTime() === weddingDate.getTime(),
    });

    setReceptionStatus({
      show: startOfToday >= receptionDate,
      isLive: startOfToday.getTime() === receptionDate.getTime(),
    });
  }, []);

  const VideoFallback = ({ title, date }: { title: string; date: string }) => (
    <div className="group relative w-full aspect-square md:aspect-video rounded-[1.5rem] md:rounded-[2rem] overflow-hidden flex flex-col items-center justify-center p-6 md:p-8 text-center border border-wedding-pink-100 dark:border-white/10 shadow-xl transition-all duration-500 hover:shadow-2xl">
      {/* Background with subtle animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-wedding-pink-50/80 via-white to-wedding-gold-50/50 dark:from-wedding-pink-950/20 dark:via-black dark:to-wedding-gold-950/10 -z-10" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/corner1-01.svg')] opacity-[0.03] dark:opacity-[0.05] bg-cover bg-center pointer-events-none" />

      {/* Animated glowing rings */}
      <div className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full border border-wedding-pink-200/30 dark:border-wedding-pink-500/10 animate-[ping_3s_infinite]" />
      <div className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full border border-wedding-gold-200/30 dark:border-wedding-gold-500/10 animate-[ping_4s_infinite]" />

      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
      >
        <div className="w-16 h-16 md:w-20 md:h-20 mb-4 md:mb-6 rounded-full bg-white dark:bg-zinc-900 shadow-xl flex items-center justify-center border border-wedding-pink-100 dark:border-wedding-pink-900 group-hover:scale-110 transition-transform duration-500">
          <svg
            className="w-8 h-8 md:w-10 md:h-10 text-wedding-pink-500 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
            />
          </svg>
        </div>

        <h4
          className={`${fontCursive.className} text-2xl md:text-4xl text-wedding-gold-600 dark:text-wedding-gold-400 mb-2 md:mb-3`}
        >
          {title} Stream
        </h4>

        <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-wedding-pink-200 dark:via-wedding-pink-800 to-transparent mb-3 md:mb-4" />

        <p className="text-default-600 dark:text-gray-300 max-w-[240px] md:max-w-sm mx-auto leading-relaxed text-sm md:text-base">
          Our hearts are filled with joy as we prepare for our big day.
        </p>
        <p className="mt-2 font-bold text-wedding-pink-600 dark:text-wedding-pink-400 tracking-wide uppercase text-[10px] md:text-xs">
          Available on {date}
        </p>

        <div className="mt-6 md:mt-8 px-4 md:px-6 py-1.5 md:py-2 rounded-full border border-wedding-gold-200 dark:border-wedding-gold-800 bg-white/50 dark:bg-black/20 backdrop-blur-sm text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-default-500 font-bold">
          Reserved for Guests
        </div>
      </motion.div>
    </div>
  );

  return (
    <section className="container mx-auto px-4">
      <motion.div {...fadeInUp}>
        <div className="text-center mb-12">
          <h2
            className={`${fontCursive.className} text-5xl md:text-6xl text-wedding-gold-600 dark:text-wedding-gold-400`}
          >
            Live Feed
          </h2>
          <p className="mt-4 text-default-500 italic">
            Witness our special moments from wherever you are
          </p>
        </div>

        <div className="flex flex-col gap-16 max-w-4xl mx-auto">
          {/* Wedding Video Section */}
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex flex-col items-center gap-2">
              {weddingStatus.isLive && (
                <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse uppercase tracking-wider">
                  Live Now
                </span>
              )}
              <h3
                className={`${fontCursive.className} text-4xl text-center text-wedding-pink-600 dark:text-wedding-pink-400`}
              >
                The Wedding
              </h3>
            </div>

            {weddingStatus.show ? (
              <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 md:border-4 border-white dark:border-white/10 hover:scale-[1.01] transition-transform duration-500">
                <iframe
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  className="w-full h-full"
                  referrerPolicy="strict-origin-when-cross-origin"
                  src="https://www.youtube.com/embed/lKZoK6F5b3I"
                  title="Wedding Live Stream"
                />
              </div>
            ) : (
              <VideoFallback date="January 23, 2026" title="Wedding" />
            )}
          </div>

          {/* Reception Video Section */}
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex flex-col items-center gap-2">
              {receptionStatus.isLive && (
                <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse uppercase tracking-wider">
                  Live Now
                </span>
              )}
              <h3
                className={`${fontCursive.className} text-4xl text-center text-wedding-pink-600 dark:text-wedding-pink-400`}
              >
                The Reception
              </h3>
            </div>

            {receptionStatus.show ? (
              <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 md:border-4 border-white dark:border-white/10 hover:scale-[1.01] transition-transform duration-500">
                <iframe
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  className="w-full h-full"
                  referrerPolicy="strict-origin-when-cross-origin"
                  src="https://www.youtube.com/embed/bE2fxBPD5NU"
                  title="Reception Live Stream"
                />
              </div>
            ) : (
              <VideoFallback date="January 25, 2026" title="Reception" />
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default LiveVideos;

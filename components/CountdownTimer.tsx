"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { HeartFilledIcon } from "./icons";

import { fontMono, fontCursive } from "@/config/fonts";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

type TimerPhase =
  | "BEFORE_WEDDING"
  | "WEDDING_DAY"
  | "BEFORE_RECEPTION"
  | "RECEPTION_DAY"
  | "POST_EVENT";

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [phase, setPhase] = useState<TimerPhase>("BEFORE_WEDDING");

  useEffect(() => {
    const weddingStart = new Date("2026-01-23T18:00:00").getTime();
    const weddingEnd = new Date("2026-01-24T06:00:00").getTime();
    const receptionStart = new Date("2026-01-25T18:00:00").getTime();
    const receptionEnd = new Date("2026-01-26T06:00:00").getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();

      let currentPhase: TimerPhase = "BEFORE_WEDDING";
      let targetDate = weddingStart;

      if (now < weddingStart) {
        currentPhase = "BEFORE_WEDDING";
        targetDate = weddingStart;
      } else if (now >= weddingStart && now < weddingEnd) {
        currentPhase = "WEDDING_DAY";
      } else if (now >= weddingEnd && now < receptionStart) {
        currentPhase = "BEFORE_RECEPTION";
        targetDate = receptionStart;
      } else if (now >= receptionStart && now < receptionEnd) {
        currentPhase = "RECEPTION_DAY";
      } else {
        currentPhase = "POST_EVENT";
      }

      setPhase(currentPhase);

      if (
        currentPhase === "BEFORE_WEDDING" ||
        currentPhase === "BEFORE_RECEPTION"
      ) {
        const difference = targetDate - now;

        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="relative h-[48px] md:h-[72px] overflow-hidden flex items-center justify-center min-w-[60px] md:min-w-[80px]">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            animate={{ y: 0, opacity: 1 }}
            className={`${fontMono.className} text-4xl md:text-6xl font-black text-default-800 dark:text-white tabular-nums`}
            exit={{ y: -20, opacity: 0 }}
            initial={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {String(value).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-wedding-pink-500 font-bold mt-1">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <AnimatePresence mode="wait">
        {(phase === "BEFORE_WEDDING" || phase === "BEFORE_RECEPTION") &&
        timeLeft ? (
          <motion.div
            key="countdown"
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4 md:gap-8 bg-white/30 dark:bg-black/20 backdrop-blur-md px-8 py-6 rounded-[40px] border border-wedding-gold-200/50 dark:border-wedding-gold-800/50 shadow-xl"
            exit={{ opacity: 0, scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.9 }}
          >
            <TimeUnit label="Days" value={timeLeft.days} />
            <div className="text-wedding-gold-400 text-3xl md:text-5xl font-light mb-6">
              :
            </div>
            <TimeUnit label="Hours" value={timeLeft.hours} />
            <div className="text-wedding-gold-400 text-3xl md:text-5xl font-light mb-6">
              :
            </div>
            <TimeUnit label="Mins" value={timeLeft.minutes} />
            <div className="text-wedding-gold-400 text-3xl md:text-5xl font-light mb-6">
              :
            </div>
            <TimeUnit label="Secs" value={timeLeft.seconds} />
          </motion.div>
        ) : (
          <motion.div
            key="celebration"
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-2 bg-white/30 dark:bg-black/20 backdrop-blur-md px-8 md:px-16 py-6 rounded-[40px] border border-wedding-gold-200/50 dark:border-wedding-gold-800/50 shadow-xl overflow-visible"
            exit={{ opacity: 0, y: 20 }}
            initial={{ opacity: 0, y: 20 }}
          >
            <HeartFilledIcon className="w-12 h-12 animate-beat text-wedding-pink-500" />
            <h2
              className={`${fontCursive.className} text-4xl md:text-6xl text-center bg-gradient-to-r from-wedding-pink-500 to-wedding-gold-500 bg-clip-text text-transparent leading-[1.6] py-12 px-4 overflow-visible`}
            >
              {phase === "WEDDING_DAY" && "Today is our Wedding Day!"}
              {phase === "RECEPTION_DAY" && "Today is our Reception!"}
              {phase === "POST_EVENT" && "Just Married!"}
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      <p
        className={`${fontCursive.className} text-2xl text-wedding-gold-600 dark:text-wedding-gold-400`}
      >
        {" "}
        {phase === "BEFORE_WEDDING" && 'Until we say "I Do"'}
        {phase === "BEFORE_RECEPTION" && "Until the Grand Reception"}
        {phase === "POST_EVENT" && "Happily Ever After"}
        {(phase === "WEDDING_DAY" || phase === "RECEPTION_DAY") &&
          "The Celebration Continues..."}
      </p>
    </div>
  );
}

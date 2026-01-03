"use client";

import { motion } from "framer-motion";
import { Card, CardBody, Image, Chip } from "@heroui/react";
import { useEffect, useState } from "react";

import { fontCursive, fontSans, fontMono } from "@/config/fonts";
import { HeartFilledIcon, CalendarIcon } from "@/components/icons";

const importantDates = [
  {
    title: "The Proposal",
    date: "15th March 2025",
    note: "The day the proposal happened with a ring.",
    image: "/Images/19.jpg",
  },
  {
    title: "The Patipatra",
    date: "18th April 2025",
    note: "Our families came up with a holy date.",
    image: "/Images/Patipatra.jpeg",
  },
  {
    title: "Our Engagement",
    date: "23rd November 2025",
    note: "A promise sealed with love and laughter.",
    image: "/Images/22.jpg",
  },
  {
    title: "Wedding Bells",
    date: "23rd January 2026",
    note: "Two souls, one journey begins.",
    image: "/Images/21.jpg",
  },
  {
    title: "Reception",
    date: "25th January 2026",
    note: "Celebrating our union with friends and family.",
    image: "/Images/20.jpg",
  },
];

export default function DatesPage() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  const parseDate = (dateStr: string) => {
    const cleaned = dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1");

    return new Date(cleaned);
  };

  return (
    <div className="min-h-screen pb-20 pt-10 px-4">
      {/* Header */}
      <section className="max-w-4xl mx-auto text-center mb-20">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-3 py-1 rounded-full bg-wedding-pink-50 dark:bg-wedding-pink-900/30 text-wedding-pink-600 dark:text-wedding-pink-300 text-xs font-bold tracking-widest uppercase mb-6 border border-wedding-pink-100 dark:border-wedding-pink-800">
            Our Journey
          </span>
          <h1
            className={`${fontCursive.className} py-2 text-5xl md:text-7xl bg-gradient-to-r from-wedding-pink-600 to-wedding-gold-600 dark:from-wedding-pink-400 dark:to-wedding-gold-400 bg-clip-text text-transparent mb-6 leading-normal`}
          >
            Mark the Dates
          </h1>
          <p className="text-default-500 dark:text-default-400 max-w-xl mx-auto italic">
            &quot;Every moment led us here. From the first proposal to the final
            vows, follow the milestones of our love story.&quot;
          </p>
        </motion.div>
      </section>

      {/* Timeline Grid */}
      <div className="max-w-5xl mx-auto relative">
        {/* Timeline Line (Center - Desktop only) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-wedding-pink-200 via-wedding-gold-200 to-transparent -translate-x-1/2 hidden md:block opacity-30" />

        <div className="flex flex-col gap-12 md:gap-24">
          {importantDates.map((item, index) => {
            const eventDate = parseDate(item.date);
            // Mark as completed only after one full day has passed (24 hours after end of day)
            const completionThreshold = new Date(eventDate);

            completionThreshold.setDate(completionThreshold.getDate() + 1);
            completionThreshold.setHours(23, 59, 59, 999);

            const isPast = now ? now > completionThreshold : false;
            const isLeft = index % 2 === 0;

            return (
              <motion.div
                key={index}
                className={`flex flex-col ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8 md:gap-0`}
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                viewport={{ once: true, margin: "-100px" }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                {/* Content Side */}
                <div
                  className={`w-full md:w-1/2 ${isLeft ? "md:pr-16 md:text-right" : "md:pl-16 md:text-left"}`}
                >
                  <div
                    className={`flex flex-col ${isLeft ? "md:items-end" : "md:items-start"} items-center space-y-3`}
                  >
                    <div className="flex items-center gap-2">
                      {isPast && (
                        <Chip
                          className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800/30"
                          color="success"
                          size="sm"
                          variant="flat"
                        >
                          Completed
                        </Chip>
                      )}
                      <p
                        className={`${fontMono.className} text-wedding-pink-500 font-bold tracking-tighter text-sm`}
                      >
                        {item.date}
                      </p>
                    </div>

                    <h3
                      className={`${fontSans.className} text-2xl md:text-3xl font-bold text-default-900`}
                    >
                      {item.title}
                    </h3>

                    <p className="text-default-500 dark:text-default-400 text-sm md:text-base leading-relaxed max-w-sm">
                      {item.note}
                    </p>
                  </div>
                </div>

                {/* Center Icon (Desktop only) */}
                <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border-4 border-wedding-pink-100 dark:border-wedding-pink-900 hidden md:flex items-center justify-center z-10 shadow-lg">
                  {isPast ? (
                    <HeartFilledIcon className="w-4 h-4 text-wedding-pink-500" />
                  ) : (
                    <CalendarIcon className="w-4 h-4 text-wedding-gold-500" />
                  )}
                </div>

                {/* Image Side */}
                <div
                  className={`w-full md:w-1/2 ${isLeft ? "md:pl-16" : "md:pr-16"}`}
                >
                  <motion.div
                    className="w-full"
                    transition={{ type: "spring", stiffness: 300 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card
                      className={`overflow-hidden border-none shadow-xl aspect-[4/5] w-full ${isPast ? "opacity-90" : ""}`}
                    >
                      <CardBody className="p-0 h-full w-full overflow-hidden relative">
                        <Image
                          removeWrapper
                          alt={item.title}
                          className="z-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700 block"
                          height="100%"
                          radius="none"
                          src={item.image}
                          width="100%"
                        />
                      </CardBody>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Call to Action */}
      <motion.div
        className="mt-32 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <div className="inline-block p-[2px] rounded-full bg-gradient-to-r from-wedding-pink-500 to-wedding-gold-500 mb-6">
          <div className="bg-white dark:bg-zinc-900 px-8 py-3 rounded-full">
            <p
              className={`${fontCursive.className} text-3xl bg-gradient-to-r from-wedding-pink-600 to-wedding-gold-600 dark:from-wedding-pink-400 dark:to-wedding-gold-400 bg-clip-text text-transparent`}
            >
              Counting down the days...
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

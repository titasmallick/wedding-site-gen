"use client";

import { motion } from "framer-motion";
import { Card, CardBody, Button, Link } from "@heroui/react";
import { CalendarIcon, ClockIcon, MapPinIcon } from "./icons";
import { useEffect, useState } from "react";

export default function ImportantNews() {
  const [currentDate, setCurrentDate] = useState(null);

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  const events = {
    registration: {
      title: "Engagement Ceremony",
      date: "23rd November 2025",
      venue: "Venue City",
      map: "",
      mapHref: "#",
      time: "10:00 AM",
      direction: "Sample Direction",
    },
    wedding: {
      title: "Wedding Ceremony",
      date: "23rd January 2026",
      venue: "Venue City",
      map: "",
      mapHref: "#",
      time: "06:00 PM",
      direction: "Sample Direction",
    },
    reception: {
      title: "Reception Celebration",
      date: "25th January 2026",
      venue: "Venue City",
      map: "",
      mapHref: "#",
      time: "06:00 PM",
      direction: "Sample Direction",
    },
  };

  const parseDate = (dateStr) => {
    // Remove ordinal suffixes (st, nd, rd, th) from the day
    const cleanedDate = dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1");
    return new Date(cleanedDate);
  };

  return (
    <div className="w-full flex items-center justify-center font-sans my-12 px-4">
      <motion.div
        className="w-full max-w-6xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Card className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-xl">
          {/* Decorative background gradients */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 dark:from-pink-900 dark:via-purple-900 dark:to-indigo-900" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-100/50 dark:bg-pink-900/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />

          <CardBody className="p-8 md:p-12 relative z-10">
            {/* Header */}
            <div className="text-center mb-12">
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 text-xs font-bold tracking-widest uppercase mb-3 border border-pink-100 dark:border-pink-800"
              >
                Save The Dates
              </motion.span>
              <h1 className="text-3xl md:text-5xl font-bold font-serif bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Wedding Events
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base max-w-2xl mx-auto italic leading-relaxed">
                &quot;We invite you to share in our joy at the following events as we begin our new journey together.&quot;
              </p>
            </div>

            {/* Events Grid */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {Object.entries(events).map(([key, event], index) => {
                const eventDate = parseDate(event.date);
                // Mark as completed only after one full day has passed (24 hours after end of day)
                const completionThreshold = new Date(eventDate);
                completionThreshold.setDate(completionThreshold.getDate() + 1);
                completionThreshold.setHours(23, 59, 59, 999);
                
                const isPast = currentDate ? currentDate > completionThreshold : false;

                return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className={`group relative flex flex-col items-center bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-6 transition-all duration-300 
                    ${isPast 
                      ? "opacity-60 grayscale hover:opacity-80 hover:grayscale-0" 
                      : "hover:shadow-xl hover:shadow-pink-500/10 dark:hover:shadow-pink-500/5 hover:-translate-y-1"
                    }`}
                >
                  {isPast && (
                    <div className="absolute top-4 right-4 bg-gray-100 dark:bg-gray-800 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider border border-gray-200 dark:border-gray-700">
                      Completed
                    </div>
                  )}

                  <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-pink-200 dark:via-pink-800 to-transparent transition-opacity ${isPast ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`} />
                  
                  <h3 className="font-serif font-bold text-xl text-gray-800 dark:text-gray-100 mb-6 text-center">
                    {event.title}
                  </h3>

                  <div className="w-full space-y-4 flex-grow">
                    <div className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                      <CalendarIcon className="w-5 h-5 text-pink-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold">{event.date}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                      <ClockIcon className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                      <p>{event.time}</p>
                    </div>

                    <div className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                      <MapPinIcon className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">{event.venue}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{event.direction}</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    as={Link}
                    href={event.mapHref}
                    isExternal
                    className={`mt-8 w-full font-medium shadow-sm border
                      ${isPast 
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700 cursor-not-allowed" 
                        : "bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 hover:from-pink-100 hover:to-purple-100 dark:hover:from-pink-900/40 dark:hover:to-purple-900/40 text-pink-700 dark:text-pink-300 border-pink-100 dark:border-pink-800/50"
                      }`}
                    variant="flat"
                    isDisabled={isPast || event.mapHref === "#"}
                    endContent={
                      <MapPinIcon className="w-4 h-4 opacity-50" />
                    }
                  >
                    {isPast ? "Event Concluded" : "View Map"}
                  </Button>
                </motion.div>
              );})}
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
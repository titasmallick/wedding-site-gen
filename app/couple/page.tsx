"use client";

import { motion } from "framer-motion";
import { Card, CardBody, CardFooter, Image, Button } from "@heroui/react";
import { Link } from "@heroui/link";

import { fontCursive } from "@/config/fonts";
import OurStorySection from "@/components/OurStory";
import { HeartFilledIcon } from "@/components/icons";

export default function CouplePage() {
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <section className="relative py-20 text-center px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-wedding-pink-100/40 dark:bg-wedding-pink-900/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <h1
            className={`${fontCursive.className} text-6xl md:text-8xl bg-gradient-to-r from-wedding-pink-600 to-wedding-gold-600 bg-clip-text text-transparent mb-6 py-4 leading-normal`}
          >
            The Couple
          </h1>
          <p className="text-default-500 dark:text-default-400 text-lg uppercase tracking-widest">
            Two Souls, One Heart
          </p>
        </motion.div>
      </section>

      {/* Profile Cards */}
      <section className="container mx-auto px-4 max-w-6xl mb-20">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          {/* Bride Profile */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <Card className="w-full aspect-[3/4] max-w-md border-none shadow-2xl overflow-visible group">
              <CardBody className="p-0 overflow-hidden rounded-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10 opacity-80 group-hover:opacity-100 transition-opacity" />
                <Image
                  removeWrapper
                  alt="Bride"
                  className="z-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  src="/bride.jpg"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                  <h3 className={`${fontCursive.className} text-4xl mb-1`}>
                    Bride
                  </h3>
                  <p className="text-white/80 font-medium">The Bride</p>
                </div>
              </CardBody>
              <CardFooter className="flex-col items-start pt-6 px-4 pb-4">
                <p className="italic text-default-500 mb-4">
                  &quot;Grace in her smile, strength in her soul.&quot;
                </p>
                <div className="w-full flex justify-between items-center">
                  <p className="text-sm font-semibold text-wedding-pink-600 dark:text-wedding-pink-400">
                    Biology Teacher
                  </p>
                  <Button
                    as={Link}
                    className="font-medium"
                    color="danger"
                    href="/sukanya"
                    size="sm"
                    variant="light"
                  >
                    Know More
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Groom Profile */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <Card className="w-full aspect-[3/4] max-w-md border-none shadow-2xl overflow-visible group">
              <CardBody className="p-0 overflow-hidden rounded-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10 opacity-80 group-hover:opacity-100 transition-opacity" />
                <Image
                  removeWrapper
                  alt="Groom"
                  className="z-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  src="/groom.jpg"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                  <h3 className={`${fontCursive.className} text-4xl mb-1`}>
                    Groom
                  </h3>
                  <p className="text-white/80 font-medium">The Groom</p>
                </div>
              </CardBody>
              <CardFooter className="flex-col items-start pt-6 px-4 pb-4">
                <p className="italic text-default-500 mb-4">
                  &quot;Steady and kind, he leads with heart.&quot;
                </p>
                <div className="w-full flex justify-between items-center">
                  <p className="text-sm font-semibold text-wedding-pink-600 dark:text-wedding-pink-400">
                    Biology Teacher
                  </p>
                  <Button
                    as={Link}
                    className="font-medium"
                    color="danger"
                    href="/titas"
                    size="sm"
                    variant="light"
                  >
                    Know More
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-wedding-pink-50/50 dark:bg-wedding-pink-900/5 skew-y-3 transform origin-top-left -z-10" />
        <OurStorySection />
      </section>

      {/* Navigation Links */}
      <section className="container mx-auto px-4 mt-16 text-center">
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            as={Link}
            className="bg-wedding-pink-100 text-wedding-pink-700 font-semibold shadow-md hover:bg-wedding-pink-200 dark:bg-wedding-pink-900/40 dark:text-wedding-pink-200"
            href="/memories"
            size="lg"
            startContent={<HeartFilledIcon className="text-wedding-pink-500" />}
          >
            Our Memories
          </Button>
          <Button
            as={Link}
            className="bg-wedding-gold-100 text-wedding-gold-800 font-semibold shadow-md hover:bg-wedding-gold-200 dark:bg-wedding-gold-500 dark:text-black dark:hover:bg-wedding-gold-400"
            href="/mark-the-dates"
            size="lg"
          >
            Mark the Dates
          </Button>
        </div>
      </section>
    </div>
  );
}

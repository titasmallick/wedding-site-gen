"use client";

import { motion } from "framer-motion";
import { Card, CardBody, Divider } from "@heroui/react";

import { fontCursive, fontSans, fontMono } from "@/config/fonts";
import {
  HeartFilledIcon,
  SunFilledIcon,
  MoonFilledIcon,
} from "@/components/icons";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8 },
};

const tenets = [
  {
    title: "Light in the Void",
    desc: "The universe is silent and indifferent — this is freedom. Meaning is ours to create.",
    icon: <SunFilledIcon className="text-wedding-gold-500 w-6 h-6" />,
  },
  {
    title: "Presence Over Promise",
    desc: "There is no afterlife. The present moment is sacred enough.",
    icon: <MoonFilledIcon className="text-indigo-400 w-6 h-6" />,
  },
  {
    title: "Compassion Without Karma",
    desc: "Kindness is not transactional. It is our natural responsibility.",
    icon: <HeartFilledIcon className="text-wedding-pink-500 w-6 h-6" />,
  },
  {
    title: "Mindfulness Without Myth",
    desc: "We seek awareness, not awakening. Lucidity is the goal, not enlightenment.",
    icon: <div className="w-6 h-6 rounded-full border-2 border-default-400" />,
  },
  {
    title: "Reason with Reverence",
    desc: "Science and logic illuminate reality — but so do stillness and art.",
    icon: (
      <div className="w-6 h-6 rotate-45 border-2 border-wedding-gold-400" />
    ),
  },
  {
    title: "Impermanence as Inspiration",
    desc: "Nothing lasts — and that makes everything matter more.",
    icon: <div className="w-6 h-6 border-b-2 border-default-500" />,
  },
];

export default function NeoLucentismPage() {
  return (
    <div className="w-full min-h-screen pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4 flex flex-col items-center text-center">
        {/* Celestial background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 dark:bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-2 h-2 bg-wedding-gold-400 rounded-full animate-pulse" />
        <div className="absolute bottom-40 right-1/4 w-1.5 h-1.5 bg-wedding-pink-400 rounded-full animate-pulse delay-700" />

        <motion.div {...fadeInUp} className="relative z-10">
          <h1
            className={`${fontCursive.className} text-6xl md:text-8xl lg:text-9xl bg-gradient-to-r from-indigo-500 via-purple-500 to-wedding-gold-500 bg-clip-text text-transparent mb-8 py-4 leading-normal`}
          >
            Neo-Lucentism
          </h1>
          <p className="text-default-500 dark:text-default-400 text-xl md:text-2xl italic max-w-2xl mx-auto font-light">
            &quot;We are lights in the void — brief, brilliant, and free.&quot;
          </p>
        </motion.div>
      </section>

      {/* Intro Text */}
      <section className="container mx-auto max-w-4xl px-6 mb-24">
        <motion.div
          {...fadeInUp}
          className={`${fontSans.className} text-lg md:text-xl leading-relaxed text-default-800 dark:text-white text-center border-y border-default-100 dark:border-white/10 py-12`}
        >
          Neo-Lucentism is a secular spiritual philosophy that embraces the
          absence of divine purpose as an invitation to create beauty, kindness,
          and meaning in the fleeting space between birth and death. It draws
          from humanism, secular Buddhism, and optimistic nihilism.
        </motion.div>
      </section>

      {/* Tenets Grid */}
      <section className="container mx-auto max-w-6xl px-4 mb-32">
        <h2
          className={`${fontMono.className} text-center text-3xl mb-16 uppercase tracking-widest text-default-400`}
        >
          The Core Tenets
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tenets.map((tenet, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <Card className="h-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-default-100 dark:border-white/10 hover:-translate-y-2 transition-transform duration-500 shadow-xl">
                <CardBody className="p-8 flex flex-col items-center text-center">
                  <div className="mb-6 p-4 rounded-full bg-default-50 dark:bg-white/5 shadow-inner">
                    {tenet.icon}
                  </div>
                  <h3
                    className={`${fontSans.className} text-xl font-bold mb-4 text-default-900 dark:text-white`}
                  >
                    {idx + 1}. {tenet.title}
                  </h3>
                  <p className="text-default-600 dark:text-gray-300">
                    {tenet.desc}
                  </p>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Practices & Ethics */}
      <section className="bg-default-50 dark:bg-white/5 py-24 px-4 relative">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-16">
          <motion.div {...fadeInUp}>
            <h2
              className={`${fontSans.className} text-3xl font-bold mb-8 text-indigo-600 dark:text-indigo-400`}
            >
              Lucent Practices
            </h2>
            <ul className="space-y-6">
              {[
                "Begin your day with 2 minutes of silence or intentional breath.",
                "Reflect on impermanence — everything you experience is passing.",
                "Read or engage with one meaningful idea per day.",
                "Speak with clarity and compassion, even in disagreement.",
                "Offer kindness without needing a reason or reward.",
                "Create something — even a thought, a poem, a gesture.",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex gap-4 items-start text-default-700 dark:text-white text-lg"
                >
                  <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex-shrink-0 flex items-center justify-center text-xs font-bold mt-1">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            <h2
              className={`${fontSans.className} text-3xl font-bold mb-8 text-wedding-pink-600 dark:text-wedding-pink-400`}
            >
              Ethical Code
            </h2>
            <div className="space-y-10">
              <div>
                <h3 className="uppercase tracking-widest text-xs font-bold text-default-400 mb-4">
                  What to Do
                </h3>
                <ul className="space-y-4">
                  {[
                    "Act with empathy, not ego.",
                    "Be present with your sensations, emotions, and thoughts.",
                    "Question beliefs — including your own — with kindness.",
                    "Respect the silence between things. Practice mindful pauses.",
                    "Use reason and evidence while staying humble in knowledge.",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex gap-3 items-center text-default-700 dark:text-white"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Divider className="opacity-50" />
              <div>
                <h3 className="uppercase tracking-widest text-xs font-bold text-default-400 mb-4">
                  What Not to Do
                </h3>
                <ul className="space-y-4">
                  {[
                    "Do not claim certainty over the unknowable.",
                    "Do not seek salvation, judgment, or cosmic reward.",
                    "Do not harm in the name of truth, logic, or freedom.",
                    "Do not use Lucentism to divide or dominate.",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex gap-3 items-center text-default-700 dark:text-white"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How to Follow */}
      <section className="container mx-auto max-w-4xl px-6 py-32 text-center">
        <motion.div {...fadeInUp}>
          <h2
            className={`${fontSans.className} text-4xl font-bold mb-8 text-default-900 dark:text-white`}
          >
            Following the Light
          </h2>
          <p className="text-default-600 dark:text-gray-300 text-lg mb-12">
            You do not need rituals, temples, or dogma. To follow Lucentism is
            to live with awareness, compassion, and clarity. Connect with others
            not as followers, but as fellow lights in the void.
          </p>
          <div className="inline-flex flex-wrap justify-center gap-4">
            <div className="px-6 py-3 rounded-full bg-white dark:bg-white/5 border border-default-200 dark:border-white/10 text-default-700 dark:text-white font-medium">
              Daily Awareness
            </div>
            <div className="px-6 py-3 rounded-full bg-white dark:bg-white/5 border border-default-200 dark:border-white/10 text-default-700 dark:text-white font-medium">
              Radical Kindness
            </div>
            <div className="px-6 py-3 rounded-full bg-white dark:bg-white/5 border border-default-200 dark:border-white/10 text-default-700 dark:text-white font-medium">
              Lucid Creation
            </div>
          </div>
        </motion.div>
      </section>

      {/* Closing Creed */}
      <footer className="container mx-auto max-w-4xl px-6 py-20 border-t border-default-100 dark:border-white/10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          whileInView={{ opacity: 1 }}
        >
          <p
            className={`${fontCursive.className} text-3xl md:text-4xl lg:text-5xl text-default-800 dark:text-white italic leading-relaxed`}
          >
            &quot;There is no plan. There is no judge. <br />
            We are the brief awareness of the universe — and that is
            enough.&quot;
          </p>
        </motion.div>
      </footer>
    </div>
  );
}

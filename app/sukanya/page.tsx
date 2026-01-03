"use client";

import { Image, Button, Card, CardBody } from "@heroui/react";
import { Link } from "@heroui/link";

import { fontCursive, fontSans, fontMono } from "@/config/fonts";
import { HeartFilledIcon } from "@/components/icons";

export default function SukanyaPage() {
  return (
    <div className="w-full min-h-screen pb-20">
      {/* Hero / Intro */}
      <section className="relative py-16 md:py-24 px-4 bg-wedding-pink-50/50 dark:bg-wedding-pink-900/10 rounded-md">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row-reverse items-center gap-12">
          {/* Image */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-start">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 bg-wedding-pink-200 dark:bg-wedding-pink-800 rounded-full blur-2xl opacity-50 transform translate-x-4 translate-y-4" />
              <Image
                alt="Bride"
                className="rounded-full object-cover w-full h-full border-4 border-white dark:border-default-100 shadow-2xl z-10"
                src="/bride.jpg"
              />
            </div>
          </div>

          {/* Text */}
          <div className="w-full md:w-1/2 text-center md:text-right space-y-6">
            <h1
              className={`${fontCursive.className} text-6xl md:text-7xl text-wedding-pink-600 dark:text-wedding-pink-400`}
            >
              Bride Name
            </h1>
            <p
              className={`${fontMono.className} text-xl md:text-2xl text-default-600 dark:text-white font-medium`}
            >
              Dedicated Educator &amp; Compassionate Mentor
            </p>
            <p
              className={`${fontSans.className} text-lg text-default-700 dark:text-white leading-relaxed max-w-lg mx-auto md:ml-auto md:mr-0`}
            >
              A dedicated teacher with a strong academic background in Botany
              and an unwavering passion for nurturing young learners.
            </p>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="container mx-auto max-w-5xl px-4 py-16 space-y-16">
        {/* About */}
        <div className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <h2
              className={`${fontCursive.className} text-4xl text-wedding-pink-500 dark:text-wedding-pink-400 md:text-right`}
            >
              The Journey
            </h2>
          </div>
          <div className="md:col-span-8 space-y-4 text-default-700 dark:text-white text-lg leading-relaxed">
            <p>
              I strive to foster curiosity, empathy, and excellence in the
              classroom. My academic journey began at a reputable girls' school and continued with
              Botany Honours at college. I
              earned my Master&apos;s from a leading women's college, building a deep research
              orientation.
            </p>
            <p>
              Currently, I am a school teacher at a private school and a teaching partner at an educational firm, where I emphasize conceptual
              clarity and moral growth.
            </p>
          </div>
        </div>

        {/* Philosophy */}
        <div className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <h2
              className={`${fontCursive.className} text-4xl text-wedding-pink-500 dark:text-wedding-pink-400 md:text-right`}
            >
              My Philosophy
            </h2>
          </div>
          <div className="md:col-span-8 space-y-4 text-default-700 dark:text-white text-lg leading-relaxed">
            <p>
              Education is the most powerful tool for personal and social
              transformation. I design my lessons to balance structure with
              exploration, encouraging students to think independently and act
              ethically in an ever-changing world.
            </p>
          </div>
        </div>

        {/* Interests */}
        <div className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <h2
              className={`${fontCursive.className} text-4xl text-wedding-pink-500 dark:text-wedding-pink-400 md:text-right`}
            >
              Beyond Work
            </h2>
          </div>
          <div className="md:col-span-8 space-y-4 text-default-700 dark:text-white text-lg leading-relaxed">
            <p>
              I have a keen interest in Indian classical literature, nature
              walks, and visual arts. I often find inspiration in the harmony
              between traditional wisdom and modern scientific thought.
            </p>
            <p>
              Outside the classroom, I enjoy exploring plant biology and
              creating learner-friendly resources while staying connected to my
              cultural roots.
            </p>
          </div>
        </div>

        {/* Partner / Values */}
        <div className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <h2
              className={`${fontCursive.className} text-4xl text-wedding-pink-500 dark:text-wedding-pink-400 md:text-right`}
            >
              Love & Life
            </h2>
          </div>
          <div className="md:col-span-8 space-y-6 text-default-700 dark:text-white text-lg leading-relaxed">
            <p>
              I believe that marriage is a space for mutual upliftment, calm
              companionship, and respect for each other&apos;s individuality.
              Simplicity and emotional well-being are the values that shape my
              daily life.
            </p>

            <Card className="bg-wedding-pink-50 dark:bg-wedding-pink-900/20 border-none shadow-sm mt-6">
              <CardBody className="flex flex-col md:flex-row items-center gap-6 p-6">
                <HeartFilledIcon className="text-wedding-pink-500 w-12 h-12 flex-shrink-0" />
                <div>
                  <h3
                    className={`${fontCursive.className} text-2xl text-wedding-pink-600 dark:text-wedding-pink-300 mb-2`}
                  >
                    My Partner
                  </h3>
                  <p className="text-default-600 dark:text-white text-sm mb-4">
                    I found a partner in the Groom—someone who is sincere,
                    intellectually inclined, and my steady companion.
                  </p>
                  <Button
                    as={Link}
                    className="bg-wedding-gold-100 text-wedding-gold-700 font-semibold hover:bg-wedding-gold-200 dark:bg-wedding-gold-500 dark:text-black dark:hover:bg-wedding-gold-400"
                    href="/titas"
                    size="sm"
                  >
                    Meet Groom
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
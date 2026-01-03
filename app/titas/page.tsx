"use client";

import { Image, Button, Card, CardBody } from "@heroui/react";
import { Link } from "@heroui/link";

import { fontCursive, fontSans, fontMono } from "@/config/fonts";
import { HeartFilledIcon } from "@/components/icons";

export default function TitasPage() {
  return (
    <div className="w-full min-h-screen pb-20">
      {/* Hero / Intro */}
      <section className="relative py-16 md:py-24 px-4 bg-wedding-gold-50/50 dark:bg-wedding-pink-900/10 rounded-md">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center gap-12">
          {/* Image */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 bg-wedding-gold-200 dark:bg-wedding-gold-800 rounded-full blur-2xl opacity-50 transform translate-x-4 translate-y-4" />
              <Image
                alt="Groom"
                className="rounded-full object-cover w-full h-full border-4 border-white dark:border-default-100 shadow-2xl z-10"
                src="/groom.jpg"
              />
            </div>
          </div>

          {/* Text */}
          <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
            <h1
              className={`${fontCursive.className} text-6xl md:text-7xl text-wedding-gold-600 dark:text-wedding-gold-400`}
            >
              Groom Name
            </h1>
            <p
              className={`${fontMono.className} text-xl md:text-2xl text-default-600 dark:text-white font-medium`}
            >
              Visionary Edupreneur &amp; Changemaker
            </p>
            <p
              className={`${fontSans.className} text-lg text-default-700 dark:text-white leading-relaxed max-w-lg mx-auto md:mx-0`}
            >
              An educator by profession and a changemaker by passion.
              Transforming traditional education into a holistic, value-driven
              journey.
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
              className={`${fontCursive.className} text-4xl text-wedding-gold-500 dark:text-wedding-gold-400 md:text-right`}
            >
              The Journey
            </h2>
          </div>
          <div className="md:col-span-8 space-y-4 text-default-700 dark:text-white text-lg leading-relaxed">
            <p>
              With over a decade of experience, I have dedicated my life to
              nurturing young minds. From my roots at a reputable high school to achieving a state rank at college and mastering Microbiology at a leading university, my academic path has been driven by curiosity.
            </p>
            <p>
              Today, I serve at an educational institution and founded a learning platform, where I mentor students to look beyond textbooks and understand the beautiful complexity of life.
            </p>
          </div>
        </div>

        {/* Philosophy */}
        <div className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <h2
              className={`${fontCursive.className} text-4xl text-wedding-gold-500 dark:text-wedding-gold-400 md:text-right`}
            >
              My Philosophy
            </h2>
          </div>
          <div className="md:col-span-8 space-y-4 text-default-700 dark:text-white text-lg leading-relaxed">
            <p>
              Education is not just about grades; it&apos;s about empowerment. I
              advocate for inquiry-based learning and ethical living. My
              practice is grounded in creating balanced, interdisciplinary
              learning environments that foster critical thinking and empathy.
            </p>
          </div>
        </div>

        {/* Interests */}
        <div className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <h2
              className={`${fontCursive.className} text-4xl text-wedding-gold-500 dark:text-wedding-gold-400 md:text-right`}
            >
              Beyond Work
            </h2>
          </div>
          <div className="md:col-span-8 space-y-4 text-default-700 dark:text-white text-lg leading-relaxed">
            <p>
              My mind wanders through philosophy, literature, and the quiet
              wisdom of nature. I am developing a belief system blending humanism, secular spirituality, and optimistic nihilism.
            </p>
            <p>
              You&apos;ll often find me exploring heritage landscapes, writing
              reflectively, or simply advocating for a more mindful, ethical
              world.
            </p>
          </div>
        </div>

        {/* Partner / Values */}
        <div className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <h2
              className={`${fontCursive.className} text-4xl text-wedding-gold-500 dark:text-wedding-gold-400 md:text-right`}
            >
              Love & Life
            </h2>
          </div>
          <div className="md:col-span-8 space-y-6 text-default-700 dark:text-white text-lg leading-relaxed">
            <p>
              I believe in a partnership rooted in intellectual resonance and
              shared growth. I come from a family that values integrity and
              emotional intelligence, and I sought a partner who shares this
              vision.
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
                    I found that resonance in the Bride—graceful, strong, and my
                    companion in every adventure.
                  </p>
                  <Button
                    as={Link}
                    className="bg-wedding-gold-100 text-wedding-gold-700 font-semibold hover:bg-wedding-gold-200 dark:bg-wedding-gold-500 dark:text-black dark:hover:bg-wedding-gold-400"
                    href="/sukanya"
                    size="sm"
                  >
                    Meet Bride
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
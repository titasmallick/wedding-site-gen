"use client";

import { Card, CardHeader, CardFooter, Image } from "@heroui/react";

import { fontSans, fontCursive } from "@/config/fonts";

const images = [
  {
    src: "/Images/1.jpg",
    alt: "In tuition back in 2016",
    description: "One of our first pictures together.",
    width: 1200,
    height: 800,
    label: "2016",
  },
  {
    src: "/Images/2.jpg",
    alt: "Getting slightly close together",
    description: "Tried makeing a film together back then, but it was a flop.",
    width: 1200,
    height: 800,
    label: "2016",
  },
  {
    src: "/Images/3.jpg",
    alt: "Our College Days",
    description: "Hazy, but beautiful memories.",
    width: 1200,
    height: 800,
    label: "2016",
  },
  {
    src: "/Images/4.jpg",
    alt: "Our College Excursion",
    description: "Something happened that day, did not know it was love.",
    width: 1200,
    height: 800,
    label: "2016",
  },
  {
    src: "/Images/5.jpg",
    alt: "Getting back from the Excursion",
    description: "I may have fallen for her till then.",
    width: 1200,
    height: 800,
    label: "2016",
  },
  {
    src: "/Images/6.jpg",
    alt: "In Kolakham",
    description:
      "This picture has so many stories attatched to it. Maybe one day.",
    width: 1200,
    height: 800,
    label: "2016",
  },
  {
    src: "/Images/7.jpg",
    alt: "Last few days of college",
    description: "We were still not sure about our feelings.",
    width: 1200,
    height: 800,
    label: "2017",
  },
  {
    src: "/Images/8.jpg",
    alt: "College ended in a blink",
    description: "We were sure about our feelings, but not about our future.",
    width: 1200,
    height: 800,
    label: "2017",
  },
  {
    src: "/Images/9.jpg",
    alt: "University Days",
    description:
      "The days of our lives were getting busier, but we were still together.",
    width: 1200,
    height: 800,
    label: "2018",
  },
  {
    src: "/Images/9b.jpg",
    alt: "We were sure about our future",
    description: "We knew now a common path leads to the destination.",
    width: 1200,
    height: 800,
    label: "2018",
  },
  {
    src: "/Images/11.jpg",
    alt: "Eventually, the university days ended",
    description: "We grew together, and so did our love.",
    width: 1200,
    height: 800,
    label: "2019",
  },
  {
    src: "/Images/12.jpg",
    alt: "We never counted the days",
    description: "We just lived them.",
    width: 1200,
    height: 800,
    label: "2020",
  },
  {
    src: "/Images/13.jpg",
    alt: "Our FoodyCouple days",
    description: "Belive us or not, we were famous online for a while.",
    width: 1200,
    height: 800,
    label: "2021",
  },
  {
    src: "/Images/14.jpg",
    alt: "Our exploration days began",
    description:
      "We had entered a new phase of the relationship, one which gets pleased by the mountains and seas.",
    width: 1200,
    height: 800,
    label: "2021",
  },
  {
    src: "/Images/15.jpg",
    alt: "The buzz of the city",
    description: "Kolkata, a major city that nourishes our love.",
    width: 1200,
    height: 800,
    label: "2022",
  },
  {
    src: "/Images/16.jpg",
    alt: "Ahh, the mountains",
    description: "Another part of the story begins here.",
    width: 1200,
    height: 800,
    label: "2023",
  },
  {
    src: "/Images/17.jpg",
    alt: "We were full blown mountain-holics",
    description: "Once we started, we could not stop.",
    width: 1200,
    height: 800,
    label: "2024",
  },
  {
    src: "/Images/18.jpg",
    alt: "The Proposal",
    description:
      "After all the adventures, we finally decided to take the next step.",
    width: 1200,
    height: 800,
    label: "2025",
  },
];

const pwImages = Array.from({ length: 57 }, (_, i) => {
  const num = String(i + 1).padStart(3, "0");

  return {
    src: `/pw/${num}.jpg`,
    alt: `Memory ${num}`,
    description: `A cherished moment number ${num}.`,
    width: 1200,
    height: 800,
    label: "Pre-Wedding",
  };
});

export default function Gallery() {
  return (
    <div className="container mx-auto max-w-7xl px-4">
      <div className="max-w-3xl mx-auto mb-16 text-center">
        <p
          className={`${fontSans.className} text-lg md:text-xl leading-relaxed text-default-800 dark:text-gray-100`}
        >
          This is our journey from 2016 into the unfolding future. Fueled by a
          quiet juvenoia, we found ourselves drawn more to the nostalgia of the
          past than the immediacy of the present — choosing frames that echo
          where we began rather than where we stand.
        </p>
      </div>

      {/* Pre-Wedding Video */}
      <section className="w-full py-10 flex flex-col items-center gap-8 mb-16">
        <h3
          className={`${fontCursive.className} text-4xl md:text-5xl text-center text-wedding-gold-600 dark:text-wedding-gold-400`}
        >
          Our Pre-Wedding Video
        </h3>
        <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-white/10">
          <iframe
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            className="w-full h-full"
            referrerPolicy="strict-origin-when-cross-origin"
            src="https://www.youtube.com/embed/a_RV8HevyBE"
            title="... For . Life"
          />
        </div>
      </section>

      {/* Pre-Wedding Photos */}
      <section className="mb-20">
        <div className="flex items-center justify-center mb-10">
          <h3
            className={`${fontCursive.className} text-4xl md:text-5xl text-center text-wedding-pink-600 dark:text-wedding-pink-400`}
          >
            The Pre-Wedding
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pwImages.map((img, index) => (
            <Card
              key={index}
              className="w-full aspect-[4/5] border-none shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader className="absolute z-10 top-2 left-2 flex-col items-start p-0">
                <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg">
                  <p className="text-tiny text-white/90 uppercase font-bold tracking-wider">
                    {img.label}
                  </p>
                </div>
              </CardHeader>

              <Image
                removeWrapper
                alt={img.alt}
                className="z-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                src={img.src}
              />

              <CardFooter className="absolute bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent w-full p-4 pt-12">
                <p
                  className={`${fontSans.className} text-white/90 text-sm font-medium`}
                >
                  {img.description}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* The Memories */}
      <section className="mb-20">
        <div className="flex items-center justify-center mb-10">
          <h3
            className={`${fontCursive.className} text-4xl md:text-5xl text-center text-wedding-pink-600 dark:text-wedding-pink-400`}
          >
            The Memories
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, index) => (
            <Card
              key={index}
              className="w-full aspect-[4/5] border-none shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader className="absolute z-10 top-2 left-2 flex-col items-start p-0">
                <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg">
                  <p className="text-tiny text-white/90 uppercase font-bold tracking-wider">
                    {img.label}
                  </p>
                </div>
              </CardHeader>

              <Image
                removeWrapper
                alt={img.alt}
                className="z-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                src={img.src}
              />

              <CardFooter className="absolute bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent w-full p-4 pt-12 text-left">
                <div>
                  <h4 className="text-white font-bold text-lg mb-1 drop-shadow-md">
                    {img.alt}
                  </h4>
                  <p className={`${fontSans.className} text-white/80 text-sm`}>
                    {img.description}
                  </p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Videos Section */}
      <section className="grid md:grid-cols-2 gap-8 mb-20">
        <div className="flex flex-col items-center gap-6">
          <h3
            className={`${fontCursive.className} text-3xl text-center text-wedding-pink-600 dark:text-wedding-pink-400`}
          >
            The Proposal
          </h3>
          <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-default-200 dark:border-default-800">
            <iframe
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              className="w-full h-full"
              referrerPolicy="strict-origin-when-cross-origin"
              src="https://www.youtube.com/embed/F1fJ9kvXvPQ"
              title="And... I asked Her..."
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <h3
            className={`${fontCursive.className} text-3xl text-center text-wedding-pink-600 dark:text-wedding-pink-400`}
          >
            Our Theme Song
          </h3>
          <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-default-200 dark:border-default-800">
            <iframe
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              className="w-full h-full"
              referrerPolicy="strict-origin-when-cross-origin"
              src="https://www.youtube.com/embed/mzrBfpUExVM"
              title="... For . Life"
            />
          </div>
        </div>
      </section>

      {/* Travel Diary */}
      <section className="w-full pb-10">
        <h3
          className={`${fontCursive.className} text-4xl md:text-5xl text-center mb-10 text-wedding-gold-600 dark:text-wedding-gold-400`}
        >
          Our Travel Diary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            "https://www.youtube.com/embed/-LY7GQCjsJo",
            "https://www.youtube.com/embed/pY8kd0KWLGo",
            "https://www.youtube.com/embed/EoH4BgPsaRo",
            "https://www.youtube.com/embed/8vvfKYIVdBw",
            "https://www.youtube.com/embed/aSB7BP9rlC4",
            "https://www.youtube.com/embed/5I9YNmre_0Q",
            "https://www.youtube.com/embed/l_vWvQVCZdk",
            "https://www.youtube.com/embed/qDuK8hCnvzc",
            "https://www.youtube.com/embed/gF_q7YOFN1c",
            "https://www.youtube.com/embed/4Yo80j89xvE",
            "https://www.youtube.com/embed/UMkCb9lCY_M",
            "https://www.youtube.com/embed/X-U-rSav8_s",
            "https://www.youtube.com/embed/GUslhHpDtYs",
          ].map((src, index) => (
            <div
              key={index}
              className="aspect-video rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-default-100 dark:border-default-800"
            >
              <iframe
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                className="w-full h-full"
                referrerPolicy="strict-origin-when-cross-origin"
                src={src}
                title={`Travel Video ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

"use client";

import { fontCursive } from "@/config/fonts";
import Gallery from "@/components/Gallery";

export default function MemoriesPage() {
  return (
    <div className="w-full min-h-screen pb-20">
      <section className="relative py-16 md:py-24 text-center px-4 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-wedding-pink-100/40 dark:bg-wedding-pink-900/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <h1
            className={`${fontCursive.className} text-5xl md:text-7xl lg:text-8xl bg-gradient-to-r from-wedding-pink-600 to-wedding-gold-600 bg-clip-text text-transparent mb-6 py-4 leading-normal`}
          >
            Days of Future Past
          </h1>
          <p className="text-default-500 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto italic">
            &quot;Frames that echo where we began, rather than where we
            stand.&quot;
          </p>
        </div>
      </section>

      <Gallery />
    </div>
  );
}

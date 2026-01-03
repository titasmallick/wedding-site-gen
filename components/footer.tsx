import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";

import { fontCursive } from "@/config/fonts";
import { HeartFilledIcon } from "@/components/icons";
import { AdminAuth } from "./AdminAuth";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-wedding-cream dark:bg-black/40 border-t border-wedding-pink-100 dark:border-white/10 pt-12 pb-8">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          {/* Column 1: Brand/Names */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h2
              className={`${fontCursive.className} text-4xl text-wedding-pink-600 dark:text-wedding-pink-400`}
            >
              Titas & Sukanya
            </h2>
            <p className="text-default-500 text-sm max-w-xs leading-relaxed">
              We can&apos;t wait to celebrate our special day with you. Thank
              you for being part of our journey.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-center space-y-4">
            <h3 className="uppercase tracking-widest text-xs font-bold text-default-400 mb-2">
              Explore
            </h3>
            <div className="flex flex-col space-y-2">
              <Link
                className="hover:text-wedding-pink-500 transition-colors"
                color="foreground"
                href="/"
              >
                Home
              </Link>
              <Link
                className="hover:text-wedding-pink-500 transition-colors"
                color="foreground"
                href="/couple"
              >
                Our Story
              </Link>
              <Link
                className="hover:text-wedding-pink-500 transition-colors"
                color="foreground"
                href="/memories"
              >
                Gallery
              </Link>
            </div>
          </div>

          {/* Column 3: Contact/Action */}
          <div className="flex flex-col items-center md:items-end space-y-4">
            <h3 className="uppercase tracking-widest text-xs font-bold text-default-400 mb-2">
              Wedding Hashtag
            </h3>
            <p className="font-serif text-xl italic text-default-600">
              #TitasWedsSukanya
            </p>
            <div className="flex gap-4 mt-2">
              {/* Social placeholders or contact icons could go here */}
            </div>
          </div>
        </div>

        <Divider className="my-8 opacity-50" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-default-400">
          <div className="flex items-center gap-1">
            <span>&copy; {currentYear} Made with</span>
            <HeartFilledIcon className="text-wedding-pink-500 w-3 h-3 animate-pulse" />
            <span>by Titas Mallick</span>
            <AdminAuth />
          </div>

          <div className="flex gap-6">
            <span className="text-default-400 italic">
              Celebrate Love & Happiness
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

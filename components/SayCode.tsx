"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const SayCode = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Determine if we are on an invitation guest page
  const isInvitationSlugPage = pathname.startsWith("/invitation/") && pathname !== "/invitation/maker";   

  useEffect(() => {
    // 1. Date Range Check (January 21 to January 27)
    const now = new Date();
    const currentYear = now.getFullYear();
    const startDate = new Date(currentYear, 0, 21); // Jan 21 (Month is 0-indexed)
    const endDate = new Date(currentYear, 0, 27, 23, 59, 59); // Jan 27, end of day

    const isInDateRange = now >= startDate && now <= endDate;

    // 2. Responsive Check
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // 3. Visibility Logic
    const dismissed = localStorage.getItem("sayCodeDismissed");

    // Only show if: not dismissed, not on invitation page, AND within date range
    if (!dismissed && !isInvitationSlugPage && isInDateRange) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", checkMobile);
      };
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, [pathname, isInvitationSlugPage]);

  // Don't render if on invitation slug page
  if (isInvitationSlugPage) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("sayCodeDismissed", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: isMobile ? -20 : 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: isMobile ? -20 : 20, scale: 0.95 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
          className="fixed z-[100] w-full max-w-sm px-4 top-6 left-0 right-0 mx-auto sm:top-auto sm:bottom-6 sm:left-6 sm:right-auto sm:mx-0"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/70 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl dark:bg-black/60 dark:border-white/10">

            <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/40 to-transparent opacity-50 dark:from-white/10" />

            <div className="relative z-10 flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>

              <div className="flex-1 pt-0.5">
                <h3 className="text-base font-semibold text-foreground">
                  Security Access
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-foreground/80">
                  Use <span className="font-bold text-primary">"10"</span> as the
                  answer for any security questions on this site.
                </p>
                <p className="mt-2 text-[10px] leading-tight text-foreground/40 italic">
                  *This security layer is implemented to protect input fields from automated bot attacks. 
                </p>
              </div>

              <button
                onClick={handleDismiss}
                className="-mr-2 -mt-2 rounded-full p-2 text-foreground/50 transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
                aria-label="Dismiss"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SayCode;

"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { fontCursive } from "@/config/fonts";
import {
  HeartFilledIcon,
  CalendarIcon,
  MapPinIcon,
  Logo,
} from "@/components/icons";

const getIcon = (label: string) => {
  switch (label.toLowerCase()) {
    case "home":
      return <HeartFilledIcon size={18} />;
    case "our story":
      return <Logo size={18} />;
    case "events":
      return <CalendarIcon size={18} />;
    case "gallery":
      return <HeartFilledIcon size={18} />;
    case "travel guide":
      return <MapPinIcon size={18} />;
    default:
      return <HeartFilledIcon size={18} />;
  }
};

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <HeroUINavbar
      className="bg-wedding-cream/80 dark:bg-black/80 backdrop-blur-md"
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <p
              className={`${fontCursive.className} font-bold text-2xl md:text-3xl text-wedding-pink-600 dark:text-wedding-pink-400`}
            >
              T & S
            </p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-4">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-wedding-pink-500 data-[active=true]:font-medium hover:text-wedding-pink-500 transition-colors",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <Button
            as={Link}
            className="text-sm font-normal bg-wedding-pink-100 text-wedding-pink-700 hover:bg-wedding-pink-200 dark:bg-wedding-pink-900/30 dark:text-wedding-pink-200 dark:hover:bg-wedding-pink-900/50"
            href={"/sagun"}
            startContent={<HeartFilledIcon className="text-wedding-pink-500" />}
            variant="flat"
          >
            Send Wishes
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="flex items-center justify-center gap-2.5 ml-2 px-4 py-1.5 h-10 w-auto rounded-full bg-gradient-to-r from-wedding-pink-50 to-wedding-cream dark:from-wedding-pink-900/20 dark:to-zinc-900 border-1.5 border-wedding-pink-200/50 dark:border-wedding-pink-800/50 text-wedding-pink-600 dark:text-wedding-pink-400 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-wedding-pink-500/5"
        >
          <span className="text-[10px] font-black tracking-[0.2em] ml-1">
            {isMenuOpen ? "CLOSE" : "MENU"}
          </span>
          <div className="relative w-5 h-5 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {!isMenuOpen ? (
                <motion.div
                  key="menu-heart"
                  animate={{
                    opacity: 1,
                    scale: [1, 1.15, 1],
                  }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  transition={{
                    scale: {
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut",
                    },
                    opacity: { duration: 0.2 },
                  }}
                >
                  <HeartFilledIcon size={16} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu-close"
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: -180 }}
                  initial={{ opacity: 0, scale: 0.5, rotate: 180 }}
                  transition={{ duration: 0.3, ease: "backOut" }}
                >
                  <svg
                    fill="none"
                    height="16"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    width="16"
                  >
                    <line x1="18" x2="6" y1="6" y2="18" />
                    <line x1="6" x2="18" y1="6" y2="18" />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </NavbarMenuToggle>
      </NavbarContent>

      <NavbarMenu className="bg-wedding-cream/95 dark:bg-black/95 pt-12">
        <div className="mx-4 flex flex-col h-full">
          <div className="grid grid-cols-1 gap-3">
            {siteConfig.navMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item.href}-${index}`}>
                <Link
                  as={NextLink}
                  className="w-full flex items-center gap-4 py-4 px-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-wedding-pink-100/50 dark:border-wedding-pink-900/20 text-lg transition-all text-foreground hover:bg-wedding-pink-500 hover:text-white group"
                  color="foreground"
                  href={item.href}
                  onPress={() => setIsMenuOpen(false)}
                >
                  <span className="text-wedding-pink-500 group-hover:text-white transition-colors">
                    {getIcon(item.label)}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </NavbarMenuItem>
            ))}
          </div>

          <div className="mt-auto mb-12 flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-[1px] bg-wedding-pink-200" />
            <p
              className={`${fontCursive.className} text-3xl text-wedding-pink-600 dark:text-wedding-pink-400`}
            >
              Titas & Sukanya
            </p>
            <p className="text-[10px] uppercase tracking-[0.5em] text-default-400">
              January 2026
            </p>
          </div>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};

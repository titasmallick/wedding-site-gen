import {
  Geist as FontSans,
  Geist_Mono as FontMono,
  Great_Vibes as FontCursive,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontCursive = FontCursive({
  subsets: ["latin"],
  weight: "400", // Great Vibes only comes in 400
  variable: "--font-cursive",
});

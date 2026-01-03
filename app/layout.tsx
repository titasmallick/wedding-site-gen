import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Analytics } from "@vercel/analytics/next";

import Providers from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans, fontMono, fontCursive } from "@/config/fonts"; // include all fonts
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import ConciergeBot from "@/components/ConciergeBot";
import { SchemaMarkup } from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  metadataBase: new URL("your-wedding-site.com"),

  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Wedding",
    "Groom",
    "Bride",
    "Marriage",
    "Celebration",
    "Event",
  ],
  authors: [
    {
      name: "Groom Name",
      url: "your-wedding-site.com",
    },
  ],
  creator: "Groom Name",
  icons: {
    icon: "/love-birds.png",
    shortcut: "/love-birds.png",
    apple: "/love-birds.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "your-wedding-site.com",
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "your-wedding-site.com/invite.jpeg",
        width: 1200,
        height: 630,
        alt: "Wedding Invitation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["your-wedding-site.com/invite.jpeg"],
    creator: "@wedding",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      suppressHydrationWarning
      className={clsx(
        fontSans.variable,
        fontMono.variable,
        fontCursive.variable,
      )}
      lang="en"
    >
      <head>
        <SchemaMarkup />
      </head>
      <body
        className={clsx("min-h-screen bg-background font-sans antialiased")}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <div className="relative flex flex-col h-screen">
            <Navbar />
            <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
              {children}
            </main>
            <Footer />
            <Analytics />
            <ConciergeBot />
          </div>
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;

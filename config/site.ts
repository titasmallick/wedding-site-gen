export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Groom & Bride",
  description:
    "Join us in celebrating the wedding of Groom and Bride. Save the date and be part of our journey.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Our Story",
      href: "/couple",
    },
    {
      label: "Events",
      href: "/mark-the-dates",
    },
    {
      label: "Guestbook",
      href: "/guestbook",
    },
    {
      label: "Songs",
      href: "/song-requests",
    },
    {
      label: "Travel Guide",
      href: "/travel-guide",
    },
    {
      label: "Gallery",
      href: "/memories",
    },
    {
      label: "Game",
      href: "/game",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Our Story",
      href: "/couple",
    },
    {
      label: "Events",
      href: "/mark-the-dates",
    },
    {
      label: "Guestbook",
      href: "/guestbook",
    },
    {
      label: "Game",
      href: "/game",
    },
    {
      label: "Gallery",
      href: "/memories",
    },
    {
      label: "Song Requests",
      href: "/song-requests",
    },
    {
      label: "Travel Guide",
      href: "/travel-guide",
    },
    {
      label: "Gift Registry",
      href: "/registry/maker", // Default to maker or info page if you have one
    },
    {
      label: "Send Wishes",
      href: "/sagun",
    },
  ],
  links: {
    // Keep empty or relevant social links if needed later
  },
};

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding Invitation | Groom & Bride",
  description:
    "We cordially invite you to celebrate the wedding of the couple. Click to view your personalized invitation and event details.",
  openGraph: {
    title: "You're Invited! | Wedding",
    description:
      "We would be honored to have you join us as we celebrate our wedding. View details for the ceremony and reception.",
    url: "your-wedding-site.com/invitation",
    siteName: "Groom & Bride",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "your-wedding-site.com/invite.jpeg", // Updated to use absolute URL for WhatsApp
        width: 1200,
        height: 630,
        alt: "Wedding Invitation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding Invitation | Groom & Bride",
    description: "Join us in celebrating our special day.",
    images: ["your-wedding-site.com/invite.jpeg"], // Updated to use absolute URL for WhatsApp
  },
};

export default function InvitationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full">{children}</div>;
}

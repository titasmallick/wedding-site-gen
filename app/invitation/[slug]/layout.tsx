import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding Invitation | Titas & Sukanya",
  description:
    "We cordially invite you to celebrate the wedding of Titas and Sukanya. Click to view your personalized invitation and event details.",
  openGraph: {
    title: "You're Invited! | Titas & Sukanya Wedding",
    description:
      "We would be honored to have you join us as we celebrate our wedding. View details for the ceremony and reception.",
    url: "https://www.titas-sukanya-for.life/invitation",
    siteName: "Titas & Sukanya",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://www.titas-sukanya-for.life/invite.jpeg", // Updated to use absolute URL for WhatsApp
        width: 1200,
        height: 630,
        alt: "Titas & Sukanya Wedding Invitation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding Invitation | Titas & Sukanya",
    description: "Join us in celebrating our special day.",
    images: ["https://www.titas-sukanya-for.life/invite.jpeg"], // Updated to use absolute URL for WhatsApp
  },
};

export default function InvitationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full">{children}</div>;
}

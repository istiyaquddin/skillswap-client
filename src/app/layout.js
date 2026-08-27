import { Toaster } from "react-hot-toast";
import Scroll from "../components/minor/Scroll";
import "./globals.css";

export const metadata = {
  title: {
    default: "SkillSwap — Campus Freelancing Platform",
    template: "%s | SkillSwap",
  },
  description:
    "SkillSwap is the premier peer-to-peer campus freelancing platform. Post tasks, hire verified student freelancers, and pay securely with Stripe escrow protection.",
  keywords: ["campus freelancing", "student freelancer", "escrow payments", "hire developers", "skill exchange", "peer-to-peer marketplace"],
  authors: [{ name: "SkillSwap Team" }],
  creator: "SkillSwap",
  metadataBase: new URL("https://skillswap-client-blush-two.vercel.app"),
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://skillswap-client-blush-two.vercel.app",
    siteName: "SkillSwap",
    title: "SkillSwap — Campus Freelancing Platform",
    description:
      "Post tasks, hire verified student freelancers, and pay securely with Stripe escrow protection.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillSwap — Campus Freelancing Platform",
    description:
      "Post tasks, hire verified student freelancers, and pay securely with Stripe escrow protection.",
    creator: "@skillswap",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <Scroll />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}

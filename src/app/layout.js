import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Scroll from "../components/minor/Scroll";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SkillSwap | Modern Freelance Marketplace",
  description: "A premium freelance marketplace for clients and creators.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Scroll />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}

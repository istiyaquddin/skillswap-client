import { Toaster } from "react-hot-toast";
import Scroll from "../components/minor/Scroll";
import "./globals.css";

export const metadata = {
  title: "SkillSwap | Modern Freelance Marketplace",
  description: "A premium freelance marketplace for clients and creators.",
  icons: {
    icon: "/favicon.svg",
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

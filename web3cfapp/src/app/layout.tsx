import type { Metadata } from "next";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import Navbar from "@/app/components/Navbar";

export const metadata: Metadata = {
  title: "Crowdfunding Factory",
  description:
    "A decentralized crowdfunding app enabling creators to raise funds transparently with smart contracts.",
  icons: {
    icon: "/crowdfundingIcon.svg",
    shortcut: "/crowdfundingIcon.svg",
    apple: "/crowdfundingIcon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-700">
        <ThirdwebProvider>
          <Navbar />
          {children}
        </ThirdwebProvider>
      </body>
    </html>
  );
}

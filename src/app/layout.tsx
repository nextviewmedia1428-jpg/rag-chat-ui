import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { ScrollNodeCanvas } from "@/components/ScrollNodeCanvas";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IKnowIt — One Agent. Knows It All.",
  description: "Train one AI agent on all your documentation. It becomes the single source of truth your team actually uses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="h-full bg-[#F8FAFC]">
        <ScrollNodeCanvas />
        <div className="relative z-10 h-full">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}

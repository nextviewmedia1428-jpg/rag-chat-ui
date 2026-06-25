import type { Metadata } from "next";
import { DM_Serif_Display, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { ScrollNodeCanvas } from "@/components/ScrollNodeCanvas";
import { OrbBackground } from "@/components/OrbBackground";

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const ibmMono = IBM_Plex_Mono({
  variable: "--font-ibm-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IKnowIt — One Agent. Knows It All.",
  description:
    "Train one AI agent on all your documentation. It becomes the single source of truth your team actually uses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${dmSerif.variable} ${instrumentSans.variable} ${ibmMono.variable} h-full antialiased`}
    >
      <body className="h-full">
        <OrbBackground />
        <ScrollNodeCanvas />
        <div className="relative z-10 h-full">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}

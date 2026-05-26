import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ParticlesBackground from "@/components/ParticlesBackground";
import InteractiveCursor from "@/components/InteractiveCursor";
import Preloader from "@/components/Preloader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Priya | Immersive Frontend Developer & 3D Designer",
  description: "Bespoke high-fidelity UI engineering, fluid GSAP ScrollTriggers, and optimized WebGL/Three.js interactive experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="flex flex-col bg-[#0a0a0a] text-white overflow-x-hidden">
        <Preloader />
        <ParticlesBackground />
        <InteractiveCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}

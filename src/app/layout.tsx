import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ParticlesBackground from "@/components/ParticlesBackground";
import InteractiveCursor from "@/components/InteractiveCursor";
import Preloader from "@/components/Preloader";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
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
      className={`${lato.variable} antialiased`}
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

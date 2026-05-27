"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ShaderHoverImage from "@/components/ShaderHoverImage";
import HeroSection from "@/components/home/HeroSection";

export default function Home() {
  const workContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Dynamic Entrance & Scroll Reveal Animations for Project Cases
    const projectBoxes = workContainerRef.current?.querySelectorAll(".project-box");
    if (projectBoxes && projectBoxes.length > 0) {
      projectBoxes.forEach((box) => {
        gsap.fromTo(
          box,
          { y: 100, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: box,
              start: "top 85%",
              end: "top 55%",
              scrub: 1,
            },
          }
        );
      });
    }

    // Refresh ScrollTrigger calculations
    ScrollTrigger.refresh();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Background Columns Grid & Animated Falling Raindrops */}
      <div className="grid_overlay">
        <div className="grid_layout">
          <div className="grid_col"><div className="grid_raindrop" /></div>
          <div className="grid_col" />
          <div className="grid_col" />
          <div className="grid_col"><div className="grid_raindrop" /></div>
          <div className="grid_col" />
          <div className="grid_col"><div className="grid_raindrop" /></div>
        </div>
      </div>

      {/* Decorative Parallax Glow Elements */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-600/5 to-violet-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-fuchsia-600/5 to-pink-600/5 blur-[130px] pointer-events-none" />

      {/* Simplified Clean Header */}
      <nav className="fixed top-0 left-0 w-full z-40 py-6 px-6 md:px-16 flex justify-between items-center transition-all bg-gradient-to-b from-[#0a0a0a]/90 to-transparent backdrop-blur-[6px]">
        <div className="font-black text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400 select-none">
          PRIYA.DEV
        </div>
        <div className="text-xs font-bold tracking-widest uppercase text-zinc-500 select-none">
          WORKS SHOWCASE
        </div>
      </nav>

      {/* Interactive Custom Hero Section */}
      <HeroSection />

      {/* Main Content: Dedicated Selected Creations Showcase */}
      <main id="work" className="relative z-10 py-32 px-6 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto" ref={workContainerRef}>
          {/* Section Introduction */}
          <div className="mb-28 mt-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-12">
            <div>
              <span className="text-indigo-400 text-xs font-bold tracking-widest uppercase block mb-3">Case Studies</span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">SELECTED CREATIONS</h1>
            </div>
            <p className="max-w-md text-zinc-400 font-light leading-relaxed text-sm md:text-base">
              Bespoke high-fidelity user interfaces blending semantic React structure, responsive grid coordinates, and custom Three.js liquid wave mouse displacement shaders.
            </p>
          </div>

          {/* Cases timeline grid */}
          <div className="space-y-36">
            {/* Project 1 */}
            <div className="project-box grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <div className="lg:col-span-5 space-y-6">
                <div className="flex gap-4 items-center">
                  <span className="text-zinc-600 text-3xl font-black font-mono">01</span>
                  <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[9px] uppercase tracking-widest font-extrabold text-indigo-400">GSAP / ScrollTrigger</span>
                </div>
                <h3 className="text-3xl font-black tracking-tight hover:text-indigo-400 transition-colors duration-300">VORTEX INTERACTIVE</h3>
                
                <div className="space-y-4 text-sm text-zinc-400 font-light">
                  <div>
                    <strong className="text-white block font-bold text-xs uppercase tracking-wider mb-1">Description</strong>
                    <p>A premium digital data visualization platform mapping network analytics into real-time Awwwards-grade digital interfaces.</p>
                  </div>
                  <div>
                    <strong className="text-white block font-bold text-xs uppercase tracking-wider mb-1">X-Factor</strong>
                    <p>Features liquid fluid page transition, horizontal card pins, and customized procedural canvas rendering.</p>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-7 aspect-[4/3] w-full rounded-2xl overflow-hidden cursor-pointer hover-trigger" data-cursor-text="Interactive">
                <ShaderHoverImage src="/project_vortex.png" alt="Vortex project preview" />
              </div>
            </div>

            {/* Project 2 */}
            <div className="project-box grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <div className="lg:col-span-5 space-y-6 lg:order-2">
                <div className="flex gap-4 items-center">
                  <span className="text-zinc-600 text-3xl font-black font-mono">02</span>
                  <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[9px] uppercase tracking-widest font-extrabold text-fuchsia-400">Three.js / Custom Shaders</span>
                </div>
                <h3 className="text-3xl font-black tracking-tight hover:text-fuchsia-400 transition-colors duration-300">AETHER LABS</h3>

                <div className="space-y-4 text-sm text-zinc-400 font-light">
                  <div>
                    <strong className="text-white block font-bold text-xs uppercase tracking-wider mb-1">Description</strong>
                    <p>An immersive 3D digital laboratory displaying rendering capabilities, dynamic light reflections, and real-time custom materials shaders.</p>
                  </div>
                  <div>
                    <strong className="text-white block font-bold text-xs uppercase tracking-wider mb-1">X-Factor</strong>
                    <p>Constructed utilizing procedural canvas vertex coordinates, linked directly to interactive scroll position calculations.</p>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-7 aspect-[4/3] w-full rounded-2xl overflow-hidden cursor-pointer hover-trigger lg:order-1" data-cursor-text="Fluid WebGL">
                <ShaderHoverImage src="/project_aether.png" alt="Aether project preview" />
              </div>
            </div>

            {/* Project 3 */}
            <div className="project-box grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <div className="lg:col-span-5 space-y-6">
                <div className="flex gap-4 items-center">
                  <span className="text-zinc-600 text-3xl font-black font-mono">03</span>
                  <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[9px] uppercase tracking-widest font-extrabold text-cyan-400">Tailwind CSS / NextJS</span>
                </div>
                <h3 className="text-3xl font-black tracking-tight hover:text-cyan-400 transition-colors duration-300">NEXUS DASHBOARD</h3>

                <div className="space-y-4 text-sm text-zinc-400 font-light">
                  <div>
                    <strong className="text-white block font-bold text-xs uppercase tracking-wider mb-1">Description</strong>
                    <p>Sleek glassmorphic business CRM dashboard containing dynamic tables, visual chart timelines, and rapid-filter databases.</p>
                  </div>
                  <div>
                    <strong className="text-white block font-bold text-xs uppercase tracking-wider mb-1">X-Factor</strong>
                    <p>High-speed responsive dashboard framework built on tailwind configuration resulting in excellent page load performance.</p>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-7 aspect-[4/3] w-full rounded-2xl overflow-hidden cursor-pointer hover-trigger" data-cursor-text="Sleek Grid">
                <ShaderHoverImage src="/project_nexus.png" alt="Nexus project preview" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Simplified Immersive Footer */}
      <footer className="relative z-10 py-16 px-6 md:px-16 lg:px-24 border-t border-zinc-900 bg-black/40 text-zinc-600 text-xs tracking-wider uppercase font-semibold">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <span className="text-zinc-400 font-bold block mb-1">PRIYA DEV STUDIO</span>
            <p className="font-light text-zinc-700">© 2026 Priya Dev Studio. All rights reserved.</p>
          </div>
          <div className="flex gap-8 text-zinc-500">
            <a href="#" className="hover-trigger hover:text-indigo-400 transition-colors" data-cursor-text="Social">GitHub</a>
            <a href="#" className="hover-trigger hover:text-indigo-400 transition-colors" data-cursor-text="Social">LinkedIn</a>
            <a href="#" className="hover-trigger hover:text-indigo-400 transition-colors" data-cursor-text="Social">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

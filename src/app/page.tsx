"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Home() {
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const heroSubtextRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Register ScrollTrigger with GSAP
    gsap.registerPlugin(ScrollTrigger);

    // 1. Navbar Scroll Effect (Adds background blur & border on scroll)
    const header = headerRef.current;
    if (header) {
      ScrollTrigger.create({
        start: "top -50px",
        onEnter: () => {
          gsap.to(header, {
            backgroundColor: "rgba(10, 10, 10, 0.75)",
            backdropFilter: "blur(12px)",
            borderBottomColor: "rgba(255, 255, 255, 0.1)",
            duration: 0.3,
          });
        },
        onLeaveBack: () => {
          gsap.to(header, {
            backgroundColor: "rgba(10, 10, 10, 0)",
            backdropFilter: "blur(0px)",
            borderBottomColor: "rgba(255, 255, 255, 0)",
            duration: 0.3,
          });
        },
      });
    }

    // 2. Hero Text Entry Animation (Awwwards-style staggered slide-up)
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    if (heroTextRef.current) {
      const words = heroTextRef.current.querySelectorAll(".animate-word");
      tl.fromTo(
        words,
        { y: "110%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.4, stagger: 0.12, delay: 0.3 }
      );
    }

    if (heroSubtextRef.current) {
      const subItems = heroSubtextRef.current.querySelectorAll(".animate-sub");
      tl.fromTo(
        subItems,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15 },
        "-=0.9"
      );
    }

    // 3. ScrollTrigger-based Portfolio Project Card Reveals (Smooth Scrub & Scale)
    const cards = cardsRef.current?.querySelectorAll(".portfolio-card");
    if (cards && cards.length > 0) {
      cards.forEach((card) => {
        // Create entrance reveal
        gsap.fromTo(
          card,
          { y: 100, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              end: "top 60%",
              scrub: 1,
            },
          }
        );

        // Hover tilt effect setup
        const inner = card.querySelector(".card-inner");
        if (inner) {
          card.addEventListener("mousemove", (e: any) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(inner, {
              rotateX: -y * 0.05,
              rotateY: x * 0.05,
              transformPerspective: 1000,
              ease: "power1.out",
              duration: 0.3,
            });
          });

          card.addEventListener("mouseleave", () => {
            gsap.to(inner, {
              rotateX: 0,
              rotateY: 0,
              ease: "power1.out",
              duration: 0.5,
            });
          });
        }
      });
    }

    // 4. Parallax scroll effect on decorative circles
    gsap.to(".parallax-glow-1", {
      y: -150,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
      },
    });

    gsap.to(".parallax-glow-2", {
      y: 120,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
      },
    });

    // Refresh triggers to ensure correct layout offset calculations
    ScrollTrigger.refresh();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white selection:bg-indigo-500 selection:text-white overflow-hidden">
      {/* Background Decorative Glowing Parallax Elements */}
      <div className="parallax-glow-1 absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-600/10 to-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="parallax-glow-2 absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-fuchsia-600/10 to-pink-600/10 blur-[130px] pointer-events-none" />

      {/* Floating Header */}
      <header
        ref={headerRef}
        className="fixed top-0 left-0 w-full z-50 border-b border-transparent transition-colors py-5 px-6 md:px-12 flex justify-between items-center"
      >
        <div className="text-xl font-bold tracking-wider bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
          MUIZZ.STUDIO
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-zinc-400">
          <a href="#work" className="hover:text-white transition-colors duration-200">Work</a>
          <a href="#about" className="hover:text-white transition-colors duration-200">About</a>
          <a href="#contact" className="hover:text-white transition-colors duration-200">Contact</a>
        </nav>
        <button className="px-5 py-2 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-zinc-200 transition-colors duration-300">
          Let's Talk
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-24">
        <div className="max-w-5xl">
          <h1
            ref={heroTextRef}
            className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none mb-8"
          >
            <span className="block overflow-hidden py-1">
              <span className="inline-block animate-word">CRAFTING</span>
            </span>
            <span className="block overflow-hidden py-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              <span className="inline-block animate-word">DIGITAL</span>
            </span>
            <span className="block overflow-hidden py-1">
              <span className="inline-block animate-word">EXPERIENCES.</span>
            </span>
          </h1>

          <div ref={heroSubtextRef} className="max-w-xl text-zinc-400 text-lg md:text-xl font-light space-y-6">
            <p className="animate-sub leading-relaxed">
              We design and build immersive high-fidelity websites. Unifying perfect typography, custom smooth scrolling, and bespoke, hardware-accelerated animations.
            </p>
            <div className="animate-sub flex gap-4 pt-4">
              <a
                href="#work"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all duration-300"
              >
                Explore Work
              </a>
              <a
                href="#about"
                className="px-6 py-3 rounded-full border border-zinc-800 text-zinc-300 font-semibold text-sm hover:bg-zinc-900 transition-colors duration-300"
              >
                Our Method
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-6 md:left-16 lg:left-24 flex items-center gap-3">
          <div className="w-5 h-8 border-2 border-zinc-700 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-indigo-400 rounded-full animate-bounce" />
          </div>
          <span className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Scroll down</span>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="work" className="py-32 px-6 md:px-16 lg:px-24 border-t border-zinc-900 bg-[#080808]/60">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-indigo-400 text-xs font-semibold tracking-widest uppercase block mb-3">Selected Portfolios</span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">FEATURED CREATIONS</h2>
            </div>
            <p className="max-w-md text-zinc-400 font-light leading-relaxed">
              A curated collection of web apps where fluidity meets performance. Built from scratch with state management, Next.js optimization, and custom scrolling systems.
            </p>
          </div>

          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            {/* Project 1 */}
            <div className="portfolio-card cursor-pointer group">
              <div className="card-inner relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 to-indigo-950 border border-zinc-800 p-8 flex flex-col justify-between transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                {/* Visual Glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="z-10 flex justify-between items-start">
                  <span className="px-3 py-1 rounded-full bg-zinc-950/80 border border-zinc-800 text-[10px] uppercase tracking-wider font-semibold">Web Development</span>
                  <span className="text-zinc-500 group-hover:text-indigo-400 transition-colors duration-300 text-xl font-bold">↗</span>
                </div>
                <div className="z-10">
                  <span className="text-zinc-500 text-xs font-bold tracking-widest uppercase block mb-1">01 / BRANDING</span>
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight group-hover:text-indigo-300 transition-colors duration-300">VORTEX INTERACTIVE</h3>
                </div>
              </div>
            </div>

            {/* Project 2 */}
            <div className="portfolio-card cursor-pointer group">
              <div className="card-inner relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 to-fuchsia-950 border border-zinc-800 p-8 flex flex-col justify-between transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="z-10 flex justify-between items-start">
                  <span className="px-3 py-1 rounded-full bg-zinc-950/80 border border-zinc-800 text-[10px] uppercase tracking-wider font-semibold">Bespoke Animation</span>
                  <span className="text-zinc-500 group-hover:text-fuchsia-400 transition-colors duration-300 text-xl font-bold">↗</span>
                </div>
                <div className="z-10">
                  <span className="text-zinc-500 text-xs font-bold tracking-widest uppercase block mb-1">02 / INTERACTION</span>
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight group-hover:text-fuchsia-300 transition-colors duration-300">AETHER LABS</h3>
                </div>
              </div>
            </div>

            {/* Project 3 */}
            <div className="portfolio-card cursor-pointer group">
              <div className="card-inner relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 to-cyan-950 border border-zinc-800 p-8 flex flex-col justify-between transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="z-10 flex justify-between items-start">
                  <span className="px-3 py-1 rounded-full bg-zinc-950/80 border border-zinc-800 text-[10px] uppercase tracking-wider font-semibold">User Experience</span>
                  <span className="text-zinc-500 group-hover:text-cyan-400 transition-colors duration-300 text-xl font-bold">↗</span>
                </div>
                <div className="z-10">
                  <span className="text-zinc-500 text-xs font-bold tracking-widest uppercase block mb-1">03 / PRODUCTIVITY</span>
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight group-hover:text-cyan-300 transition-colors duration-300">NEXUS DASHBOARD</h3>
                </div>
              </div>
            </div>

            {/* Project 4 */}
            <div className="portfolio-card cursor-pointer group">
              <div className="card-inner relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 to-amber-950 border border-zinc-800 p-8 flex flex-col justify-between transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-0 bg-gradient-to-t from-amber-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="z-10 flex justify-between items-start">
                  <span className="px-3 py-1 rounded-full bg-zinc-950/80 border border-zinc-800 text-[10px] uppercase tracking-wider font-semibold">SaaS Platform</span>
                  <span className="text-zinc-500 group-hover:text-amber-400 transition-colors duration-300 text-xl font-bold">↗</span>
                </div>
                <div className="z-10">
                  <span className="text-zinc-500 text-xs font-bold tracking-widest uppercase block mb-1">04 / E-COMMERCE</span>
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight group-hover:text-amber-300 transition-colors duration-300">SOLARIS MARKETPLACE</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 md:px-16 lg:px-24 border-t border-zinc-900 bg-black text-zinc-500 text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="text-white font-bold tracking-wider mb-2">MUIZZ.STUDIO</div>
            <p className="font-light text-zinc-600">© 2026 Muizz Studio. All rights reserved.</p>
          </div>
          <div className="flex gap-8 text-zinc-400 font-medium">
            <a href="#" className="hover:text-indigo-400 transition-colors">GitHub</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

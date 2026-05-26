"use client";

import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const preloaderRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    // Lock viewport scroll during loader reveal
    document.body.classList.add("no-scroll");

    const ring = ringRef.current;
    
    // SVG Circle Circumference => 2 * Math.PI * r => 2 * 3.14159 * 45 = ~283px
    const circumference = 283;

    // Failsafe safety timeout: Forces preloader dismissal and restores scroll
    // under any circumstances after 3.8 seconds to prevent layout locks.
    const safetyTimeout = setTimeout(() => {
      setIsLoaded(true);
      document.body.classList.remove("no-scroll");
    }, 3800);

    const timeline = gsap.timeline({
      onComplete: () => {
        // Animation Phase 2: Expand condensed brand text segment using bulletproof transform staggers
        const expandTl = gsap.timeline({
          onComplete: () => {
            // Animation Phase 3: Slide up the entire preloader overlay layer
            gsap.to(preloaderRef.current, {
              yPercent: -100,
              duration: 1.1,
              ease: "power4.inOut",
              onComplete: () => {
                setIsLoaded(true);
                document.body.classList.remove("no-scroll");
                clearTimeout(safetyTimeout);
              },
            });
          },
        });

        expandTl
          .to(".expand-char", {
            width: "1.2rem",
            opacity: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: "power2.out",
          })
          .to(
            ".loader-ring-wrapper",
            {
              scale: 0.7,
              opacity: 0,
              duration: 0.5,
              ease: "power3.in",
            },
            "-=0.5"
          );
      },
    });

    // Animation Phase 1: Count percentages and fill SVG progress ring
    const loaderObj = { value: 0 };
    timeline.to(loaderObj, {
      value: 100,
      duration: 2.2,
      ease: "power2.out",
      onUpdate: () => {
        const rounded = Math.floor(loaderObj.value);
        setProgress(rounded);

        // Fill progress circle stroke offsets
        if (ring) {
          const offset = circumference - (loaderObj.value / 100) * circumference;
          ring.style.strokeDashoffset = offset.toString();
        }
      },
    });

    return () => {
      document.body.classList.remove("no-scroll");
      clearTimeout(safetyTimeout);
    };
  }, []);

  if (isLoaded) return null;

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 w-full h-full bg-[#0a0a0a] z-[9999] flex flex-col items-center justify-center text-white"
    >
      <style dangerouslySetInnerHTML={{
        __html: `
          body.no-scroll {
            overflow: hidden !important;
            height: 100vh !important;
          }
        `
      }} />

      <div className="relative flex flex-col items-center justify-center">
        {/* Radial SVG Ring Progress Tracker */}
        <div className="loader-ring-wrapper absolute w-[280px] h-[280px] md:w-[360px] md:h-[360px] pointer-events-none z-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              className="ring-track fill-none stroke-zinc-900"
              strokeWidth="0.8"
              cx="50"
              cy="50"
              r="45"
            />
            <circle
              ref={ringRef}
              className="radial-ring-progress fill-none stroke-indigo-500"
              strokeWidth="1.2"
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="45"
            />
          </svg>
        </div>

        {/* Staggered Branding Text segments */}
        <div className="z-10 flex items-center justify-center text-3xl md:text-5xl font-black tracking-widest text-white select-none">
          <div className="flex overflow-hidden">
            <span>P</span>
            <span className="expand-char w-0 opacity-0 overflow-hidden inline-block whitespace-nowrap">r</span>
            <span className="expand-char w-0 opacity-0 overflow-hidden inline-block whitespace-nowrap">i</span>
            <span className="expand-char w-0 opacity-0 overflow-hidden inline-block whitespace-nowrap">y</span>
            <span className="expand-char w-0 opacity-0 overflow-hidden inline-block whitespace-nowrap">a</span>
          </div>
          <span className="mx-2 text-indigo-400">.</span>
          <div className="flex overflow-hidden">
            <span>D</span>
            <span className="expand-char w-0 opacity-0 overflow-hidden inline-block whitespace-nowrap">e</span>
            <span className="expand-char w-0 opacity-0 overflow-hidden inline-block whitespace-nowrap">v</span>
          </div>
        </div>

        {/* Counter Percentage indicator */}
        <div className="mt-8 text-zinc-500 text-sm font-mono tracking-widest z-10">
          {progress.toString().padStart(3, "0")}%
        </div>
      </div>
    </div>
  );
}

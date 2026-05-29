"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

// Awwwards-grade interactive magnetic nav item with elastic bounce
function NavItem({ href, label }: { href: string; label: string }) {
  const textRef = useRef<HTMLSpanElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Calculate cursor offset relative to the center of the nav link
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Pull the clean text towards the cursor for a gorgeous magnetic feel
    gsap.to(textRef.current, {
      x: x * 0.45,
      y: y * 0.45,
      duration: 0.35,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    // Springy elastic bounce snapping back to original centered shape
    gsap.to(textRef.current, {
      x: 0,
      y: 0,
      duration: 0.65,
      ease: "elastic.out(1, 0.35)",
    });
  };

  return (
    <a
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative px-3 py-2 flex items-center justify-center cursor-pointer group rounded-full overflow-visible"
    >
      {/* Intact text (magnetic movement, no background capsule distortion) */}
      <span
        ref={textRef}
        className="relative z-10 font-lato font-bold text-xs tracking-wider text-zinc-300 group-hover:text-white transition-colors duration-300 whitespace-nowrap"
        style={{ willChange: "transform" }}
      >
        {label}
      </span>
    </a>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const riyaRef = useRef<HTMLDivElement>(null);
  const spaceRef = useRef<HTMLDivElement>(null);
  const uptaRef = useRef<HTMLDivElement>(null);

  // Check screen size for hover vs tap triggers
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // Butter-smooth GSAP layout animation for navbar expansion and name door-slide reveal
  useEffect(() => {
    if (!navRef.current || !logoRef.current || !riyaRef.current || !spaceRef.current || !uptaRef.current) return;

    if (isOpen) {
      // Smoothly expand navbar container (compact to fit PG -> Priya Gupta perfectly!)
      gsap.to(navRef.current, {
        width: isMobile ? "calc(100vw - 48px)" : "420px",
        duration: 0.85,
        ease: "power4.out", // Super fluid decelerating curve
        overwrite: "auto",
      });

      // Smoothly expand logo container to full name width
      gsap.to(logoRef.current, {
        width: "90px",
        duration: 0.85,
        ease: "power4.out",
        overwrite: "auto",
      });

      // Door-slide reveal: expand "riya"
      gsap.to(riyaRef.current, {
        width: "32px",
        duration: 0.85,
        ease: "power4.out",
        overwrite: "auto",
      });

      // Door-slide reveal: expand space between names
      gsap.to(spaceRef.current, {
        width: "6px",
        duration: 0.85,
        ease: "power4.out",
        overwrite: "auto",
      });

      // Door-slide reveal: expand "upta"
      gsap.to(uptaRef.current, {
        width: "36px",
        duration: 0.85,
        ease: "power4.out",
        overwrite: "auto",
      });
    } else {
      // Smoothly collapse navbar container (compact for initials "PG")
      gsap.to(navRef.current, {
        width: "120px",
        duration: 0.75,
        ease: "power3.out", // Elegant soft deceleration
        overwrite: "auto",
      });

      // Smoothly collapse logo container to initials width
      gsap.to(logoRef.current, {
        width: "26px",
        duration: 0.75,
        ease: "power3.out",
        overwrite: "auto",
      });

      // Door-slide collapse: shrink "riya"
      gsap.to(riyaRef.current, {
        width: "0px",
        duration: 0.75,
        ease: "power3.out",
        overwrite: "auto",
      });

      // Door-slide collapse: shrink space
      gsap.to(spaceRef.current, {
        width: "0px",
        duration: 0.75,
        ease: "power3.out",
        overwrite: "auto",
      });

      // Door-slide collapse: shrink "upta"
      gsap.to(uptaRef.current, {
        width: "0px",
        duration: 0.75,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
  }, [isOpen, isMobile]);

  const handleMouseEnter = () => {
    if (!isMobile) setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile) setIsOpen(false);
  };

  const handleClick = () => {
    if (isMobile) setIsOpen(!isOpen);
  };

  return (
    <div
      ref={navRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="fixed top-6 left-6 md:left-16 z-[9999] flex items-center justify-between h-[52px] rounded-xl border border-white/10 bg-black px-4 shadow-[0_10px_30px_rgba(0,0,0,0.6)] cursor-pointer select-none overflow-hidden w-[120px]"
    >
      {/* Left Logo / Title Area (door-slides initials PG into Priya Gupta) */}
      <div
        ref={logoRef}
        className="relative flex-shrink-0 h-6 overflow-hidden w-[26px] flex items-center select-none"
      >
        <div className="font-lato text-sm font-bold tracking-normal text-white flex items-center select-none">
          {/* First Name component: P + (riya) */}
          <div className="flex items-center flex-shrink-0">
            <span className="font-black text-sm tracking-normal">P</span>
            <div
              ref={riyaRef}
              className="overflow-hidden h-6 flex items-center w-0 flex-shrink-0"
            >
              <span className="pl-[2px] font-bold text-sm tracking-normal text-white/95">riya</span>
            </div>
          </div>

          {/* Spacer component: ( ) */}
          <div
            ref={spaceRef}
            className="overflow-hidden h-6 flex items-center w-0 flex-shrink-0"
          >
            <span className="pl-[2px]">&nbsp;</span>
          </div>

          {/* Last Name component: G + (upta) */}
          <div className="flex items-center flex-shrink-0">
            <span className="font-black text-sm tracking-normal">G</span>
            <div
              ref={uptaRef}
              className="overflow-hidden h-6 flex items-center w-0 flex-shrink-0"
            >
              <span className="pl-[2px] font-bold text-sm tracking-normal text-white/95">upta</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Controls & Navigation */}
      <div className="flex items-center flex-shrink-0">
        {/* Navigation Links Grouped close together with equal beautiful spacing */}
        <div
          className={`flex items-center gap-2.5 transition-all duration-500 absolute right-4 ${
            isOpen
              ? "opacity-100 translate-x-0 pointer-events-auto delay-200"
              : "opacity-0 translate-x-28 pointer-events-none delay-0"
          }`}
        >
          <NavItem href="#work" label="Work &rarr;" />
          <NavItem href="#about" label="About &rarr;" />
          <NavItem href="#contact" label="Contact &rarr;" />
        </div>

        {/* Hamburger Icon / Menu indicator (Beautifully visible next to logo initials inside collapsed PG pill) */}
        <div
          className={`flex flex-col gap-1 pr-1 transition-all duration-500 ${
            isOpen ? "opacity-0 -translate-x-8 pointer-events-none absolute" : "opacity-100 translate-x-0"
          }`}
        >
          <div className="w-5 h-[2px] bg-white rounded-full" />
          <div className="w-5 h-[2px] bg-white rounded-full" />
          <div className="w-5 h-[2px] bg-white rounded-full" />
        </div>
      </div>
    </div>
  );
}

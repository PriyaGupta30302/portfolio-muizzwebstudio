"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";

export default function HeroSection() {
  const [isOn, setIsOn] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const trailContainerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Mouse trail refs
  const lastPoint = useRef({ x: 0, y: 0 });
  const mousePosRef = useRef({ x: 0, y: 0 });
  const activeImgRef = useRef<HTMLImageElement | null>(null);
  const spawnTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const imageIndex = useRef(0);
  const isOverButtonRef = useRef(false);

  // Carousel scroll animation refs
  const progress = useRef(0);
  const rafId = useRef<number | null>(null);

  // Pool of high-fidelity project images generated in public/ folder
  const images = [
    "/project_vortex.png",
    "/project_aether.png",
    "/project_nexus.png",
    "/project_yummy.png",
    "/project_dentist.png",
  ];

  // 1. Mouse Trail Spawner (Active when Toggle is OFF)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isOn || isOverButtonRef.current) return; // Disable trail when circular carousel or button hover is active

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Save latest coordinates
    mousePosRef.current = { x, y };

    // Calculate distance moved from last spawned point to control frequency
    const distance = Math.hypot(x - lastPoint.current.x, y - lastPoint.current.y);

    if (distance > 75) {
      // Clear any pending spawn timeout
      if (spawnTimeoutRef.current) {
        clearTimeout(spawnTimeoutRef.current);
      }

      // Schedule trail spawn with a subtle delay (millisecond delay)
      spawnTimeoutRef.current = setTimeout(() => {
        spawnImage(mousePosRef.current.x, mousePosRef.current.y);
      }, 150); // 150ms delay for smooth trailing offset

      lastPoint.current = { x, y };
    }
  };

  const spawnImage = (x: number, y: number) => {
    const container = trailContainerRef.current;
    if (!container) return;

    // STAGE 1: Garbage Collection - Force remove existing image immediately (Strictly ONE image on screen at a time)
    if (activeImgRef.current) {
      const oldImg = activeImgRef.current;
      gsap.killTweensOf(oldImg);
      oldImg.remove();
      activeImgRef.current = null;
    }

    // STAGE 2: Construct the new image
    const img = document.createElement("img");
    const src = images[imageIndex.current];
    imageIndex.current = (imageIndex.current + 1) % images.length;

    img.src = src;
    img.alt = "Trail mockup visual";
    
    // Positioned strictly at z-10 (behind the text which sits at z-20)
    img.style.position = "absolute";
    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
    img.style.width = "250px";
    img.style.height = "125px";
    img.style.objectFit = "cover";
    img.style.borderRadius = "0px";
    img.style.border = "1px solid rgba(255, 255, 255, 0.08)";
    img.style.boxShadow = "0 30px 60px rgba(0, 0, 0, 0.8)";
    img.style.pointerEvents = "none";
    img.style.zIndex = "10";
    img.style.transform = "translate(-50%, -50%) scale(0.6)";
    img.style.opacity = "0";
    img.style.willChange = "transform, opacity";

    container.appendChild(img);
    activeImgRef.current = img;

    const randomRotation = (Math.random() - 0.5) * 20; // -10deg to 10deg

    // Fade-in entry animation
    gsap.to(img, {
      scale: 1,
      opacity: 1,
      rotation: randomRotation,
      duration: 0.35,
      ease: "power2.out",
      onComplete: () => {
        // Automatically animate fade-out after 1 second
        gsap.to(img, {
          scale: 0.5,
          opacity: 0,
          duration: 0.4,
          delay: 0.8, // Stays visible for ~1 second
          ease: "power2.in",
          onComplete: () => {
            img.remove();
            if (activeImgRef.current === img) {
              activeImgRef.current = null;
            }
          },
        });
      },
    });
  };

  // 2. Math-Based Circular Arc Carousel Scroll Loop (Active when Toggle is ON)
  useEffect(() => {
    if (!isOn || !carouselRef.current) {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      return;
    }

    const animateCarousel = () => {
      const cards = carouselRef.current?.querySelectorAll(".carousel-card");
      if (!cards || cards.length === 0) {
        rafId.current = requestAnimationFrame(animateCarousel);
        return;
      }

      const w = window.innerWidth;
      const h = window.innerHeight;

      // Arc coordinates parameters
      const centerX = w / 2;
      const centerY = h * 0.95; // Position the center of rotation slightly below the viewport
      const radiusX = w * 0.44; // Horizontal radius of the ellipse arc
      const radiusY = h * 0.45; // Vertical height of the curved arc

      // Slowly increment scroll progress for infinite translation
      progress.current += 0.0012; // Controls scroll speed

      cards.forEach((cardNode, idx) => {
        const card = cardNode as HTMLDivElement;

        // Equally space cards along the progress bounds
        const cardProgress = (idx / cards.length) + progress.current;
        const wrappedProgress = cardProgress % 1.0;

        // Map progress [0, 1] to angle [0, Math.PI]
        // 0.0 starts at Right-Bottom, 0.5 reaches Center-Top, 1.0 ends at Left-Bottom
        const angle = wrappedProgress * Math.PI;

        // Calculate (X, Y) layout positions along the half-circle curved path
        const x = centerX + radiusX * Math.cos(angle);
        const y = centerY - radiusY * Math.sin(angle);

        // Keep the cards completely straight (no rotation, always horizontal 0deg) as requested
        const rotation = 0;

        // Set scale: smaller at the edges, full scale at the center top
        const scale = 0.5 + Math.sin(angle) * 0.5;

        // Set opacity: stays fully visible (1.0) across the curve, fading out only at the very outer edges
        const opacity = Math.min(1, Math.sin(angle) * 3.5);

        card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg) scale(${scale})`;
        card.style.opacity = Math.max(0, Math.min(1, opacity)).toString();
      });

      rafId.current = requestAnimationFrame(animateCarousel);
    };

    rafId.current = requestAnimationFrame(animateCarousel);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isOn]);

  // Clean up any timeouts or spawned images on unmount, and trigger text entrance stagger reveal
  useEffect(() => {
    // Staggered slide-up reveal for premium masked typography
    gsap.fromTo(
      ".hero-line-child",
      { y: "110%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 1.4,
        stagger: 0.12,
        ease: "power4.out",
        delay: 0.35,
      }
    );

    return () => {
      if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current);
      if (activeImgRef.current) activeImgRef.current.remove();
    };
  }, []);

  return (
    <div
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative isolate w-full h-screen bg-black flex flex-col items-center justify-center overflow-hidden select-none border-b border-zinc-950"
    >
      {/* Dynamic Trail Spawner Canvas wrapper (Toggle OFF) */}
      {!isOn && (
        <div
          ref={trailContainerRef}
          className="absolute inset-0 pointer-events-none z-10 w-full h-full"
        />
      )}

      {/* Half-Circle Curved scrolling Carousel (Toggle ON) */}
      {isOn && (
        <div
          ref={carouselRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        >
          {images.map((src, idx) => (
            <div
              key={idx}
              className="carousel-card absolute w-[180px] h-[90px] md:w-[280px] md:h-[140px] rounded-none overflow-hidden border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-10 flex-shrink-0 transition-shadow duration-300"
              style={{
                left: "0px",
                top: "0px",
                willChange: "transform, opacity",
              }}
            >
              <img
                src={src}
                alt="Scrolling mockup"
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>
          ))}
        </div>
      )}

      {/* Center Hero Content (No isolating z-index on this wrapper to allow blending with backdrop) */}
      <div className="flex flex-col items-center text-center max-w-6xl px-6 pointer-events-none">
        {/*
          Mix-blend-difference allows the white text to blend dynamically with the project images rendered at z-10 behind it.
          Since the text and images are now in the same stacking context (the isolated parent container), the text automatically 
          reveals the image details inside the letters when they overlap, acting like a premium transparent mask!
        */}
        <h1 className="pointer-events-none text-center font-bold tracking-tight font-lato relative z-20 select-none text-3xl leading-[42px] sm:text-4xl sm:leading-[52px] md:text-[50px] md:leading-[60px] text-white mix-blend-difference cursor-default max-w-5xl">
          <span className="line-mask relative overflow-hidden block">
            <span className="hero-line-child py-[0px] block will-change-transform">
              Next-Gen Websites. Immersive, and
            </span>
          </span>
          <span className="line-mask relative overflow-hidden block">
            <span className="hero-line-child py-[0px] block will-change-transform">
              Fast. I build digital experiences that feel
            </span>
          </span>
          <span className="line-mask relative overflow-hidden block">
            <span className="hero-line-child py-[0px] block will-change-transform">
              expensive, load instantly, and turn
            </span>
          </span>
          <span className="line-mask relative overflow-hidden block">
            <span className="hero-line-child py-[0px] block will-change-transform">
              visitors into loyal clients.
            </span>
          </span>
        </h1>
      </div>

      {/* Minimalist Switch Toggle Button Control */}
      <div 
        onMouseEnter={() => { isOverButtonRef.current = true; }}
        onMouseLeave={() => { isOverButtonRef.current = false; }}
        className="absolute bottom-[18%] z-30 flex flex-col items-center gap-3"
      >
        <div
          onClick={() => {
            // Clean up mouse trail leftovers when toggling ON
            if (!isOn && activeImgRef.current) {
              activeImgRef.current.remove();
              activeImgRef.current = null;
            }
            setIsOn(!isOn);
          }}
          className={`w-32 h-16 rounded-full border border-white/80 p-1 flex items-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 ${
            isOn 
              ? "bg-white border-white shadow-[0_0_35px_rgba(255,255,255,0.45)]" 
              : "bg-transparent hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          }`}
          data-cursor-text={isOn ? "Trail" : "Marquee"}
        >
          {/* Slider Circular Knob */}
          <div
            className={`w-14 h-14 rounded-full transition-all duration-300 transform ${
              isOn 
                ? "translate-x-16 bg-black shadow-[0_2px_10px_rgba(0,0,0,0.5)]" 
                : "translate-x-0 bg-white"
            }`}
          />
        </div>
      </div>

      {/* Background Rainfall grid columns overlay inside hero bounds */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40">
        <div className="grid_layout h-full">
          <div className="grid_col" />
          <div className="grid_col" />
          <div className="grid_col" />
          <div className="grid_col" />
          <div className="grid_col" />
          <div className="grid_col" />
        </div>
      </div>
    </div>
  );
}
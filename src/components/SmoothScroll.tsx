"use client";

import React, { useEffect, useRef } from "react";
import { ReactLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Sync Lenis scroll with GSAP Ticker
    // By disabling Lenis's autoRaf and ticking it via GSAP's ticker,
    // we run all scroll-driven and timeline animations in a unified RAF loop,
    // ensuring frame-perfect synchronization without layout lag or jitter.
    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(update);

    // Tell ScrollTrigger to recalculate positions on Lenis scroll events
    const lenisInstance = lenisRef.current?.lenis;
    if (lenisInstance) {
      lenisInstance.on("scroll", ScrollTrigger.update);
    }

    return () => {
      // Clean up ticker and event listeners on unmount
      gsap.ticker.remove(update);
      if (lenisInstance) {
        lenisInstance.off("scroll", ScrollTrigger.update);
      }
    };
  }, []);

  return (
    <ReactLenis ref={lenisRef} autoRaf={false} root>
      {children}
    </ReactLenis>
  );
}

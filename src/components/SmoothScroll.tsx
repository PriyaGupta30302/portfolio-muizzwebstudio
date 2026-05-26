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

    // Sync ScrollTrigger updates on Lenis scroll events
    const lenis = lenisRef.current?.lenis;
    
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
    }

    return () => {
      if (lenis) {
        lenis.off("scroll", ScrollTrigger.update);
      }
    };
  }, []);

  return (
    <ReactLenis ref={lenisRef} root>
      {children}
    </ReactLenis>
  );
}

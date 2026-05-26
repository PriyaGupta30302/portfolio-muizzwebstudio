"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function InteractiveCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hoverText, setHoverText] = useState("");

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Use GSAP's quickTo for maximum-performance cursor tracking.
    // quickTo is highly optimized for fast properties updates inside mousemove handlers,
    // bypassing CSS engine delays and guaranteeing buttery smooth 60fps renders.
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3.out" });

    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", onMouseMove);

    // Event Delegation to handle dynamic hover transformations efficiently
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const trigger = target.closest(".hover-trigger, a, button, [data-cursor-text]") as HTMLElement;

      if (trigger) {
        cursor.classList.add("hovering");

        // Set cursor textual guide based on custom attribute or tag name defaults
        const customText = trigger.getAttribute("data-cursor-text") 
          || (trigger.tagName === "A" ? "Open" : "View");

        setHoverText(customText);
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const trigger = target.closest(".hover-trigger, a, button, [data-cursor-text]") as HTMLElement;

      if (trigger) {
        cursor.classList.remove("hovering");
        setHoverText("");
      }
    };

    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("mouseout", onMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  return (
    <div className="cursor-wrapper hidden lg:block">
      <div ref={cursorRef} className="custom-cursor">
        <span className="custom-cursor-text">{hoverText}</span>
      </div>
    </div>
  );
}

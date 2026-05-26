# portfolio-muizzwebstudio

This repository contains a premium portfolio website built using **Next.js 15 (App Router)**, **TypeScript**, and **Tailwind CSS v4**, integrated with state-of-the-art animations powered by **GSAP (GreenSock Animation Platform)**, **ScrollTrigger**, and **Lenis smooth scrolling**.

## Technical Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (CSS-first engine)
- **Animations:** GSAP & GSAP ScrollTrigger
- **Scroll Engine:** Lenis Smooth Scroll

## Seamless Scroll & Animation Integration

To ensure optimal performance and eliminate any vertical scroll jitter (often caused by running separate `requestAnimationFrame` hooks for custom scrolling and scroll animations), we have unified both engines into a single update loop using GSAP's global ticker:

- **GSAP Ticker + Lenis integration:** Lenis smooth scrolling ticks are handled directly by GSAP's high-performance animation ticker.
- **ScrollTrigger Sync:** ScrollTrigger updates are perfectly synchronized with the smooth-scroll ticks.

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Run the development server:
   ```bash
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

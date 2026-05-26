"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ParticlesBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Initialize Scene, Camera, and WebGLRenderer
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 2. Generate a 3D Floating Particle Cloud
    const particleCount = 180;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Cohesive premium color palette (Indigo, Violet, Fuchsia)
    const colorChoices = [
      new THREE.Color("#6366f1"), // Indigo
      new THREE.Color("#8b5cf6"), // Violet
      new THREE.Color("#d946ef"), // Fuchsia
    ];

    for (let i = 0; i < particleCount; i++) {
      // Position vector distributed randomly in a wide coordinate space
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;

      // Assign random color from palette
      const chosenColor = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Custom Points material with soft glowing particles
    const material = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 3. Dynamic Interactive Tracking (Parallax + Scroll Sync)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    let currentScroll = 0;
    let targetScroll = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Map mouse coordinate bounds between [-1, 1]
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleScroll = () => {
      targetScroll = window.scrollY / window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 4. Smooth 60fps Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Gentle continuous rotation
      particles.rotation.y = elapsedTime * 0.025;
      particles.rotation.x = elapsedTime * 0.012;

      // Linear Interpolation (lerp) for frame-perfect visual inertia
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      particles.position.x = targetX * 0.6;
      particles.position.y = targetY * 0.6;

      // Update vertical drift in sync with window scroll depth
      currentScroll += (targetScroll - currentScroll) * 0.08;
      particles.position.y -= currentScroll * 1.8;

      renderer.render(scene, camera);
    };
    animate();

    // 5. Clean up logic to guarantee 0% memory footprint leakage
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none opacity-60 bg-[#0a0a0a]"
    />
  );
}

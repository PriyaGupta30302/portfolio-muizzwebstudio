"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

interface ShaderHoverImageProps {
  src: string;
  alt?: string;
  className?: string;
}

export default function ShaderHoverImage({ src, alt = "", className = "" }: ShaderHoverImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasContainerRef.current || !imageRef.current) return;

    const container = containerRef.current;
    const canvasContainer = canvasContainerRef.current;
    const imgElement = imageRef.current;

    let scene: THREE.Scene;
    let camera: THREE.OrthographicCamera;
    let renderer: THREE.WebGLRenderer;
    let material: THREE.ShaderMaterial;
    let geometry: THREE.PlaneGeometry;
    let mesh: THREE.Mesh;
    let texture: THREE.Texture;
    let animationFrameId: number;

    const initShader = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (width === 0 || height === 0) return;

      // 1. Setup Scene & Orthographic Camera (Perfect for a 2D plane layout)
      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(
        width / -2,
        width / 2,
        height / 2,
        height / -2,
        1,
        1000
      );
      camera.position.z = 1;

      // 2. Setup WebGL Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      canvasContainer.appendChild(renderer.domElement);

      // 3. Load Image Texture
      const loader = new THREE.TextureLoader();
      texture = loader.load(src, () => {
        // Toggle WebGL visibility once texture successfully loads
        imgElement.classList.add("is-webgl-active");
        canvasContainer.classList.add("is-loaded");
      });

      // Filter settings for high-fidelity rendering
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;

      // 4. Custom GLSL Shader Material
      const vertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;

      const fragmentShader = `
        uniform sampler2D uTexture;
        uniform float uHover;
        uniform vec2 uMouse;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;

          if (uHover > 0.0) {
            // Calculate distance from cursor to uv coordinates
            float dist = distance(uv, uMouse);

            // Sine-wave displacement frequencies
            float waveX = sin(uv.y * 12.0 + uHover * 5.0) * 0.05 * uHover;
            float waveY = cos(uv.x * 12.0 + uHover * 5.0) * 0.05 * uHover;

            // Decay the ripple wave away from the mouse cursor
            float rippleMask = smoothstep(0.7, 0.0, dist);

            uv.x += waveX * rippleMask;
            uv.y += waveY * rippleMask;
          }

          vec4 color = texture2D(uTexture, uv);
          gl_FragColor = color;
        }
      `;

      material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTexture: { value: texture },
          uHover: { value: 0.0 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        },
        transparent: true,
      });

      // 5. Plane geometry matching container size
      geometry = new THREE.PlaneGeometry(width, height);
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // 6. Interaction Handlers
      let targetHover = 0;
      let mouseX = 0.5;
      let mouseY = 0.5;

      const onMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        // Normalize mouse coordinates [0.0, 1.0] relative to canvas bounds
        const x = (e.clientX - rect.left) / rect.width;
        // Invert Y coordinate for standard WebGL viewport layout
        const y = 1.0 - (e.clientY - rect.top) / rect.height;

        gsap.to(material.uniforms.uMouse.value, {
          x,
          y,
          duration: 0.4,
          ease: "power2.out",
        });
      };

      const onMouseEnter = () => {
        gsap.to(material.uniforms.uHover, {
          value: 1.0,
          duration: 0.8,
          ease: "power2.out",
        });
      };

      const onMouseLeave = () => {
        gsap.to(material.uniforms.uHover, {
          value: 0.0,
          duration: 0.8,
          ease: "power2.out",
        });
      };

      container.addEventListener("mousemove", onMouseMove);
      container.addEventListener("mouseenter", onMouseEnter);
      container.addEventListener("mouseleave", onMouseLeave);

      // Render loop
      const render = () => {
        animationFrameId = requestAnimationFrame(render);
        renderer.render(scene, camera);
      };
      render();

      // Resize event
      const onResize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;

        if (w === 0 || h === 0) return;

        camera.left = w / -2;
        camera.right = w / 2;
        camera.top = h / 2;
        camera.bottom = h / -2;
        camera.updateProjectionMatrix();

        renderer.setSize(w, h);

        // Re-scale geometry
        mesh.geometry.dispose();
        geometry = new THREE.PlaneGeometry(w, h);
        mesh.geometry = geometry;
      };
      window.addEventListener("resize", onResize);

      // Clean up internal instances on unmount
      return () => {
        container.removeEventListener("mousemove", onMouseMove);
        container.removeEventListener("mouseenter", onMouseEnter);
        container.removeEventListener("mouseleave", onMouseLeave);
        window.removeEventListener("resize", onResize);
      };
    };

    // Instantiate WebGL once image size is initialized
    let cleanupFn: (() => void) | undefined;
    
    // Ensure image sizes are loaded or trigger immediately
    if (imgElement.complete) {
      cleanupFn = initShader();
    } else {
      imgElement.onload = () => {
        cleanupFn = initShader();
      };
    }

    return () => {
      if (cleanupFn) cleanupFn();

      cancelAnimationFrame(animationFrameId);

      if (canvasContainer && renderer?.domElement) {
        canvasContainer.removeChild(renderer.domElement);
      }

      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (texture) texture.dispose();
      if (renderer) renderer.dispose();
    };
  }, [src]);

  return (
    <div ref={containerRef} className="js-shader-wrapper relative w-full h-full">
      {/* HTML Image backup placeholder (Hides when WebGL texture loads) */}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="shader-img w-full h-full object-cover rounded-2xl"
      />
      {/* Interactive WebGL Canvas Container Layer */}
      <div
        ref={canvasContainerRef}
        className="webgl-canvas-wrap absolute inset-0 w-full h-full rounded-2xl overflow-hidden"
      />
    </div>
  );
}

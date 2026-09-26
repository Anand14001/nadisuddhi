import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

// Particle simulation configuration tuned for high responsiveness and celestial aesthetic
const config = {
  particles: {
    count: 48000,
    size: 0.032,
    spreadZ: 6.5,
  },
  colors: {
    baseHue: 228, // Royal cosmic blue / indigo matching Nadisuddhi palette
    hueVariance: 44,
  },
  simulation: {
    noiseSpeed: 0.15,
    noiseScale: 1.05,
    interactionRadius: 1.8, // Tight localized radius around the pointer
    repulsionStrength: 0.016, // Gentle, soft repulsion
    vortexStrength: 0.012, // Subtle, graceful eddy
    friction: 0.94,
  },
  bloom: {
    strength: 0.55,
    radius: 0.38,
    threshold: 0.15,
  },
  camera: {
    initialDistance: 5.2,
    parallaxIntensity: 0.005, // Gentle subtle parallax
  },
};

export default function GenerativeArtSceneV3() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Pointer state refs
  const targetMouse = useRef({ x: 0, y: 0 });
  const mouseSmooth = useRef({ x: 0, y: 0 });
  const prevMouse = useRef({ x: 0, y: 0 });
  const mouseSpeed = useRef(0);
  const targetHover = useRef(0);
  const hoverIntensity = useRef(0);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const width = currentMount.clientWidth || window.innerWidth;
    const height = currentMount.clientHeight || window.innerHeight;
    const aspect = width / Math.max(height, 1);

    const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.z = config.camera.initialDistance;
    cameraRef.current = camera;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    currentMount.appendChild(renderer.domElement);

    // 3. Post-Processing Bloom for ethereal celestial luminescence
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      config.bloom.strength,
      config.bloom.radius,
      config.bloom.threshold
    );
    const composer = new EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    composerRef.current = composer;

    // Dynamic Frustum-Based Particle Distribution Bounds at z = 0
    const vFovRad = THREE.MathUtils.degToRad(camera.fov);
    const visibleHeight = 2 * Math.tan(vFovRad / 2) * camera.position.z;
    const visibleWidth = visibleHeight * aspect;

    let spreadX = Math.max(visibleWidth * 1.45, 18);
    let spreadY = Math.max(visibleHeight * 1.45, 12);
    const spreadZ = config.particles.spreadZ;

    // 4. Particle System Data
    const particleCount = config.particles.count;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3).fill(0);

    const tempColor = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * spreadX;
      positions[i3 + 1] = (Math.random() - 0.5) * spreadY;
      positions[i3 + 2] = (Math.random() - 0.5) * spreadZ;

      // Celestial cosmic indigo & royal sapphire with occasional starlight gold
      const isGoldSpark = Math.random() < 0.08;
      if (isGoldSpark) {
        tempColor.setHSL(0.12, 0.95, 0.72); // Sacred amber / solar gold spark
      } else {
        const hue = (config.colors.baseHue + (Math.random() - 0.5) * config.colors.hueVariance) / 360;
        tempColor.setHSL(hue, 0.92, 0.62);
      }

      colors[i3] = tempColor.r;
      colors[i3 + 1] = tempColor.g;
      colors[i3 + 2] = tempColor.b;

      phases[i] = Math.random() * Math.PI * 2;
      sizes[i] = 0.65 + Math.random() * 0.9;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute("a_phase", new THREE.BufferAttribute(phases, 1));
    particleGeometry.setAttribute("a_size", new THREE.BufferAttribute(sizes, 1));

    // Custom Interactive Shader
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        u_pointSize: { value: config.particles.size * renderer.getPixelRatio() },
        u_mouse: { value: new THREE.Vector2(0, 0) },
        u_hover: { value: 0.0 },
        u_time: { value: 0.0 },
        u_aspect: { value: aspect },
      },
      vertexShader: `
        attribute vec3 color;
        attribute float a_phase;
        attribute float a_size;
        varying vec3 vColor;
        varying float vAlpha;
        varying float vProximity;

        uniform float u_pointSize;
        uniform vec2 u_mouse;
        uniform float u_hover;
        uniform float u_time;
        uniform float u_aspect;

        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vec4 clipPos = projectionMatrix * mvPosition;

          // Normalized Screen Space relative distance to cursor (-1 to 1)
          vec2 screenPos = clipPos.xy / clipPos.w;
          vec2 diff = (screenPos - u_mouse) * vec2(u_aspect, 1.0);
          float distToCursor = length(diff);

          // Glowing interactive aura tightly focused near pointer
          float proximity = max(0.0, 1.0 - smoothstep(0.015, 0.16, distToCursor)) * u_hover;
          vProximity = proximity;

          // Subtle organic breathing oscillation
          float shimmer = sin(u_time * 2.2 + a_phase) * 0.2 + 0.8;

          // Color transition: shift toward ethereal starlight violet & gold near cursor
          vec3 activeGlowColor = mix(
            vec3(0.55, 0.78, 1.0),
            vec3(1.0, 0.88, 0.58),
            sin(u_time * 3.0 + a_phase) * 0.5 + 0.5
          );

          vColor = mix(color * shimmer, activeGlowColor, proximity * 0.75);

          // Gentle scale expansion when hovered
          float scaleBoost = (1.0 + proximity * 0.75);
          gl_PointSize = u_pointSize * a_size * scaleBoost * (12.0 / -mvPosition.z);
          gl_Position = clipPos;

          vAlpha = clamp(0.4 + proximity * 0.45, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        varying float vProximity;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;

          // Smooth radial falloff with luminous nucleus
          float ring = 1.0 - smoothstep(0.0, 0.48, dist);
          float nucleus = 1.0 - smoothstep(0.0, 0.16, dist);

          vec3 finalColor = vColor + vec3(nucleus * (0.4 + vProximity * 0.5));
          gl_FragColor = vec4(finalColor, ring * vAlpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 5. Animation Loop with Zero-Allocation Direct Float Physics
    let frameId: number;
    const clock = new THREE.Clock();

    const radius = config.simulation.interactionRadius;
    const radiusSq = radius * radius;
    const friction = config.simulation.friction;
    const repulsionBase = config.simulation.repulsionStrength;
    const vortexBase = config.simulation.vortexStrength;
    const noiseScale = config.simulation.noiseScale;
    const noiseSpeed = config.simulation.noiseSpeed;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      const posArray = particleSystem.geometry.attributes.position.array as Float32Array;

      // Smooth pointer interpolation and velocity calculation
      const dx = targetMouse.current.x - mouseSmooth.current.x;
      const dy = targetMouse.current.y - mouseSmooth.current.y;
      mouseSmooth.current.x += dx * 0.12;
      mouseSmooth.current.y += dy * 0.12;

      const rawSpeed = Math.sqrt(dx * dx + dy * dy);
      mouseSpeed.current += (rawSpeed - mouseSpeed.current) * 0.15;

      // Smooth hover intensity transition (lerp in/out)
      hoverIntensity.current += (targetHover.current - hoverIntensity.current) * 0.08;

      // Update shader uniforms
      particleMaterial.uniforms.u_mouse.value.set(mouseSmooth.current.x, mouseSmooth.current.y);
      particleMaterial.uniforms.u_hover.value = hoverIntensity.current;
      particleMaterial.uniforms.u_time.value = elapsedTime;

      const halfSpreadX = spreadX / 2;
      const halfSpreadY = spreadY / 2;
      const halfSpreadZ = spreadZ / 2;

      // World-space target coordinates for physics interaction
      const targetWorldX = mouseSmooth.current.x * halfSpreadX;
      const targetWorldY = mouseSmooth.current.y * halfSpreadY;

      const currentHover = hoverIntensity.current;
      const speedFactor = 1.0 + Math.min(mouseSpeed.current * 2.0, 0.8);
      const activeRepulsion = repulsionBase * currentHover * speedFactor;
      const activeVortex = vortexBase * currentHover * speedFactor;

      const noiseTime = elapsedTime * noiseSpeed;

      // High-performance CPU physics loop with zero allocations per particle
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const px = posArray[i3];
        const py = posArray[i3 + 1];
        const pz = posArray[i3 + 2];

        // Cosmic curl harmonics
        const cx = Math.sin(py * noiseScale + noiseTime);
        const cy = Math.cos(pz * noiseScale + noiseTime);
        const cz = Math.sin(px * noiseScale + noiseTime);

        let fx = 0;
        let fy = 0;
        let fz = 0;

        // Subtle, localized pointer interaction strictly within a small radius
        if (currentHover > 0.005) {
          const diffX = px - targetWorldX;
          const diffY = py - targetWorldY;
          const distSq = diffX * diffX + diffY * diffY;

          if (distSq < radiusSq && distSq > 0.0001) {
            const dist = Math.sqrt(distSq);
            const normalizedDist = dist / radius; // 0 (near cursor) to 1 (outer edge)
            const influence = (1.0 - normalizedDist) * (1.0 - normalizedDist);

            // 1. Gentle radial push / repulsion wave
            const push = (influence * activeRepulsion) / (dist + 0.45);
            fx += (diffX / dist) * push;
            fy += (diffY / dist) * push;

            // 2. Gentle tangential cosmic swirl around pointer
            const swirl = influence * activeVortex;
            fx += (-diffY / dist) * swirl;
            fy += (diffX / dist) * swirl;

            // 3. Subtle 3D depth ripple
            fz += Math.sin(normalizedDist * Math.PI) * 0.008 * currentHover;
          }
        }

        // Apply forces & integrate
        velocities[i3] = (velocities[i3] + cx * 0.00085 + fx) * friction;
        velocities[i3 + 1] = (velocities[i3 + 1] + cy * 0.00085 + fy) * friction;
        velocities[i3 + 2] = (velocities[i3 + 2] + cz * 0.00085 + fz) * friction;

        posArray[i3] = px + velocities[i3];
        posArray[i3 + 1] = py + velocities[i3 + 1];
        posArray[i3 + 2] = pz + velocities[i3 + 2];

        // Seamless boundary toroidal wrapping
        if (posArray[i3] > halfSpreadX) posArray[i3] = -halfSpreadX;
        else if (posArray[i3] < -halfSpreadX) posArray[i3] = halfSpreadX;

        if (posArray[i3 + 1] > halfSpreadY) posArray[i3 + 1] = -halfSpreadY;
        else if (posArray[i3 + 1] < -halfSpreadY) posArray[i3 + 1] = halfSpreadY;

        if (posArray[i3 + 2] > halfSpreadZ) posArray[i3 + 2] = -halfSpreadZ;
        else if (posArray[i3 + 2] < -halfSpreadZ) posArray[i3 + 2] = halfSpreadZ;
      }

      particleSystem.geometry.attributes.position.needsUpdate = true;

      // Parallax 3D Camera Rotation and Perspective Tracking
      const camTargetX = mouseSmooth.current.x * config.camera.parallaxIntensity * halfSpreadX * 0.25 * currentHover;
      const camTargetY = -mouseSmooth.current.y * config.camera.parallaxIntensity * halfSpreadY * 0.25 * currentHover;

      camera.position.x += (camTargetX - camera.position.x) * 0.04;
      camera.position.y += (camTargetY - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      composer.render();
      frameId = requestAnimationFrame(animate);
    };

    animate();

    // 6. Interactive Event Listeners targeted to Hero Section and Viewport
    const heroElement = currentMount.closest("#home") as HTMLElement || document.getElementById("home") || currentMount;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = heroElement.getBoundingClientRect();
      const isInsideHero = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );

      if (isInsideHero) {
        targetHover.current = 1.0;
        const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        targetMouse.current.x = Math.max(-1.1, Math.min(1.1, normX));
        targetMouse.current.y = Math.max(-1.1, Math.min(1.1, normY));
      } else {
        targetHover.current = 0.0;
      }
    };

    const handlePointerEnter = () => {
      targetHover.current = 1.0;
    };

    const handlePointerLeave = () => {
      targetHover.current = 0.0;
    };

    // Resize handling with observer
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth || window.innerWidth;
      const h = currentMount.clientHeight || window.innerHeight;
      const newAspect = w / Math.max(h, 1);

      camera.aspect = newAspect;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      composer.setSize(w, h);
      bloomPass.resolution.set(w, h);

      // Recompute visible frustum dimensions
      const vFov = THREE.MathUtils.degToRad(camera.fov);
      const vH = 2 * Math.tan(vFov / 2) * camera.position.z;
      const vW = vH * newAspect;

      spreadX = Math.max(vW * 1.45, 18);
      spreadY = Math.max(vH * 1.45, 12);

      if (particleMaterial.uniforms.u_pointSize) {
        particleMaterial.uniforms.u_pointSize.value = config.particles.size * renderer.getPixelRatio();
      }
      if (particleMaterial.uniforms.u_aspect) {
        particleMaterial.uniforms.u_aspect.value = newAspect;
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(currentMount);

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    heroElement.addEventListener("pointerenter", handlePointerEnter);
    heroElement.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      heroElement.removeEventListener("pointerenter", handlePointerEnter);
      heroElement.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", handleResize);

      if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}

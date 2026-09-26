import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

// Particle simulation configuration
const config = {
  particles: {
    count: 46000,
    size: 0.026,
    spreadZ: 6.0,
  },
  colors: {
    baseHue: 220, // Royal blue / cosmic indigo hue matching Nadisuddhi palette
    hueVariance: 40,
  },
  simulation: {
    noiseSpeed: 0.12,
    noiseScale: 1.1,
    mouseRepulsion: 0.005,
    friction: 0.95,
  },
  bloom: {
    strength: 0.5,
    radius: 0.35,
    threshold: 0.15,
  },
  camera: {
    initialDistance: 5.2,
    parallaxIntensity: 0.006,
  },
};

export default function GenerativeArtSceneV3() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const width = currentMount.clientWidth || window.innerWidth;
    const height = currentMount.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(75, width / Math.max(height, 1), 0.1, 1000);
    camera.position.z = config.camera.initialDistance;
    cameraRef.current = camera;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    currentMount.appendChild(renderer.domElement);

    // 3. Post-Processing Bloom
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
    const visibleWidth = visibleHeight * (width / Math.max(height, 1));

    let spreadX = Math.max(visibleWidth * 1.4, 18);
    let spreadY = Math.max(visibleHeight * 1.4, 12);
    const spreadZ = config.particles.spreadZ;

    // 4. Particle System
    const particleCount = config.particles.count;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3).fill(0);
    const baseColor = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * spreadX;
      positions[i3 + 1] = (Math.random() - 0.5) * spreadY;
      positions[i3 + 2] = (Math.random() - 0.5) * spreadZ;

      const hue = (config.colors.baseHue + (Math.random() - 0.5) * config.colors.hueVariance) / 360;
      baseColor.setHSL(hue, 0.9, 0.65);
      colors[i3] = baseColor.r;
      colors[i3 + 1] = baseColor.g;
      colors[i3 + 2] = baseColor.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        u_pointSize: { value: config.particles.size * renderer.getPixelRatio() },
      },
      vertexShader: `
        attribute vec3 color;
        varying vec3 vColor;
        uniform float u_pointSize;

        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = u_pointSize * (12.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float strength = distance(gl_PointCoord, vec2(0.5));
          if (strength > 0.5) discard;
          gl_FragColor = vec4(vColor, 1.0 - (strength * 2.0));
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 5. Force calculation
    const curlNoiseFn = (p: THREE.Vector3, speed: number, scale: number) => {
      return new THREE.Vector3(
        Math.sin(p.y * scale + speed),
        Math.cos(p.z * scale + speed),
        Math.sin(p.x * scale + speed)
      ).normalize();
    };

    // 6. Animation Loop
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      const posArray = particleSystem.geometry.attributes.position.array as Float32Array;

      const halfSpreadX = spreadX / 2;
      const halfSpreadY = spreadY / 2;
      const halfSpreadZ = spreadZ / 2;

      const mouseTarget = new THREE.Vector3(
        mouseRef.current.x * halfSpreadX,
        mouseRef.current.y * halfSpreadY,
        0
      );

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const p = new THREE.Vector3(posArray[i3], posArray[i3 + 1], posArray[i3 + 2]);

        const curlForce = curlNoiseFn(p, elapsedTime * config.simulation.noiseSpeed, config.simulation.noiseScale);
        const distanceToMouse = p.distanceTo(mouseTarget);
        const mouseForce = new THREE.Vector3();

        if (distanceToMouse < 2.5) {
          mouseForce.subVectors(p, mouseTarget).normalize().multiplyScalar(1 / (distanceToMouse + 0.1));
        }

        velocities[i3] += curlForce.x * 0.0008 + mouseForce.x * config.simulation.mouseRepulsion;
        velocities[i3 + 1] += curlForce.y * 0.0008 + mouseForce.y * config.simulation.mouseRepulsion;
        velocities[i3 + 2] += curlForce.z * 0.0008 + mouseForce.z * config.simulation.mouseRepulsion;

        velocities[i3] *= config.simulation.friction;
        velocities[i3 + 1] *= config.simulation.friction;
        velocities[i3 + 2] *= config.simulation.friction;

        posArray[i3] += velocities[i3];
        posArray[i3 + 1] += velocities[i3 + 1];
        posArray[i3 + 2] += velocities[i3 + 2];

        // Boundary wrap: recycle seamlessly across dynamic spread dimensions
        if (posArray[i3] > halfSpreadX) posArray[i3] = -halfSpreadX;
        else if (posArray[i3] < -halfSpreadX) posArray[i3] = halfSpreadX;

        if (posArray[i3 + 1] > halfSpreadY) posArray[i3 + 1] = -halfSpreadY;
        else if (posArray[i3 + 1] < -halfSpreadY) posArray[i3 + 1] = halfSpreadY;

        if (posArray[i3 + 2] > halfSpreadZ) posArray[i3 + 2] = -halfSpreadZ;
        else if (posArray[i3 + 2] < -halfSpreadZ) posArray[i3 + 2] = halfSpreadZ;
      }

      particleSystem.geometry.attributes.position.needsUpdate = true;

      // Parallax camera follow
      camera.position.x += (mouseRef.current.x * config.camera.parallaxIntensity - camera.position.x) * 0.03;
      camera.position.y += (-mouseRef.current.y * config.camera.parallaxIntensity - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      composer.render();
      frameId = requestAnimationFrame(animate);
    };

    animate();

    // 7. Resize & Mouse interaction
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth || window.innerWidth;
      const h = currentMount.clientHeight || window.innerHeight;
      const aspect = w / Math.max(h, 1);

      camera.aspect = aspect;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      composer.setSize(w, h);
      bloomPass.resolution.set(w, h);

      // Recompute visible frustum dimensions and update particle spread bounds
      const vFov = THREE.MathUtils.degToRad(camera.fov);
      const vHeight = 2 * Math.tan(vFov / 2) * camera.position.z;
      const vWidth = vHeight * aspect;

      spreadX = Math.max(vWidth * 1.4, 18);
      spreadY = Math.max(vHeight * 1.4, 12);

      if (particleMaterial.uniforms.u_pointSize) {
        particleMaterial.uniforms.u_pointSize.value = config.particles.size * renderer.getPixelRatio();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(currentMount);

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden" />;
}

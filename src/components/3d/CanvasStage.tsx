import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { aggressionVertexShader, aggressionFragmentShader } from './shaders/aggressionShaders';

interface CanvasStageProps {
  scrollProgress: number;
  tension: number;
}

// Generates a soft, luminous, circular particle texture to eliminate square pixels
function createCircularParticleTexture(): THREE.Texture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const center = size / 2;
  const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
  gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
  gradient.addColorStop(0.2, 'rgba(255, 210, 150, 0.85)');
  gradient.addColorStop(0.55, 'rgba(224, 93, 56, 0.35)');
  gradient.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(center, center, center, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export const CanvasStage: React.FC<CanvasStageProps> = ({ scrollProgress, tension }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniformsRef = useRef<{
    uTime: { value: number };
    uTension: { value: number };
    uScrollProgress: { value: number };
    uMouse: { value: THREE.Vector2 };
  }>({
    uTime: { value: 0 },
    uTension: { value: 1.0 },
    uScrollProgress: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) }
  });

  const targetMouse = useRef(new THREE.Vector2(0, 0));
  const targetScrollRef = useRef(0);
  const targetTensionRef = useRef(1.0);
  const smoothProgress = useRef(0);
  const smoothTension = useRef(1.0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 6.4;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for combined sphere & particles
    const group = new THREE.Group();
    scene.add(group);

    // High-resolution Dynamic Shader Sphere with silky organic geometry
    const sphereGeometry = new THREE.SphereGeometry(1.95, 128, 128);
    const sphereMaterial = new THREE.ShaderMaterial({
      vertexShader: aggressionVertexShader,
      fragmentShader: aggressionFragmentShader,
      uniforms: uniformsRef.current,
      transparent: true,
      blending: THREE.NormalBlending,
      side: THREE.DoubleSide
    });
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    group.add(sphereMesh);

    // Initial responsive positioning
    const isInitiallyMobile = window.innerWidth < 992;
    if (isInitiallyMobile) {
      group.position.set(0.0, -2.2, -0.5);
      group.scale.set(0.65, 0.65, 0.65);
    } else {
      group.position.set(2.4, 0.1, 0);
      group.scale.set(1.0, 1.0, 1.0);
    }

    // Dynamic glowing circular ember particles
    const circularTexture = createCircularParticleTexture();
    const particlesCount = 180;
    const particlePositions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 14;
      particlePositions[i + 1] = (Math.random() - 0.5) * 14;
      particlePositions[i + 2] = (Math.random() - 0.5) * 10;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      map: circularTexture,
      color: 0xFFA566,
      size: 0.14,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Resize tracking
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop with zero scroll jerking / stable continuous time
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTime) * 0.001;
      uniformsRef.current.uTime.value = elapsedTime;

      // Low-pass filter for scroll progress and tension - completely removes tick stutter!
      smoothProgress.current += (targetScrollRef.current - smoothProgress.current) * 0.04;
      smoothTension.current += (targetTensionRef.current - smoothTension.current) * 0.04;

      uniformsRef.current.uScrollProgress.value = smoothProgress.current;
      uniformsRef.current.uTension.value = smoothTension.current;

      // Smooth mouse interpolation
      uniformsRef.current.uMouse.value.lerp(targetMouse.current, 0.05);

      // Steady, majestic, non-jerking continuous fluid rotation
      sphereMesh.rotation.y = elapsedTime * 0.12;
      sphereMesh.rotation.x = Math.sin(elapsedTime * 0.1) * 0.15;
      particles.rotation.y = elapsedTime * 0.025;

      // Responsive positioning based on smoothProgress
      const p = smoothProgress.current;
      const isMobile = window.innerWidth < 992;

      const targetScale = isMobile ? 0.65 : 1.0;
      group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);

      // Calm, smooth continuous trajectory without sudden spikes or jumps
      let targetX = isMobile ? (Math.sin(p * Math.PI * 2) * 0.4) : (2.4 - p * 2.6);
      let targetY = isMobile ? (-2.2 + Math.cos(p * Math.PI * 2) * 0.4) : (Math.sin(p * Math.PI * 2.2) * 0.5);
      let targetZ = isMobile ? -0.5 : 0;
      let targetCamZ = isMobile ? 6.8 : 6.4;

      group.position.x += (targetX - group.position.x) * 0.04;
      group.position.y += (targetY - group.position.y) * 0.04;
      group.position.z += (targetZ - group.position.z) * 0.04;
      camera.position.z += (targetCamZ - camera.position.z) * 0.04;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      circularTexture.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    targetScrollRef.current = scrollProgress;
    targetTensionRef.current = tension;
  }, [scrollProgress, tension]);

  return <div ref={containerRef} className="webgl-canvas-container" aria-hidden="true" />;
};

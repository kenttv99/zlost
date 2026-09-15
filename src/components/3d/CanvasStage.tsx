import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { aggressionVertexShader, aggressionFragmentShader } from './shaders/aggressionShaders';

interface CanvasStageProps {
  scrollProgress: number;
  tension: number;
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
  const currentScrollRef = useRef(0);
  const prevScrollRef = useRef(0);
  const scrollVelocityRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 6.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for combined sphere & particles
    const group = new THREE.Group();
    scene.add(group);

    // High-resolution Dynamic Shader Sphere
    const sphereGeometry = new THREE.SphereGeometry(2.3, 96, 96);
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

    // Initial positioning in Hero section
    group.position.set(1.6, 0.2, 0);

    // Dynamic ember particles
    const particlesCount = 280;
    const particlePositions = new Float32Array(particlesCount * 3);
    const originalPositions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      const x = (Math.random() - 0.5) * 14;
      const y = (Math.random() - 0.5) * 14;
      const z = (Math.random() - 0.5) * 10;
      particlePositions[i] = x;
      particlePositions[i + 1] = y;
      particlePositions[i + 2] = z;

      originalPositions[i] = x;
      originalPositions[i + 1] = y;
      originalPositions[i + 2] = z;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xE89862,
      size: 0.055,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
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

    // Animation Loop
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTime) * 0.001;
      uniformsRef.current.uTime.value = elapsedTime;

      // Calculate scroll velocity
      const scrollDiff = currentScrollRef.current - prevScrollRef.current;
      scrollVelocityRef.current += (Math.abs(scrollDiff) * 35 - scrollVelocityRef.current) * 0.1;
      prevScrollRef.current = currentScrollRef.current;

      // Mouse lerp
      uniformsRef.current.uMouse.value.lerp(targetMouse.current, 0.06);

      // Sphere rotation with velocity acceleration
      const rotSpeed = 0.12 + scrollVelocityRef.current * 0.015;
      sphereMesh.rotation.y += rotSpeed * 0.02;
      sphereMesh.rotation.x = Math.sin(elapsedTime * 0.15) * 0.25;
      particles.rotation.y += (0.005 + scrollVelocityRef.current * 0.001);

      // Section-specific 3D trajectory across the viewport:
      // p = 0.00 (Hero): Right side [1.6, 0.2, 0], camZ = 6.2
      // p = 0.12 (Audience): Centers/Left [-1.8, -0.3, 0], camZ = 6.8
      // p = 0.24 (Value): Deep Zoom [0.0, 0.0, 0.5], camZ = 4.3 (Dramatic Immersion!)
      // p = 0.42 (Program): Drifts to right [2.0, 0.2, 0], camZ = 6.4
      // p = 0.60 (Format): Low center [0.0, -1.2, 0], camZ = 5.8
      // p = 0.78 (Pricing): Right-behind card [1.8, 0.0, 0], camZ = 6.2
      // p = 1.00 (CTA): Centered harmony [0.0, 0.0, 0], camZ = 5.2
      const p = uniformsRef.current.uScrollProgress.value;

      let targetX = Math.cos(p * Math.PI * 3.5) * 1.8;
      let targetY = Math.sin(p * Math.PI * 2.8) * 0.9;
      let targetZ = 0;
      let targetCamZ = 6.5;

      // Value section dramatic zoom peak around progress 0.20 - 0.28
      if (p > 0.16 && p < 0.32) {
        const peakFactor = 1.0 - Math.abs(p - 0.24) / 0.08;
        targetCamZ = 6.5 - peakFactor * 2.4; // zooms up to 4.1!
        targetX *= (1.0 - peakFactor * 0.8);
      }

      // Smooth coordinate interpolation
      group.position.x += (targetX - group.position.x) * 0.06;
      group.position.y += (targetY - group.position.y) * 0.06;
      group.position.z += (targetZ - group.position.z) * 0.06;
      camera.position.z += (targetCamZ - camera.position.z) * 0.06;

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
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    currentScrollRef.current = scrollProgress;
    uniformsRef.current.uScrollProgress.value = scrollProgress;
    uniformsRef.current.uTension.value = tension;
  }, [scrollProgress, tension]);

  return <div ref={containerRef} className="webgl-canvas-container" aria-hidden="true" />;
};

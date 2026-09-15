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
  const sphereGroupRef = useRef<THREE.Group | null>(null);

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
    sphereGroupRef.current = group;
    scene.add(group);

    // Dynamic Shader Sphere
    const sphereGeometry = new THREE.SphereGeometry(2.0, 72, 72);
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

    // Ambient floating embers/particles
    const particlesCount = 180;
    const particlePositions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 12;
      particlePositions[i + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i + 2] = (Math.random() - 0.5) * 8;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xE0A96D,
      size: 0.04,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Mouse listener
    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      uniformsRef.current.uTime.value = elapsedTime;

      // Smooth mouse interpolation
      uniformsRef.current.uMouse.value.lerp(targetMouse.current, 0.05);

      // Gentle continuous rotation
      sphereMesh.rotation.y = elapsedTime * 0.12;
      sphereMesh.rotation.x = Math.sin(elapsedTime * 0.08) * 0.2;
      particles.rotation.y = elapsedTime * 0.03;

      // Position sphere algorithmically across viewport based on scroll progress
      const progress = uniformsRef.current.uScrollProgress.value;
      const targetX = Math.sin(progress * Math.PI * 3) * 1.5;
      const targetY = Math.cos(progress * Math.PI * 2) * 0.8 - progress * 1.2;
      group.position.x += (targetX - group.position.x) * 0.05;
      group.position.y += (targetY - group.position.y) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
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

  // Update uniforms smoothly when props change
  useEffect(() => {
    uniformsRef.current.uScrollProgress.value = scrollProgress;
    uniformsRef.current.uTension.value = tension;
  }, [scrollProgress, tension]);

  return <div ref={containerRef} className="webgl-canvas-container" aria-hidden="true" />;
};

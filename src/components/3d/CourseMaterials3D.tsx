import React, { useRef, useState } from 'react';
import './CourseMaterials3D.css';

export const CourseMaterials3D: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Smooth tilt angles
    const rotateY = (x / (rect.width / 2)) * 14;
    const rotateX = -(y / (rect.height / 2)) * 14;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div 
      className="course-materials-3d-wrapper"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={cardRef}
        className={`materials-3d-canvas ${isHovered ? 'hovered' : ''}`}
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
      >
        {/* Ambient glow behind card */}
        <div className="materials-glow-layer" />

        {/* Realistic Mobile Device Frame Mockup */}
        <div className="device-mockup">
          <div className="device-speaker" />
          <div className="device-screen">
            <div className="screen-header">
              <span className="screen-tag">МИНИ-КУРС</span>
              <span className="screen-battery" />
            </div>
            
            <div className="screen-content">
              <h3 className="screen-title serif-title">Я и<br />Агрессия</h3>
              <p className="screen-subtitle">Практический мини-курс</p>

              <div className="screen-audio-card">
                <div className="play-indicator">
                  <div className="soundwave-bar" />
                  <div className="soundwave-bar" />
                  <div className="soundwave-bar" />
                </div>
                <div>
                  <span className="audio-title">Урок 1. Зачем нам злость?</span>
                  <span className="audio-time">04:12 • Практика</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Physical PDF Booklet / Guide Mockup layered behind device in 3D */}
        <div className="guide-mockup">
          <div className="guide-spine" />
          <div className="guide-inner">
            <span className="guide-badge">PDF ГАЙД</span>
            <span className="guide-title serif-title">Итоговая<br />инструкция</span>
            <p className="guide-note">Алгоритм проживания злости шаг за шагом</p>
          </div>
        </div>
      </div>
    </div>
  );
};

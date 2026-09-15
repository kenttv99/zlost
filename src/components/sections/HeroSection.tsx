import React from 'react';
import { ArrowRight, Play, CheckCircle, FileText } from 'lucide-react';
import { COURSE_CONTENT } from '../../data/courseData';
import './HeroSection.css';

interface HeroSectionProps {
  onCtaClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onCtaClick }) => {
  const { hero } = COURSE_CONTENT;

  return (
    <section className="hero-section theme-dark" id="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <span className="section-label hero-badge">{hero.badge}</span>
          
          <h1 className="hero-title serif-title">
            <span className="hero-title-primary">{hero.titlePrimary}</span>
            <span className="hero-title-secondary">{hero.titleSecondary}</span>
          </h1>

          <p className="hero-subtitle">
            {hero.subtitle}
          </p>

          <div className="hero-features-list">
            <div className="feature-item">
              <span className="feature-icon"><Play size={16} /></span>
              <span className="feature-text">{hero.features[0]}</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon"><CheckCircle size={16} /></span>
              <span className="feature-text">{hero.features[1]}</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon"><FileText size={16} /></span>
              <span className="feature-text">{hero.features[2]}</span>
            </div>
          </div>

          <div className="hero-cta-group">
            <button type="button" onClick={onCtaClick} className="btn-pill btn-pill-light">
              <span>{hero.ctaText}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="hero-media-wrapper">
          <div className="hero-image-frame">
            <img 
              src={hero.image} 
              alt="Я и Агрессия — авторский курс" 
              className="hero-image"
              loading="eager"
            />
            <div className="hero-note-badge">
              <span className="handwritten hero-handwritten-note">{hero.note}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

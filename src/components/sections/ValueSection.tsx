import React from 'react';
import { ArrowRight } from 'lucide-react';
import { COURSE_CONTENT } from '../../data/courseData';
import './ValueSection.css';

interface ValueSectionProps {
  onProgramClick: () => void;
}

export const ValueSection: React.FC<ValueSectionProps> = ({ onProgramClick }) => {
  const { value } = COURSE_CONTENT;

  return (
    <section className="value-section theme-dark" id="value">
      <div className="container value-container">
        <div className="value-content">
          <span className="section-label value-label">{value.label}</span>

          <h2 className="value-headline serif-title">
            {value.headline}
          </h2>

          <p className="value-description">
            {value.description}
          </p>

          <div className="value-cta-wrapper">
            <button type="button" onClick={onProgramClick} className="btn-pill btn-pill-light">
              <span>{value.ctaText}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="value-media-wrapper">
          <div className="value-image-frame">
            <img 
              src={value.image} 
              alt="Что даст этот курс" 
              className="value-image"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

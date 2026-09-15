import React from 'react';
import { ArrowRight } from 'lucide-react';
import { COURSE_CONTENT } from '../../data/courseData';
import './FinalCtaSection.css';

interface FinalCtaSectionProps {
  onDirectClick: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onDirectClick }) => {
  const { finalCta } = COURSE_CONTENT;

  return (
    <section className="final-cta-section theme-dark" id="final-cta">
      <div className="container final-cta-container">
        <div className="final-cta-card">
          <h2 className="final-cta-title serif-title">{finalCta.title}</h2>
          <p className="final-cta-instruction">{finalCta.instruction}</p>

          <div className="final-cta-btn-wrapper">
            <button type="button" onClick={onDirectClick} className="btn-pill btn-pill-light">
              <span>{finalCta.ctaText}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <footer className="footer-bar">
          <p>© {new Date().getFullYear()} «Я и Агрессия». Все права защищены.</p>
        </footer>
      </div>
    </section>
  );
};

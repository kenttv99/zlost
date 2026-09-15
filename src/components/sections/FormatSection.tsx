import React from 'react';
import { Play, CheckCircle2, FileText, Smartphone, ArrowRight } from 'lucide-react';
import { COURSE_CONTENT } from '../../data/courseData';
import './FormatSection.css';

interface FormatSectionProps {
  onPreviewClick: () => void;
}

export const FormatSection: React.FC<FormatSectionProps> = ({ onPreviewClick }) => {
  const { format } = COURSE_CONTENT;

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play size={26} strokeWidth={1.8} />;
      case 'practice': return <CheckCircle2 size={26} strokeWidth={1.8} />;
      case 'document': return <FileText size={26} strokeWidth={1.8} />;
      case 'devices': return <Smartphone size={26} strokeWidth={1.8} />;
      default: return null;
    }
  };

  return (
    <section className="format-section theme-dark" id="format">
      <div className="container format-container">
        <div className="format-card">
          <span className="section-label format-label">{format.label}</span>
          <h2 className="format-title serif-title">{format.title}</h2>

          <div className="format-grid">
            {format.items.map((item, idx) => (
              <div key={idx} className="format-grid-item">
                <div className="format-item-icon">
                  {getIcon(item.iconType)}
                </div>
                <div className="format-item-text">
                  <h3 className="format-item-title">{item.title}</h3>
                  <p className="format-item-subtitle">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="format-cta-wrapper">
            <button type="button" onClick={onPreviewClick} className="btn-pill btn-pill-light">
              <span>{format.ctaText}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Check } from 'lucide-react';
import { COURSE_CONTENT } from '../../data/courseData';
import './OutcomesSection.css';

export const OutcomesSection: React.FC = () => {
  const { outcomes } = COURSE_CONTENT;

  return (
    <section className="outcomes-section theme-light" id="outcomes">
      <div className="container outcomes-container">
        <div className="outcomes-card">
          <span className="section-label outcomes-label">{outcomes.label}</span>

          <div className="outcomes-list">
            {outcomes.points.map((point, index) => (
              <div key={index} className="outcome-item">
                <div className="outcome-check-icon">
                  <Check size={18} strokeWidth={2.5} />
                </div>
                <p className="outcome-text">{point}</p>
              </div>
            ))}
          </div>

          <div className="outcomes-note-wrapper">
            <span className="handwritten outcomes-handwritten-note">
              {outcomes.note}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { COURSE_CONTENT } from '../../data/courseData';
import './AudienceSection.css';

export const AudienceSection: React.FC = () => {
  const { audience } = COURSE_CONTENT;

  return (
    <section className="audience-section theme-light" id="audience">
      <div className="container audience-container">
        <div className="audience-content">
          <span className="section-label audience-label">{audience.label}</span>

          <div className="audience-points-list">
            {audience.points.map((point, index) => (
              <div key={index} className="audience-point-item">
                <span className="audience-point-dash" aria-hidden="true">—</span>
                <p className="audience-point-text">{point}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="audience-media-wrapper">
          <div className="audience-image-frame">
            <img 
              src={audience.image} 
              alt="Ты точно узнаешь себя, если" 
              className="audience-image"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

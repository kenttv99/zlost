import React from 'react';
import { COURSE_CONTENT } from '../../data/courseData';
import './AuthorSection.css';

export const AuthorSection: React.FC = () => {
  const { author } = COURSE_CONTENT;

  return (
    <section className="author-section theme-dark" id="author">
      <div className="container author-container">
        <div className="author-content">
          <span className="section-label author-label">{author.label}</span>
          <h2 className="author-title serif-title">{author.title}</h2>

          <div className="author-paragraphs">
            {author.paragraphs.map((p, idx) => (
              <p key={idx} className="author-bio-text">{p}</p>
            ))}
          </div>

          <div className="author-quote-wrapper">
            <span className="handwritten author-handwritten-quote">
              «{author.quote}»
            </span>
          </div>
        </div>

        <div className="author-media-wrapper">
          <div className="author-image-frame">
            <img 
              src={author.image} 
              alt="Анастасия — автор курса" 
              className="author-image"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Check } from 'lucide-react';
import { COURSE_CONTENT } from '../../data/courseData';
import './ReviewsSection.css';

export const ReviewsSection: React.FC = () => {
  const { reviews } = COURSE_CONTENT;

  return (
    <section className="reviews-section theme-light" id="reviews">
      <div className="container reviews-container">
        <div className="reviews-header">
          <span className="section-label reviews-label">{reviews.label}</span>
          <h2 className="reviews-title serif-title">{reviews.title}</h2>
        </div>

        <div className="reviews-list">
          {reviews.items.map((item, idx) => (
            <article key={item.id} className="review-card">
              <span className="review-quote-mark" aria-hidden="true">“</span>

              <div className="review-card-header">
                <span className="review-tag">{item.tag}</span>
                <span className="review-index">0{idx + 1}</span>
              </div>

              <div className="review-body">
                <p className="review-quote">{item.quote}</p>
              </div>

              <div className="review-card-footer">
                <div className="review-author-meta">
                  <span className="review-author-name">{item.name}</span>
                  <span className="review-meta-dot">•</span>
                  <span className="review-author-age">{item.age}</span>
                  <span className="review-verified-badge">
                    <Check size={12} strokeWidth={2.5} className="review-check-icon" />
                    <span>прошла курс</span>
                  </span>
                </div>

                <div className="review-note-wrapper">
                  <span className="handwritten review-handwritten-note">{item.handwrittenNote}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

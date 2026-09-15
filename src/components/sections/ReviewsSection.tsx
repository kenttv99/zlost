import React from 'react';
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
          {reviews.items.map(item => (
            <div key={item.id} className="review-card">
              <div className="review-author-row">
                <div className="review-avatar-frame">
                  {item.avatarUrl ? (
                    <img 
                      src={item.avatarUrl} 
                      alt={`${item.name}, ${item.age}`} 
                      className="review-avatar-img"
                      onError={(e) => {
                        // Clean initials fallback if user hasn't provided the file yet
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : null}
                  <span className="review-avatar-fallback">{item.name.charAt(0)}</span>
                </div>
                <div className="review-author-meta">
                  <h3 className="review-author-name">{item.name},</h3>
                  <span className="review-author-age">{item.age}</span>
                </div>
              </div>

              <div className="review-body">
                <p className="review-quote">{item.quote}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

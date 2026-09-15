import React from 'react';
import { ArrowRight, ShieldCheck, Zap, HeartHandshake } from 'lucide-react';
import { COURSE_CONTENT } from '../../data/courseData';
import { CourseMaterials3D } from '../3d/CourseMaterials3D';
import './PricingSection.css';

interface PricingSectionProps {
  onBuyClick: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onBuyClick }) => {
  const { pricing } = COURSE_CONTENT;

  return (
    <section className="pricing-section theme-light" id="pricing">
      <div className="container pricing-container">
        <div className="pricing-content">
          <span className="section-label pricing-label">{pricing.label}</span>
          <h2 className="pricing-title serif-title">{pricing.title}</h2>

          <div className="pricing-price-row">
            <span className="current-price">{pricing.price}</span>
            <span className="original-price">{pricing.originalPrice}</span>
            <span className="discount-badge">{pricing.discountBadge}</span>
          </div>

          <div className="pricing-cta-row">
            <button type="button" onClick={onBuyClick} className="btn-pill btn-pill-dark">
              <span>{pricing.ctaText}</span>
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="pricing-features-list">
            <div className="pricing-feature-item">
              <span className="pricing-feature-icon"><ShieldCheck size={20} /></span>
              <span className="pricing-feature-text">{pricing.features[0]}</span>
            </div>
            <div className="pricing-feature-item">
              <span className="pricing-feature-icon"><Zap size={20} /></span>
              <span className="pricing-feature-text">{pricing.features[1]}</span>
            </div>
            <div className="pricing-feature-item">
              <span className="pricing-feature-icon"><HeartHandshake size={20} /></span>
              <span className="pricing-feature-text">{pricing.features[2]}</span>
            </div>
          </div>
        </div>

        <div className="pricing-3d-wrapper">
          <CourseMaterials3D />
        </div>
      </div>
    </section>
  );
};

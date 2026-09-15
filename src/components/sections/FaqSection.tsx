import React from 'react';
import { COURSE_CONTENT } from '../../data/courseData';
import { Accordion } from '../ui/Accordion';
import './FaqSection.css';

export const FaqSection: React.FC = () => {
  const { faq } = COURSE_CONTENT;

  const faqItems = faq.items.map(item => ({
    id: item.id,
    title: item.question,
    content: item.answer
  }));

  return (
    <section className="faq-section theme-light" id="faq">
      <div className="container faq-container">
        <div className="faq-header">
          <span className="section-label faq-label">{faq.label}</span>
          <h2 className="faq-title serif-title">{faq.title}</h2>
        </div>

        <div className="faq-accordion-wrapper">
          <Accordion items={faqItems} variant="minimal" />
        </div>
      </div>
    </section>
  );
};

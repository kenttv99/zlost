import React from 'react';
import { COURSE_CONTENT } from '../../data/courseData';
import { Accordion } from '../ui/Accordion';
import './ProgramSection.css';

export const ProgramSection: React.FC = () => {
  const { program } = COURSE_CONTENT;

  const accordionItems = program.steps.map(step => ({
    id: step.number,
    badge: step.number,
    title: step.title,
    content: step.description
  }));

  return (
    <section className="program-section theme-light" id="program">
      <div className="container program-container">
        <div className="program-header">
          <span className="section-label program-label">{program.label}</span>
          <h2 className="program-title serif-title">{program.title}</h2>
        </div>

        <div className="program-accordion-wrapper">
          <Accordion items={accordionItems} variant="numbered" />
        </div>
      </div>
    </section>
  );
};

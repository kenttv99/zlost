import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import './Accordion.css';

export interface AccordionItemData {
  id: string | number;
  title: string;
  content: string;
  badge?: string | number;
}

interface AccordionProps {
  items: AccordionItemData[];
  variant?: 'numbered' | 'minimal';
}

export const Accordion: React.FC<AccordionProps> = ({ items, variant = 'minimal' }) => {
  const [openId, setOpenId] = useState<string | number | null>(items[0]?.id ?? null);

  const toggle = (id: string | number) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <div className={`accordion-root accordion-${variant}`}>
      {items.map(item => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className={`accordion-item ${isOpen ? 'is-open' : ''}`}>
            <button
              type="button"
              className="accordion-trigger"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
            >
              <div className="accordion-title-group">
                {variant === 'numbered' && (
                  <span className="accordion-number">{item.badge ?? item.id}</span>
                )}
                <span className="accordion-title">{item.title}</span>
              </div>
              <span className="accordion-icon" aria-hidden="true">
                {isOpen ? <Minus size={20} /> : <Plus size={20} />}
              </span>
            </button>
            <div className={`accordion-content ${isOpen ? 'show' : ''}`}>
              <div className="accordion-inner">
                <p>{item.content}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

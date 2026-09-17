import React, { useState, useRef } from 'react';
import { Play, CheckCircle2, FileText, Smartphone, ArrowRight, X, Sparkles } from 'lucide-react';
import { COURSE_CONTENT } from '../../data/courseData';
import { LessonPlayer } from '../ui/LessonPlayer';
import './FormatSection.css';

interface FormatSectionProps {
  onBuyClick?: () => void;
}

export const FormatSection: React.FC<FormatSectionProps> = ({ onBuyClick }) => {
  const { format } = COURSE_CONTENT;
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play size={26} strokeWidth={1.8} />;
      case 'practice': return <CheckCircle2 size={26} strokeWidth={1.8} />;
      case 'document': return <FileText size={26} strokeWidth={1.8} />;
      case 'devices': return <Smartphone size={26} strokeWidth={1.8} />;
      default: return null;
    }
  };

  const handleTogglePreview = () => {
    const nextState = !isPreviewOpen;
    setIsPreviewOpen(nextState);

    if (nextState) {
      setTimeout(() => {
        drawerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
    }
  };

  return (
    <section className="format-section theme-dark" id="format">
      <div className="container format-container">
        <div className={`format-card ${isPreviewOpen ? 'has-active-preview' : ''}`}>
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
            <button
              type="button"
              onClick={handleTogglePreview}
              className={`btn-pill ${isPreviewOpen ? 'btn-pill-active' : 'btn-pill-light'}`}
              aria-expanded={isPreviewOpen}
            >
              <span>{isPreviewOpen ? 'Скрыть пример урока' : format.ctaText}</span>
              {isPreviewOpen ? <X size={18} /> : <ArrowRight size={18} />}
            </button>
          </div>

          {/* In-Card Morphing Unfold Drawer */}
          <div
            ref={drawerRef}
            className={`format-preview-drawer ${isPreviewOpen ? 'is-open' : ''}`}
            aria-hidden={!isPreviewOpen}
          >
            <div className="format-preview-inner">
              <div className="format-preview-stage">
                <div className="preview-player-column">
                  {isPreviewOpen && (
                    <LessonPlayer
                      src="/media/lesson-preview.mp4"
                      poster="/media/lesson-preview-poster.jpg"
                      title="Фрагменты из уроков"
                      autoPlay={false}
                    />
                  )}
                </div>

                <div className="preview-info-column">
                  <div className="preview-info-badge">
                    <Sparkles size={14} className="preview-sparkle-icon" />
                    <span>Фрагменты из уроков</span>
                  </div>

                  <h3 className="preview-info-title">Зачем нам агрессия?</h3>
                  <p className="preview-info-desc">
                    Посмотрите живые отрывки из уроков: автор без лишней теории и терминов объясняет физиологию злости и показывает, как перестать копить раздражение до разрушительного взрыва.
                  </p>

                  <ul className="preview-highlights">
                    <li className="preview-highlight-item">
                      <CheckCircle2 size={18} className="highlight-icon" />
                      <span>Короткий фокусный формат (3–5 минут на урок)</span>
                    </li>
                    <li className="preview-highlight-item">
                      <CheckCircle2 size={18} className="highlight-icon" />
                      <span>Конкретные телесные и психологические практики</span>
                    </li>
                    <li className="preview-highlight-item">
                      <CheckCircle2 size={18} className="highlight-icon" />
                      <span>Бессрочный доступ сразу после оплаты</span>
                    </li>
                  </ul>

                  <div className="preview-actions">
                    <button
                      type="button"
                      onClick={onBuyClick}
                      className="btn-pill btn-pill-light preview-buy-btn"
                    >
                      <span>Купить курс за 1 490 ₽</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { CheckCircle2, Send, Copy, Check, ArrowLeft, ShieldCheck } from 'lucide-react';
import { COURSE_CONTENT } from '../../data/courseData';
import './SuccessPage.css';

interface SuccessPageProps {
  onBackToHome?: () => void;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({ onBackToHome }) => {
  const { author } = COURSE_CONTENT;
  const [copied, setCopied] = useState(false);

  // Telegram handle can be configured in courseData.ts or via VITE_TELEGRAM_HANDLE
  const tgHandle = import.meta.env.VITE_TELEGRAM_HANDLE || author.telegramUsername || '@anastasia_psy';
  const cleanHandle = tgHandle.replace('@', '');
  const tgUrl = `https://t.me/${cleanHandle}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(tgHandle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBack = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="success-page-root theme-dark">
      <div className="success-ambient-glow" />

      <div className="container success-container">
        {/* Top navigation */}
        <header className="success-nav">
          <button type="button" onClick={handleBack} className="success-back-btn">
            <ArrowLeft size={18} />
            <span>Вернуться на главную</span>
          </button>
        </header>

        {/* Main Success Card */}
        <main className="success-card">
          <div className="success-status-badge">
            <CheckCircle2 size={18} className="success-badge-icon" />
            <span>Оплата прошла успешно</span>
          </div>

          <h1 className="success-title serif-title">
            Добро пожаловать в курс!
          </h1>

          <p className="success-subtitle">
            Ваш платёж принят платёжным шлюзом. Теперь перейдём к получению материалов.
          </p>

          <div className="success-grid">
            {/* Illustrative Author Frame */}
            <div className="success-author-column">
              <div className="success-author-frame">
                <img
                  src={author.image}
                  alt={author.title}
                  className="success-author-image"
                />
                <div className="success-author-overlay">
                  <span className="success-author-tag">Анастасия</span>
                  <span className="success-author-role">автор курса</span>
                </div>
              </div>
            </div>

            {/* Instruction & Telegram Action Block */}
            <div className="success-info-column">
              <div className="success-instruction-card">
                <div className="instruction-quote-marker">“</div>
                <p className="success-instruction-text handwritten">
                  Напиши мне в личные сообщения и прикрепи чек об оплате, чтобы мы познакомились и я выдала доступ к курсу
                </p>
              </div>

              <div className="success-telegram-card">
                <div className="telegram-card-header">
                  <div className="telegram-icon-box">
                    <Send size={22} className="telegram-icon" />
                  </div>
                  <div className="telegram-meta">
                    <span className="telegram-meta-label">Прямая связь с автором</span>
                    <span className="telegram-handle-text">{tgHandle}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="telegram-copy-btn"
                    title="Скопировать логин"
                  >
                    {copied ? <Check size={16} color="#4ADE80" /> : <Copy size={16} />}
                    <span>{copied ? 'Скопировано' : 'Копировать'}</span>
                  </button>
                </div>

                <div className="telegram-action-wrapper">
                  <a
                    href={tgUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pill btn-pill-light telegram-primary-btn"
                  >
                    <Send size={18} />
                    <span>Написать в Telegram</span>
                  </a>
                </div>
              </div>

              <div className="success-steps-hint">
                <div className="hint-item">
                  <span className="hint-num">1</span>
                  <span>Нажмите на кнопку и перейдите в диалог Telegram</span>
                </div>
                <div className="hint-item">
                  <span className="hint-num">2</span>
                  <span>Прикрепите скриншот или чек вашей оплаты</span>
                </div>
                <div className="hint-item">
                  <span className="hint-num">3</span>
                  <span>Анастасия лично отправит ссылку на закрытый канал и уроки</span>
                </div>
              </div>

              <div className="success-security-note">
                <ShieldCheck size={16} />
                <span>Безопасная выдача доступа • Бессрочный доступ к материалам</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

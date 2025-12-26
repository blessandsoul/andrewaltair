'use client';

import React, { useState, useEffect } from 'react';

interface Deal {
    id: string;
    title: string;
    description: string;
    originalPrice: number;
    discountedPrice: number;
    discount: number;
    endTime: Date;
    icon: string;
    tag?: string;
    features: string[];
}

const generateDeals = (): Deal[] => {
    const now = new Date();
    return [
        {
            id: '1',
            title: 'AI Starter Pack',
            description: 'Идеальный старт в мире AI',
            originalPrice: 9900,
            discountedPrice: 4900,
            discount: 50,
            endTime: new Date(now.getTime() + 3 * 60 * 60 * 1000), // 3 hours
            icon: '🚀',
            tag: 'Самый популярный',
            features: ['10 часов обучения', '50 промптов', 'Сертификат'],
        },
        {
            id: '2',
            title: 'Pro Consultation',
            description: 'Персональная консультация',
            originalPrice: 15000,
            discountedPrice: 7500,
            discount: 50,
            endTime: new Date(now.getTime() + 1.5 * 60 * 60 * 1000), // 1.5 hours
            icon: '💎',
            tag: 'Скоро закончится',
            features: ['1 час с экспертом', 'Аудит процессов', 'Roadmap'],
        },
        {
            id: '3',
            title: 'AI Arsenal',
            description: 'Полный набор инструментов',
            originalPrice: 29900,
            discountedPrice: 14900,
            discount: 50,
            endTime: new Date(now.getTime() + 6 * 60 * 60 * 1000), // 6 hours
            icon: '⚔️',
            features: ['100+ инструментов', 'Пожизненный доступ', 'Обновления'],
        },
    ];
};

export default function LimitedTimeDeals() {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [timers, setTimers] = useState<{ [key: string]: string }>({});
    const [isVisible, setIsVisible] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

    useEffect(() => {
        setDeals(generateDeals());
        const timer = setTimeout(() => setIsVisible(true), 3000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const newTimers: { [key: string]: string } = {};
            deals.forEach(deal => {
                const diff = deal.endTime.getTime() - Date.now();
                if (diff > 0) {
                    const hours = Math.floor(diff / (60 * 60 * 1000));
                    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
                    const seconds = Math.floor((diff % (60 * 1000)) / 1000);
                    newTimers[deal.id] = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                } else {
                    newTimers[deal.id] = 'Истекло';
                }
            });
            setTimers(newTimers);
        }, 1000);

        return () => clearInterval(interval);
    }, [deals]);

    if (!isVisible) return null;

    return (
        <section className="limited-deals-section">
            <style jsx>{`
        .limited-deals-section {
          padding: 80px 20px;
          background: linear-gradient(180deg, rgba(17, 24, 39, 0) 0%, rgba(127, 29, 29, 0.1) 50%, rgba(17, 24, 39, 0) 100%);
        }

        .section-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .fire-icon {
          font-size: 48px;
          animation: fire 0.5s ease-in-out infinite alternate;
        }

        @keyframes fire {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }

        .section-title {
          font-size: 36px;
          font-weight: 800;
          background: linear-gradient(135deg, #ef4444, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 16px 0 8px;
        }

        .section-subtitle {
          font-size: 18px;
          color: #9ca3af;
        }

        .deals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .deal-card {
          background: linear-gradient(135deg, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.9));
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 20px;
          padding: 28px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .deal-card:hover {
          transform: translateY(-8px);
          border-color: rgba(239, 68, 68, 0.6);
          box-shadow: 0 20px 40px rgba(239, 68, 68, 0.2);
        }

        .deal-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #ef4444, #f59e0b);
        }

        .deal-tag {
          position: absolute;
          top: 16px;
          right: 16px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          font-size: 11px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 20px;
          text-transform: uppercase;
        }

        .deal-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .deal-title {
          font-size: 22px;
          font-weight: 700;
          color: white;
          margin-bottom: 8px;
        }

        .deal-description {
          font-size: 14px;
          color: #9ca3af;
          margin-bottom: 20px;
        }

        .price-container {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .original-price {
          font-size: 18px;
          color: #6b7280;
          text-decoration: line-through;
        }

        .discounted-price {
          font-size: 28px;
          font-weight: 800;
          color: #10b981;
        }

        .discount-badge {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          font-size: 14px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 8px;
        }

        .timer-container {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 20px;
        }

        .timer-label {
          font-size: 12px;
          color: #ef4444;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .timer-value {
          font-size: 24px;
          font-weight: 800;
          color: white;
          font-family: monospace;
          letter-spacing: 2px;
        }

        .timer-urgent {
          animation: urgentPulse 0.5s ease-in-out infinite;
        }

        @keyframes urgentPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 0 0 20px 0;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #d1d5db;
          margin-bottom: 8px;
        }

        .feature-check {
          color: #10b981;
        }

        .buy-button {
          width: 100%;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border: none;
          padding: 14px 24px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .buy-button:hover {
          transform: scale(1.02);
          box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }

        .modal-content {
          background: #1f2937;
          border-radius: 24px;
          padding: 40px;
          max-width: 500px;
          width: 100%;
          text-align: center;
        }

        .modal-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .modal-title {
          font-size: 28px;
          font-weight: 800;
          color: white;
          margin-bottom: 8px;
        }

        .modal-price {
          font-size: 36px;
          font-weight: 800;
          color: #10b981;
          margin-bottom: 24px;
        }

        .modal-timer {
          background: rgba(239, 68, 68, 0.2);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .confirm-button {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 16px 48px;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          margin-right: 12px;
        }

        .cancel-button {
          background: transparent;
          color: #9ca3af;
          border: 1px solid #374151;
          padding: 16px 32px;
          border-radius: 12px;
          font-size: 16px;
          cursor: pointer;
        }
      `}</style>

            <div className="section-header">
                <span className="fire-icon">🔥</span>
                <h2 className="section-title">Горящие предложения</h2>
                <p className="section-subtitle">Успейте получить скидку до 50%</p>
            </div>

            <div className="deals-grid">
                {deals.map(deal => (
                    <div key={deal.id} className="deal-card" onClick={() => setSelectedDeal(deal)}>
                        {deal.tag && <span className="deal-tag">{deal.tag}</span>}
                        <div className="deal-icon">{deal.icon}</div>
                        <h3 className="deal-title">{deal.title}</h3>
                        <p className="deal-description">{deal.description}</p>

                        <div className="price-container">
                            <span className="original-price">{deal.originalPrice.toLocaleString()}₽</span>
                            <span className="discounted-price">{deal.discountedPrice.toLocaleString()}₽</span>
                            <span className="discount-badge">-{deal.discount}%</span>
                        </div>

                        <div className="timer-container">
                            <div className="timer-label">⏰ Предложение истекает через</div>
                            <div className={`timer-value ${timers[deal.id]?.includes(':00:') ? 'timer-urgent' : ''}`}>
                                {timers[deal.id] || '--:--:--'}
                            </div>
                        </div>

                        <ul className="features-list">
                            {deal.features.map((feature, i) => (
                                <li key={i} className="feature-item">
                                    <span className="feature-check">✓</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button className="buy-button">
                            Забрать скидку <span>→</span>
                        </button>
                    </div>
                ))}
            </div>

            {selectedDeal && (
                <div className="modal-overlay" onClick={() => setSelectedDeal(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-icon">{selectedDeal.icon}</div>
                        <h3 className="modal-title">{selectedDeal.title}</h3>
                        <div className="modal-price">{selectedDeal.discountedPrice.toLocaleString()}₽</div>
                        <div className="modal-timer">
                            <div className="timer-label">Осталось времени</div>
                            <div className="timer-value">{timers[selectedDeal.id]}</div>
                        </div>
                        <button className="confirm-button">Оформить заказ</button>
                        <button className="cancel-button" onClick={() => setSelectedDeal(null)}>Отмена</button>
                    </div>
                </div>
            )}
        </section>
    );
}

'use client';

import React, { useState, useEffect } from 'react';

interface Prize {
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    value?: string;
}

const prizes: Prize[] = [
    { id: '1', name: '10% скидка', description: 'На любой курс', icon: '🎫', rarity: 'common', value: '10%' },
    { id: '2', name: 'Бесплатный урок', description: 'AI для начинающих', icon: '📚', rarity: 'common' },
    { id: '3', name: '50 AI кредитов', description: 'Для тестирования', icon: '💎', rarity: 'rare', value: '50' },
    { id: '4', name: '25% скидка', description: 'На премиум план', icon: '🌟', rarity: 'rare', value: '25%' },
    { id: '5', name: 'Эксклюзивный гайд', description: 'Продвинутые промпты', icon: '📖', rarity: 'epic' },
    { id: '6', name: 'Консультация 15 мин', description: 'С Andrew Altair', icon: '🎯', rarity: 'epic' },
    { id: '7', name: '50% скидка', description: 'На годовую подписку', icon: '💰', rarity: 'legendary', value: '50%' },
    { id: '8', name: 'VIP доступ', description: 'На 1 месяц', icon: '👑', rarity: 'legendary' },
];

const rarityColors = {
    common: { bg: 'linear-gradient(135deg, #6b7280, #4b5563)', glow: '#6b7280' },
    rare: { bg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', glow: '#3b82f6' },
    epic: { bg: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', glow: '#8b5cf6' },
    legendary: { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', glow: '#f59e0b' },
};

const rarityNames = {
    common: 'Обычный',
    rare: 'Редкий',
    epic: 'Эпический',
    legendary: 'Легендарный',
};

export default function MysteryBox() {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpening, setIsOpening] = useState(false);
    const [wonPrize, setWonPrize] = useState<Prize | null>(null);
    const [canOpen, setCanOpen] = useState(true);
    const [timeUntilNext, setTimeUntilNext] = useState<string>('');
    const [showBox, setShowBox] = useState(false);

    useEffect(() => {
        const lastOpened = localStorage.getItem('mysteryBoxLastOpened');
        if (lastOpened) {
            const lastTime = parseInt(lastOpened);
            const now = Date.now();
            const diff = now - lastTime;
            const cooldown = 24 * 60 * 60 * 1000; // 24 hours

            if (diff < cooldown) {
                setCanOpen(false);
                const remaining = cooldown - diff;
                updateTimer(remaining);
            }
        }
        setShowBox(true);
    }, []);

    useEffect(() => {
        if (!canOpen) {
            const interval = setInterval(() => {
                const lastOpened = localStorage.getItem('mysteryBoxLastOpened');
                if (lastOpened) {
                    const lastTime = parseInt(lastOpened);
                    const now = Date.now();
                    const diff = now - lastTime;
                    const cooldown = 24 * 60 * 60 * 1000;

                    if (diff >= cooldown) {
                        setCanOpen(true);
                        clearInterval(interval);
                    } else {
                        updateTimer(cooldown - diff);
                    }
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [canOpen]);

    const updateTimer = (remaining: number) => {
        const hours = Math.floor(remaining / (60 * 60 * 1000));
        const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
        setTimeUntilNext(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    const selectPrize = (): Prize => {
        const random = Math.random();
        let filtered: Prize[];

        if (random < 0.5) {
            filtered = prizes.filter(p => p.rarity === 'common');
        } else if (random < 0.8) {
            filtered = prizes.filter(p => p.rarity === 'rare');
        } else if (random < 0.95) {
            filtered = prizes.filter(p => p.rarity === 'epic');
        } else {
            filtered = prizes.filter(p => p.rarity === 'legendary');
        }

        return filtered[Math.floor(Math.random() * filtered.length)];
    };

    const handleOpen = () => {
        if (!canOpen || isOpening) return;

        setIsOpening(true);

        // Simulate opening animation
        setTimeout(() => {
            const prize = selectPrize();
            setWonPrize(prize);
            setIsOpening(false);
            setIsOpen(true);
            setCanOpen(false);
            localStorage.setItem('mysteryBoxLastOpened', Date.now().toString());

            // Save won prize
            const wonPrizes = JSON.parse(localStorage.getItem('mysteryBoxPrizes') || '[]');
            wonPrizes.push({ ...prize, wonAt: new Date().toISOString() });
            localStorage.setItem('mysteryBoxPrizes', JSON.stringify(wonPrizes));
        }, 2000);
    };

    const handleClose = () => {
        setIsOpen(false);
        setWonPrize(null);
    };

    if (!showBox) return null;

    return (
        <div className="mystery-box-container">
            <style jsx>{`
        .mystery-box-container {
          position: fixed;
          bottom: 120px;
          right: 24px;
          z-index: 1000;
        }

        .mystery-box {
          width: 70px;
          height: 70px;
          border-radius: 16px;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
          position: relative;
          overflow: hidden;
        }

        .mystery-box:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 30px rgba(139, 92, 246, 0.6);
        }

        .mystery-box.disabled {
          background: linear-gradient(135deg, #4b5563, #374151);
          cursor: not-allowed;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .mystery-box.disabled:hover {
          transform: none;
        }

        .mystery-box.opening {
          animation: shake 0.5s ease-in-out infinite;
        }

        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }

        .box-icon {
          font-size: 32px;
          z-index: 1;
        }

        .sparkle {
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%);
          animation: sparkle 2s infinite;
        }

        @keyframes sparkle {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .timer-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #1f2937;
          color: #f3f4f6;
          font-size: 10px;
          padding: 4px 6px;
          border-radius: 8px;
          font-weight: 600;
          border: 2px solid #374151;
        }

        .new-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          padding: 4px 8px;
          border-radius: 8px;
          font-weight: 700;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: #1f2937;
          border-radius: 24px;
          padding: 40px;
          max-width: 400px;
          width: 90%;
          text-align: center;
          position: relative;
          animation: scaleIn 0.4s ease;
        }

        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .prize-icon {
          font-size: 80px;
          margin-bottom: 20px;
          animation: bounce 0.6s ease;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .rarity-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 16px;
          color: white;
        }

        .prize-name {
          font-size: 24px;
          font-weight: 700;
          color: white;
          margin-bottom: 8px;
        }

        .prize-description {
          font-size: 16px;
          color: #9ca3af;
          margin-bottom: 24px;
        }

        .claim-button {
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          color: white;
          border: none;
          padding: 14px 40px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .claim-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
        }

        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          animation: confetti-fall 3s ease-out forwards;
        }

        @keyframes confetti-fall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
        }

        .tooltip {
          position: absolute;
          bottom: 80px;
          right: 0;
          background: #1f2937;
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .mystery-box:hover + .tooltip,
        .mystery-box:focus + .tooltip {
          opacity: 1;
        }
      `}</style>

            <div
                className={`mystery-box ${!canOpen ? 'disabled' : ''} ${isOpening ? 'opening' : ''}`}
                onClick={handleOpen}
                role="button"
                tabIndex={0}
                aria-label="Открыть таинственный ящик"
            >
                {canOpen && <div className="sparkle" />}
                <span className="box-icon">{isOpening ? '✨' : '🎁'}</span>
                {canOpen ? (
                    <span className="new-badge">NEW!</span>
                ) : (
                    <span className="timer-badge">{timeUntilNext}</span>
                )}
            </div>
            <div className="tooltip">
                {canOpen ? 'Ежедневный приз!' : `Следующий через ${timeUntilNext}`}
            </div>

            {isOpen && wonPrize && (
                <div className="modal-overlay" onClick={handleClose}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        {/* Confetti */}
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className="confetti"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    backgroundColor: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][Math.floor(Math.random() * 4)],
                                    animationDelay: `${Math.random() * 0.5}s`,
                                    borderRadius: Math.random() > 0.5 ? '50%' : '0',
                                }}
                            />
                        ))}

                        <div className="prize-icon">{wonPrize.icon}</div>
                        <div
                            className="rarity-badge"
                            style={{ background: rarityColors[wonPrize.rarity].bg }}
                        >
                            {rarityNames[wonPrize.rarity]}
                        </div>
                        <h3 className="prize-name">{wonPrize.name}</h3>
                        <p className="prize-description">{wonPrize.description}</p>
                        <button className="claim-button" onClick={handleClose}>
                            Забрать приз! 🎉
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

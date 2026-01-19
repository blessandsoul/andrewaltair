'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlossaryTooltipProps {
    term: string;
    definition: string;
    children: React.ReactNode;
}

export default function GlossaryTooltip({ term, definition, children }: GlossaryTooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState<'top' | 'bottom'>('top');
    const triggerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (isVisible && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            // If there's not enough space above, show below
            setPosition(rect.top < 150 ? 'bottom' : 'top');
        }
    }, [isVisible]);

    return (
        <span
            ref={triggerRef}
            className="relative inline cursor-help"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {/* Term with dotted underline */}
            <span className="border-b border-dotted border-[#00f3ff] text-[#00f3ff] hover:text-[#00f3ff]/80 transition-colors">
                {children}
            </span>

            {/* Tooltip */}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: position === 'top' ? 10 : -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: position === 'top' ? 10 : -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute z-50 w-64 p-4 rounded-xl backdrop-blur-md shadow-xl border border-[#00f3ff]/30 left-1/2 -translate-x-1/2 ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
                            }`}
                        style={{
                            background: 'linear-gradient(135deg, rgba(10, 10, 26, 0.95) 0%, rgba(5, 5, 16, 0.98) 100%)',
                            boxShadow: '0 0 20px rgba(0, 243, 255, 0.15), inset 0 0 20px rgba(0, 243, 255, 0.05)'
                        }}
                    >
                        {/* Term Title */}
                        <div className="text-sm font-bold text-[#00f3ff] mb-2 font-mono">
                            {term}
                        </div>

                        {/* Definition */}
                        <p className="text-xs text-gray-300 leading-relaxed">
                            {definition}
                        </p>

                        {/* Arrow */}
                        <div
                            className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-transparent ${position === 'top'
                                    ? 'top-full border-t-8 border-t-[#0a0a1a]'
                                    : 'bottom-full border-b-8 border-b-[#0a0a1a]'
                                }`}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    );
}

// Utility function to wrap glossary terms in text
export function wrapGlossaryTerms(
    text: string,
    glossary: Record<string, string>
): React.ReactNode {
    if (!text || !glossary || Object.keys(glossary).length === 0) {
        return text;
    }

    const terms = Object.keys(glossary).sort((a, b) => b.length - a.length); // Match longer terms first
    const parts: React.ReactNode[] = [];
    let remainingText = text;
    let key = 0;

    while (remainingText.length > 0) {
        let foundMatch = false;

        for (const term of terms) {
            const lowerRemaining = remainingText.toLowerCase();
            const lowerTerm = term.toLowerCase();
            const index = lowerRemaining.indexOf(lowerTerm);

            if (index === 0) {
                // Found term at the beginning
                const matchedText = remainingText.substring(0, term.length);
                parts.push(
                    <GlossaryTooltip key={key++} term={term} definition={glossary[term]}>
                        {matchedText}
                    </GlossaryTooltip>
                );
                remainingText = remainingText.substring(term.length);
                foundMatch = true;
                break;
            } else if (index > 0) {
                // Found term but not at beginning - add prefix text first
                parts.push(remainingText.substring(0, index));
                remainingText = remainingText.substring(index);
                foundMatch = true;
                break;
            }
        }

        if (!foundMatch) {
            // No term found, add first character and continue
            parts.push(remainingText[0]);
            remainingText = remainingText.substring(1);
        }
    }

    return <>{parts}</>;
}

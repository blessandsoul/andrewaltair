'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const phrases = [
    "გამარჯობა, AI ენთუზიასტო 👋",
    "მზად ხარ ციფრული რევოლუციისთვის? 🚀",
    "შექმენი შენი პირველი აგენტი 🤖",
    "აღმოაჩინე ტექნოლოგიების მაგია ✨",
    "Andrew Altair გელოდება... 👁️"
];

export function HeroGreeting() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        }, 3000); // Change phrase every 3 seconds

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="h-8 mb-2 flex items-center">
            <AnimatePresence mode="wait">
                <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="text-lg font-medium text-accent font-mono tracking-wide"
                >
                    {phrases[index]}
                </motion.p>
            </AnimatePresence>
        </div>
    );
}

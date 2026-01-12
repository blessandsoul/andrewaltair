'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TbBrandTelegram, TbBrandYoutube, TbBrandInstagram, TbBrandTiktok, TbBrandFacebook, TbPlus, TbX } from 'react-icons/tb'

export default function SocialFloatingButton() {
    const [isOpen, setIsOpen] = useState(false)

    const socials = [
        { name: 'Telegram', icon: TbBrandTelegram, url: 'https://t.me/andr3waltairchannel', color: 'bg-[#2AABEE]' },
        { name: 'YouTube', icon: TbBrandYoutube, url: 'https://www.youtube.com/@AndrewAltair', color: 'bg-[#FF0000]' },
        { name: 'Instagram', icon: TbBrandInstagram, url: 'https://www.instagram.com/andr3waltair/', color: 'bg-[#E1306C]' },
        { name: 'TikTok', icon: TbBrandTiktok, url: 'https://www.tiktok.com/@andrewaltair', color: 'bg-black' },
        { name: 'Facebook', icon: TbBrandFacebook, url: 'https://www.facebook.com/andr3waltair', color: 'bg-[#1877F2]' },
    ]

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            <AnimatePresence>
                {isOpen && (
                    <div className="flex flex-col gap-3 mb-2">
                        {socials.map((social, i) => (
                            <motion.a
                                key={social.name}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center gap-3 pr-1"
                            >
                                <span className="bg-background/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm border border-border/50">
                                    {social.name}
                                </span>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg shadow-black/10 hover:scale-110 transition-transform ${social.color}`}>
                                    <social.icon className="w-5 h-5" />
                                </div>
                            </motion.a>
                        ))}
                    </div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-colors ${isOpen ? 'bg-muted text-foreground' : 'bg-primary text-primary-foreground'}`}
            >
                <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <TbPlus className="w-8 h-8" />
                </motion.div>
            </motion.button>
        </div>
    )
}

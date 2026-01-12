'use client'

import { TbBrandTelegram, TbBrandYoutube, TbBrandInstagram, TbBrandTiktok, TbBrandFacebook, TbSparkles } from 'react-icons/tb'
import { motion } from 'framer-motion'

export default function SocialFooterBanner() {
    const socials = [
        { icon: TbBrandTelegram, url: 'https://t.me/andr3waltairchannel', color: 'text-sky-500', bg: 'bg-sky-500/10' },
        { icon: TbBrandYoutube, url: 'https://www.youtube.com/@AndrewAltair', color: 'text-red-600', bg: 'bg-red-600/10' },
        { icon: TbBrandInstagram, url: 'https://www.instagram.com/andr3waltair/', color: 'text-pink-600', bg: 'bg-pink-600/10' },
        { icon: TbBrandTiktok, url: 'https://www.tiktok.com/@andrewaltair', color: 'text-black dark:text-white', bg: 'bg-gray-500/10' },
        { icon: TbBrandFacebook, url: 'https://www.facebook.com/andr3waltair', color: 'text-blue-600', bg: 'bg-blue-600/10' },
    ]

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-background to-primary/5 border p-8 md:p-12 mb-8 group">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <TbSparkles className="w-4 h-4" />
                    <span>არ გამოტოვოთ სიახლეები</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60">
                    გამოიწერეთ ჩემი არხები
                </h2>
                <p className="text-muted-foreground max-w-lg text-lg">
                    მიიღეთ წვდომა ექსკლუზიურ კონტენტზე, უფასო პრომპტებსა და უახლეს AI სიახლეებზე.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                    {socials.map((social, i) => (
                        <motion.a
                            key={i}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-4 rounded-2xl bg-background border shadow-sm hover:shadow-md transition-all ${social.color}`}
                        >
                            <social.icon className="w-6 h-6 md:w-8 md:h-8" />
                        </motion.a>
                    ))}
                </div>
            </div>
        </div>
    )
}

"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { brand } from "@/lib/brand"
import { TbBrandYoutube, TbBrandInstagram, TbSend, TbMail, TbFileText } from "react-icons/tb"

export function AboutHero() {
    return (
        <section className="relative py-20 lg:py-32 overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5">
                <div className="absolute inset-0 noise-overlay"></div>
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
                />
            </div>

            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                    {/* Left: Interactive 3D/Photo Element */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center lg:items-start text-center lg:text-left"
                    >
                        <div className="relative mb-8 group cursor-pointer perspective-1000">
                            <motion.div
                                whileHover={{ rotateY: 15, rotateX: -5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                                <div className="relative w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden border border-white/10">
                                    <Image
                                        src="/andrewaltair.png"
                                        alt="Andrew Altair"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            </motion.div>

                            {/* Floating Video Avatar Indicator */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="absolute -bottom-4 -right-4 w-12 h-12 bg-red-500 rounded-full border-4 border-background flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                            >
                                <TbBrandYoutube className="text-white w-6 h-6" />
                            </motion.div>
                        </div>

                        <div className="flex gap-3 flex-wrap justify-center lg:justify-start">
                            {[
                                { icon: TbBrandYoutube, label: "YouTube", href: brand.social.youtube, color: "text-red-500" },
                                { icon: TbBrandInstagram, label: "Instagram", href: brand.social.instagram, color: "text-pink-500" },
                                { icon: TbSend, label: "Telegram", href: brand.social.telegram, color: "text-sky-500" }
                            ].map((social, idx) => (
                                <Link key={social.label} href={social.href}>
                                    <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                                        <Button variant="outline" size="sm" className="gap-2 bg-background/50 backdrop-blur-sm hover:bg-background/80">
                                            <social.icon className={`w-4 h-4 ${social.color}`} />
                                            {social.label}
                                        </Button>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: Bio */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                            </span>
                            AI ინოვატორი
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                            <span className="block text-2xl sm:text-3xl font-medium text-muted-foreground mb-2">
                                {new Date().getHours() < 12 ? "დილა მშვიდობისა," : new Date().getHours() < 18 ? "გამარჯობა," : "საღამო მშვიდობისა,"} მე ვარ
                            </span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient">
                                Andrew Altair
                            </span>
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed">
                            ვარ ხელოვნური ინტელექტის ენთუზიასტი და კონტენტ კრეატორი.
                            <span className="text-foreground font-semibold"> {brand.stats.yearsExperience} წელზე მეტია </span>
                            ვმუშაობ ტექნოლოგიების სფეროში და ვეხმარები ადამიანებს AI-ს შესაძლებლობების გამოყენებაში.
                        </p>

                        <p className="text-lg text-muted-foreground/80 leading-relaxed">
                            ჩემი მისიაა — გავხადო რთული AI კონცეფციები მარტივი და ხელმისაწვდომი ყველასთვის.
                            ვქმნი კონტენტს ChatGPT-ს, DALL-E-ს და სხვა AI ინსტრუმენტების შესახებ.
                        </p>

                        <div className="flex gap-4">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                                    <TbMail className="w-4 h-4 mr-2" />
                                    დამიკავშირდი
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button size="lg" variant="outline" asChild className="hover:bg-accent/5">
                                    <Link href="/blog">
                                        <TbFileText className="w-4 h-4 mr-2" />
                                        ბლოგი
                                    </Link>
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TbArrowRight, TbBrandGithub, TbBrandLinkedin, TbBrandTwitter } from "react-icons/tb"
import { brand } from "@/lib/brand"

export function AboutHero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-white/5">
            {/* Neuro-Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <div className="container relative mx-auto px-6 lg:px-12 max-w-[90rem]">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-center">

                    {/* Typography / Content (Left - 7 cols) */}
                    <div className="lg:col-span-7 space-y-8 lg:space-y-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-6"
                        >
                            <Badge variant="outline" className="px-4 py-1.5 text-sm tracking-widest uppercase border-primary/20 text-primary bg-primary/5 rounded-full">
                                AI ინოვატორი
                            </Badge>

                            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] text-foreground">
                                Andrew <br />
                                <span className="text-muted-foreground/30">Altair.</span>
                            </h1>

                            <p className="text-xl sm:text-2xl text-muted-foreground/80 max-w-2xl leading-relaxed font-light">
                                ვქმნი <span className="text-foreground font-medium">Neuro-Aesthetic</span> ინტერფეისებს
                                აგენტური ვებ-სამყაროსთვის. სპეციალიზაცია: Reasoning Models და მაღალი წარმადობის UI.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-wrap gap-4"
                        >
                            <Button size="lg" className="h-14 px-8 text-base rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-[0_0_20px_-5px_var(--primary)]" asChild>
                                <Link href="#contact">
                                    თანამშრომლობა <TbArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="ghost" className="h-14 px-8 text-base rounded-full border border-white/10 hover:bg-white/5" asChild>
                                <Link href="/blog">
                                    წაიკითხე მანიფესტი
                                </Link>
                            </Button>
                        </motion.div>

                        {/* Social Proof - Monochrome */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="pt-8 flex gap-6 text-muted-foreground"
                        >
                            {[
                                { icon: TbBrandGithub, href: brand.social.github },
                                { icon: TbBrandLinkedin, href: brand.social.linkedin },
                                { icon: TbBrandTwitter, href: brand.social.twitter }
                            ].map((social, i) => (
                                <Link key={i} href={social.href || "#"} className="hover:text-primary transition-colors">
                                    <social.icon className="w-6 h-6" />
                                </Link>
                            ))}
                        </motion.div>
                    </div>

                    {/* Image / Visual (Right - 5 cols) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="lg:col-span-5 relative aspect-square lg:aspect-[4/5] max-w-lg mx-auto lg:mx-0"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl -rotate-6 blur-2xl" />
                        <div className="relative h-full w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-muted">
                            <Image
                                src="/i.png"
                                alt="Andrew Altair"
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                priority
                            />
                        </div>

                        {/* Floating Metric Card */}
                        <div className="absolute -bottom-8 -left-8 bg-card border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md hidden sm:block">
                            <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">გამოცდილება</div>
                            <div className="text-3xl font-bold font-mono text-primary">{brand.stats.yearsExperience} წელი</div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    )
}

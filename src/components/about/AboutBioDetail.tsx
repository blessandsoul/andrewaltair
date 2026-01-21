"use client"

import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { TbBrain, TbStack2 } from "react-icons/tb"
import { brand } from "@/lib/brand"

export function AboutBioDetail() {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-6 lg:px-12 max-w-[90rem]">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">

                    {/* Left Column - Sticky Title or Intro */}
                    <div className="lg:col-span-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="sticky top-32 space-y-8"
                        >
                            <div>
                                <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-primary">ჩემი ისტორია</h2>
                                <div className="h-1.5 w-20 bg-primary/20 rounded-full mt-6 mb-6" />
                            </div>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                მოგესალმებით, მე ვარ <span className="text-foreground font-medium">Andrew Altair</span> — {brand.bio.title}.
                            </p>
                        </motion.div>
                    </div>

                    {/* Right Column - Detailed Content */}
                    <div className="lg:col-span-8 space-y-16">

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="prose prose-lg prose-invert text-muted-foreground/90 leading-loose max-w-none"
                        >
                            <p>
                                {brand.bio.long}
                            </p>
                            <p className="font-medium text-foreground text-xl">
                                {brand.bio.philosophy}
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-4">
                                {brand.bio.bullets.map((bullet, i) => (
                                    <li key={i}>{bullet}</li>
                                ))}
                            </ul>
                        </motion.div>

                        <Separator className="bg-white/5" />

                        {/* Tech Stack Grid */}
                        <div className="grid md:grid-cols-2 gap-10">

                            {/* Technical Arsenal */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="space-y-5"
                            >
                                <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                                    <TbStack2 className="text-primary text-2xl" />
                                    ტექნიკური არსენალი
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    როგორც <strong>Senior Frontend Architect</strong>, მე ვიყენებ უახლეს სტეკს მაღალი წარმადობის სისტემების შესაქმნელად.
                                </p>
                                <ul className="space-y-3 text-sm text-muted-foreground/80">
                                    <li className="flex items-start gap-3">
                                        <span className="h-1.5 w-1.5 mt-2 rounded-full bg-primary shrink-0" />
                                        <span><strong className="text-foreground">Core:</strong> Next.js 15, RSC, TypeScript</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="h-1.5 w-1.5 mt-2 rounded-full bg-primary shrink-0" />
                                        <span><strong className="text-foreground">Style:</strong> Tailwind CSS v4, Framer Motion</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="h-1.5 w-1.5 mt-2 rounded-full bg-primary shrink-0" />
                                        <span><strong className="text-foreground">AI:</strong> LangChain, Vector DBs, Fine-tuning</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="h-1.5 w-1.5 mt-2 rounded-full bg-primary shrink-0" />
                                        <span><strong className="text-foreground">Backend:</strong> Node.js, Python, Supabase</span>
                                    </li>
                                </ul>
                            </motion.div>

                            {/* Neuro-Aesthetic */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="space-y-5"
                            >
                                <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                                    <TbBrain className="text-primary text-2xl" />
                                    Neuro-Aesthetic
                                </h3>
                                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                                    <p>
                                        მე არ ვქმნი უბრალოდ ვებ-გვერდებს. მე ვქმნი <strong>ციფრულ გამოცდილებას</strong>.
                                        Neuro-Aesthetic დიზაინი გულისხმობს ინტერფეისების აგებას ადამიანის ტვინის აღქმის თავისებურებების გათვალისწინებით.
                                    </p>
                                    <p>
                                        მინიმალისტური ფერები, მკაფიო ტიპოგრაფია და სოლიდური გეომეტრია — ეს არის "Dopamine-Driven" დიზაინის საფუძველი.
                                    </p>
                                </div>
                            </motion.div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

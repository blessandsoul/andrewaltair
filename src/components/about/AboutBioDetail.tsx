"use client"

import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"

export function AboutBioDetail() {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-6 lg:px-12 max-w-[90rem]">
                <div className="max-w-4xl mx-auto space-y-12">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-primary">ჩემი ისტორია</h2>
                        <div className="prose prose-lg prose-invert text-muted-foreground leading-relaxed">
                            <p>
                                მოგესალმებით, მე ვარ <strong>Andrew Altair</strong> — AI ინოვატორი და ციფრული არქიტექტორი.
                                ჩემი მოგზაურობა ტექნოლოგიებში დაიწყო 8 წლის წინ, როდესაც პირველად აღმოვაჩინე კოდის ძალა.
                                დღეს, მე ვიკვლევ საზღვრებს <strong className="text-foreground">ბიოლოგიურ ინტელექტსა</strong> და <strong className="text-foreground">სინთეზურ გონებას</strong> (Artificial Intelligence) შორის.
                            </p>
                            <p>
                                ჩემი მისიაა, გავხადო 2026 წლის უახლესი ტექნოლოგიები — <strong>Autonomous Agents</strong>, <strong>Reasoning Models</strong> (როგორიცაა GPT-5.2, Gemini 3, Claude 4.5) და <strong>Neuro-Symbolic AI</strong> — ხელმისაწვდომი თითოეული ადამიანისთვის.
                                მე მჯერა, რომ მომავალი ეკუთვნის მათ, ვინც შეძლებს ამ ინსტრუმენტების ჰარმონიულად ინტეგრირებას ყოველდღიურობაში.
                            </p>
                        </div>
                    </motion.div>

                    <Separator className="bg-white/10" />

                    <div className="grid md:grid-cols-2 gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="space-y-4"
                        >
                            <h3 className="text-xl font-bold text-foreground">ტექნიკური არსენალი</h3>
                            <p className="text-muted-foreground">
                                როგორც <strong>Senior Frontend Architect</strong>, მე ვიყენებ უახლეს სტეკს მაღალი წარმადობის სისტემების შესაქმნელად.
                                ჩემი ძირითადი ინსტრუმენტებია:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 marker:text-primary">
                                <li><strong>Core:</strong> Next.js 15, React Server Components, TypeScript</li>
                                <li><strong>Style:</strong> Tailwind CSS v4, Framer Motion, OKLCH Colors</li>
                                <li><strong>AI Engineering:</strong> LangChain, Vector Databases (Pinecone/Qdrant), LLM Fine-tuning</li>
                                <li><strong>Backend:</strong> Node.js, Python (FastAPI), Supabase</li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="space-y-4"
                        >
                            <h3 className="text-xl font-bold text-foreground">Neuro-Aesthetic ხედვა</h3>
                            <p className="text-muted-foreground">
                                მე არ ვქმნი უბრალოდ ვებ-გვერდებს. მე ვქმნი <strong>ციფრულ გამოცდილებას</strong>.
                                Neuro-Aesthetic დიზაინი გულისხმობს ინტერფეისების აგებას ადამიანის ტვინის აღქმის თავისებურებების გათვალისწინებით (Cognitive Load Theory).
                            </p>
                            <p className="text-muted-foreground">
                                მინიმალისტური ფერები, მკაფიო ტიპოგრაფია და სოლიდური გეომეტრია — ეს არის "Dopamine-Driven" დიზაინის საფუძველი, რომელიც ამცირებს მენტალურ დატვირთვას და ზრდის პროდუქტიულობას.
                            </p>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    )
}

"use client"

import { motion } from "framer-motion"
import { TbBrain, TbScale } from "react-icons/tb"

export function AboutPhilosophy() {
    return (
        <section className="py-20 bg-secondary/5 border-y border-white/5">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl font-bold mb-4"
                    >
                        ხედვა და ფილოსოფია
                    </motion.h2>
                    <p className="text-muted-foreground">რისი მჯერა და საით მივდივართ</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Prediction 2030 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 p-8"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TbBrain size={120} />
                        </div>

                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            <span className="text-indigo-400">2030</span> პროგნოზი
                        </h3>
                        <p className="text-lg leading-relaxed text-foreground/90 mb-6">
                            "2030 წლისთვის AI არ ჩაანაცვლებს ადამიანებს, მაგრამ ადამიანები,
                            რომლებიც იყენებენ AI-ს, ჩაანაცვლებენ მათ, ვინც მას არ იყენებს.
                            კრეატიულობა გახდება ყველაზე ღირებული ვალუტა."
                        </p>
                        <div className="text-sm font-mono text-indigo-400 opacity-60">
                            // Andrew Altair
                        </div>
                    </motion.div>

                    {/* Ethics Stance */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-white/10 p-8"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TbScale size={120} />
                        </div>

                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            <span className="text-emerald-400">ეთიკა</span> და პასუხისმგებლობა
                        </h3>
                        <p className="text-lg leading-relaxed text-foreground/90 mb-6">
                            ჩემი პოზიცია ცალსახაა: ტექნოლოგია უნდა ემსახურებოდეს ადამიანის გაძლიერებას და არა მანიპულაციას.
                            მე ვემხრობი გამჭვირვალე და ეთიკურ AI განვითარებას.
                        </p>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 text-xs font-medium border border-emerald-200 dark:border-emerald-500/30">Human Centric</span>
                            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 text-xs font-medium border border-emerald-200 dark:border-emerald-500/30">Transparency</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

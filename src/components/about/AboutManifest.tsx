"use client"

import { motion } from "framer-motion"
import {
    TbFlame,
    TbBolt,
    TbSparkles,
    TbSchool,
    TbFlag,
    TbRocket
} from "react-icons/tb"

const beliefs = [
    {
        text: "AI არ ჩაანაცვლებს ადამიანებს, მაგრამ ადამიანები AI-ით ჩაანაცვლებენ მათ, ვინც მას არ იყენებს",
        icon: TbBolt,
        color: "#a855f7"
    },
    {
        text: "ტექნოლოგია უნდა ემსახურებოდეს ადამიანს და არა პირიქით",
        icon: TbSparkles,
        color: "#f59e0b"
    },
    {
        text: "კრეატიულობა არის და იქნება ყველაზე ძვირფასი ვალუტა",
        icon: TbFlame,
        color: "#ef4444"
    },
    {
        text: "განათლება AI-ში უნდა იყოს ხელმისაწვდომი ყველასთვის — უფასოდ",
        icon: TbSchool,
        color: "#10b981"
    },
    {
        text: "საქართველოს შეუძლია გახდეს რეგიონალური ტექნოლოგიური ჰაბი",
        icon: TbFlag,
        color: "#dc2626"
    },
    {
        text: "მომავალი ეკუთვნის მათ, ვინც დღეს სწავლობს",
        icon: TbRocket,
        color: "#6366f1"
    },
]

export function AboutManifest() {
    return (
        <section className="py-20 lg:py-28 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl" />

            <div className="container relative mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 mb-4 text-primary">
                        <TbFlame className="w-6 h-6" />
                        <span className="text-sm font-bold uppercase tracking-widest">მანიფესტი</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                        რისი <span className="text-gradient">მჯერა</span>
                    </h2>
                </motion.div>

                <div className="grid gap-4 sm:gap-6">
                    {beliefs.map((belief, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group"
                        >
                            <div className="flex items-start gap-4 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-white/5 hover:border-primary/30 hover:bg-card/80 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                                    style={{ backgroundColor: `${belief.color}15` }}
                                >
                                    <belief.icon className="w-6 h-6" style={{ color: belief.color }} />
                                </div>
                                <p className="text-lg sm:text-xl font-medium leading-relaxed text-foreground/90">
                                    "{belief.text}"
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-12"
                >
                    <p className="text-muted-foreground font-mono text-sm">
                        // Andrew Altair, 2024
                    </p>
                </motion.div>
            </div>
        </section>
    )
}

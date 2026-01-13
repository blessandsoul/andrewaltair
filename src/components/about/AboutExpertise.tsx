"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import {
    TbBulb,
    TbRocket,
    TbBriefcase,
    TbSchool
} from "react-icons/tb"

const expertise = [
    {
        icon: TbBulb,
        title: "ChatGPT & Prompt Engineering",
        description: "პრომპტების ოპტიმიზაცია და AI-სთან ეფექტური კომუნიკაცია",
        color: "#f59e0b"
    },
    {
        icon: TbRocket,
        title: "AI ავტომატიზაცია",
        description: "ბიზნეს პროცესების ავტომატიზაცია ხელოვნური ინტელექტით",
        color: "#6366f1"
    },
    {
        icon: TbBriefcase,
        title: "AI კონსულტაცია",
        description: "კომპანიებისთვის AI სტრატეგიის შემუშავება და დანერგვა",
        color: "#22d3ee"
    },
    {
        icon: TbSchool,
        title: "AI განათლება",
        description: "ტრეინინგები და ვორქშოპები AI-ს შესახებ",
        color: "#10b981"
    }
]

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export function AboutExpertise() {
    return (
        <section className="py-16 lg:py-24 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2"></div>
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl font-bold"
                    >
                        🎯 ჩემი ექსპერტიზა
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground mt-2"
                    >
                        რაში შემიძლია დაგეხმაროთ
                    </motion.p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {expertise.map((exp, idx) => (
                        <motion.div key={exp.title} variants={item}>
                            <Card className="group h-full bg-background/50 backdrop-blur-md border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <CardContent className="p-6 space-y-4 relative z-10">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg"
                                        style={{ backgroundColor: `${exp.color}15`, boxShadow: `0 0 20px ${exp.color}15` }}
                                    >
                                        <exp.icon className="w-6 h-6" style={{ color: exp.color }} />
                                    </div>
                                    <h3 className="font-bold text-lg">{exp.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{exp.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

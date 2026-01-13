"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    TbPlayerPlay,
    TbBriefcase,
    TbSchool,
    TbSparkles,
    TbArrowRight,
    TbBrandYoutube
} from "react-icons/tb"
import { brand } from "@/lib/brand"

const paths = [
    {
        icon: TbPlayerPlay,
        badge: TbBrandYoutube,
        title: "ახალი ხარ AI-ში?",
        description: "დაიწყე ჩემი YouTube არხით — უფასო ვიდეოები ChatGPT-სა და AI-ს შესახებ",
        cta: "YouTube არხი",
        href: brand.social.youtube,
        color: "#ef4444",
        gradient: "from-red-500/20 to-orange-500/20"
    },
    {
        icon: TbSchool,
        badge: TbSchool,
        title: "გინდა ისწავლო?",
        description: "საბაზისო ტუტორიალებიდან დაწყებული Advanced Prompt Engineering-ით დამთავრებული",
        cta: "ტუტორიალები",
        href: "/tutorials",
        color: "#10b981",
        gradient: "from-emerald-500/20 to-teal-500/20"
    },
    {
        icon: TbBriefcase,
        badge: TbBriefcase,
        title: "ბიზნესი ხარ?",
        description: "AI სტრატეგია, ავტომატიზაცია, კორპორატიული ტრეინინგი — დამიკავშირდი პირადად",
        cta: "კონსულტაცია",
        href: brand.social.telegram.replace("channel", ""),
        color: "#6366f1",
        gradient: "from-indigo-500/20 to-purple-500/20"
    },
]

export function AboutStartPath() {
    return (
        <section className="py-20 lg:py-28 bg-secondary/5 border-y border-white/5">
            <div className="container mx-auto px-4 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 mb-4 text-accent">
                        <TbSparkles className="w-6 h-6" />
                        <span className="text-sm font-bold uppercase tracking-widest">დაიწყე აქ</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold">
                        შენთვის სწორი <span className="text-gradient">გზა</span>
                    </h2>
                    <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                        აირჩიე შენი ამჟამინდელი მდგომარეობა და მე დაგეხმარები შემდეგ ნაბიჯებში
                    </p>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-3">
                    {paths.map((path, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.15 }}
                        >
                            <Card className={`group h-full bg-gradient-to-br ${path.gradient} border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden`}>
                                <CardContent className="p-8 flex flex-col h-full">
                                    <div
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                                        style={{ backgroundColor: `${path.color}20` }}
                                    >
                                        <path.icon className="w-7 h-7" style={{ color: path.color }} />
                                    </div>

                                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                                        <path.badge className="w-5 h-5" style={{ color: path.color }} />
                                        {path.title}
                                    </h3>
                                    <p className="text-muted-foreground flex-grow mb-6 leading-relaxed">
                                        {path.description}
                                    </p>

                                    <Link href={path.href} target={path.href.startsWith("http") ? "_blank" : undefined}>
                                        <Button
                                            className="w-full gap-2 group-hover:gap-3 transition-all"
                                            style={{ backgroundColor: path.color }}
                                        >
                                            {path.cta}
                                            <TbArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

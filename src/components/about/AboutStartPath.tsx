"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TbPlayerPlay, TbBriefcase, TbSchool, TbArrowRight } from "react-icons/tb"
import { brand } from "@/lib/brand"

const paths = [
    {
        icon: TbPlayerPlay,
        title: "დამწყები",
        desc: "დაიწყე უფასო YouTube ტუტორიალებით.",
        cta: "უყურე ახლავე",
        href: brand.social.youtube,
    },
    {
        icon: TbSchool,
        title: "მსწავლელი",
        desc: "სიღრმისეული ცოდნა და კურსები.",
        cta: "ნახე კურსები",
        href: "/tutorials",
    },
    {
        icon: TbBriefcase,
        title: "ბიზნესი",
        desc: "შენი საქმიანობის ავტომატიზაცია.",
        cta: "კონსულტაცია",
        href: brand.social.telegram.replace("channel", ""),
    },
]

export function AboutStartPath() {
    return (
        <section className="py-24 border-b border-white/5">
            <div className="container mx-auto px-6 lg:px-12 max-w-[90rem]">
                <div className="grid lg:grid-cols-12 gap-12 items-center">

                    <div className="lg:col-span-4">
                        <h2 className="text-3xl font-bold tracking-tight mb-4">დაიწყე აქ</h2>
                        <p className="text-muted-foreground text-lg mb-8">
                            აირჩიე შენი გზა გამოცდილების მიხედვით.
                        </p>
                    </div>

                    <div className="lg:col-span-8 grid md:grid-cols-3 gap-6">
                        {paths.map((path, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card className="h-full bg-muted/20 border-white/5 hover:border-primary/30 transition-all duration-300 group">
                                    <CardContent className="p-8 flex flex-col h-full">
                                        <div className="w-12 h-12 bg-background border border-white/10 rounded-full flex items-center justify-center mb-6 group-hover:border-primary/50 transition-colors">
                                            <path.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>

                                        <h3 className="text-lg font-bold mb-2">{path.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-8 flex-grow">
                                            {path.desc}
                                        </p>

                                        <Link href={path.href} target={path.href.startsWith("http") ? "_blank" : undefined}>
                                            <Button variant="ghost" className="w-full text-foreground group-hover:text-primary justify-between px-0 hover:bg-transparent hover:px-2 transition-all">
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
            </div>
        </section>
    )
}

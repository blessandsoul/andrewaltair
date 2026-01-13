"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { TbCalendar } from "react-icons/tb"

const timeline = [
    {
        year: "2024",
        title: "AI კონტენტ კრეატორი",
        company: "AndrewAltair.GE",
        description: "AI-ს შესახებ კონტენტის შექმნა და გაზიარება სოციალურ ქსელებში"
    },
    {
        year: "2022",
        title: "AI სტარტაპის დამფუძნებელი",
        company: "AI Solutions",
        description: "კომპანიებისთვის AI გადაწყვეტილებების შექმნა და დანერგვა"
    },
    {
        year: "2020",
        title: "ტექნოლოგიური კონსულტანტი",
        company: "Tech Consulting",
        description: "ციფრული ტრანსფორმაცია და ტექნოლოგიური სტრატეგია"
    },
    {
        year: "2017",
        title: "პროდუქტის მენეჯერი",
        company: "Digital Agency",
        description: "ციფრული პროდუქტების მართვა და განვითარება"
    }
]

export function Timeline() {
    return (
        <section className="py-16 lg:py-24 bg-secondary/10 relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl font-bold flex items-center justify-center gap-3"
                    >
                        <TbCalendar className="w-8 h-8 text-primary" />
                        ჩემი გზა
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground mt-2"
                    >
                        კარიერული ისტორია
                    </motion.p>
                </div>

                <div className="space-y-8 relative">
                    {/* Center Line */}
                    <div className="absolute left-[31px] md:left-1/2 top-4 bottom-4 w-0.5 bg-border -translate-x-1/2 hidden md:block" />
                    <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-border md:hidden" />

                    {timeline.map((item, index) => (
                        <motion.div
                            key={index}
                            className={`flex gap-6 md:gap-0 items-center md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                            initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            {/* Spacer for desktop layout */}
                            <div className="flex-1 hidden md:block" />

                            {/* Center Dot */}
                            <div className="flex flex-col items-center relative z-10 mx-auto md:mx-4">
                                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-4 border-background">
                                    {item.year.slice(2)}
                                </div>
                            </div>

                            {/* Content Card */}
                            <div className="flex-1">
                                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-background/80 backdrop-blur-sm">
                                    <CardContent className="p-6 relative">
                                        {/* Arrow for desktop */}
                                        <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-background rotate-45 ${index % 2 === 0 ? '-left-2 border-l border-b border-border/0' : '-right-2 border-r border-t border-border/0'}`} />

                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                            <TbCalendar className="w-4 h-4" />
                                            {item.year}
                                        </div>
                                        <h3 className="font-bold text-lg">{item.title}</h3>
                                        <p className="text-primary text-sm font-medium">{item.company}</p>
                                        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{item.description}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

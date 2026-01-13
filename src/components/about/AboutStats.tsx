"use client"

import CountUp from "react-countup"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { brand } from "@/lib/brand"

const stats = [
    { value: parseInt(brand.stats.yearsExperience), suffix: "+", label: "წელი გამოცდილება" },
    { value: 50, suffix: "K+", label: "გამომწერი" }, // Hardcoded base number for animation, visual suffix
    { value: 200, suffix: "+", label: "სტატია" },
    { value: 30, suffix: "+", label: "პროექტი" },
]

export function AboutStats() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <section ref={ref} className="py-12 bg-card border-y border-border relative z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                            <div className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground group-hover:from-primary group-hover:to-accent transition-all duration-300">
                                {isInView ? (
                                    <CountUp end={stat.value} duration={2.5} separator="," />
                                ) : (
                                    "0"
                                )}
                                {stat.suffix}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

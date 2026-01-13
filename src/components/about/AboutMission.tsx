"use client"

import { motion } from "framer-motion"
import { TbWorld, TbUsersGroup } from "react-icons/tb"

export function AboutMission() {
    return (
        <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4 max-w-5xl relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                            რატომ <span className="text-primary">საქართველო?</span>
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                            ჩემი მთავარი მოტივაციაა, საქართველო გახდეს რეგიონალური ლიდერი ტექნოლოგიებში.
                            მჯერა, რომ AI არის ის ინსტრუმენტი, რომელიც პატარა ქვეყნებს აძლევს შანსს,
                            გაუსწრონ გლობალურ კონკურენციას.
                        </p>
                        <div className="flex items-center gap-4 text-sm font-medium text-accent">
                            <TbWorld className="w-6 h-6" />
                            <span>გლობალური ხედვა, ლოკალური მოქმედება</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-secondary/10 p-8 rounded-3xl border border-white/5 backdrop-blur-sm"
                    >
                        <div className="mb-6">
                            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                                <TbUsersGroup className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">დემოკრატიზაცია</h3>
                            <p className="text-muted-foreground">
                                ჩემი მიზანია, AI განათლება იყოს ხელმისაწვდომი ყველასთვის — სკოლის მოსწავლიდან დაწყებული,
                                გამოცდილი პროფესიონალით დამთავრებული. ტექნოლოგია არ უნდა იყოს პრივილეგია.
                            </p>
                        </div>
                        <div className="h-1 w-full bg-gradient-to-r from-primary to-transparent rounded-full" />
                    </motion.div>
                </div>
            </div>

            {/* Background Graphic */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
        </section>
    )
}

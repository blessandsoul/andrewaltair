"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const movies = [
    { title: "Interstellar", src: "/inspiration/interstellar.jpg" },
    { title: "Inception", src: "/inspiration/inception.jpg" },
    { title: "Transcendence", src: "/inspiration/transcendence.jpg" },
    { title: "Hitchhiker's Guide", src: "/inspiration/hitchhiker.jpg" },
]

export function AboutInspiration() {
    return (
        <section className="py-20 lg:py-24">
            <div className="container mx-auto px-4 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-muted-foreground mb-4">
                        ინსპირაცია
                    </h2>
                    <div className="w-12 h-1 bg-primary mx-auto rounded-full" />
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {movies.map((movie, idx) => (
                        <motion.div
                            key={movie.title}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl cursor-default"
                        >
                            <Image
                                src={movie.src}
                                alt={movie.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <span className="text-white font-medium text-sm">{movie.title}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

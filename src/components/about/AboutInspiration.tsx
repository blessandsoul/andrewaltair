"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const movies = [
    {
        title: "Interstellar",
        src: "/inspiration/interstellar.jpg",
        year: "2014",
    },
    {
        title: "Inception",
        src: "/inspiration/inception.jpg",
        year: "2010",
    },
    {
        title: "Transcendence",
        src: "/inspiration/transcendence.jpg",
        year: "2014",
    },
    {
        title: "Ex Machina",
        src: "https://m.media-amazon.com/images/M/MV5BMTUxNzc0OTIxMV5BMl5BanBnXkFtZTgwNDI3NzU2NDE@._V1_.jpg",
        year: "2014",
    },
]

export function AboutInspiration() {
    return (
        <section className="py-24 border-b border-white/5">
            <div className="container mx-auto px-6 lg:px-12 max-w-[90rem]">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight mb-2">Cinematic DNA</h2>
                        <p className="text-muted-foreground">ფილმები, რომლებმაც შეცვალეს ჩემი ხედვა AI-ზე.</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {movies.map((movie, idx) => (
                        <motion.div
                            key={movie.title}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative aspect-[2/3] overflow-hidden bg-muted"
                        >
                            <Image
                                src={movie.src}
                                alt={movie.title}
                                fill
                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                <h3 className="text-white font-medium text-sm">{movie.title}</h3>
                                <p className="text-white/60 text-xs font-mono">{movie.year}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

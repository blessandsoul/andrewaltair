"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { TbMovie } from "react-icons/tb"

const movies = [
    {
        title: "Interstellar",
        src: "/inspiration/interstellar.jpg",
        year: "2014",
        reason: "სიყვარული, მეცნიერება და დროის ფარდობითობა"
    },
    {
        title: "Inception",
        src: "/inspiration/inception.jpg",
        year: "2010",
        reason: "სიზმრის ფენები და რეალობის აღქმა"
    },
    {
        title: "Transcendence",
        src: "/inspiration/transcendence.jpg",
        year: "2014",
        reason: "AI ცნობიერება და ადამიანობის საზღვრები"
    },
    {
        title: "Ex Machina",
        src: "https://m.media-amazon.com/images/M/MV5BMTUxNzc0OTIxMV5BMl5BanBnXkFtZTgwNDI3NzU2NDE@._V1_.jpg",
        year: "2014",
        reason: "AI ეთიკა და ცნობიერების ტესტი"
    },
]

export function AboutInspiration() {
    return (
        <section className="py-20 lg:py-28 bg-background relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

            <div className="container relative mx-auto px-4 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 mb-4 text-primary">
                        <TbMovie className="w-6 h-6" />
                        <span className="text-sm font-bold uppercase tracking-widest">ინსპირაცია</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold">
                        ფილმები რომლებმაც <span className="text-gradient">ჩამაფიქრეს</span>
                    </h2>
                    <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                        ეს ფილმები ხელოვნური ინტელექტისა და ადამიანობის შესახებ ფიქრს მაიძულებენ
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {movies.map((movie, idx) => (
                        <motion.div
                            key={movie.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl cursor-pointer border border-white/10 hover:border-primary/30 transition-all duration-500"
                        >
                            <Image
                                src={movie.src}
                                alt={movie.title}
                                fill
                                className="object-cover transition-all duration-700 group-hover:scale-110 brightness-75 group-hover:brightness-100"
                            />

                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                            {/* Content */}
                            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                                <div className="text-xs text-primary font-mono mb-1">{movie.year}</div>
                                <h3 className="text-white font-bold text-lg mb-2">{movie.title}</h3>
                                <p className="text-white/70 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                                    {movie.reason}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

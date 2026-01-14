"use client"

import { motion } from "framer-motion"
import { TbBulb, TbBrain, TbCode, TbRocket, TbUsers, TbWorld } from "react-icons/tb"

const beliefs = [
    { icon: TbBrain, text: "AI არ ჩაანაცვლებს ადამიანს. ის გააფართოებს მას." },
    { icon: TbCode, text: "კოდი — მომავლის ლოგიკის ენაა." },
    { icon: TbBulb, text: "კრეატიულობა — ახალი პროდუქტიულობაა." },
    { icon: TbRocket, text: "ააშენე სწრაფად, დახვეწე უფრო სწრაფად." },
    { icon: TbUsers, text: "კომუნა კონკურენციაზე მაღლა დგას." },
    { icon: TbWorld, text: "მომავალი ღია კოდშია (Open Source)." }
]

export function AboutManifest() {
    return (
        <section className="py-24 border-b border-white/5">
            <div className="container mx-auto px-6 lg:px-12 max-w-[90rem]">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">მანიფესტი</h2>
                    <p className="text-muted-foreground">მთავარი პრინციპები, რომლითაც ვხელმძღვანელობ</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {beliefs.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex gap-4 items-start group"
                        >
                            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary/50 group-hover:bg-primary/5 transition-colors duration-300">
                                <item.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium leading-tight group-hover:text-primary transition-colors duration-300">
                                    {item.text}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

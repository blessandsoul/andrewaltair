"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { TbMessageQuestion } from "react-icons/tb"

const questions = [
    {
        q: "როგორ დავიწყო AI-ს შესწავლა ნულიდან?",
        a: "დაიწყეთ პრაქტიკით: გამოიყენეთ ChatGPT ყოველდღიურ ამოცანებში. ისწავლეთ 'Prompt Engineering'-ის საფუძვლები YouTube-ზე ჩემი ვიდეოებით.",
        author: "ნიკა, სტუდენტი"
    },
    {
        q: "ჩაანაცვლებს თუ არა AI პროგრამისტებს?",
        a: "არა, მაგრამ შეცვლის მათ მუშაობას. კოდის წერა უფრო სწრაფი გახდება, მთავარი აქცენტი კი არქიტექტურასა და ლოგიკაზე გადავა.",
        author: "ანა, Junior Dev"
    },
    {
        q: "რომელია საუკეთესო AI ინსტრუმენტი გრაფიკისთვის?",
        a: "Midjourney v6.1 ამჟამად ლიდერია ფოტორეალისტურობაში, ხოლო Flux არის საუკეთესო ღია კოდის მოდელი.",
        author: "ლუკა, დიზაინერი"
    }
]

export function AboutAMA() {
    const [activeIdx, setActiveIdx] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIdx((prev) => (prev + 1) % questions.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    return (
        <section className="py-16 bg-gradient-to-r from-primary/5 to-accent/5 border-y border-white/5">
            <div className="container mx-auto px-4 max-w-4xl text-center">
                <div className="inline-flex items-center gap-2 mb-8 text-primary font-bold bg-primary/10 px-4 py-2 rounded-full">
                    <TbMessageQuestion className="w-5 h-5" />
                    <span>Ask Me Anything</span>
                </div>

                <div className="min-h-[200px] relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIdx}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.5 }}
                            className="bg-background border border-white/10 rounded-2xl p-8 shadow-xl max-w-2xl mx-auto"
                        >
                            <h3 className="text-xl md:text-2xl font-bold mb-4">"{questions[activeIdx].q}"</h3>
                            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                                {questions[activeIdx].a}
                            </p>
                            <div className="text-sm font-medium text-accent">
                                — {questions[activeIdx].author}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex justify-center gap-2 mt-8">
                    {questions.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIdx(i)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeIdx ? 'w-8 bg-primary' : 'bg-primary/20'}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

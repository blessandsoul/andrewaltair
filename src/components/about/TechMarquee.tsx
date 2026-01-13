"use client"

import { motion } from "framer-motion"

const technologies = [
    "ChatGPT", "Claude 3", "Midjourney", "Stable Diffusion",
    "Python", "Next.js", "TypeScript", "LangChain",
    "React", "TailwindCSS", "Node.js", "OpenAI API",
    "Gemini", "Llama 3", "Hugging Face", "Vercel"
]

export function TechMarquee() {
    return (
        <section className="py-10 border-y border-border/50 bg-secondary/20 overflow-hidden">
            <div className="flex relative w-full">
                {/* Gradients to fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

                <motion.div
                    className="flex gap-12 whitespace-nowrap"
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 20
                    }}
                >
                    {[...technologies, ...technologies, ...technologies].map((tech, index) => (
                        <div
                            key={`${tech}-${index}`}
                            className="text-lg font-semibold text-muted-foreground/50 flex items-center gap-2"
                        >
                            <span className="w-2 h-2 rounded-full bg-primary/30" />
                            {tech}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

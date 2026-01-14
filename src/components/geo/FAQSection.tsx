"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { motion } from "framer-motion"

interface FAQItem {
    question: string
    answer: string
}

interface FAQSectionProps {
    title?: string
    items: FAQItem[]
}

export function FAQSection({ title = "Frequently Asked Questions", items }: FAQSectionProps) {
    // JSON-LD for FAQPage
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": items.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    }

    return (
        <section className="py-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="text-primary">?</span> {title}
                </h2>

                <Accordion type="single" collapsible className="w-full space-y-4">
                    {items.map((item, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="border border-white/5 bg-white/5 px-6 rounded-xl data-[state=open]:border-primary/20 data-[state=open]:bg-primary/5 transition-all"
                        >
                            <AccordionTrigger className="text-lg font-medium py-4 hover:no-underline hover:text-primary transition-colors text-left">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                                <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </motion.div>
        </section>
    )
}

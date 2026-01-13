"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { motion } from "framer-motion"

const faqs = [
    {
        question: "შესაძლებელია თუ არა ინდივიდუალური კონსულტაცია?",
        answer: "დიახ, მე ვთავაზობ 1-ზე-1 საკონსულტაციო სესიებს ბიზნესებისთვის და კერძო პირებისთვის. დეტალების განსახილველად შეავსეთ საკონტაქტო ფორმა."
    },
    {
        question: "ატარებთ თუ არა ტრეინინგებს კომპანიებისთვის?",
        answer: "რა თქმა უნდა. მაქვს კორპორატიული ტრეინინგების პროგრამა, რომელიც მორგებულია თქვენი გუნდის საჭიროებებზე - დაწყებული AI-ს საფუძვლებიდან, დამთავრებული პროცესების ავტომატიზაციით."
    },
    {
        question: "რა ღირს AI ავტომატიზაციის სერვისი?",
        answer: "ფასი დამოკიდებულია პროექტის სირთულესა და მასშტაბზე. პირველადი კონსულტაცია უფასოა, სადაც განვიხილავთ თქვენს მიზნებს და შეგირჩევთ ოპტიმალურ გადაწყვეტას."
    },
    {
        question: "რომელ AI ინსტრუმენტებს ასწავლით?",
        answer: "ძირითადი ფოკუსი არის ChatGPT, Claude, Midjourney და სხვ. ასევე ვასწავლით როგორ გავაერთიანოთ ეს ინსტრუმენტები ყოველდღიურ საქმიანობაში."
    }
]

export function AboutFAQ() {
    return (
        <section className="py-16 lg:py-24 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold">ხშირად დასმული კითხვები</h2>
                    <p className="text-muted-foreground mt-2">პასუხები ყველაზე გავრცელებულ კითხვებზე</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>
            </div>
        </section>
    )
}

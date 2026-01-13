"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { TbQuote } from "react-icons/tb"

const testimonials = [
    {
        name: "გიორგი ბერიძე",
        role: "Marketing Manager",
        content: "ანდრიას კონსულტაციამ ჩვენი მარკეტინგული გუნდის პროდუქტიულობა 300%-ით გაზარდა. AI ინსტრუმენტების დანერგვა საუკეთესო ინვესტიცია იყო.",
        avatar: "/avatars/giorgi.jpg"
    },
    {
        name: "ნინო წიკლაური",
        role: "Content Creator",
        content: "მისი ტუტორიალები არის ყველაზე პრაქტიკული და ადვილად გასაგები ქართულ ინტერნეტ სივრცეში. მადლობა ასეთი ხარისხიანი კონტენტისთვის!",
        avatar: "/avatars/nino.jpg"
    },
    {
        name: "დავით მაისურაძე",
        role: "Startup Founder",
        content: "AI ავტომატიზაციის სერვისმა დაგვიზოგა უამრავი დრო და რესურსი. პროფესიონალიზმი მაღალ დონეზეა.",
        avatar: "/avatars/davit.jpg"
    }
]

export function Testimonials() {
    return (
        <section className="py-16 lg:py-24 bg-card/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold">💬 რას ამბობენ</h2>
                    <p className="text-muted-foreground mt-2">კლიენტების და გამომწერების შეფასებები</p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                        >
                            <Card className="h-full border-none shadow-lg bg-background/60 backdrop-blur-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <TbQuote size={64} />
                                </div>
                                <CardContent className="p-6 flex flex-col h-full">
                                    <div className="flex items-center gap-4 mb-4">
                                        <Avatar className="w-12 h-12 border-2 border-primary/20">
                                            <AvatarImage src={t.avatar} />
                                            <AvatarFallback>{t.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-bold">{t.name}</div>
                                            <div className="text-sm text-muted-foreground">{t.role}</div>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground italic leading-relaxed flex-1">
                                        "{t.content}"
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TbStar, TbChevronLeft, TbChevronRight, TbQuote } from "react-icons/tb"

interface Testimonial {
    quote: string
    author: string
    role: string
    avatar: string
    rating: number
}

const testimonials: Testimonial[] = [
    {
        quote: "ანდრიუმ დაგვეხმარა AI ავტომატიზაციის დანერგვაში და დროის დაზოგვა 40%-ით გაიზარდა. რეკომენდაციას ვუწევ ყველას!",
        author: "გიორგი მ.",
        role: "სტარტაპის დამფუძნებელი",
        avatar: "გ",
        rating: 5
    },
    {
        quote: "პროფესიონალი მიდგომა და შედეგზე ორიენტირებული მუშაობა. ჩვენი გაყიდვები 60%-ით გაიზარდა AI ჩატბოტის დანერგვის შემდეგ.",
        author: "ნინო კ.",
        role: "მარკეტინგის დირექტორი",
        avatar: "ნ",
        rating: 5
    },
    {
        quote: "საუკეთესო ინვესტიცია რაც გავაკეთეთ წელს. AI ავტომატიზაციამ გუნდის პროდუქტიულობა 3x-ით გაზარდა.",
        author: "დავით ს.",
        role: "CEO, TechStart",
        avatar: "დ",
        rating: 5
    },
    {
        quote: "ტრენინგები იყო ძალიან პრაქტიკული და სასარგებლო. გუნდმა სწრაფად აითვისა ახალი ინსტრუმენტები.",
        author: "მარიამ თ.",
        role: "HR მენეჯერი",
        avatar: "მ",
        rating: 5
    }
]

export function TestimonialsCarousel() {
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = React.useState(true)

    React.useEffect(() => {
        if (!isAutoPlaying) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [isAutoPlaying])

    const goTo = (index: number) => {
        setCurrentIndex(index)
        setIsAutoPlaying(false)
        setTimeout(() => setIsAutoPlaying(true), 10000)
    }

    const prev = () => goTo((currentIndex - 1 + testimonials.length) % testimonials.length)
    const next = () => goTo((currentIndex + 1) % testimonials.length)

    const current = testimonials[currentIndex]

    return (
        <div className="relative">
            <Card className="overflow-hidden border-border/50 bg-card/60 backdrop-blur">
                <CardContent className="p-8 relative">
                    {/* Quote icon */}
                    <TbQuote className="absolute top-4 right-4 w-12 h-12 text-primary/10" />

                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-6">
                        {[...Array(current.rating)].map((_, i) => (
                            <TbStar key={i} className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                        ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-xl mb-6 italic leading-relaxed min-h-[80px]">
                        &ldquo;{current.quote}&rdquo;
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
                                {current.avatar}
                            </div>
                            <div>
                                <div className="font-bold text-lg">{current.author}</div>
                                <div className="text-muted-foreground">{current.role}</div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={prev}
                                className="w-10 h-10 rounded-full bg-secondary/50 hover:bg-secondary flex items-center justify-center transition-colors"
                            >
                                <TbChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={next}
                                className="w-10 h-10 rounded-full bg-secondary/50 hover:bg-secondary flex items-center justify-center transition-colors"
                            >
                                <TbChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Dots */}
                    <div className="flex items-center justify-center gap-2 mt-6">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className={`w-2 h-2 rounded-full transition-all ${i === currentIndex
                                        ? 'w-6 bg-primary'
                                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                                    }`}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

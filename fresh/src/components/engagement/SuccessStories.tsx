'use client'

import { useState, useEffect } from 'react'
import { TbQuote, TbStar, TbChevronLeft, TbChevronRight, TbBuilding, TbTrendingUp } from "react-icons/tb"

interface Story {
    id: string
    name: string
    role: string
    company: string
    avatar: string
    quote: string
    metric: string
    improvement: string
    rating: number
}

const SUCCESS_STORIES: Story[] = [
    {
        id: '1',
        name: 'დავით გელაშვილი',
        role: 'მარკეტინგის დირექტორი',
        company: 'TBC Bank',
        avatar: '👨‍💼',
        quote: 'AI ინსტრუმენტების გამოყენებით ჩვენი კონტენტის წარმოება 3-ჯერ გაიზარდა. Andrew Altair-მა დამეხმარა სწორი ინსტრუმენტების არჩევაში.',
        metric: 'კონტენტის წარმოება',
        improvement: '+300%',
        rating: 5
    },
    {
        id: '2',
        name: 'ანა ბერიძე',
        role: 'UX დიზაინერი',
        company: 'Wissol',
        avatar: '👩‍🎨',
        quote: 'DALL-E და Midjourney-ს სწავლის შემდეგ, ჩემი დიზაინ პროცესი სრულიად შეიცვალა. დროის დაზოგვა უზარმაზარია!',
        metric: 'დიზაინის დრო',
        improvement: '-60%',
        rating: 5
    },
    {
        id: '3',
        name: 'გიორგი მაჭარაშვილი',
        role: 'Senior Developer',
        company: 'Bank of Georgia',
        avatar: '👨‍💻',
        quote: 'GitHub Copilot-ის შესახებ სტატიამ გამიხსნა თვალები. ახლა კოდირება ორჯერ სწრაფია და ნაკლები ბაგი მაქვს.',
        metric: 'კოდირების სისწრაფე',
        improvement: '+100%',
        rating: 5
    },
    {
        id: '4',
        name: 'ნინო კვარაცხელია',
        role: 'კონტენტ მენეჯერი',
        company: 'Magti',
        avatar: '👩‍💻',
        quote: 'ChatGPT-ს და Claude-ს ტუტორიალებმა დამეხმარა ყოველდღიური დავალებების ავტომატიზაციაში. ახლა უფრო კრეატიულ საქმეებზე ვმუშაობ.',
        metric: 'პროდუქტიულობა',
        improvement: '+80%',
        rating: 5
    },
    {
        id: '5',
        name: 'ლევან წულაძე',
        role: 'ფრილანსერი',
        company: 'თვითდასაქმებული',
        avatar: '🧑‍🎓',
        quote: 'AI-ს შესწავლის შემდეგ, ჩემი შემოსავალი თვეში 2000 ლარით გაიზარდა. კლიენტებს AI სერვისებს ვთავაზობ.',
        metric: 'შემოსავალი',
        improvement: '+₾2000/თვე',
        rating: 5
    }
]

export function SuccessStories() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    useEffect(() => {
        if (!isAutoPlaying) return

        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % SUCCESS_STORIES.length)
        }, 6000)

        return () => clearInterval(interval)
    }, [isAutoPlaying])

    const handlePrev = () => {
        setIsAutoPlaying(false)
        setCurrentIndex(prev => (prev - 1 + SUCCESS_STORIES.length) % SUCCESS_STORIES.length)
    }

    const handleNext = () => {
        setIsAutoPlaying(false)
        setCurrentIndex(prev => (prev + 1) % SUCCESS_STORIES.length)
    }

    const story = SUCCESS_STORIES[currentIndex]

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-900/20 to-purple-900/20 border border-indigo-500/20 p-6">
                {/* Background decoration */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />

                {/* TbQuote Icon */}
                <div className="relative flex justify-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full">
                        <TbQuote className="w-6 h-6 text-indigo-400" />
                    </div>
                </div>

                {/* Story Content */}
                <div className="relative text-center mb-6">
                    <p className="text-white/90 text-lg leading-relaxed mb-6">
                        &quot;{story.quote}&quot;
                    </p>

                    {/* Author */}
                    <div className="flex items-center justify-center gap-4">
                        <span className="text-4xl">{story.avatar}</span>
                        <div className="text-left">
                            <p className="text-white font-semibold">{story.name}</p>
                            <div className="flex items-center gap-2 text-white/60 text-sm">
                                <span>{story.role}</span>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                    <TbBuilding className="w-3 h-3" />
                                    <span>{story.company}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="flex justify-center gap-1 mt-4">
                        {[...Array(5)].map((_, i) => (
                            <TbStar
                                key={i}
                                className={`w-4 h-4 ${i < story.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Metric Badge */}
                <div className="relative flex justify-center mb-6">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/30">
                        <TbTrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="text-white/70 text-sm">{story.metric}:</span>
                        <span className="text-emerald-400 font-bold">{story.improvement}</span>
                    </div>
                </div>

                {/* Navigation */}
                <div className="relative flex items-center justify-center gap-4">
                    <button
                        onClick={handlePrev}
                        className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
                    >
                        <TbChevronLeft className="w-5 h-5 text-white" />
                    </button>

                    {/* Dots */}
                    <div className="flex gap-2">
                        {SUCCESS_STORIES.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => { setIsAutoPlaying(false); setCurrentIndex(i) }}
                                className={`w-2 h-2 rounded-full transition-all ${i === currentIndex
                                        ? 'w-6 bg-indigo-500'
                                        : 'bg-slate-600 hover:bg-slate-500'
                                    }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleNext}
                        className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
                    >
                        <TbChevronRight className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>
        </div>
    )
}

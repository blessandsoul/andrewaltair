'use client'

import { useState } from 'react'
import { Star, ThumbsUp, ThumbsDown, CheckCircle2, Filter, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Review {
    id: string
    author: string
    avatar: string
    rating: number
    date: string
    toolName: string
    content: string
    helpful: number
    notHelpful: number
    verified: boolean
}

const SAMPLE_REVIEWS: Review[] = [
    {
        id: '1',
        author: 'ნიკა მ.',
        avatar: '👨‍💻',
        rating: 5,
        date: '2 დღის წინ',
        toolName: 'ChatGPT',
        content: 'უბრალოდ საოცარია! ყოველდღიურ სამუშაოში ვიყენებ და დროის უზარმაზარ დაზოგვას ვახერხებ. რეკომენდაციას ვუწევ ყველას.',
        helpful: 24,
        notHelpful: 2,
        verified: true
    },
    {
        id: '2',
        author: 'თეა გ.',
        avatar: '👩‍🎨',
        rating: 5,
        date: '5 დღის წინ',
        toolName: 'Midjourney',
        content: 'ვიზუალური კონტენტის შესაქმნელად საუკეთესო ინსტრუმენტია. თავიდან რთული იყო, მაგრამ ტუტორიალის წაკითხვის შემდეგ ყველაფერი გასაგები გახდა.',
        helpful: 18,
        notHelpful: 1,
        verified: true
    },
    {
        id: '3',
        author: 'გიორგი კ.',
        avatar: '🧑‍🔬',
        rating: 4,
        date: '1 კვირის წინ',
        toolName: 'Claude',
        content: 'ძალიან კარგი ალტერნატივაა ChatGPT-ისთვის. განსაკუთრებით კოდის ანალიზისთვის მომწონს. ოდნავ ნელია ზოგჯერ.',
        helpful: 12,
        notHelpful: 3,
        verified: false
    },
    {
        id: '4',
        author: 'მარიამ ბ.',
        avatar: '👩‍💼',
        rating: 5,
        date: '2 კვირის წინ',
        toolName: 'Notion AI',
        content: 'პროდუქტიულობა ძალიან გაიზარდა! შეხვედრების შენიშვნებს ავტომატურად აჯამებს და ToDo-ებს აგენერირებს. Premium ღირს!',
        helpful: 31,
        notHelpful: 0,
        verified: true
    }
]

export function UserReviews() {
    const [reviews, setReviews] = useState<Review[]>(SAMPLE_REVIEWS)
    const [filterRating, setFilterRating] = useState<number | null>(null)
    const [showFilters, setShowFilters] = useState(false)

    const handleHelpful = (id: string, isHelpful: boolean) => {
        setReviews(prev => prev.map(review => {
            if (review.id === id) {
                return {
                    ...review,
                    helpful: isHelpful ? review.helpful + 1 : review.helpful,
                    notHelpful: !isHelpful ? review.notHelpful + 1 : review.notHelpful
                }
            }
            return review
        }))
    }

    const filteredReviews = filterRating
        ? reviews.filter(r => r.rating === filterRating)
        : reviews

    const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-white font-bold text-xl">მომხმარებლების შეფასებები</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                        key={star}
                                        className={`w-4 h-4 ${star <= Math.round(parseFloat(averageRating)) ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-white font-bold">{averageRating}</span>
                            <span className="text-white/50 text-sm">({reviews.length} შეფასება)</span>
                        </div>
                    </div>

                    {/* Filter Button */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-xl text-white/70 hover:text-white transition-colors"
                    >
                        <Filter className="w-4 h-4" />
                        ფილტრი
                        <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="flex gap-2 mb-4 animate-in slide-in-from-top-2">
                        <button
                            onClick={() => setFilterRating(null)}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${filterRating === null ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-white/60 hover:text-white'
                                }`}
                        >
                            ყველა
                        </button>
                        {[5, 4, 3, 2, 1].map(rating => (
                            <button
                                key={rating}
                                onClick={() => setFilterRating(rating)}
                                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${filterRating === rating ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-white/60 hover:text-white'
                                    }`}
                            >
                                {rating} <Star className="w-3 h-3 fill-current" />
                            </button>
                        ))}
                    </div>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                    {filteredReviews.map(review => (
                        <div key={review.id} className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{review.avatar}</span>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-medium">{review.author}</span>
                                            {review.verified && (
                                                <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 rounded-full text-xs text-emerald-400">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    დამოწმებული
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-white/50 text-xs">{review.date} • {review.toolName}</p>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star
                                            key={star}
                                            className={`w-4 h-4 ${star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Content */}
                            <p className="text-white/80 text-sm mb-4">{review.content}</p>

                            {/* Actions */}
                            <div className="flex items-center gap-4">
                                <span className="text-white/40 text-xs">სასარგებლო იყო?</span>
                                <button
                                    onClick={() => handleHelpful(review.id, true)}
                                    className="flex items-center gap-1 text-white/50 hover:text-emerald-400 transition-colors"
                                >
                                    <ThumbsUp className="w-4 h-4" />
                                    <span className="text-xs">{review.helpful}</span>
                                </button>
                                <button
                                    onClick={() => handleHelpful(review.id, false)}
                                    className="flex items-center gap-1 text-white/50 hover:text-red-400 transition-colors"
                                >
                                    <ThumbsDown className="w-4 h-4" />
                                    <span className="text-xs">{review.notHelpful}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Write Review CTA */}
                <div className="mt-6 p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20 text-center">
                    <p className="text-white/80 text-sm mb-2">გაქვს გამოცდილება AI ინსტრუმენტებთან?</p>
                    <Button
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                    >
                        დაწერე შეფასება
                    </Button>
                </div>
            </div>
        </div>
    )
}

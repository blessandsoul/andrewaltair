'use client'

import { useState } from 'react'
import { TbCheck, TbX, TbCrown, TbBolt, TbInfinity, TbStar, TbShield, TbHeadphones } from "react-icons/tb"
import { Button } from '@/components/ui/button'

interface PricingComparisonProps {
    onUpgrade?: () => void
}

const features = [
    { name: 'AI კრედიტები დღეში', free: '10', premium: 'შეუზღუდავი', icon: TbBolt },
    { name: 'AI ინსტრუმენტების კატალოგი', free: true, premium: true, icon: TbStar },
    { name: 'სტატიების წვდომა', free: true, premium: true, icon: TbCheck },
    { name: 'AI ჩატბოტი', free: 'შეზღუდული', premium: 'სრული წვდომა', icon: TbBolt },
    { name: 'მისტიკური AI (ჰოროსკოპი, გადალი)', free: '3/დღე', premium: 'შეუზღუდავი', icon: TbStar },
    { name: 'პერსონალიზებული რეკომენდაციები', free: false, premium: true, icon: TbStar },
    { name: 'AI Learning Path', free: false, premium: true, icon: TbStar },
    { name: 'Premium ბეჯები', free: false, premium: true, icon: TbCrown },
    { name: 'რეკლამის გარეშე', free: false, premium: true, icon: TbShield },
    { name: 'პრიორიტეტული მხარდაჭერა', free: false, premium: true, icon: TbHeadphones },
    { name: 'AI სერტიფიკატი', free: false, premium: true, icon: TbCrown },
    { name: 'ექსკლუზიური კონტენტი', free: false, premium: true, icon: TbStar },
]

export function PricingComparison({ onUpgrade }: PricingComparisonProps) {
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly')

    const prices = {
        monthly: { amount: 9.99, period: 'თვეში' },
        yearly: { amount: 79.99, period: 'წელიწადში', savings: '33%' }
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            {/* Billing Toggle */}
            <div className="flex justify-center mb-8">
                <div className="inline-flex items-center bg-slate-800/50 rounded-full p-1 border border-slate-700">
                    <button
                        onClick={() => setBillingPeriod('monthly')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${billingPeriod === 'monthly'
                            ? 'bg-indigo-500 text-white shadow-lg'
                            : 'text-white/60 hover:text-white'
                            }`}
                    >
                        თვიური
                    </button>
                    <button
                        onClick={() => setBillingPeriod('yearly')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${billingPeriod === 'yearly'
                            ? 'bg-indigo-500 text-white shadow-lg'
                            : 'text-white/60 hover:text-white'
                            }`}
                    >
                        წლიური
                        <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full">
                            -33%
                        </span>
                    </button>
                </div>
            </div>

            {/* Comparison Cards */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Free Plan */}
                <div className="relative rounded-2xl bg-slate-900/50 border border-slate-700 p-6 backdrop-blur-xl">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-white mb-2">უფასო</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-white">₾0</span>
                            <span className="text-white/50">სამუდამოდ</span>
                        </div>
                        <p className="text-white/60 text-sm mt-2">დაიწყე AI-ს სამყაროში მოგზაურობა</p>
                    </div>

                    <div className="space-y-3 mb-6">
                        {features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`p-1 rounded-full ${feature.free === false ? 'bg-red-500/20' : 'bg-emerald-500/20'
                                    }`}>
                                    {feature.free === false ? (
                                        <TbX className="w-4 h-4 text-red-400" />
                                    ) : (
                                        <TbCheck className="w-4 h-4 text-emerald-400" />
                                    )}
                                </div>
                                <span className="text-white/70 text-sm flex-1">{feature.name}</span>
                                {typeof feature.free === 'string' && (
                                    <span className="text-white/50 text-xs">{feature.free}</span>
                                )}
                            </div>
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        className="w-full border-slate-600 text-white hover:bg-slate-800"
                    >
                        ამჟამად აქტიურია
                    </Button>
                </div>

                {/* Premium Plan */}
                <div className="relative rounded-2xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 p-6 backdrop-blur-xl">
                    {/* Popular Badge */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-white text-xs font-bold shadow-lg shadow-indigo-500/30">
                            ⭐ ყველაზე პოპულარული
                        </span>
                    </div>

                    <div className="mb-6 mt-2">
                        <div className="flex items-center gap-2 mb-2">
                            <TbCrown className="w-5 h-5 text-amber-400" />
                            <h3 className="text-xl font-bold text-white">Premium</h3>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                                ₾{prices[billingPeriod].amount}
                            </span>
                            <span className="text-white/50">/{prices[billingPeriod].period}</span>
                        </div>
                        {billingPeriod === 'yearly' && (
                            <p className="text-emerald-400 text-sm mt-1">
                                დაზოგე {prices.yearly.savings} წლიური პლანით!
                            </p>
                        )}
                        <p className="text-white/60 text-sm mt-2">სრული AI ძალაუფლება შენს ხელში</p>
                    </div>

                    <div className="space-y-3 mb-6">
                        {features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="p-1 rounded-full bg-emerald-500/20">
                                    <TbCheck className="w-4 h-4 text-emerald-400" />
                                </div>
                                <span className="text-white/90 text-sm flex-1">{feature.name}</span>
                                {typeof feature.premium === 'string' && (
                                    <span className="text-indigo-300 text-xs font-medium flex items-center gap-1">
                                        {feature.premium === 'შეუზღუდავი' && <TbInfinity className="w-3 h-3" />}
                                        {feature.premium}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    <Button
                        onClick={onUpgrade}
                        className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold shadow-lg shadow-purple-500/30"
                    >
                        <TbBolt className="w-4 h-4 mr-2" />
                        გახდი Premium ახლავე
                    </Button>

                    {/* Guarantee */}
                    <p className="text-center text-white/50 text-xs mt-4">
                        🔒 7-დღიანი თანხის დაბრუნების გარანტია
                    </p>
                </div>
            </div>
        </div>
    )
}

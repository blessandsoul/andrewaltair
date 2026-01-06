"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TbCrown, TbCheck, TbSparkles, TbLock, TbX } from "react-icons/tb"

interface PremiumUpsellProps {
    isOpen: boolean
    onClose: () => void
}

const PREMIUM_FEATURES = [
    { icon: "🃏", name: "კელტური ჯვარი (10 კარტა)", description: "სრული ტაროს კითხვა" },
    { icon: "✋", name: "ხელის ხაზების ანალიზი", description: "ფოტო ატვირთვით" },
    { icon: "💬", name: "შეუზღუდავი AI ჩატი", description: "პირადი მისტიკოსთან" },
    { icon: "📊", name: "დეტალური ანალიზი", description: "გაფართოებული პროგნოზები" },
    { icon: "🏆", name: "ექსკლუზიური ბეჯები", description: "Premium წევრის სტატუსი" },
    { icon: "🔔", name: "ყოველდღიური ჰოროსკოპი", description: "პირადი შეტყობინებები" },
]

const PRICING = [
    {
        id: 'monthly',
        name: 'თვიური',
        price: 9.99,
        period: '/თვე',
        popular: false,
        savings: null
    },
    {
        id: 'yearly',
        name: 'წლიური',
        price: 79.99,
        period: '/წელი',
        popular: true,
        savings: '33% ეკონომია'
    },
]

export function PremiumUpsell({ isOpen, onClose }: PremiumUpsellProps) {
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly')

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
            <div
                className="w-full max-w-md rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#15151f] to-[#0f0f18] border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto shadow-2xl shadow-purple-900/30 animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header - Modernized */}
                <div className="relative p-6 overflow-hidden">
                    {/* Gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-600/30 via-yellow-500/20 to-orange-600/30" />

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 translate-x-[-100%] animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ animationDuration: '3s', animationIterationCount: 'infinite' }} />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-black/20 backdrop-blur-sm flex items-center justify-center hover:bg-black/40 transition-all hover:scale-105 border border-white/10"
                    >
                        <TbX className="w-4 h-4 text-white" />
                    </button>

                    <div className="relative flex items-center gap-4">
                        {/* Animated icon */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl blur-lg opacity-60" />
                            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
                                <TbCrown className="w-7 h-7 text-white drop-shadow-md" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent">PRO გეგმა</h2>
                            <p className="text-sm text-amber-200/70">გახსენი სრული პოტენციალი ✨</p>
                        </div>
                    </div>
                </div>

                <div className="border-b border-white/10" />

                {/* Features - Modernized */}
                <div className="p-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">რა მიიღებ:</h3>
                    <div className="space-y-3">
                        {PREMIUM_FEATURES.map((feature, i) => (
                            <div key={i} className="group flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors border border-transparent hover:border-white/5">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center text-xl">
                                    {feature.icon}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white">{feature.name}</p>
                                    <p className="text-xs text-gray-500">{feature.description}</p>
                                </div>
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-sm shadow-emerald-500/30">
                                    <TbCheck className="w-3 h-3 text-white" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-b border-white/10" />

                {/* Pricing - Modernized */}
                <div className="p-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">აირჩიე გეგმა:</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {PRICING.map((plan) => (
                            <button
                                key={plan.id}
                                onClick={() => setSelectedPlan(plan.id as 'monthly' | 'yearly')}
                                className={`group relative p-4 rounded-2xl transition-all duration-300 ${selectedPlan === plan.id
                                    ? 'bg-gradient-to-br from-amber-500/15 to-orange-500/15 border-2 border-amber-500 shadow-lg shadow-amber-500/20'
                                    : 'bg-white/[0.03] border-2 border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                                    }`}
                            >
                                {plan.popular && (
                                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[10px] font-bold text-white tracking-wide shadow-lg shadow-amber-500/30">
                                        ✨ BEST
                                    </span>
                                )}
                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-400 mb-2">{plan.name}</p>
                                    <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                        ₾{plan.price}
                                    </p>
                                    <span className="text-xs text-gray-500">{plan.period}</span>
                                    {plan.savings && (
                                        <p className="mt-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 rounded-full px-2 py-1">{plan.savings}</p>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* CTA - Modernized */}
                <div className="p-6 pt-0">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 rounded-xl blur-md opacity-60" />
                        <Button
                            className="relative w-full h-13 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-400 hover:via-yellow-400 hover:to-orange-400 text-white font-bold text-base border-0 shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/40"
                        >
                            <TbSparkles className="w-5 h-5 mr-2" />
                            გახდი PRO
                        </Button>
                    </div>
                    <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-gray-600" />
                        გაუქმება ნებისმიერ დროს
                        <span className="w-1 h-1 rounded-full bg-gray-600" />
                        უსაფრთხო გადახდა
                        <span className="w-1 h-1 rounded-full bg-gray-600" />
                    </p>
                </div>
            </div>
        </div>
    )
}

// Premium badge for locked features - MODERN DESIGN
export function PremiumBadge({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'px-2.5 py-1 gap-1',
        md: 'px-3 py-1.5 gap-1.5',
        lg: 'px-4 py-2 gap-2'
    }
    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    }
    const textSizes = {
        sm: 'text-[10px]',
        md: 'text-xs',
        lg: 'text-sm'
    }

    return (
        <div className={`group relative inline-flex items-center ${sizeClasses[size]} rounded-full overflow-hidden cursor-pointer`}>
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 opacity-90" />

            {/* Shimmer effect */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 blur-md opacity-50 group-hover:opacity-70 transition-opacity" />

            {/* Content */}
            <div className="relative flex items-center gap-1">
                <TbCrown className={`${iconSizes[size]} text-white drop-shadow-sm`} />
                <span className={`${textSizes[size]} font-bold text-white tracking-wide uppercase drop-shadow-sm`}>PRO</span>
            </div>
        </div>
    )
}

// Lock overlay for premium-only features - MODERN DESIGN
export function PremiumLock({ onUnlock }: { onUnlock: () => void }) {
    return (
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-purple-950/50 backdrop-blur-md rounded-2xl sm:rounded-3xl flex items-center justify-center z-10">
            <div className="text-center p-6 max-w-xs">
                {/* Animated lock icon with rings */}
                <div className="relative w-20 h-20 mx-auto mb-5">
                    {/* Outer pulsing ring */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 animate-ping" style={{ animationDuration: '2s' }} />

                    {/* Middle ring */}
                    <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-amber-500/40 to-yellow-500/40 blur-sm" />

                    {/* Inner icon container */}
                    <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <TbLock className="w-8 h-8 text-white drop-shadow-md" />
                    </div>
                </div>

                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent mb-2">
                    Premium ფუნქცია
                </h3>
                <p className="text-sm text-gray-400 mb-5 leading-relaxed">
                    გახსენი სრული წვდომა Premium წევრობით
                </p>

                {/* Modern button with glow */}
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl blur-md opacity-60 group-hover:opacity-80" />
                    <Button
                        onClick={onUnlock}
                        className="relative px-6 h-11 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-400 hover:via-yellow-400 hover:to-orange-400 text-white font-bold border-0 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-amber-500/30"
                    >
                        <TbCrown className="w-4 h-4 mr-2" />
                        გახსენი PRO
                    </Button>
                </div>
            </div>
        </div>
    )
}

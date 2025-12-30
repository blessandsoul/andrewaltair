"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Crown, Check, Sparkles, Lock, X } from "lucide-react"

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div
                className="w-full max-w-md rounded-2xl sm:rounded-3xl bg-[#12121a] border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative p-6 bg-gradient-to-br from-amber-600/20 via-yellow-500/20 to-orange-600/20 border-b border-white/10">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>

                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                            <Crown className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Premium წევრობა</h2>
                            <p className="text-sm text-amber-300/80">გახსენი სრული პოტენციალი</p>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="p-6 border-b border-white/10">
                    <h3 className="text-sm font-medium text-gray-400 mb-4">რა მიიღებ:</h3>
                    <div className="space-y-3">
                        {PREMIUM_FEATURES.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-xl">{feature.icon}</span>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white">{feature.name}</p>
                                    <p className="text-xs text-gray-500">{feature.description}</p>
                                </div>
                                <Check className="w-4 h-4 text-green-400" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pricing */}
                <div className="p-6 border-b border-white/10">
                    <h3 className="text-sm font-medium text-gray-400 mb-4">აირჩიე გეგმა:</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {PRICING.map((plan) => (
                            <button
                                key={plan.id}
                                onClick={() => setSelectedPlan(plan.id as 'monthly' | 'yearly')}
                                className={`relative p-4 rounded-xl border-2 transition-all ${selectedPlan === plan.id
                                        ? 'bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500'
                                        : 'bg-white/5 border-white/10 hover:border-white/20'
                                    }`}
                            >
                                {plan.popular && (
                                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-500 text-[10px] font-bold text-black">
                                        პოპულარული
                                    </span>
                                )}
                                <div className="text-center">
                                    <p className="text-sm font-medium text-white mb-1">{plan.name}</p>
                                    <p className="text-2xl font-bold text-white">
                                        ₾{plan.price}
                                        <span className="text-sm font-normal text-gray-500">{plan.period}</span>
                                    </p>
                                    {plan.savings && (
                                        <p className="text-xs text-green-400 mt-1">{plan.savings}</p>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="p-6">
                    <Button
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold text-base border-0"
                    >
                        <Sparkles className="w-5 h-5 mr-2" />
                        გახდი Premium
                    </Button>
                    <p className="text-center text-xs text-gray-500 mt-3">
                        გაუქმება ნებისმიერ დროს • უსაფრთხო გადახდა
                    </p>
                </div>
            </div>
        </div>
    )
}

// Premium badge for locked features
export function PremiumBadge({ size = 'sm' }: { size?: 'sm' | 'md' }) {
    return (
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 ${size === 'md' ? 'px-3 py-1.5' : ''}`}>
            <Crown className={`text-amber-400 ${size === 'md' ? 'w-4 h-4' : 'w-3 h-3'}`} />
            <span className={`font-medium text-amber-400 ${size === 'md' ? 'text-sm' : 'text-xs'}`}>Premium</span>
        </div>
    )
}

// Lock overlay for premium-only features
export function PremiumLock({ onUnlock }: { onUnlock: () => void }) {
    return (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
            <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30 flex items-center justify-center">
                    <Lock className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Premium ფუნქცია</h3>
                <p className="text-sm text-gray-400 mb-4">გახსენი სრული წვდომა Premium წევრობით</p>
                <Button
                    onClick={onUnlock}
                    className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold border-0"
                >
                    <Crown className="w-4 h-4 mr-2" />
                    გახსნა
                </Button>
            </div>
        </div>
    )
}

'use client'

import { useState, useEffect } from 'react'
import { Sparkles, ChevronRight, Check, ArrowRight, X, Zap, Target, BookOpen, Star, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface OnboardingStep {
    id: number
    title: string
    description: string
    icon: string
    component: 'welcome' | 'goals' | 'experience' | 'interests' | 'personalize' | 'complete'
}

interface UserPreferences {
    goals: string[]
    experience: 'beginner' | 'intermediate' | 'advanced' | null
    interests: string[]
    profession: string | null
}

const STEPS: OnboardingStep[] = [
    { id: 1, title: 'მოგესალმებით!', description: 'მოდით გავიცნოთ ერთმანეთი', icon: '👋', component: 'welcome' },
    { id: 2, title: 'რა არის თქვენი მიზანი?', description: 'რისთვის გსურთ AI-ს გამოყენება?', icon: '🎯', component: 'goals' },
    { id: 3, title: 'თქვენი გამოცდილება', description: 'რამდენად იცნობთ AI ხელსაწყოებს?', icon: '📊', component: 'experience' },
    { id: 4, title: 'თქვენი ინტერესები', description: 'რა სფეროები გაინტერესებთ?', icon: '💡', component: 'interests' },
    { id: 5, title: 'პერსონალიზაცია', description: 'მორგებული რეკომენდაციები', icon: '✨', component: 'personalize' },
    { id: 6, title: 'მზად ხართ!', description: 'დაიწყეთ AI მოგზაურობა', icon: '🚀', component: 'complete' }
]

const GOALS = [
    { id: 'productivity', label: 'პროდუქტიულობა', icon: '⚡', description: 'დროის დაზოგვა და ეფექტურობა' },
    { id: 'creativity', label: 'კრეატიულობა', icon: '🎨', description: 'კონტენტი, დიზაინი, ხელოვნება' },
    { id: 'learning', label: 'სწავლა', icon: '📚', description: 'ახალი უნარებისა და ცოდნის მიღება' },
    { id: 'business', label: 'ბიზნესი', icon: '💼', description: 'კომპანიის განვითარება' },
    { id: 'coding', label: 'პროგრამირება', icon: '💻', description: 'კოდის წერა და დეველოპმენტი' },
    { id: 'research', label: 'კვლევა', icon: '🔍', description: 'ინფორმაციის მოძიება და ანალიზი' }
]

const INTERESTS = [
    { id: 'chatbots', label: 'ჩატბოტები', icon: '💬' },
    { id: 'images', label: 'სურათები', icon: '🖼️' },
    { id: 'video', label: 'ვიდეო', icon: '🎬' },
    { id: 'audio', label: 'აუდიო', icon: '🎵' },
    { id: 'writing', label: 'ტექსტი', icon: '✍️' },
    { id: 'coding', label: 'კოდი', icon: '💻' },
    { id: 'automation', label: 'ავტომატიზაცია', icon: '⚙️' },
    { id: 'analytics', label: 'ანალიტიკა', icon: '📊' }
]

const PROFESSIONS = [
    { id: 'marketer', label: 'მარკეტოლოგი', icon: '📢' },
    { id: 'designer', label: 'დიზაინერი', icon: '🎨' },
    { id: 'developer', label: 'დეველოპერი', icon: '💻' },
    { id: 'writer', label: 'კოპირაიტერი', icon: '✍️' },
    { id: 'entrepreneur', label: 'მეწარმე', icon: '💼' },
    { id: 'student', label: 'სტუდენტი', icon: '🎓' },
    { id: 'teacher', label: 'მასწავლებელი', icon: '👨‍🏫' },
    { id: 'other', label: 'სხვა', icon: '🌟' }
]

interface SmartOnboardingProps {
    onComplete?: (preferences: UserPreferences) => void
    onSkip?: () => void
}

export function SmartOnboarding({ onComplete, onSkip }: SmartOnboardingProps) {
    const [currentStep, setCurrentStep] = useState(1)
    const [isVisible, setIsVisible] = useState(true)
    const [preferences, setPreferences] = useState<UserPreferences>({
        goals: [],
        experience: null,
        interests: [],
        profession: null
    })
    const [isAnimating, setIsAnimating] = useState(false)

    const step = STEPS.find(s => s.id === currentStep)!
    const progress = (currentStep / STEPS.length) * 100

    const canProceed = () => {
        switch (step.component) {
            case 'welcome': return true
            case 'goals': return preferences.goals.length > 0
            case 'experience': return preferences.experience !== null
            case 'interests': return preferences.interests.length > 0
            case 'personalize': return preferences.profession !== null
            case 'complete': return true
            default: return false
        }
    }

    const handleNext = () => {
        if (!canProceed()) return

        setIsAnimating(true)
        setTimeout(() => {
            if (currentStep < STEPS.length) {
                setCurrentStep(currentStep + 1)
            } else {
                handleComplete()
            }
            setIsAnimating(false)
        }, 300)
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setIsAnimating(true)
            setTimeout(() => {
                setCurrentStep(currentStep - 1)
                setIsAnimating(false)
            }, 300)
        }
    }

    const handleComplete = () => {
        // Save to localStorage
        localStorage.setItem('userPreferences', JSON.stringify(preferences))
        localStorage.setItem('onboardingCompleted', 'true')

        setIsVisible(false)
        onComplete?.(preferences)
    }

    const handleSkip = () => {
        localStorage.setItem('onboardingSkipped', 'true')
        setIsVisible(false)
        onSkip?.()
    }

    const toggleGoal = (goalId: string) => {
        setPreferences(prev => ({
            ...prev,
            goals: prev.goals.includes(goalId)
                ? prev.goals.filter(g => g !== goalId)
                : [...prev.goals, goalId]
        }))
    }

    const toggleInterest = (interestId: string) => {
        setPreferences(prev => ({
            ...prev,
            interests: prev.interests.includes(interestId)
                ? prev.interests.filter(i => i !== interestId)
                : [...prev.interests, interestId]
        }))
    }

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="relative max-w-2xl w-full bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
                {/* Skip Button */}
                <button
                    onClick={handleSkip}
                    className="absolute top-4 right-4 p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Progress Bar */}
                <div className="h-1 bg-zinc-800">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Step Indicators */}
                <div className="flex justify-center gap-2 p-4 border-b border-zinc-800">
                    {STEPS.map((s) => (
                        <div
                            key={s.id}
                            className={`w-2 h-2 rounded-full transition-all ${s.id === currentStep
                                    ? 'w-8 bg-indigo-500'
                                    : s.id < currentStep
                                        ? 'bg-green-500'
                                        : 'bg-zinc-700'
                                }`}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className={`p-8 transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="text-5xl mb-4">{step.icon}</div>
                        <h2 className="text-2xl font-bold text-white mb-2">{step.title}</h2>
                        <p className="text-zinc-400">{step.description}</p>
                    </div>

                    {/* Step Content */}
                    {step.component === 'welcome' && (
                        <div className="text-center">
                            <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-2xl p-8 border border-indigo-500/30 mb-6">
                                <h3 className="text-xl font-semibold text-white mb-4">
                                    მოგესალმებით Andrew Altair AI პლატფორმაზე! 🎉
                                </h3>
                                <p className="text-zinc-300 mb-4">
                                    რამდენიმე წუთში მოგარგებთ პერსონალიზებულ გამოცდილებას, რომ AI ხელსაწყოები მაქსიმალურად ეფექტურად გამოიყენოთ.
                                </p>
                                <div className="flex justify-center gap-6 text-sm text-zinc-400">
                                    <span className="flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-yellow-400" />
                                        2 წუთი
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Target className="w-4 h-4 text-green-400" />
                                        5 კითხვა
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Star className="w-4 h-4 text-purple-400" />
                                        +100 XP
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {step.component === 'goals' && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {GOALS.map((goal) => (
                                <button
                                    key={goal.id}
                                    onClick={() => toggleGoal(goal.id)}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${preferences.goals.includes(goal.id)
                                            ? 'border-indigo-500 bg-indigo-500/10'
                                            : 'border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/50'
                                        }`}
                                >
                                    <div className="text-2xl mb-2">{goal.icon}</div>
                                    <div className="font-medium text-white text-sm">{goal.label}</div>
                                    <div className="text-xs text-zinc-500 mt-1">{goal.description}</div>
                                    {preferences.goals.includes(goal.id) && (
                                        <Check className="absolute top-2 right-2 w-4 h-4 text-indigo-400" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {step.component === 'experience' && (
                        <div className="space-y-3">
                            {[
                                { id: 'beginner', label: 'დამწყები', description: 'ახლახანს ვიწყებ AI-ს გამოყენებას', icon: '🌱' },
                                { id: 'intermediate', label: 'საშუალო', description: 'გამოვყენებული მაქვს რამდენიმე AI ხელსაწყო', icon: '🌿' },
                                { id: 'advanced', label: 'მოწინავე', description: 'რეგულარულად ვიყენებ სხვადასხვა AI-ს', icon: '🌳' }
                            ].map((level) => (
                                <button
                                    key={level.id}
                                    onClick={() => setPreferences(prev => ({ ...prev, experience: level.id as typeof prev.experience }))}
                                    className={`w-full p-5 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${preferences.experience === level.id
                                            ? 'border-indigo-500 bg-indigo-500/10'
                                            : 'border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/50'
                                        }`}
                                >
                                    <span className="text-3xl">{level.icon}</span>
                                    <div className="flex-1">
                                        <div className="font-medium text-white">{level.label}</div>
                                        <div className="text-sm text-zinc-400">{level.description}</div>
                                    </div>
                                    {preferences.experience === level.id && (
                                        <Check className="w-5 h-5 text-indigo-400" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {step.component === 'interests' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {INTERESTS.map((interest) => (
                                <button
                                    key={interest.id}
                                    onClick={() => toggleInterest(interest.id)}
                                    className={`p-4 rounded-xl border-2 text-center transition-all ${preferences.interests.includes(interest.id)
                                            ? 'border-indigo-500 bg-indigo-500/10'
                                            : 'border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/50'
                                        }`}
                                >
                                    <div className="text-2xl mb-2">{interest.icon}</div>
                                    <div className="text-sm text-white">{interest.label}</div>
                                </button>
                            ))}
                        </div>
                    )}

                    {step.component === 'personalize' && (
                        <div>
                            <p className="text-center text-zinc-400 mb-6">რა არის თქვენი პროფესია?</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {PROFESSIONS.map((prof) => (
                                    <button
                                        key={prof.id}
                                        onClick={() => setPreferences(prev => ({ ...prev, profession: prof.id }))}
                                        className={`p-4 rounded-xl border-2 text-center transition-all ${preferences.profession === prof.id
                                                ? 'border-indigo-500 bg-indigo-500/10'
                                                : 'border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/50'
                                            }`}
                                    >
                                        <div className="text-2xl mb-2">{prof.icon}</div>
                                        <div className="text-sm text-white">{prof.label}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step.component === 'complete' && (
                        <div className="text-center">
                            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-2xl p-8 border border-green-500/30 mb-6">
                                <div className="text-6xl mb-4">🎉</div>
                                <h3 className="text-xl font-semibold text-white mb-4">
                                    გილოცავთ! თქვენი პროფილი მზადაა
                                </h3>
                                <p className="text-zinc-300 mb-4">
                                    ახლა მიიღებთ პერსონალიზებულ რეკომენდაციებს თქვენი ინტერესებისა და მიზნების მიხედვით.
                                </p>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 text-yellow-300">
                                    <Zap className="w-4 h-4" />
                                    +100 XP მიღებულია!
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div className="bg-zinc-800/50 rounded-lg p-3">
                                    <div className="text-zinc-400">მიზნები</div>
                                    <div className="text-white font-medium">{preferences.goals.length} არჩეული</div>
                                </div>
                                <div className="bg-zinc-800/50 rounded-lg p-3">
                                    <div className="text-zinc-400">ინტერესები</div>
                                    <div className="text-white font-medium">{preferences.interests.length} არჩეული</div>
                                </div>
                                <div className="bg-zinc-800/50 rounded-lg p-3">
                                    <div className="text-zinc-400">დონე</div>
                                    <div className="text-white font-medium capitalize">{preferences.experience || '-'}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-zinc-800 flex justify-between items-center">
                    <div>
                        {currentStep > 1 && (
                            <Button variant="ghost" onClick={handleBack} className="text-zinc-400 hover:text-white">
                                უკან
                            </Button>
                        )}
                    </div>
                    <Button
                        onClick={handleNext}
                        disabled={!canProceed()}
                        className={`gap-2 ${canProceed()
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'
                                : 'bg-zinc-700 cursor-not-allowed'
                            }`}
                    >
                        {step.component === 'complete' ? (
                            <>
                                <Rocket className="w-4 h-4" />
                                დაწყება
                            </>
                        ) : (
                            <>
                                გაგრძელება
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}

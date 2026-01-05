"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { TbX, TbChevronRight, TbChevronLeft, TbSparkles, TbLayoutDashboard, TbFileText, TbChartBar, TbSettings, TbKeyboard, TbCircleCheck } from "react-icons/tb"

interface TourStep {
    target: string
    title: string
    description: string
    icon: React.ReactNode
    position: "top" | "bottom" | "left" | "right"
}

const tourSteps: TourStep[] = [
    {
        target: "[data-tour='dashboard']",
        title: "მოგესალმებით Dashboard-ში! 🎉",
        description: "აქ ნახავთ თქვენი საიტის მთავარ სტატისტიკას და ბოლო აქტივობებს.",
        icon: <TbLayoutDashboard className="w-6 h-6" />,
        position: "bottom"
    },
    {
        target: "[data-tour='content']",
        title: "კონტენტის მართვა",
        description: "შექმენით და დაარედაქტირეთ პოსტები, ვიდეოები და მედია ფაილები.",
        icon: <TbFileText className="w-6 h-6" />,
        position: "right"
    },
    {
        target: "[data-tour='analytics']",
        title: "ანალიტიკა",
        description: "თვალყურს ადევნეთ ნახვებს, რეაქციებს და მომხმარებლების აქტივობას.",
        icon: <TbChartBar className="w-6 h-6" />,
        position: "right"
    },
    {
        target: "[data-tour='settings']",
        title: "პარამეტრები",
        description: "მოირგეთ საიტის კონფიგურაცია, თემა და უსაფრთხოების პარამეტრები.",
        icon: <TbSettings className="w-6 h-6" />,
        position: "right"
    },
    {
        target: "[data-tour='shortcuts']",
        title: "კლავიატურის მალსახმობები",
        description: "გამოიყენეთ ⌘K ძიებისთვის, ⌘S შენახვისთვის და ⌘N ახალი პოსტისთვის.",
        icon: <TbKeyboard className="w-6 h-6" />,
        position: "top"
    }
]

interface OnboardingTourProps {
    onComplete: () => void
    isOpen: boolean
}

export function OnboardingTour({ onComplete, isOpen }: OnboardingTourProps) {
    const [currentStep, setCurrentStep] = React.useState(0)
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [isOpen])

    const handleNext = () => {
        if (currentStep < tourSteps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            handleComplete()
        }
    }

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleComplete = () => {
        localStorage.setItem("admin_tour_completed", "true")
        onComplete()
    }

    const handleSkip = () => {
        handleComplete()
    }

    if (!mounted || !isOpen) return null

    const step = tourSteps[currentStep]
    const progress = ((currentStep + 1) / tourSteps.length) * 100

    return createPortal(
        <div className="fixed inset-0 z-[200]">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Tour Card */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in duration-300">
                    {/* Progress Bar */}
                    <div className="h-1 bg-muted">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Header */}
                    <div className="p-6 pb-4">
                        <div className="flex items-start justify-between">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                                {step.icon}
                            </div>
                            <button
                                onClick={handleSkip}
                                className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground"
                            >
                                <TbX className="w-5 h-5" />
                            </button>
                        </div>
                        <h2 className="text-xl font-bold mt-4">{step.title}</h2>
                        <p className="text-muted-foreground mt-2">{step.description}</p>
                    </div>

                    {/* Step Indicators */}
                    <div className="flex justify-center gap-2 px-6 pb-4">
                        {tourSteps.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentStep(i)}
                                className={`w-2 h-2 rounded-full transition-all ${i === currentStep
                                        ? "w-6 bg-indigo-500"
                                        : i < currentStep
                                            ? "bg-indigo-500/50"
                                            : "bg-muted-foreground/30"
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="p-6 pt-2 flex items-center justify-between border-t border-border">
                        <div className="text-sm text-muted-foreground">
                            {currentStep + 1} / {tourSteps.length}
                        </div>
                        <div className="flex gap-2">
                            {currentStep > 0 && (
                                <Button variant="outline" size="sm" onClick={handlePrev}>
                                    <TbChevronLeft className="w-4 h-4 mr-1" />
                                    უკან
                                </Button>
                            )}
                            <Button
                                size="sm"
                                onClick={handleNext}
                                className="bg-gradient-to-r from-indigo-500 to-purple-600"
                            >
                                {currentStep === tourSteps.length - 1 ? (
                                    <>
                                        <TbCircleCheck className="w-4 h-4 mr-1" />
                                        დასრულება
                                    </>
                                ) : (
                                    <>
                                        შემდეგი
                                        <TbChevronRight className="w-4 h-4 ml-1" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}

// Hook to manage onboarding state
export function useOnboarding() {
    const [showTour, setShowTour] = React.useState(false)

    React.useEffect(() => {
        const tourCompleted = localStorage.getItem("admin_tour_completed")
        if (!tourCompleted) {
            // Show tour after a short delay for first-time users
            const timer = setTimeout(() => setShowTour(true), 1000)
            return () => clearTimeout(timer)
        }
    }, [])

    const startTour = () => setShowTour(true)
    const endTour = () => setShowTour(false)
    const resetTour = () => {
        localStorage.removeItem("admin_tour_completed")
        setShowTour(true)
    }

    return { showTour, startTour, endTour, resetTour }
}

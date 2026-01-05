'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TbX, TbChevronRight, TbChevronLeft, TbSparkles, TbHelp } from "react-icons/tb"

interface TourStep {
    target: string // CSS selector or data-tour-step value
    title: string
    description: string
    placement?: 'top' | 'bottom' | 'left' | 'right'
}

interface OnboardingTourProps {
    steps: TourStep[]
    onComplete?: () => void
    storageKey?: string
}

export function OnboardingTour({ steps, onComplete, storageKey = 'prompt-builder-tour-completed' }: OnboardingTourProps) {
    const [isActive, setIsActive] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
    const [mounted, setMounted] = useState(false)

    // Check if tour was completed
    useEffect(() => {
        setMounted(true)
        const completed = localStorage.getItem(storageKey)
        if (!completed) {
            // Delay start to allow page to load
            setTimeout(() => setIsActive(true), 1000)
        }
    }, [storageKey])

    // Update target element position
    const updateTargetPosition = useCallback(() => {
        if (!isActive || !steps[currentStep]) return

        const target = steps[currentStep].target
        const element = document.querySelector(`[data-tour-step="${target}"]`) || document.querySelector(target)

        if (element) {
            const rect = element.getBoundingClientRect()
            setTargetRect(rect)

            // Scroll element into view if needed
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }, [isActive, currentStep, steps])

    useEffect(() => {
        updateTargetPosition()
        window.addEventListener('resize', updateTargetPosition)
        window.addEventListener('scroll', updateTargetPosition)

        return () => {
            window.removeEventListener('resize', updateTargetPosition)
            window.removeEventListener('scroll', updateTargetPosition)
        }
    }, [updateTargetPosition])

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            completeTour()
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
        }
    }

    const completeTour = () => {
        localStorage.setItem(storageKey, 'true')
        setIsActive(false)
        setCurrentStep(0)
        onComplete?.()
    }

    const skipTour = () => {
        localStorage.setItem(storageKey, 'true')
        setIsActive(false)
    }

    const startTour = () => {
        setCurrentStep(0)
        setIsActive(true)
    }

    if (!mounted) return null

    const step = steps[currentStep]
    const placement = step?.placement || 'bottom'

    // Calculate tooltip position
    const getTooltipStyle = (): React.CSSProperties => {
        if (!targetRect) return { opacity: 0 }

        const padding = 16
        const tooltipWidth = 340
        const tooltipHeight = 180

        let top = 0
        let left = 0

        switch (placement) {
            case 'top':
                top = targetRect.top - tooltipHeight - padding
                left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2
                break
            case 'bottom':
                top = targetRect.bottom + padding
                left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2
                break
            case 'left':
                top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2
                left = targetRect.left - tooltipWidth - padding
                break
            case 'right':
                top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2
                left = targetRect.right + padding
                break
        }

        // Keep within viewport bounds
        left = Math.max(padding, Math.min(left, window.innerWidth - tooltipWidth - padding))
        top = Math.max(padding, Math.min(top, window.innerHeight - tooltipHeight - padding))

        return {
            position: 'fixed',
            top: `${top}px`,
            left: `${left}px`,
            width: `${tooltipWidth}px`,
            zIndex: 10001
        }
    }

    // Get arrow style
    const getArrowStyle = (): React.CSSProperties => {
        if (!targetRect) return { display: 'none' }

        const arrowSize = 12
        const style: React.CSSProperties = {
            position: 'absolute',
            width: 0,
            height: 0,
            borderStyle: 'solid'
        }

        switch (placement) {
            case 'top':
                style.bottom = -arrowSize
                style.left = '50%'
                style.transform = 'translateX(-50%)'
                style.borderWidth = `${arrowSize}px ${arrowSize}px 0 ${arrowSize}px`
                style.borderColor = 'hsl(var(--card)) transparent transparent transparent'
                break
            case 'bottom':
                style.top = -arrowSize
                style.left = '50%'
                style.transform = 'translateX(-50%)'
                style.borderWidth = `0 ${arrowSize}px ${arrowSize}px ${arrowSize}px`
                style.borderColor = 'transparent transparent hsl(var(--card)) transparent'
                break
            case 'left':
                style.right = -arrowSize
                style.top = '50%'
                style.transform = 'translateY(-50%)'
                style.borderWidth = `${arrowSize}px 0 ${arrowSize}px ${arrowSize}px`
                style.borderColor = 'transparent transparent transparent hsl(var(--card))'
                break
            case 'right':
                style.left = -arrowSize
                style.top = '50%'
                style.transform = 'translateY(-50%)'
                style.borderWidth = `${arrowSize}px ${arrowSize}px ${arrowSize}px 0`
                style.borderColor = 'transparent hsl(var(--card)) transparent transparent'
                break
        }

        return style
    }

    const tourContent = isActive && step && (
        <>
            {/* SVG Mask Overlay for clean spotlight effect */}
            <svg
                className="fixed inset-0 z-[9999] pointer-events-none"
                width="100%"
                height="100%"
            >
                <defs>
                    <mask id="spotlight-mask">
                        <rect width="100%" height="100%" fill="white" />
                        {targetRect && (
                            <rect
                                x={targetRect.left - 12}
                                y={targetRect.top - 12}
                                width={targetRect.width + 24}
                                height={targetRect.height + 24}
                                rx="12"
                                fill="black"
                            />
                        )}
                    </mask>
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    fill="rgba(0, 0, 0, 0.8)"
                    mask="url(#spotlight-mask)"
                />
            </svg>

            {/* Clickable overlay to prevent interaction */}
            <div
                className="fixed inset-0 z-[10000]"
                onClick={(e) => e.stopPropagation()}
            />

            {/* Glowing spotlight border around target */}
            {targetRect && (
                <div
                    className="fixed z-[10000] pointer-events-none rounded-xl border-2 border-primary shadow-[0_0_30px_rgba(139,92,246,0.6)]"
                    style={{
                        top: targetRect.top - 12,
                        left: targetRect.left - 12,
                        width: targetRect.width + 24,
                        height: targetRect.height + 24,
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    }}
                />
            )}

            {/* Tooltip */}
            <Card
                className="shadow-2xl border-2 border-primary/30 animate-in fade-in-0 zoom-in-95"
                style={getTooltipStyle()}
            >
                {/* Arrow */}
                <div style={getArrowStyle()} />

                <CardContent className="p-4">
                    {/* Header with step counter */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <TbSparkles className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-xs text-muted-foreground font-medium">
                                {currentStep + 1} / {steps.length}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={skipTour}
                        >
                            <TbX className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Content */}
                    <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{step.description}</p>

                    {/* Progress dots */}
                    <div className="flex items-center justify-center gap-1 mb-4">
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full transition-colors ${index === currentStep
                                    ? 'bg-primary'
                                    : index < currentStep
                                        ? 'bg-primary/50'
                                        : 'bg-muted'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className="text-xs"
                        >
                            <TbChevronLeft className="w-4 h-4 mr-1" />
                            წინა
                        </Button>

                        {currentStep < steps.length - 1 ? (
                            <Button
                                size="sm"
                                onClick={nextStep}
                                className="bg-gradient-to-r from-primary to-accent text-white"
                            >
                                შემდეგი
                                <TbChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        ) : (
                            <Button
                                size="sm"
                                onClick={completeTour}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                            >
                                დასრულება ✓
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    )

    return (
        <>
            {/* Help button to restart tour - more visible */}
            <Button
                variant="default"
                size="sm"
                onClick={startTour}
                className="fixed bottom-4 left-4 z-50 gap-2 shadow-xl hover:shadow-2xl transition-all bg-gradient-to-r from-primary to-accent text-white hover:scale-105"
            >
                <TbHelp className="w-4 h-4" />
                <span>დახმარება</span>
            </Button>

            {/* Portal for overlay */}
            {mounted && createPortal(tourContent, document.body)}
        </>
    )
}

// Default tour steps for Prompt Builder
export const promptBuilderTourSteps: TourStep[] = [
    {
        target: 'tabs-list',
        title: '👋 კეთილი იყოს შენი მობრძანება!',
        description: 'ეს არის AI პრომპტების შემქმნელი. აქ შეგიძლია შექმნა პროფესიონალური პრომპტები ნებისმიერი AI ასისტენტისთვის. გაიარე ტური და გაიგე როგორ მუშაობს!',
        placement: 'bottom'
    },
    {
        target: 'role-selector',
        title: '1️⃣ აირჩიე ექსპერტის როლი',
        description: 'პირველ რიგში აირჩიე ვინ უნდა გახდეს AI — მარკეტოლოგი, პროგრამისტი, კოპირაიტერი, იურისტი თუ სხვა ექსპერტი.',
        placement: 'right'
    },
    {
        target: 'task-input',
        title: '2️⃣ აღწერე დავალება',
        description: 'დეტალურად ჩაწერე რა გჭირდება. რაც უფრო კონკრეტული იქნები, მით უკეთეს პასუხს მიიღებ AI-სგან!',
        placement: 'right'
    },
    {
        target: 'ai-ideas-btn',
        title: '3️⃣ AI იდეები',
        description: 'არ იცი რა დაწერო? დააჭირე ამ ღილაკს და AI შემოგთავაზებს იდეებს შენი არჩეული როლის მიხედვით.',
        placement: 'left'
    },
    {
        target: 'generate-btn',
        title: '4️⃣ შექმენი პრომპტი',
        description: 'ყველაფრის შევსების შემდეგ დააჭირე აქ და მიიღებ მზა პრომპტს მარჯვენა მხარეს!',
        placement: 'right'
    },
    {
        target: 'output-section',
        title: '5️⃣ შენი პრომპტი',
        description: 'აქ გამოჩნდება შენი მზა პრომპტი. შეგიძლია დააკოპირო, AI-ით გააუმჯობესო, გაზიარო ან შეინახო. ისტორია, შაბლონები და გალერეა ზემოთ ჩანართებშია!',
        placement: 'left'
    }
]

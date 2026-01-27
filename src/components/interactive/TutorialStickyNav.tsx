"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { TbListNumbers } from "react-icons/tb"

export function TutorialStickyNav() {
    const [currentStep, setCurrentStep] = useState(0)
    const [totalSteps, setTotalSteps] = useState(0)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Find all tutorial steps
        const steps = document.querySelectorAll('.tutorial-step')
        setTotalSteps(steps.length)

        if (steps.length === 0) return;

        setIsVisible(true)

        // Observer to track active step
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stepNum = parseInt(entry.target.getAttribute('data-step') || '0')
                    setCurrentStep(stepNum)
                }
            })
        }, {
            root: null,
            rootMargin: '-20% 0px -50% 0px', // Trigger when step is in the middle-ish
            threshold: 0.1
        })

        steps.forEach(step => observer.observe(step))

        return () => observer.disconnect()
    }, [])

    if (!isVisible || totalSteps === 0) return null

    return (
        <div className="fixed bottom-8 right-8 z-40 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-background/80 backdrop-blur-md border border-border shadow-2xl rounded-full px-5 py-3 flex items-center gap-3">
                <div className="bg-primary/10 p-1.5 rounded-full text-primary">
                    <TbListNumbers className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider leading-none">
                        ნაბიჯი
                    </span>
                    <span className="font-bold text-sm tabular-nums leading-tight">
                        {currentStep || 1} <span className="text-muted-foreground/50 mx-1">/</span> {totalSteps}
                    </span>
                </div>
            </div>
        </div>
    )
}

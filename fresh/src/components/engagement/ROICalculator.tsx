'use client'

import { useState, useEffect } from 'react'
import { TbCalculator, TbClock, TbCurrencyDollar, TbTrendingUp, TbBolt, TbUsers } from "react-icons/tb"
import { Button } from '@/components/ui/button'

interface ROICalculatorProps {
    onUpgrade?: () => void
}

export function ROICalculator({ onUpgrade }: ROICalculatorProps) {
    const [hoursPerWeek, setHoursPerWeek] = useState(10)
    const [hourlyRate, setHourlyRate] = useState(25)
    const [teamSize, setTeamSize] = useState(1)
    const [animatedSavings, setAnimatedSavings] = useState(0)

    // Calculate savings
    const aiEfficiency = 0.4 // AI saves 40% of time
    const hoursSavedPerWeek = hoursPerWeek * aiEfficiency
    const weeklySavings = hoursSavedPerWeek * hourlyRate * teamSize
    const monthlySavings = weeklySavings * 4
    const yearlySavings = monthlySavings * 12

    // Animate savings number
    useEffect(() => {
        const duration = 1000
        const steps = 60
        const increment = monthlySavings / steps
        let current = 0

        const timer = setInterval(() => {
            current += increment
            if (current >= monthlySavings) {
                setAnimatedSavings(monthlySavings)
                clearInterval(timer)
            } else {
                setAnimatedSavings(Math.floor(current))
            }
        }, duration / steps)

        return () => clearInterval(timer)
    }, [monthlySavings])

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-900/20 to-teal-900/20 border border-emerald-500/20 p-6">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl" />

                {/* Header */}
                <div className="relative flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg shadow-emerald-500/30">
                        <TbCalculator className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">ROI კალკულატორი</h2>
                        <p className="text-white/60 text-sm">გაარკვიე რამდენს დაზოგავ AI-ით</p>
                    </div>
                </div>

                {/* Sliders */}
                <div className="relative space-y-6 mb-8">
                    {/* Hours per week */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-white/80 text-sm flex items-center gap-2">
                                <TbClock className="w-4 h-4 text-emerald-400" />
                                რეპეტიტიურ დავალებებზე დახარჯული საათი / კვირაში
                            </label>
                            <span className="text-emerald-400 font-bold">{hoursPerWeek}სთ</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="40"
                            value={hoursPerWeek}
                            onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                    </div>

                    {/* Hourly rate */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-white/80 text-sm flex items-center gap-2">
                                <TbCurrencyDollar className="w-4 h-4 text-emerald-400" />
                                საათობრივი ტარიფი (₾)
                            </label>
                            <span className="text-emerald-400 font-bold">₾{hourlyRate}</span>
                        </div>
                        <input
                            type="range"
                            min="5"
                            max="100"
                            value={hourlyRate}
                            onChange={(e) => setHourlyRate(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                    </div>

                    {/* Team size */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-white/80 text-sm flex items-center gap-2">
                                <TbUsers className="w-4 h-4 text-emerald-400" />
                                გუნდის ზომა
                            </label>
                            <span className="text-emerald-400 font-bold">{teamSize} ადამიანი</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="20"
                            value={teamSize}
                            onChange={(e) => setTeamSize(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                    </div>
                </div>

                {/* Results */}
                <div className="relative grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700/50">
                        <p className="text-white/50 text-xs mb-1">კვირაში დაზოგილი</p>
                        <p className="text-2xl font-bold text-white">₾{Math.round(weeklySavings)}</p>
                        <p className="text-emerald-400 text-xs">{hoursSavedPerWeek.toFixed(1)}სთ</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl p-4 text-center border border-emerald-500/30">
                        <p className="text-white/50 text-xs mb-1">თვეში დაზოგილი</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                            ₾{animatedSavings}
                        </p>
                        <p className="text-emerald-400 text-xs">{(hoursSavedPerWeek * 4).toFixed(0)}სთ</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700/50">
                        <p className="text-white/50 text-xs mb-1">წელიწადში დაზოგილი</p>
                        <p className="text-2xl font-bold text-white">₾{Math.round(yearlySavings)}</p>
                        <p className="text-emerald-400 text-xs">{(hoursSavedPerWeek * 52).toFixed(0)}სთ</p>
                    </div>
                </div>

                {/* ROI Message */}
                <div className="relative bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-4 mb-6 border border-emerald-500/20">
                    <div className="flex items-center gap-3">
                        <TbTrendingUp className="w-6 h-6 text-emerald-400" />
                        <div>
                            <p className="text-white font-semibold">
                                Premium ღირს ₾9.99/თვეში — შენ დაზოგავ ₾{Math.round(monthlySavings)}!
                            </p>
                            <p className="text-emerald-400 text-sm">
                                ინვესტიციის დაბრუნება: {Math.round((monthlySavings / 9.99) * 100)}% 📈
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <Button
                    onClick={onUpgrade}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold shadow-lg shadow-emerald-500/30 h-12"
                >
                    <TbBolt className="w-5 h-5 mr-2" />
                    დაიწყე დაზოგვა Premium-ით
                </Button>

                {/* AI Efficiency Note */}
                <p className="text-center text-white/40 text-xs mt-4">
                    * გათვლა ეფუძნება საშუალო 40% დროის დაზოგვას AI ხელსაწყოებით
                </p>
            </div>
        </div>
    )
}

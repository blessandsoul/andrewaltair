'use client'

import { useState } from 'react'
import { FileText, Download, Share2, Mail, Sparkles, Brain, Target, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface PersonalAIReportProps {
    userData?: {
        toolsExplored: number
        articlesRead: number
        quizzesTaken: number
        aiType: string
        favoriteCategory: string
    }
}

export function PersonalAIReport({ userData }: PersonalAIReportProps) {
    const [email, setEmail] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [showEmailCapture, setShowEmailCapture] = useState(true)
    const [reportGenerated, setReportGenerated] = useState(false)

    // Default data if not provided
    const data = userData || {
        toolsExplored: Math.floor(Math.random() * 50) + 10,
        articlesRead: Math.floor(Math.random() * 30) + 5,
        quizzesTaken: Math.floor(Math.random() * 10) + 1,
        aiType: 'AI ვიზიონერი',
        favoriteCategory: 'ტექსტის გენერაცია'
    }

    const handleGenerateReport = async () => {
        if (!email) return

        setIsGenerating(true)

        // Simulate report generation
        await new Promise(resolve => setTimeout(resolve, 2000))

        localStorage.setItem('user_email', email)
        setReportGenerated(true)
        setShowEmailCapture(false)
        setIsGenerating(false)
    }

    const handleDownload = () => {
        // In real implementation, this would generate a PDF
        alert('PDF ანგარიში იტვირთება...')
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'ჩემი AI პროფილი - Andrew Altair',
                text: `მე ვარ ${data.aiType}! შევისწავლე ${data.toolsExplored} AI ინსტრუმენტი.`,
                url: window.location.href
            })
        }
    }

    return (
        <div className="w-full max-w-lg mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-900/50 to-purple-900/50 border border-indigo-500/20 p-6">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-500/10 to-indigo-500/10 rounded-full blur-3xl" />

                {/* Header */}
                <div className="relative flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-lg shadow-indigo-500/30">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">პერსონალური AI ანგარიში</h2>
                        <p className="text-white/60 text-sm">შენი AI მოგზაურობის შეჯამება</p>
                    </div>
                </div>

                {/* Stats Preview */}
                <div className="relative grid grid-cols-2 gap-3 mb-6">
                    {[
                        { icon: Brain, label: 'AI ინსტრუმენტები', value: data.toolsExplored, color: 'from-cyan-500 to-blue-500' },
                        { icon: FileText, label: 'წაკითხული სტატიები', value: data.articlesRead, color: 'from-purple-500 to-pink-500' },
                        { icon: Target, label: 'შესრულებული ქვიზი', value: data.quizzesTaken, color: 'from-amber-500 to-orange-500' },
                        { icon: TrendingUp, label: 'საყვარელი კატეგორია', value: data.favoriteCategory, color: 'from-emerald-500 to-teal-500', isText: true }
                    ].map((stat, i) => (
                        <div key={i} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
                            <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${stat.color} bg-opacity-20 mb-2`}>
                                <stat.icon className="w-4 h-4 text-white" />
                            </div>
                            <p className="text-white/50 text-xs mb-1">{stat.label}</p>
                            <p className={`font-bold ${stat.isText ? 'text-sm' : 'text-xl'} text-white`}>
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* AI Type Badge */}
                <div className="relative bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl p-4 mb-6 border border-indigo-500/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-white/60 text-xs">შენი AI ტიპი</p>
                            <p className="text-xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                                {data.aiType}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Email Capture */}
                {showEmailCapture && !reportGenerated && (
                    <div className="relative space-y-3">
                        <p className="text-white/70 text-sm text-center">
                            მიიღე სრული PDF ანგარიში ელ-ფოსტაზე
                        </p>
                        <div className="flex gap-2">
                            <Input
                                type="email"
                                placeholder="შენი ელ-ფოსტა"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 bg-slate-800/50 border-slate-700 text-white placeholder:text-white/40"
                            />
                            <Button
                                onClick={handleGenerateReport}
                                disabled={!email || isGenerating}
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                            >
                                {isGenerating ? (
                                    <span className="animate-spin">⏳</span>
                                ) : (
                                    <>
                                        <Mail className="w-4 h-4 mr-2" />
                                        გენერირება
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Report Ready */}
                {reportGenerated && (
                    <div className="relative space-y-3">
                        <div className="flex items-center justify-center gap-2 text-emerald-400 mb-2">
                            <span className="text-2xl">✅</span>
                            <span className="font-semibold">ანგარიში მზადაა!</span>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleDownload}
                                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                ჩამოტვირთვა PDF
                            </Button>
                            <Button
                                onClick={handleShare}
                                variant="outline"
                                className="border-slate-600 text-white hover:bg-slate-800"
                            >
                                <Share2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

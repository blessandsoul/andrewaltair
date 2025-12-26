'use client'

import { useState, useRef } from 'react'
import { Award, Download, Share2, Linkedin, CheckCircle2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CertificateData {
    userName: string
    completionDate: string
    certificateId: string
    courseName: string
    level: string
}

export function AICertification() {
    const [userName, setUserName] = useState('')
    const [isGenerated, setIsGenerated] = useState(false)
    const [certificateData, setCertificateData] = useState<CertificateData | null>(null)
    const certificateRef = useRef<HTMLDivElement>(null)

    const handleGenerate = () => {
        if (!userName.trim()) return

        const data: CertificateData = {
            userName: userName.trim(),
            completionDate: new Date().toLocaleDateString('ka-GE'),
            certificateId: `AA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
            courseName: 'AI ფუნდამენტალური კურსი',
            level: 'AI ექსპერტი'
        }

        setCertificateData(data)
        setIsGenerated(true)
    }

    const handleDownload = () => {
        // In real implementation, this would use html2canvas or similar
        alert('სერტიფიკატი იტვირთება PDF ფორმატში...')
    }

    const handleShareLinkedIn = () => {
        const text = `მე წარმატებით დავასრულე "${certificateData?.courseName}" კურსი Andrew Altair-ზე და მივიღე ${certificateData?.level} სერტიფიკატი! 🎓 #AI #MachineLearning #Certificate`
        const url = encodeURIComponent(window.location.origin)
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${encodeURIComponent(text)}`, '_blank')
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-6">
                {!isGenerated ? (
                    /* Form View */
                    <div className="text-center">
                        <div className="inline-flex p-4 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full mb-6">
                            <Award className="w-10 h-10 text-amber-400" />
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">მიიღე AI სერტიფიკატი</h2>
                        <p className="text-white/60 mb-6">დაასრულე სწავლა და მიიღე ოფიციალური სერტიფიკატი LinkedIn-ისთვის</p>

                        {/* Requirements */}
                        <div className="bg-slate-800/50 rounded-xl p-4 mb-6 text-left">
                            <h3 className="text-white font-medium mb-3">მოთხოვნები:</h3>
                            <div className="space-y-2">
                                {[
                                    { label: 'შეისწავლე 20+ AI ინსტრუმენტი', completed: true },
                                    { label: 'წაიკითხე 10+ სტატია', completed: true },
                                    { label: 'გაიარე AI ქვიზი 80%+ შედეგით', completed: true },
                                    { label: 'მიაღწიე 500 XP', completed: true }
                                ].map((req, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <CheckCircle2 className={`w-4 h-4 ${req.completed ? 'text-emerald-400' : 'text-slate-600'}`} />
                                        <span className={req.completed ? 'text-white/80' : 'text-white/40'}>{req.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Name Input */}
                        <div className="mb-6">
                            <label className="block text-white/60 text-sm mb-2 text-left">შენი სახელი (სერტიფიკატზე გამოჩნდება)</label>
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="მაგ: გიორგი გელაშვილი"
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        <Button
                            onClick={handleGenerate}
                            disabled={!userName.trim()}
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3"
                        >
                            <Sparkles className="w-5 h-5 mr-2" />
                            გენერირება სერტიფიკატის
                        </Button>
                    </div>
                ) : (
                    /* Certificate View */
                    <div>
                        {/* Certificate */}
                        <div
                            ref={certificateRef}
                            className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-8 border-4 border-amber-500/30 mb-6"
                        >
                            {/* Decorative corners */}
                            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-500/50" />
                            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-500/50" />
                            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-500/50" />
                            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-500/50" />

                            {/* Content */}
                            <div className="text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full">
                                        <Award className="w-8 h-8 text-white" />
                                    </div>
                                </div>

                                <p className="text-amber-400 uppercase tracking-widest text-sm mb-2">სერტიფიკატი</p>
                                <h2 className="text-3xl font-bold text-white mb-4">{certificateData?.level}</h2>

                                <p className="text-white/60 mb-2">ეს სერტიფიკატი გადაეცემა</p>
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent mb-4">
                                    {certificateData?.userName}
                                </h3>

                                <p className="text-white/60 mb-4">
                                    წარმატებით დაასრულა <span className="text-white">{certificateData?.courseName}</span>
                                    <br />Andrew Altair AI პლატფორმაზე
                                </p>

                                <div className="flex justify-center gap-8 text-sm">
                                    <div>
                                        <p className="text-white/40">თარიღი</p>
                                        <p className="text-white">{certificateData?.completionDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/40">ID</p>
                                        <p className="text-white font-mono">{certificateData?.certificateId}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                onClick={handleDownload}
                                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                ჩამოტვირთვა PDF
                            </Button>
                            <Button
                                onClick={handleShareLinkedIn}
                                className="flex-1 bg-[#0077b5] hover:bg-[#006699]"
                            >
                                <Linkedin className="w-4 h-4 mr-2" />
                                გაზიარება LinkedIn
                            </Button>
                        </div>

                        <p className="text-center text-white/40 text-xs mt-4">
                            💡 სერტიფიკატი ვერიფიცირებადია ID-ის საშუალებით
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

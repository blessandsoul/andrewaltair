"use client"

import * as React from "react"
import Link from "next/link"
import { TbArrowLeft, TbShare3, TbRefresh, TbUserQuestion } from "react-icons/tb"

import { getForumPersona } from "@/lib/georgian-forum-personas"
import { ForumPersonaAvatar } from "@/components/forum/ForumPersonaAvatar"

type Weights = Record<string, number>
interface Question { q: string; options: { label: string; w: Weights }[] }

const QUESTIONS: Question[] = [
    {
        q: "რა არის ყველაზე მნიშვნელოვანი ქვეყნისთვის?",
        options: [
            { label: "თავისუფლება", w: { zviad: 2, mamardashvili: 2 } },
            { label: "წესრიგი და ძალა", w: { stalin: 2, david: 1 } },
            { label: "კულტურა და მემკვიდრეობა", w: { tamar: 2, galaktion: 1, takaishvili: 1 } },
            { label: "სამართალი ყველასთვის", w: { ilia: 2, noe: 1 } },
        ],
    },
    {
        q: "როგორ უნდა მიაღწიო დიად მიზანს?",
        options: [
            { label: "სისტემითა და მოთმინებით", w: { david: 2, nikoladze: 1 } },
            { label: "ბრძოლითა და ნებისყოფით", w: { vakhtang: 2, cholokashvili: 1 } },
            { label: "ჭკუითა და დიპლომატიით", w: { tamar: 2, erekle: 1 } },
            { label: "სიმართლის თქმით, თუნდაც მარტო", w: { vazha: 2, mamardashvili: 1 } },
        ],
    },
    {
        q: "ვისი ხმა უნდა ისმოდეს ყველაზე მეტად?",
        options: [
            { label: "ხალხის", w: { noe: 2, akaki: 1 } },
            { label: "ძლიერი ლიდერის", w: { stalin: 2, vakhtang: 1 } },
            { label: "ბრძენებისა და მეცნიერების", w: { rustaveli: 2, javakhishvili: 1 } },
            { label: "ყველას, ვინც გაბედავს", w: { zviad: 2, ilia: 1 } },
        ],
    },
    {
        q: "რა გადაარჩენს მცირე ერს?",
        options: [
            { label: "ძლიერი არმია", w: { david: 2, bagration: 2 } },
            { label: "ჭკვიანი მოკავშირეები", w: { erekle: 2, tamar: 1 } },
            { label: "ენა და იდენტობა", w: { ilia: 2, k_gamsakhurdia: 1 } },
            { label: "ხალხის ცოცხალი სული", w: { vazha: 1, akaki: 1, galaktion: 1 } },
        ],
    },
    {
        q: "რას ენდობი ყველაზე მეტად?",
        options: [
            { label: "ფაქტებსა და მტკიცებას", w: { javakhishvili: 2, nikoladze: 1 } },
            { label: "რწმენასა და ტრადიციას", w: { takaishvili: 2, k_gamsakhurdia: 1 } },
            { label: "საკუთარ გონებას", w: { mamardashvili: 2 } },
            { label: "ძალასა და კონტროლს", w: { beria: 2, stalin: 1 } },
        ],
    },
    {
        q: "შენი მთავარი იარაღი დავაში?",
        options: [
            { label: "მახვილი სიტყვა და კალამი", w: { ilia: 2, galaktion: 1 } },
            { label: "ცივი სტრატეგია", w: { bagration: 2, david: 1 } },
            { label: "ხიბლი და ხალხის სიყვარული", w: { akaki: 2, rustaveli: 1 } },
            { label: "შეუვალი პრინციპი", w: { cholokashvili: 2, vazha: 1 } },
        ],
    },
    {
        q: "როდის წახვიდოდი კომპრომისზე?",
        options: [
            { label: "როცა ერი გადარჩება", w: { erekle: 2 } },
            { label: "არასდროს, თუ პრინციპს ეწინააღმდეგება", w: { zviad: 2, cholokashvili: 1 } },
            { label: "როცა ორივე მხარე იგებს", w: { nikoladze: 2, tamar: 1 } },
            { label: "როცა ჭეშმარიტება ამას მოითხოვს", w: { mamardashvili: 1, javakhishvili: 1 } },
        ],
    },
    {
        q: "რას დატოვებდი შთამომავლობას?",
        options: [
            { label: "ძლიერ სახელმწიფოს", w: { david: 2, stalin: 1 } },
            { label: "დიად კულტურას", w: { tamar: 2, galaktion: 1, rustaveli: 1 } },
            { label: "თავისუფალ ერს", w: { zviad: 2, ilia: 1 } },
            { label: "სიმართლის მაგალითს", w: { vazha: 2, takaishvili: 1 } },
        ],
    },
]

export default function ForumQuizPage() {
    const [step, setStep] = React.useState(0)
    const [scores, setScores] = React.useState<Weights>({})
    const [resultId, setResultId] = React.useState<string | null>(null)

    const pick = (w: Weights) => {
        const next: Weights = { ...scores }
        for (const k of Object.keys(w)) next[k] = (next[k] || 0) + w[k]
        if (step + 1 >= QUESTIONS.length) {
            let best = "ilia", bestV = -1
            for (const k of Object.keys(next)) if (next[k] > bestV) { bestV = next[k]; best = k }
            setScores(next)
            setResultId(best)
        } else {
            setScores(next)
            setStep(step + 1)
        }
    }

    const reset = () => { setStep(0); setScores({}); setResultId(null) }

    if (resultId) {
        const p = getForumPersona(resultId)
        return (
            <main className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-10 max-w-xl">
                    <Link href="/forum" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                        <TbArrowLeft className="w-4 h-4" /> ფორუმი
                    </Link>
                    <div className="mt-6 rounded-2xl border border-primary/30 bg-card p-6 text-center">
                        <div className="text-sm text-on-surface-variant mb-3">შენ ფიქრობ როგორც</div>
                        <div className="flex justify-center mb-3">
                            <ForumPersonaAvatar personaId={resultId} size="lg" />
                        </div>
                        <h1 className="text-2xl font-bold text-on-surface">{p?.name}</h1>
                        <div className="text-sm text-on-surface-variant">{p?.era} · {p?.role}</div>
                        {p?.sample && <p className="mt-4 text-base italic leading-relaxed text-on-surface">„{p.sample}"</p>}
                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            {p?.sample && (
                                <a
                                    href={`/api/forum/quote?persona=${resultId}&text=${encodeURIComponent(p.sample)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                                >
                                    <TbShare3 className="w-4 h-4" /> გააზიარე
                                </a>
                            )}
                            <Link href={`/forum/persona/${resultId}`} className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm hover:bg-muted">
                                პროფილი
                            </Link>
                            <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm hover:bg-muted">
                                <TbRefresh className="w-4 h-4" /> თავიდან
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    const cur = QUESTIONS[step]
    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-10 max-w-xl">
                <Link href="/forum" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                    <TbArrowLeft className="w-4 h-4" /> ფორუმი
                </Link>

                <div className="mt-6">
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-2">
                        <TbUserQuestion className="w-5 h-5 text-primary" />
                        რომელ დიდებულს ჰგავხარ? · {step + 1}/{QUESTIONS.length}
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-5">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((step) / QUESTIONS.length) * 100}%` }} />
                    </div>

                    <h1 className="text-xl font-bold text-on-surface mb-4">{cur.q}</h1>
                    <div className="space-y-2">
                        {cur.options.map((o) => (
                            <button
                                key={o.label}
                                onClick={() => pick(o.w)}
                                className="w-full text-left rounded-xl border border-border bg-card px-4 py-3 text-on-surface hover:border-primary hover:bg-muted transition-colors"
                            >
                                {o.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}

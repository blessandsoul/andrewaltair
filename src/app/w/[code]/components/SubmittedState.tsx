'use client'

import { Check } from 'lucide-react'

interface SubmittedStateProps {
    onEdit: () => void
}

export default function SubmittedState({ onEdit }: SubmittedStateProps) {
    return (
        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-8 text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                <Check size={26} className="text-emerald-400" strokeWidth={2.5} />
            </div>
            <p className="text-xl font-bold">პასუხი მიღებულია</p>
            <p className="text-white/50 text-sm">დაელოდეთ შემდეგ რაუნდს</p>
            <button
                onClick={onEdit}
                className="text-violet-400 underline underline-offset-4 text-sm active:text-violet-300"
            >
                პასუხის შეცვლა
            </button>
        </div>
    )
}

'use client'

import { Check } from 'lucide-react'

interface SubmittedStateProps {
    onEdit: () => void
}

export default function SubmittedState({ onEdit }: SubmittedStateProps) {
    return (
        <div className="rounded-2xl bg-white border border-[#0E0F1F]/8 shadow-sm p-8 text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center">
                <Check size={26} className="text-emerald-600" strokeWidth={2.5} />
            </div>
            <p className="text-xl font-bold">პასუხი მიღებულია</p>
            <p className="text-[#6E7186] text-sm">დაელოდეთ შემდეგ რაუნდს</p>
            <button
                onClick={onEdit}
                className="text-violet-600 underline underline-offset-4 text-sm active:text-violet-500"
            >
                პასუხის შეცვლა
            </button>
        </div>
    )
}

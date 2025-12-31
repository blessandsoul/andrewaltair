"use client"

import { notFound, useParams } from "next/navigation"
import Link from "next/link"
import { CaretLeft } from "@phosphor-icons/react"
import { FortuneTeller } from "@/components/ai/FortuneTeller"
import { LoveCalculator } from "@/components/ai/LoveCalculator"
import { DreamInterpreter } from "@/components/ai/DreamInterpreter"
import { Horoscope } from "@/components/ai/Horoscope"
import { TarotCards } from "@/components/ai/TarotCards"
import { Numerology } from "@/components/ai/Numerology"
import { MoonPhases } from "@/components/ai/MoonPhases"
import { MysticChat } from "@/components/ai/MysticChat"
import { SERVICE_3D_MODELS } from "@/components/mystic/3DModels"

// Service definitions
const SERVICES = {
    fortune: {
        name: "მისტიკური გადალი",
        description: "AI წინასწარმეტყველება",
        color: "#a855f7",
        component: FortuneTeller,
    },
    tarot: {
        name: "ტაროს კარტები",
        description: "კარტების კითხვა",
        color: "#6366f1",
        component: TarotCards,
    },
    love: {
        name: "სიყვარულის კალკულატორი",
        description: "თავსებადობის ანალიზი",
        color: "#ec4899",
        component: LoveCalculator,
    },
    dream: {
        name: "სიზმრების ახსნა",
        description: "ფსიქოანალიზი",
        color: "#0ea5e9",
        component: DreamInterpreter,
    },
    horoscope: {
        name: "დღის ჰოროსკოპი",
        description: "ვარსკვლავების პროგნოზი",
        color: "#f59e0b",
        component: Horoscope,
    },
    numerology: {
        name: "ნუმეროლოგია",
        description: "რიცხვების ენერგია",
        color: "#10b981",
        component: Numerology,
    },
    moon: {
        name: "მთვარის ფაზები",
        description: "კოსმიური ენერგია",
        color: "#64748b",
        component: MoonPhases,
    },
    chat: {
        name: "AI მისტიკოსი",
        description: "პირადი მრჩეველი",
        color: "#d946ef",
        component: MysticChat,
    },
}

type ServiceKey = keyof typeof SERVICES

// Cosmic Background Component
function CosmicBackground() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#0d0d20] to-[#0a0a1a]" />
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.15)_0%,transparent_50%)]" />
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(236,72,153,0.12)_0%,transparent_50%)]" />
                <div className="absolute bottom-0 left-1/3 w-full h-full bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
            </div>
            <div className="absolute inset-0"
                style={{
                    backgroundImage: `
                        radial-gradient(1px 1px at 10% 10%, rgba(255,255,255,0.8), transparent),
                        radial-gradient(1px 1px at 20% 50%, rgba(255,255,255,0.6), transparent),
                        radial-gradient(1px 1px at 30% 20%, rgba(255,255,255,0.7), transparent),
                        radial-gradient(1px 1px at 50% 60%, rgba(255,255,255,0.5), transparent),
                        radial-gradient(1px 1px at 70% 30%, rgba(255,255,255,0.6), transparent),
                        radial-gradient(1.5px 1.5px at 15% 70%, rgba(255,255,255,0.9), transparent),
                        radial-gradient(2px 2px at 25% 35%, rgba(168,85,247,0.9), transparent)
                    `,
                    backgroundSize: '350px 350px',
                }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,26,0.4)_70%,rgba(10,10,26,0.8)_100%)]" />
        </div>
    )
}


export default function ServicePage() {
    const params = useParams()
    const serviceKey = params.service as ServiceKey
    const service = SERVICES[serviceKey]

    if (!service) {
        notFound()
    }

    const ServiceComponent = service.component
    const Model3D = SERVICE_3D_MODELS[serviceKey]

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white font-georgian">
            <CosmicBackground />

            <div className="relative z-10">
                {/* Header with back button */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-4 sm:py-6">
                    <Link
                        href="/mystic"
                        className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                                 bg-[#1a1a24] border border-[#2a2a3a]
                                 hover:border-[#3a3a4a] hover:bg-[#1e1e2a]
                                 transition-all duration-200"
                    >
                        <CaretLeft size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                        <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">უკან</span>
                    </Link>
                </div>

                {/* 3D Model Section */}
                <div className="py-8 sm:py-12">
                    <div className="container mx-auto px-4 max-w-4xl">
                        {/* 3D Model */}
                        {Model3D && <Model3D />}

                        {/* Title */}
                        <div className="text-center mt-8 space-y-2">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold 
                                         bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                {service.name}
                            </h1>
                            <p className="text-gray-400">{service.description}</p>
                        </div>
                    </div>
                </div>

                {/* Service Component */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl pb-16">
                    <ServiceComponent />
                </div>
            </div>
        </div>
    )
}

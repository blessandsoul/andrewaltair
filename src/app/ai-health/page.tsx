'use client';

import { AIHealthScore } from '@/components/conversion';
import { TbActivity, TbSeeding, TbSchool, TbBolt, TbRocket } from 'react-icons/tb';

export default function AIHealthPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 text-foreground pt-24 pb-12">
            {/* Decorative background elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-6 shadow-lg">
                        <TbActivity className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 mb-4">
                        AI ჯანმრთელობის ტესტი
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        შეაფასე შენი AI ცოდნა და მზადყოფნა. გაიგე რა დონეზე ხარ და რა უნდა ისწავლო შემდეგ!
                    </p>
                </div>

                {/* AI Health Score Component */}
                <div className="p-6 md:p-8 rounded-3xl border border-border bg-card/50 backdrop-blur-sm shadow-2xl">
                    <AIHealthScore />
                </div>

                {/* Score Levels Info */}
                <div className="mt-12">
                    <h2 className="text-xl font-semibold text-foreground mb-6 text-center">შესაძლო დონეები</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-border bg-gradient-to-r from-red-500/10 to-orange-500/10 hover:border-orange-500/50 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                                    <TbSeeding className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-semibold text-foreground">დამწყები</span>
                            </div>
                            <p className="text-muted-foreground text-sm">AI მოგზაურობა ახლა იწყება</p>
                        </div>
                        <div className="p-4 rounded-xl border border-border bg-gradient-to-r from-yellow-500/10 to-amber-500/10 hover:border-yellow-500/50 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center">
                                    <TbSchool className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-semibold text-foreground">მოსწავლე</span>
                            </div>
                            <p className="text-muted-foreground text-sm">კარგი საფუძველი გაქვს</p>
                        </div>
                        <div className="p-4 rounded-xl border border-border bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:border-blue-500/50 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                    <TbBolt className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-semibold text-foreground">პრაქტიკოსი</span>
                            </div>
                            <p className="text-muted-foreground text-sm">AI აქტიურად იყენებ</p>
                        </div>
                        <div className="p-4 rounded-xl border border-border bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:border-purple-500/50 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                    <TbRocket className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-semibold text-foreground">ექსპერტი</span>
                            </div>
                            <p className="text-muted-foreground text-sm">მზად ხარ AI ლიდერობისთვის</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

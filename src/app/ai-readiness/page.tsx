'use client';

import { AIReadinessAssessment } from '@/components/conversion';
import { TbClipboardCheck, TbDeviceDesktop, TbChartBar, TbUsers, TbCash } from 'react-icons/tb';

export default function AIReadinessPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 text-foreground pt-24 pb-12">
            {/* Decorative background elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 mb-6 shadow-lg">
                        <TbClipboardCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-400 mb-4">
                        AI მზადყოფნის შეფასება
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        შეაფასე შენი კომპანიის მზადყოფნა AI ტექნოლოგიების დანერგვისთვის. გაიგე რა სფეროებში გჭირდება განვითარება!
                    </p>
                </div>

                {/* AI Readiness Assessment Component */}
                <div className="p-6 md:p-8 rounded-3xl border border-border bg-card/50 backdrop-blur-sm shadow-2xl">
                    <AIReadinessAssessment />
                </div>

                {/* Categories Info */}
                <div className="mt-12">
                    <h2 className="text-xl font-semibold text-foreground mb-6 text-center">შეფასების კატეგორიები</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-border bg-card/50 hover:border-blue-500/50 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                    <TbDeviceDesktop className="w-5 h-5 text-blue-500" />
                                </div>
                                <span className="font-semibold text-foreground">ინფრასტრუქტურა</span>
                            </div>
                            <p className="text-muted-foreground text-sm">ციფრული პროცესების მზადყოფნა</p>
                        </div>
                        <div className="p-4 rounded-xl border border-border bg-card/50 hover:border-green-500/50 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                    <TbChartBar className="w-5 h-5 text-green-500" />
                                </div>
                                <span className="font-semibold text-foreground">მონაცემები</span>
                            </div>
                            <p className="text-muted-foreground text-sm">მონაცემთა ბაზების სტრუქტურა</p>
                        </div>
                        <div className="p-4 rounded-xl border border-border bg-card/50 hover:border-purple-500/50 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                    <TbUsers className="w-5 h-5 text-purple-500" />
                                </div>
                                <span className="font-semibold text-foreground">გუნდი</span>
                            </div>
                            <p className="text-muted-foreground text-sm">გუნდის AI ცოდნის დონე</p>
                        </div>
                        <div className="p-4 rounded-xl border border-border bg-card/50 hover:border-yellow-500/50 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                                    <TbCash className="w-5 h-5 text-yellow-500" />
                                </div>
                                <span className="font-semibold text-foreground">ბიუჯეტი</span>
                            </div>
                            <p className="text-muted-foreground text-sm">AI ინვესტიციის შესაძლებლობა</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

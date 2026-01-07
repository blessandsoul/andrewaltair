'use client';

import { MicroLessons } from '@/components/conversion';
import { TbBook, TbTrophy, TbBolt } from 'react-icons/tb';

export default function LessonsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 text-foreground pt-24 pb-12">
            {/* Decorative background elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-6 shadow-lg">
                        <TbBolt className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-400 mb-4">
                        მიკრო-გაკვეთილები
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        2-წუთიანი AI გაკვეთილები სწრაფი სწავლისთვის. დაასრულე გაკვეთილები და მიიღე XP!
                    </p>
                </div>

                {/* Micro Lessons Component */}
                <div className="p-6 md:p-8 rounded-3xl border border-border bg-card/50 backdrop-blur-sm shadow-2xl">
                    <MicroLessons />
                </div>

                {/* Benefits Section */}
                <div className="mt-12 grid md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:border-blue-500/50 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0">
                                <TbBook className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">სწრაფი სწავლება</h3>
                                <p className="text-muted-foreground text-sm">თითოეული გაკვეთილი მხოლოდ 2 წუთს მოითხოვს და მოიცავს კონკრეტულ AI ტექნიკას</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:border-yellow-500/50 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shrink-0">
                                <TbTrophy className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">XP და პროგრესი</h3>
                                <p className="text-muted-foreground text-sm">ყოველ დასრულებულ გაკვეთილზე მიიღებ XP-ს და თვალს ადევნებ პროგრესს</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

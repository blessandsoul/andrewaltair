'use client';

import { MysteryBox } from '@/components/conversion';
import { TbClock, TbCoins, TbTargetArrow, TbGift } from 'react-icons/tb';

export default function MysteryBoxPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 text-foreground pt-24 pb-12">
            {/* Decorative background elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 dark:bg-purple-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/10 dark:bg-pink-600/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-6 shadow-lg">
                        <TbGift className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 mb-4">
                        ყოველდღიური საჩუქარი
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        გახსენი Mystery Box ყოველ 24 საათში და მიიღე AI კრედიტები, ფასდაკლებები და სხვა პრიზები!
                    </p>
                </div>

                {/* Mystery Box Component */}
                <div className="flex justify-center">
                    <div className="p-8 rounded-3xl border border-border bg-card/50 backdrop-blur-sm shadow-2xl">
                        <MysteryBox />
                    </div>
                </div>

                {/* Info Cards */}
                <div className="mt-12 grid md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm text-center hover:border-purple-500/50 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-3">
                            <TbClock className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">24 საათში ერთხელ</h3>
                        <p className="text-muted-foreground text-sm">ყოველ დღე გექნება შანსი ახალი პრიზისთვის</p>
                    </div>
                    <div className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm text-center hover:border-yellow-500/50 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-3">
                            <TbCoins className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">AI კრედიტები</h3>
                        <p className="text-muted-foreground text-sm">მიიღე 50-100 კრედიტი ყოველ გახსნაზე</p>
                    </div>
                    <div className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm text-center hover:border-pink-500/50 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mx-auto mb-3">
                            <TbTargetArrow className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">ექსკლუზიური პრიზები</h3>
                        <p className="text-muted-foreground text-sm">ფასდაკლებები და სპეციალური ბეჯები</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

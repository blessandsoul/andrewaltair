'use client'

import { TbBrandTelegram, TbBrandYoutube, TbArrowRight, TbUsers } from 'react-icons/tb'

export default function SocialSidebarWidget() {
    return (
        <div className="rounded-xl border bg-card p-6 relative overflow-hidden group">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 transition-all group-hover:bg-primary/10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -z-10" />

            <div className="relative z-10 space-y-5">
                <div className="space-y-1">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <TbUsers className="w-5 h-5 text-primary" />
                        შემოუერთდით ჩემს თემს
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        მიიღეთ ექსკლუზიური პრომპტები და სიახლეები პირველმა!
                    </p>
                </div>

                <div className="space-y-3">
                    <a
                        href="https://t.me/andr3waltairchannel"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-background border hover:border-sky-500/50 hover:bg-sky-500/5 transition-all group/item shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-500 group-hover/item:scale-110 transition-transform">
                                <TbBrandTelegram className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm">Telegram არხი</span>
                                <span className="text-[10px] text-muted-foreground">ყოველდღიური სიახლეები</span>
                            </div>
                        </div>
                        <TbArrowRight className="w-4 h-4 text-muted-foreground group-hover/item:translate-x-1 group-hover/item:text-sky-500 transition-all" />
                    </a>

                    <a
                        href="https://www.youtube.com/@AndrewAltair"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-background border hover:border-red-600/50 hover:bg-red-600/5 transition-all group/item shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-lg bg-red-600/10 text-red-600 group-hover/item:scale-110 transition-transform">
                                <TbBrandYoutube className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm">YouTube არხი</span>
                                <span className="text-[10px] text-muted-foreground">ვიდეო გაკვეთილები</span>
                            </div>
                        </div>
                        <TbArrowRight className="w-4 h-4 text-muted-foreground group-hover/item:translate-x-1 group-hover/item:text-red-600 transition-all" />
                    </a>
                </div>
            </div>
        </div>
    )
}

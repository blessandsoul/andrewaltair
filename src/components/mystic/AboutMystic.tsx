import { Star, Wand2, Calculator, Brain } from "lucide-react"

export function AboutMystic() {
    return (
        <section className="relative overflow-hidden py-12 sm:py-16">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />

            <div className="container relative mx-auto px-4 sm:px-6 max-w-4xl">
                <div className="grid gap-8 md:grid-cols-[1fr,2fr] items-center">
                    {/* Profile & Stats */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
                        <div className="relative rounded-2xl bg-[#0a0a12] border border-white/10 p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 p-0.5">
                                    <div className="w-full h-full rounded-full bg-[#0a0a12] flex items-center justify-center">
                                        <span className="text-2xl">🔮</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">Andrew Altair</h3>
                                    <p className="text-sm text-purple-400">AI მისტიკოსი</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                                <div>
                                    <div className="text-2xl font-bold text-white">4+</div>
                                    <div className="text-xs text-gray-500">AI ინსტრუმენტი</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">∞</div>
                                    <div className="text-xs text-gray-500">შესაძლებლობა</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio & Intro */}
                    <div className="space-y-6 text-center md:text-left">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white font-georgian">
                            სადაც <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">ტექნოლოგია</span> ხვდება <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">მაგიას</span>
                        </h2>

                        <p className="text-gray-400 leading-relaxed font-georgian text-base sm:text-lg">
                            მოგესალმებით მისტიკის სამყაროში! მე ვარ Andrew Altair — ტექნოლოგიებისა და უძველესი სიბრძნის
                            გაერთიანების მოყვარული. ჩვენი პლატფორმა იყენებს უახლეს ხელოვნურ ინტელექტს, რათა
                            შემატოს ახალი სიცოცხლე ასტროლოგიას, ნუმეროლოგიასა და ეზოთერიკას.
                        </p>

                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <div className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm flex items-center gap-2">
                                <Wand2 className="w-3.5 h-3.5" />
                                <span>AI მაგია</span>
                            </div>
                            <div className="px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-sm flex items-center gap-2">
                                <Brain className="w-3.5 h-3.5" />
                                <span>ნეირო-ქსელები</span>
                            </div>
                            <div className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm flex items-center gap-2">
                                <Star className="w-3.5 h-3.5" />
                                <span>ასტროლოგია</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

"use client"

import { TbUser, TbAward, TbStar, TbHeart, TbSparkles, TbBrandYoutube, TbBrandInstagram, TbMail } from "react-icons/tb"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AboutMystic() {
    return (
        <div className="relative">
            {/* Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl sm:rounded-3xl blur-xl opacity-20" />

            <div className="relative rounded-2xl sm:rounded-3xl bg-[#12121a] border border-white/10 overflow-hidden">
                {/* Header banner */}
                <div className="h-24 sm:h-32 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#12121a] to-transparent" />
                </div>

                {/* Profile */}
                <div className="px-5 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 relative z-10">
                    <div className="flex items-end gap-4 mb-4">
                        {/* Avatar */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-1 shadow-xl">
                            <div className="w-full h-full rounded-2xl bg-[#12121a] flex items-center justify-center overflow-hidden">
                                <TbUser className="w-10 h-10 sm:w-12 sm:h-12 text-violet-400" />
                            </div>
                        </div>

                        {/* Verified badge */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/20 border border-violet-500/30 mb-2">
                            <TbAward className="w-3.5 h-3.5 text-violet-400" />
                            <span className="text-xs font-medium text-violet-300">ვერიფიცირებული მისტიკოსი</span>
                        </div>
                    </div>

                    {/* Name and title */}
                    <div className="mb-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Andrew Altair</h2>
                        <p className="text-sm sm:text-base text-gray-400">AI მისტიკოსი • ასტროლოგი • ბლოგერი</p>
                    </div>

                    {/* Bio */}
                    <div className="mb-6">
                        <p className="text-sm text-gray-300 leading-relaxed">
                            🔮 მოგესალმებით მისტიკის სამყაროში! მე ვარ Andrew Altair — ტექნოლოგიებისა და უძველესი სიბრძნის
                            გაერთიანების მოყვარული. ვაერთიანებ AI-ს მისტიკურ ინსტრუმენტებთან, რათა შეგიქმნათ
                            უნიკალური გამოცდილება.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <TbSparkles className="w-4 h-4 text-purple-400" />
                            </div>
                            <div className="text-lg sm:text-xl font-bold text-white">50K+</div>
                            <div className="text-[10px] sm:text-xs text-gray-500">წინასწარმეტყველება</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <TbHeart className="w-4 h-4 text-pink-400" />
                            </div>
                            <div className="text-lg sm:text-xl font-bold text-white">10K+</div>
                            <div className="text-[10px] sm:text-xs text-gray-500">მომხმარებელი</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <TbStar className="w-4 h-4 text-amber-400" />
                            </div>
                            <div className="text-lg sm:text-xl font-bold text-white">4.9</div>
                            <div className="text-[10px] sm:text-xs text-gray-500">რეიტინგი</div>
                        </div>
                    </div>

                    {/* Trust badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-xs text-green-400">
                            ✓ 24/7 ხელმისაწვდომი
                        </span>
                        <span className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400">
                            ✓ AI ძალით
                        </span>
                        <span className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-400">
                            ✓ 100% ქართულად
                        </span>
                    </div>

                    {/* Social links */}
                    <div className="flex gap-2 pb-6">
                        <Link href="https://www.youtube.com/@AndrewAltair" target="_blank">
                            <Button variant="outline" size="sm" className="h-9 rounded-xl border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent">
                                <TbBrandYoutube className="w-4 h-4 mr-1.5" />
                                YouTube
                            </Button>
                        </Link>
                        <Link href="https://www.instagram.com/andr3waltair/" target="_blank">
                            <Button variant="outline" size="sm" className="h-9 rounded-xl border-pink-500/30 text-pink-400 hover:bg-pink-500/10 bg-transparent">
                                <TbBrandInstagram className="w-4 h-4 mr-1.5" />
                                Instagram
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button variant="outline" size="sm" className="h-9 rounded-xl border-white/10 text-gray-400 hover:bg-white/5 bg-transparent">
                                <TbMail className="w-4 h-4 mr-1.5" />
                                კონტაქტი
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

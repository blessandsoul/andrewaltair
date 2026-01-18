'use client'

import { useState } from 'react'
import { TbSparkles, TbCopy, TbCheck, TbBrandTelegram, TbBrandFacebook, TbLockOpen, TbLoader2, TbBrandYoutube, TbBrandInstagram, TbBrandTiktok } from 'react-icons/tb'
import { motion, AnimatePresence } from 'framer-motion'

interface PromptUnlockerProps {
    template: string
    isFree: boolean
    price: number
    isUnlocked: boolean
    onUnlock: () => void
}

const SOCIAL_LINKS = [
    {
        id: 'telegram',
        name: 'Telegram',
        icon: TbBrandTelegram,
        url: 'https://t.me/andr3waltairchannel',
        color: 'text-sky-500',
        hoverBorder: 'hover:border-sky-500',
        hoverBg: 'hover:bg-sky-500/5'
    },
    {
        id: 'facebook',
        name: 'Facebook',
        icon: TbBrandFacebook,
        url: 'https://www.facebook.com/andr3waltair',
        color: 'text-blue-600',
        hoverBorder: 'hover:border-blue-600',
        hoverBg: 'hover:bg-blue-600/5'
    },
    {
        id: 'instagram',
        name: 'Instagram',
        icon: TbBrandInstagram,
        url: 'https://www.instagram.com/andr3waltair/',
        color: 'text-pink-600',
        hoverBorder: 'hover:border-pink-600',
        hoverBg: 'hover:bg-pink-600/5'
    },
    {
        id: 'tiktok',
        name: 'TikTok',
        icon: TbBrandTiktok,
        url: 'https://www.tiktok.com/@andrewaltair',
        color: 'text-black dark:text-white',
        hoverBorder: 'hover:border-black dark:hover:border-white',
        hoverBg: 'hover:bg-black/5 dark:hover:bg-white/5'
    },
    {
        id: 'youtube',
        name: 'YouTube',
        icon: TbBrandYoutube,
        url: 'https://www.youtube.com/@AndrewAltair',
        color: 'text-red-600',
        hoverBorder: 'hover:border-red-600',
        hoverBg: 'hover:bg-red-600/5'
    }
]

export default function PromptUnlocker({ template, isFree, price, isUnlocked, onUnlock }: PromptUnlockerProps) {

    const [copied, setCopied] = useState(false)
    const [checkingState, setCheckingState] = useState<'idle' | 'checking' | 'verified'>('idle')
    const [showModal, setShowModal] = useState(false)

    const handleUnlock = (url: string) => {
        // Open link immediately
        window.open(url, '_blank')

        // Start simulated check
        setCheckingState('checking')

        // Simulate API delay for "Verification"
        setTimeout(() => {
            setCheckingState('verified')
            setTimeout(() => {
                onUnlock()
                setShowModal(true) // Show success modal
            }, 800)
        }, 1500)
    }

    const handleCopy = async () => {
        if (!navigator.clipboard) return
        try {
            await navigator.clipboard.writeText(template)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy!', err)
        }
    }

    return (
        <div className="rounded-xl border bg-card p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <TbSparkles className="w-5 h-5 text-primary" />
                    პრომპტის შაბლონი
                </h2>

                <AnimatePresence>
                    {(isFree || price === 0) && isUnlocked && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                            onClick={handleCopy}
                        >
                            {copied ? <TbCheck className="w-4 h-4" /> : <TbCopy className="w-4 h-4" />}
                            {copied ? 'კოპირებულია!' : 'კოპირება'}
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            <div className="relative group rounded-lg transition-all isolation-auto">
                <motion.pre
                    initial={false}
                    animate={{
                        filter: isUnlocked ? 'blur(0px)' : 'blur(12px)', // Increased blur for better contrast
                        opacity: isUnlocked ? 1 : 0.3, // Lower opacity for background text
                    }}
                    transition={{ duration: 0.8 }}
                    className="p-4 rounded-lg bg-muted/50 text-sm overflow-x-auto whitespace-pre-wrap font-mono border min-h-[350px]" // Increased min-height
                >
                    {template}
                </motion.pre>

                {/* Social Unlock Overlay */}
                <AnimatePresence>
                    {isFree && !isUnlocked && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center z-50 p-4" // z-50
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                className="bg-background shadow-2xl border-2 border-primary/10 rounded-2xl p-6 md:p-8 max-w-md w-full space-y-6 text-center text-foreground relative z-50"
                            >
                                <div className="space-y-3">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary transition-all">
                                        {checkingState === 'idle' && <TbLockOpen className="w-8 h-8" />}
                                        {checkingState === 'checking' && <TbLoader2 className="w-8 h-8 animate-spin" />}
                                        {checkingState === 'verified' && <TbCheck className="w-8 h-8 text-green-500" />}
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-xl md:text-2xl">
                                            {checkingState === 'idle' && "პრომპტის გახსნა"}
                                            {checkingState === 'checking' && "მოწმდება..."}
                                            {checkingState === 'verified' && "გაიხსნა!"}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {checkingState === 'idle'
                                                ? "გამოიწერეთ ნებისმიერი არხი პრომპტის გასახსნელად:"
                                                : "მოწმდება გამოწერის სტატუსი..."}
                                        </p>
                                    </div>
                                </div>

                                {checkingState === 'idle' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        {SOCIAL_LINKS.map((link) => (
                                            <button
                                                key={link.id}
                                                onClick={() => handleUnlock(link.url)}
                                                className={`group flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer relative ${link.hoverBorder} ${link.hoverBg} ${link.id === 'youtube' ? 'col-span-2 py-4' : ''}`}
                                            >
                                                <link.icon className={`w-5 h-5 ${link.color} ${link.id === 'youtube' ? 'w-6 h-6' : ''}`} />
                                                <span className={`text-xs font-bold ${link.id === 'youtube' ? 'text-sm' : ''}`}>{link.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Success Modal - Post Unlock */}
                <AnimatePresence>
                    {isUnlocked && showModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-background w-full max-w-sm rounded-2xl p-6 shadow-2xl border text-center relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />

                                <h3 className="text-2xl font-bold mb-2">🎉 გილოცავთ!</h3>
                                <p className="text-muted-foreground mb-6">
                                    პრომპტი წარმატებით გაიხსნა. მეტი უფასო პრომპტებისთვის შემოუერთდით ჩემს არხებს!
                                </p>

                                <div className="space-y-3">
                                    <a
                                        href="https://t.me/andr3waltairchannel"
                                        target="_blank"
                                        className="flex items-center justify-center gap-2 w-full p-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold transition-colors"
                                    >
                                        <TbBrandTelegram className="w-5 h-5" />
                                        Telegram არხი
                                    </a>
                                    <a
                                        href="https://www.facebook.com/groups/promptgeorgia"
                                        target="_blank"
                                        className="flex items-center justify-center gap-2 w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
                                    >
                                        <TbBrandFacebook className="w-5 h-5" />
                                        Facebook ჯგუფი
                                    </a>
                                </div>

                                <button
                                    onClick={() => setShowModal(false)}
                                    className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    დახურვა
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Paid Overlay */}
                {!isFree && price > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-card via-card/80 to-transparent z-40">
                        <div className="text-center p-6 bg-background/80 backdrop-blur-sm rounded-xl border shadow-lg m-4">
                            <p className="font-semibold text-lg">შეიძინეთ სრული პრომპტი</p>
                            <p className="text-sm text-muted-foreground">სრული პრომპტი დამალულია</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

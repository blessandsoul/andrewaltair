'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function VerifyEmailPage() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')

    useEffect(() => {
        if (!token) {
            setStatus('error')
            setMessage('ვერიფიკაციის ტოკენი არ არის მითითებული')
            return
        }

        // Verify email
        fetch('/api/auth/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setStatus('success')
                    setMessage(data.message)
                    
                    // Save token to localStorage
                    if (data.token) {
                        localStorage.setItem('token', data.token)
                    }
                    
                    // Redirect to profile after 3 seconds
                    setTimeout(() => router.push('/profile'), 3000)
                } else {
                    setStatus('error')
                    setMessage(data.error || 'ვერიფიკაცია ვერ მოხერხდა')
                }
            })
            .catch(() => {
                setStatus('error')
                setMessage('ვერიფიკაცია ვერ მოხერხდა. გთხოვთ სცადოთ ხელახლა.')
            })
    }, [token, router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20 shadow-2xl"
            >
                {status === 'loading' && (
                    <>
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full mx-auto mb-6"
                        />
                        <h1 className="text-2xl font-bold text-white mb-2">
                            მიმდინარეობს ვერიფიკაცია...
                        </h1>
                        <p className="text-white/60">
                            გთხოვთ დაელოდოთ
                        </p>
                    </>
                )}
                
                {status === 'success' && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    >
                        <div className="text-6xl mb-4">✅</div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            წარმატებული!
                        </h1>
                        <p className="text-white/80 mb-4">{message}</p>
                        <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            />
                            <span>გადამისამართება პროფილზე...</span>
                        </div>
                    </motion.div>
                )}
                
                {status === 'error' && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    >
                        <div className="text-6xl mb-4">❌</div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            შეცდომა
                        </h1>
                        <p className="text-white/80 mb-6">{message}</p>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={() => router.push('/register')}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl hover:from-purple-700 hover:to-violet-700 transition-all font-medium"
                            >
                                უკან რეგისტრაციაზე
                            </button>
                            <button 
                                onClick={() => router.push('/login')}
                                className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all font-medium border border-white/20"
                            >
                                შესვლა
                            </button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}

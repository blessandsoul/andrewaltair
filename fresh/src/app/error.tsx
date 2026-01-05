'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { TbAlertTriangle, TbRefresh, TbHome } from 'react-icons/tb'
import Link from 'next/link'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application Error:', error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-secondary/30">
            <div className="text-center max-w-md mx-auto space-y-6">
                {/* Error Icon */}
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-destructive/20 rounded-full blur-xl animate-pulse" />
                    <div className="relative w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center border border-destructive/20">
                        <TbAlertTriangle className="w-10 h-10 text-destructive" />
                    </div>
                </div>

                {/* Error Message */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-foreground">
                        რაღაც შეცდომა მოხდა
                    </h1>
                    <p className="text-muted-foreground">
                        სამწუხაროდ, მოულოდნელი შეცდომა დაფიქსირდა. გთხოვთ სცადოთ თავიდან.
                    </p>
                </div>

                {/* Error Details (in development) */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg text-left">
                        <p className="text-xs font-mono text-destructive break-all">
                            {error.message}
                        </p>
                        {error.digest && (
                            <p className="text-xs text-muted-foreground mt-2">
                                Digest: {error.digest}
                            </p>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={reset} className="gap-2">
                        <TbRefresh className="w-4 h-4" />
                        თავიდან ცდა
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/" className="gap-2">
                            <TbHome className="w-4 h-4" />
                            მთავარზე დაბრუნება
                        </Link>
                    </Button>
                </div>

                {/* Support Info */}
                <p className="text-xs text-muted-foreground">
                    თუ პრობლემა გრძელდება, დაგვიკავშირდით{' '}
                    <a href="mailto:andrewaltair@icloud.com" className="text-primary hover:underline">
                        andrewaltair@icloud.com
                    </a>
                </p>
            </div>
        </div>
    )
}

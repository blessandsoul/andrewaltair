'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TbArrowLeft, TbRefresh } from "react-icons/tb"

export default function ToolsError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="text-6xl">🔧</div>
                <h1 className="text-2xl font-bold">ინსტრუმენტის ჩატვირთვა ვერ მოხერხდა</h1>
                <p className="text-muted-foreground">
                    დროებითი შეცდომა მოხდა. სცადეთ თავიდან ან დაბრუნდით ინსტრუმენტებზე.
                </p>
                <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => reset()}>
                        <TbRefresh className="w-4 h-4 mr-2" />
                        თავიდან ცდა
                    </Button>
                    <Button asChild>
                        <Link href="/tools">
                            <TbArrowLeft className="w-4 h-4 mr-2" />
                            ინსტრუმენტებზე დაბრუნება
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

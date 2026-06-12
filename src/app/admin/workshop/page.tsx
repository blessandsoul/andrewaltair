import type { Metadata } from 'next'
import CreateRoomPanel from './CreateRoomPanel'

export const metadata: Metadata = {
    title: 'Workshop Rooms · Admin',
    robots: { index: false, follow: false },
}

export default function AdminWorkshopPage() {
    return (
        <main className="min-h-dvh bg-[#0a0a12] text-white px-8 py-10">
            <div className="max-w-3xl mx-auto space-y-8">
                <header>
                    <h1 className="text-2xl font-bold">Workshop Rooms</h1>
                    <p className="text-white/50 mt-1">
                        Живые комнаты для воркшопов — QR-вход, раунды, голосования
                    </p>
                </header>
                <CreateRoomPanel />
            </div>
        </main>
    )
}

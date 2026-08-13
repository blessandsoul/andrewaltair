import type { Metadata } from 'next'
import CreateRoomPanel from './CreateRoomPanel'

export const metadata: Metadata = {
    title: 'Workshop Rooms · Admin',
    robots: { index: false, follow: false },
}

export default function AdminWorkshopPage() {
    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-foreground">ვორქშოპის ოთახები</h1>
                <p className="text-muted-foreground mt-1">
                    ლაივ-ოთახები: QR-შესვლა, რაუნდები, გამოკითხვები. ეკრანს უზიარებ Meet-ში, მართავ პულტიდან.
                </p>
            </header>
            <CreateRoomPanel />
        </div>
    )
}

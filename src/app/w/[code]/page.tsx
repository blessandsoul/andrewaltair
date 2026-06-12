import type { Metadata } from 'next'
import RoomClient from './RoomClient'

export const metadata: Metadata = {
    title: 'ვორქშოპის ოთახი · Andrew Altair',
    robots: { index: false, follow: false },
}

export default async function WorkshopRoomPage({
    params,
}: {
    params: Promise<{ code: string }>
}) {
    const { code } = await params
    return <RoomClient code={code.toUpperCase()} />
}

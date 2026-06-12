import type { Metadata } from 'next'
import RemoteClient from './RemoteClient'

export const metadata: Metadata = {
    title: 'Workshop · პულტი · Andrew Altair',
    robots: { index: false, follow: false },
}

export default async function WorkshopRemotePage({
    params,
}: {
    params: Promise<{ hostKey: string }>
}) {
    const { hostKey } = await params
    return <RemoteClient hostKey={hostKey} />
}

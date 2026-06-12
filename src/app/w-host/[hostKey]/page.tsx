import type { Metadata } from 'next'
import HostClient from './HostClient'

export const metadata: Metadata = {
    title: 'Workshop Host · Andrew Altair',
    robots: { index: false, follow: false },
}

export default async function WorkshopHostPage({
    params,
}: {
    params: Promise<{ hostKey: string }>
}) {
    const { hostKey } = await params
    return <HostClient hostKey={hostKey} />
}

import type { Metadata } from 'next'
import DisplayClient from './DisplayClient'

export const metadata: Metadata = {
    title: 'Workshop · ეკრანი · Andrew Altair',
    robots: { index: false, follow: false },
}

export default async function WorkshopDisplayPage({
    params,
}: {
    params: Promise<{ hostKey: string }>
}) {
    const { hostKey } = await params
    return <DisplayClient hostKey={hostKey} />
}

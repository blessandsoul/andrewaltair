import type { Metadata } from 'next'
import PhonePublisher from '@/app/workshop/_video/PhonePublisher'

export const metadata: Metadata = { robots: { index: false, follow: false } }

// Mobile camera page reached by scanning the QR on the host pult. Publishes the phone's
// camera straight into the workshop LiveKit room as the broadcast source.
export default async function PhoneCamPage({ params }: { params: Promise<{ hostKey: string }> }) {
    const { hostKey } = await params
    return <PhonePublisher hostKey={hostKey} />
}

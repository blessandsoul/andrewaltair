"use client"

import * as React from "react"
import { TbCertificate, TbDownload, TbShare, TbCalendar, TbBook, TbCheck } from "react-icons/tb"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Certificate {
    _id: string
    sectionTitle: string
    userName: string
    certificateId: string
    articlesCompleted: number
    totalArticles: number
    completedAt: string
}

interface CertificateCardProps {
    certificate: Certificate
}

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString("ka-GE", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}

export function CertificateCard({ certificate }: CertificateCardProps) {
    const handleDownload = () => {
        // Create a simple certificate as downloadable content
        const content = `
═══════════════════════════════════════════════════
                     CERTIFICATE
            სერტიფიკატი დასრულების შესახებ
═══════════════════════════════════════════════════

This is to certify that / ეს სერტიფიკატი ადასტურებს რომ

                    ${certificate.userName}

has successfully completed / წარმატებით დაასრულა

                 ${certificate.sectionTitle}

Articles completed / სტატიები: ${certificate.articlesCompleted}/${certificate.totalArticles}
Date / თარიღი: ${formatDate(certificate.completedAt)}
Certificate ID: ${certificate.certificateId}

═══════════════════════════════════════════════════
                 andrewaltair.ge
═══════════════════════════════════════════════════
        `
        const blob = new Blob([content], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `certificate-${certificate.certificateId}.txt`
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: `სერტიფიკატი - ${certificate.sectionTitle}`,
                text: `მე დავასრულე "${certificate.sectionTitle}" კურსი andrewaltair.ge-ზე!`,
                url: `https://andrewaltair.ge/encyclopedia/certificate/${certificate.certificateId}`,
            })
        } else {
            navigator.clipboard.writeText(
                `მე დავასრულე "${certificate.sectionTitle}" კურსი andrewaltair.ge-ზე! 🎉`
            )
            alert("ლინკი დაკოპირებულია!")
        }
    }

    return (
        <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-amber-500/10 via-transparent to-purple-500/10 p-6">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-500/50" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-500/50" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-500/50" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-500/50" />

            <div className="text-center space-y-4">
                <TbCertificate className="w-16 h-16 mx-auto text-amber-500" />

                <div>
                    <Badge variant="outline" className="mb-2 text-amber-500 border-amber-500/50">
                        სერტიფიკატი
                    </Badge>
                    <h3 className="text-2xl font-bold">{certificate.sectionTitle}</h3>
                </div>

                <p className="text-lg">{certificate.userName}</p>

                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <TbBook className="w-4 h-4" />
                        {certificate.articlesCompleted}/{certificate.totalArticles} სტატია
                    </span>
                    <span className="flex items-center gap-1">
                        <TbCalendar className="w-4 h-4" />
                        {formatDate(certificate.completedAt)}
                    </span>
                </div>

                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <TbCheck className="w-4 h-4 text-green-500" />
                    ID: {certificate.certificateId}
                </div>

                <div className="flex items-center justify-center gap-2 pt-4">
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                        <TbDownload className="w-4 h-4 mr-2" />
                        ჩამოტვირთვა
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                        <TbShare className="w-4 h-4 mr-2" />
                        გაზიარება
                    </Button>
                </div>
            </div>
        </div>
    )
}

interface CertificateListProps {
    visitorId?: string
    userId?: string
}

export function CertificateList({ visitorId, userId }: CertificateListProps) {
    const [certificates, setCertificates] = React.useState<Certificate[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        async function fetchCertificates() {
            try {
                const params = userId ? `userId=${userId}` : `visitorId=${visitorId}`
                const res = await fetch(`/api/encyclopedia/certificates?${params}`)
                if (res.ok) {
                    const data = await res.json()
                    setCertificates(data.certificates || [])
                }
            } catch (error) {
                console.error("Error fetching certificates:", error)
            } finally {
                setIsLoading(false)
            }
        }
        if (visitorId || userId) {
            fetchCertificates()
        }
    }, [visitorId, userId])

    if (isLoading) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            </div>
        )
    }

    if (certificates.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <TbCertificate className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>ჯერ არ გაქვს სერტიფიკატი</p>
                <p className="text-sm mt-1">დაასრულე სექცია სერტიფიკატის მისაღებად!</p>
            </div>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {certificates.map((cert) => (
                <CertificateCard key={cert._id} certificate={cert} />
            ))}
        </div>
    )
}

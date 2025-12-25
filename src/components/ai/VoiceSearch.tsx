"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Mic, MicOff, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VoiceSearchProps {
    onSearch: (query: string) => void
    className?: string
    placeholder?: string
}

export function VoiceSearch({
    onSearch,
    className,
    placeholder = "თქვი საძიებო ფრაზა...",
}: VoiceSearchProps) {
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [isSupported, setIsSupported] = useState(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null)

    useEffect(() => {
        // Check for browser support using any to avoid TypeScript issues with Web Speech API
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

        if (!SpeechRecognitionAPI) {
            setIsSupported(false)
            return
        }

        const recognition = new SpeechRecognitionAPI()
        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = "ka-GE" // Georgian

        recognition.onstart = () => {
            setIsListening(true)
            setError(null)
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
            const current = event.resultIndex
            const result = event.results[current]
            const text = result[0].transcript

            setTranscript(text)

            if (result.isFinal) {
                onSearch(text)
                setIsListening(false)
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onerror = (event: any) => {
            setError(event.error === "no-speech" ? "ხმა არ მოისმინა" : "შეცდომა მოხდა")
            setIsListening(false)
        }

        recognition.onend = () => {
            setIsListening(false)
        }

        recognitionRef.current = recognition

        return () => {
            recognition.stop()
        }
    }, [onSearch])

    const toggleListening = () => {
        if (!recognitionRef.current) return

        if (isListening) {
            recognitionRef.current.stop()
        } else {
            setTranscript("")
            recognitionRef.current.start()
        }
    }

    if (!isSupported) {
        return null
    }

    return (
        <div className={cn("relative", className)}>
            <Button
                variant={isListening ? "default" : "outline"}
                size="icon"
                onClick={toggleListening}
                className={cn(
                    "transition-all",
                    isListening && "bg-red-500 hover:bg-red-600 animate-pulse"
                )}
            >
                {isListening ? (
                    <MicOff className="h-4 w-4" />
                ) : (
                    <Mic className="h-4 w-4" />
                )}
            </Button>

            {/* Listening modal */}
            {isListening && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={toggleListening}
                    />
                    <div className="relative bg-card rounded-2xl p-8 shadow-2xl max-w-md w-full text-center animate-in zoom-in-95">
                        {/* Sound waves animation */}
                        <div className="relative mx-auto w-24 h-24 mb-6">
                            <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                            <div className="absolute inset-2 rounded-full bg-red-500/30 animate-ping" style={{ animationDelay: "100ms" }} />
                            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                                <Mic className="h-10 w-10 text-white" />
                            </div>
                        </div>

                        <h3 className="text-lg font-bold mb-2">{placeholder}</h3>

                        {transcript ? (
                            <p className="text-muted-foreground">&quot;{transcript}&quot;</p>
                        ) : (
                            <p className="text-muted-foreground animate-pulse">მოსმენა...</p>
                        )}

                        <Button
                            variant="ghost"
                            className="mt-6"
                            onClick={toggleListening}
                        >
                            გაუქმება
                        </Button>
                    </div>
                </div>
            )}

            {/* Error toast */}
            {error && (
                <div className="absolute top-full mt-2 right-0 bg-destructive text-destructive-foreground text-sm rounded-lg px-3 py-2 animate-in slide-in-from-top-2">
                    {error}
                </div>
            )}
        </div>
    )
}

// Inline voice search with input
export function VoiceSearchInput({
    onSearch,
    className,
}: {
    onSearch: (query: string) => void
    className?: string
}) {
    const [query, setQuery] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            onSearch(query)
        }
    }

    const handleVoiceResult = useCallback((text: string) => {
        setQuery(text)
        onSearch(text)
    }, [onSearch])

    return (
        <form onSubmit={handleSubmit} className={cn("relative flex gap-2", className)}>
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="ძიება..."
                    className="w-full h-10 pl-9 pr-4 rounded-lg border bg-background focus:ring-2 focus:ring-primary"
                />
            </div>
            <VoiceSearch onSearch={handleVoiceResult} />
            <Button type="submit">
                <Search className="h-4 w-4" />
            </Button>
        </form>
    )
}

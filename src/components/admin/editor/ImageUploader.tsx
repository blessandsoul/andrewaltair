"use client"

import * as React from "react"
import { TbUpload, TbPhoto, TbX, TbCheck, TbLoader2 } from "react-icons/tb"

interface ImageUploaderProps {
    onImageInsert: (url: string) => void
    isOpen: boolean
    onClose: () => void
}

export function ImageUploader({ onImageInsert, isOpen, onClose }: ImageUploaderProps) {
    const [isDragging, setIsDragging] = React.useState(false)
    const [uploading, setUploading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [urlInput, setUrlInput] = React.useState("")
    const [mode, setMode] = React.useState<"upload" | "url">("upload")
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const files = e.dataTransfer.files
        if (files.length > 0) {
            await uploadFile(files[0])
        }
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            await uploadFile(files[0])
        }
    }

    const uploadFile = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("გთხოვთ აირჩიეთ სურათი")
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("ფაილი ზედმეტად დიდია (მაქს. 5MB)")
            return
        }

        setUploading(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append("file", file)

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                throw new Error("ატვირთვა ვერ მოხერხდა")
            }

            const data = await response.json()
            onImageInsert(data.url)
            onClose()
        } catch (err) {
            setError(err instanceof Error ? err.message : "შეცდომა")
        } finally {
            setUploading(false)
        }
    }

    const handleUrlInsert = () => {
        if (urlInput.trim()) {
            onImageInsert(urlInput.trim())
            setUrlInput("")
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background border rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <TbPhoto className="w-5 h-5 text-indigo-500" />
                        <h3 className="font-semibold">სურათის დამატება</h3>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <TbX className="w-5 h-5" />
                    </button>
                </div>

                {/* Mode toggle */}
                <div className="flex border-b">
                    <button
                        onClick={() => setMode("upload")}
                        className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === "upload" ? "bg-muted border-b-2 border-indigo-500" : ""
                            }`}
                    >
                        ატვირთვა
                    </button>
                    <button
                        onClick={() => setMode("url")}
                        className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === "url" ? "bg-muted border-b-2 border-indigo-500" : ""
                            }`}
                    >
                        URL
                    </button>
                </div>

                {/* Upload mode */}
                {mode === "upload" && (
                    <div className="p-4">
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging
                                    ? "border-indigo-500 bg-indigo-500/10"
                                    : "border-muted-foreground/30 hover:border-indigo-500/50"
                                }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            {uploading ? (
                                <div className="flex flex-col items-center">
                                    <TbLoader2 className="w-10 h-10 text-indigo-500 animate-spin mb-2" />
                                    <p className="text-sm text-muted-foreground">იტვირთება...</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <TbUpload className="w-10 h-10 text-muted-foreground mb-2" />
                                    <p className="text-sm">
                                        <span className="text-indigo-500 font-medium">აირჩიეთ ფაილი</span>
                                        <span className="text-muted-foreground"> ან ჩააგდეთ აქ</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF (მაქს. 5MB)</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* URL mode */}
                {mode === "url" && (
                    <div className="p-4 space-y-3">
                        <input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleUrlInsert()}
                            className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            onClick={handleUrlInsert}
                            disabled={!urlInput.trim()}
                            className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <TbCheck className="w-4 h-4" />
                            ჩასმა
                        </button>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="px-4 pb-4">
                        <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500 text-center">
                            {error}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ImageUploader

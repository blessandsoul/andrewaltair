"use client"

import * as React from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

interface ToastProps {
    id: string
    type: "success" | "error" | "info" | "warning"
    title: string
    message?: string
    duration?: number
    onClose: (id: string) => void
}

function Toast({ id, type, title, message, onClose }: ToastProps) {
    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
        warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    }

    const bgColors = {
        success: "bg-green-500/10 border-green-500/20",
        error: "bg-red-500/10 border-red-500/20",
        info: "bg-blue-500/10 border-blue-500/20",
        warning: "bg-yellow-500/10 border-yellow-500/20",
    }

    return (
        <div
            className={`flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm shadow-lg animate-in slide-in-from-right-5 ${bgColors[type]}`}
        >
            {icons[type]}
            <div className="flex-1">
                <p className="font-medium text-foreground">{title}</p>
                {message && (
                    <p className="text-sm text-muted-foreground mt-1">{message}</p>
                )}
            </div>
            <button
                onClick={() => onClose(id)}
                className="p-1 rounded-md hover:bg-secondary transition-colors"
            >
                <X className="w-4 h-4 text-muted-foreground" />
            </button>
        </div>
    )
}

interface ToastItem {
    id: string
    type: "success" | "error" | "info" | "warning"
    title: string
    message?: string
    duration?: number
}

interface ToastContextType {
    toasts: ToastItem[]
    addToast: (toast: Omit<ToastItem, "id">) => void
    removeToast: (id: string) => void
    success: (title: string, message?: string) => void
    error: (title: string, message?: string) => void
    info: (title: string, message?: string) => void
    warning: (title: string, message?: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<ToastItem[]>([])

    const addToast = React.useCallback((toast: Omit<ToastItem, "id">) => {
        const id = Math.random().toString(36).substring(7)
        const newToast: ToastItem = { ...toast, id }

        setToasts(prev => [...prev, newToast])

        // Auto remove after duration
        const duration = toast.duration || 5000
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, duration)
    }, [])

    const removeToast = React.useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    const success = React.useCallback((title: string, message?: string) => {
        addToast({ type: "success", title, message })
    }, [addToast])

    const error = React.useCallback((title: string, message?: string) => {
        addToast({ type: "error", title, message })
    }, [addToast])

    const info = React.useCallback((title: string, message?: string) => {
        addToast({ type: "info", title, message })
    }, [addToast])

    const warning = React.useCallback((title: string, message?: string) => {
        addToast({ type: "warning", title, message })
    }, [addToast])

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info, warning }}>
            {children}
            {/* Toast container */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        {...toast}
                        onClose={removeToast}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = React.useContext(ToastContext)
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}

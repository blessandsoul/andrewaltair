'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { TbAlertTriangle, TbTrash, TbX } from "react-icons/tb"

interface ConfirmDialogState {
    isOpen: boolean
    title: string
    message: string
    confirmText: string
    cancelText: string
    variant: 'danger' | 'warning' | 'default'
    onConfirm: () => void
    onCancel: () => void
}

interface ConfirmDialogContextType {
    confirm: (options: {
        title: string
        message: string
        confirmText?: string
        cancelText?: string
        variant?: 'danger' | 'warning' | 'default'
    }) => Promise<boolean>
}

const ConfirmDialogContext = React.createContext<ConfirmDialogContextType | undefined>(undefined)

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = React.useState(false)
    const [state, setState] = React.useState<ConfirmDialogState>({
        isOpen: false,
        title: '',
        message: '',
        confirmText: 'დადასტურება',
        cancelText: 'გაუქმება',
        variant: 'default',
        onConfirm: () => { },
        onCancel: () => { }
    })

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const confirm = React.useCallback((options: {
        title: string
        message: string
        confirmText?: string
        cancelText?: string
        variant?: 'danger' | 'warning' | 'default'
    }): Promise<boolean> => {
        return new Promise((resolve) => {
            setState({
                isOpen: true,
                title: options.title,
                message: options.message,
                confirmText: options.confirmText || 'დადასტურება',
                cancelText: options.cancelText || 'გაუქმება',
                variant: options.variant || 'default',
                onConfirm: () => {
                    setState(prev => ({ ...prev, isOpen: false }))
                    resolve(true)
                },
                onCancel: () => {
                    setState(prev => ({ ...prev, isOpen: false }))
                    resolve(false)
                }
            })
        })
    }, [])

    const variantStyles = {
        danger: {
            icon: <TbTrash className="w-6 h-6 text-red-500" />,
            iconBg: 'bg-red-500/10',
            confirmBtn: 'bg-red-500 hover:bg-red-600 text-white'
        },
        warning: {
            icon: <TbAlertTriangle className="w-6 h-6 text-yellow-500" />,
            iconBg: 'bg-yellow-500/10',
            confirmBtn: 'bg-yellow-500 hover:bg-yellow-600 text-white'
        },
        default: {
            icon: <TbAlertTriangle className="w-6 h-6 text-primary" />,
            iconBg: 'bg-primary/10',
            confirmBtn: 'bg-primary hover:bg-primary/90 text-white'
        }
    }

    const currentStyle = variantStyles[state.variant]

    const dialog = state.isOpen && mounted && createPortal(
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm animate-in fade-in-0"
                onClick={state.onCancel}
            />

            {/* Dialog */}
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-2xl border-2 animate-in zoom-in-95 fade-in-0 duration-200">
                    <CardHeader className="relative pb-2">
                        <button
                            onClick={state.onCancel}
                            className="absolute top-4 right-4 p-1 rounded-md hover:bg-secondary transition-colors"
                        >
                            <TbX className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full ${currentStyle.iconBg} flex items-center justify-center`}>
                                {currentStyle.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">{state.title}</h3>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <p className="text-muted-foreground">{state.message}</p>
                    </CardContent>
                    <CardFooter className="flex gap-3 pt-4 pb-6">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={state.onCancel}
                        >
                            {state.cancelText}
                        </Button>
                        <Button
                            className={`flex-1 ${currentStyle.confirmBtn}`}
                            onClick={state.onConfirm}
                        >
                            {state.confirmText}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>,
        document.body
    )

    return (
        <ConfirmDialogContext.Provider value={{ confirm }}>
            {children}
            {dialog}
        </ConfirmDialogContext.Provider>
    )
}

export function useConfirm() {
    const context = React.useContext(ConfirmDialogContext)
    if (context === undefined) {
        throw new Error('useConfirm must be used within a ConfirmDialogProvider')
    }
    return context.confirm
}

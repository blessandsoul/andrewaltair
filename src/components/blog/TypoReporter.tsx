"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { TbAlertCircle, TbCheck } from "react-icons/tb"
import { toast } from "sonner"

export function TypoReporter() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [selection, setSelection] = React.useState("")
    const [comment, setComment] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl + Enter to report
            if (e.ctrlKey && e.key === 'Enter') {
                const text = window.getSelection()?.toString().trim()
                if (text) {
                    setSelection(text)
                    setIsOpen(true)
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])

    const handleSubmit = async () => {
        setIsSubmitting(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        toast.success("მადლობა! შეცდომა რეპორტებულია.", {
            description: "ჩვენ მალე გავასწორებთ ხარვეზს."
        })

        setIsSubmitting(false)
        setIsOpen(false)
        setComment("")
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <TbAlertCircle className="w-5 h-5 text-orange-500" />
                        შეცდომის რეპორტი
                    </DialogTitle>
                    <DialogDescription>
                        იპოვეთ შეცდომა? მოგვწერეთ და ჩვენ გავასწორებთ.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">მონიშნული ტექსტი</label>
                        <div className="p-3 bg-muted/50 rounded-lg border border-border text-sm italic relative">
                            "{selection}"
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-l-lg" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">კომენტარი (არასავალდებულო)</label>
                        <Textarea
                            placeholder="სწორი ვერსია ან კომენტარი..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="resize-none"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>გაუქმება</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <span className="animate-spin mr-2">⏳</span>
                        ) : (
                            <TbCheck className="w-4 h-4 mr-2" />
                        )}
                        გაგზავნა
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function TypoHint() {
    return (
        <div className="text-xs text-muted-foreground/50 text-center mt-8 pb-4">
            დაინახეთ შეცდომა? მონიშნეთ და დააჭირეთ <kbd className="px-1 py-0.5 bg-muted rounded border border-border font-mono text-[10px]">Ctrl+Enter</kbd>
        </div>
    )
}

"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { TbScript } from "react-icons/tb"

interface TranscriptAccordionProps {
    text: string
    title?: string
}

export function TranscriptAccordion({ text, title = "Video Transcript" }: TranscriptAccordionProps) {
    return (
        <div className="my-8 border rounded-xl overflow-hidden bg-background/50 backdrop-blur-sm">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="transcript" className="border-0">
                    <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 hover:no-underline transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <TbScript className="w-5 h-5" />
                            </div>
                            <span className="font-semibold text-foreground">{title}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 pt-2">
                        <div className="prose prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
                            {text}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

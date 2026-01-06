"use client"

import { useState, useRef, useEffect } from "react"
import { TbCheck, TbCopy, TbTerminal } from "react-icons/tb"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
    code: string
    language?: string
    filename?: string
    showLineNumbers?: boolean
    className?: string
}

export function CodeBlock({
    code,
    language = "text",
    filename,
    showLineNumbers = false,
    className = ""
}: CodeBlockProps) {
    const [copied, setCopied] = useState(false)
    const codeRef = useRef<HTMLPreElement>(null)

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    const lines = code.split("\n")

    return (
        <div className={cn("relative group rounded-xl overflow-hidden border border-border bg-card", className)}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
                <div className="flex items-center gap-2">
                    <TbTerminal className="w-4 h-4 text-muted-foreground" />
                    {filename ? (
                        <span className="text-sm font-mono text-foreground">{filename}</span>
                    ) : (
                        <span className="text-xs font-medium text-muted-foreground uppercase">{language}</span>
                    )}
                </div>
                <button
                    onClick={copyToClipboard}
                    className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200",
                        copied
                            ? "bg-green-500/20 text-green-500"
                            : "bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground"
                    )}
                >
                    {copied ? (
                        <>
                            <TbCheck className="w-3.5 h-3.5" />
                            კოპირებულია!
                        </>
                    ) : (
                        <>
                            <TbCopy className="w-3.5 h-3.5" />
                            კოპირება
                        </>
                    )}
                </button>
            </div>

            {/* TbCode content */}
            <div className="overflow-x-auto">
                <pre
                    ref={codeRef}
                    className="p-4 text-sm font-mono leading-relaxed"
                >
                    {showLineNumbers ? (
                        <code className="flex flex-col">
                            {lines.map((line, i) => (
                                <span key={i} className="flex">
                                    <span className="select-none w-8 text-muted-foreground/50 text-right pr-4">
                                        {i + 1}
                                    </span>
                                    <span className="text-foreground">{line || " "}</span>
                                </span>
                            ))}
                        </code>
                    ) : (
                        <code className="text-foreground">{code}</code>
                    )}
                </pre>
            </div>
        </div>
    )
}

// Wrapper component for rendering HTML content with enhanced code blocks
export function EnhancedContent({
    html,
    className = ""
}: {
    html: string
    className?: string
}) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current) return

        // Find all pre > code elements and add copy buttons
        const codeBlocks = containerRef.current.querySelectorAll("pre code")

        codeBlocks.forEach((codeBlock) => {
            const pre = codeBlock.parentElement as HTMLPreElement
            if (!pre || pre.dataset.enhanced) return

            pre.dataset.enhanced = "true"
            pre.classList.add("relative", "group")

            // Create copy button
            const button = document.createElement("button")
            button.className = "absolute top-2 right-2 p-2 rounded-md bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-all duration-200"
            button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`

            button.onclick = async () => {
                const code = codeBlock.textContent || ""
                await navigator.clipboard.writeText(code)
                button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`
                button.classList.add("text-green-500")
                setTimeout(() => {
                    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`
                    button.classList.remove("text-green-500")
                }, 2000)
            }

            pre.appendChild(button)
        })
    }, [html])

    return (
        <div
            ref={containerRef}
            className={className}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    )
}

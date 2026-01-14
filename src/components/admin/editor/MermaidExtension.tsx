"use client"

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import type { NodeViewProps } from '@tiptap/react'
import * as React from 'react'
import mermaid from 'mermaid'
import { TbRefresh, TbMaximize, TbMinimize } from 'react-icons/tb'

// Initialize Mermaid
if (typeof window !== 'undefined') {
    mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral',
        securityLevel: 'loose',
        fontFamily: 'inherit',
    })
}

// Mermaid Diagram Component
function MermaidComponent({ node, updateAttributes }: NodeViewProps) {
    const code = (node.attrs.code || '') as string
    const [svg, setSvg] = React.useState<string>('')
    const [error, setError] = React.useState<string>('')
    const [isEditing, setIsEditing] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)

    const renderDiagram = React.useCallback(async () => {
        if (!code.trim()) {
            setSvg('')
            setError('')
            return
        }

        try {
            const id = `mermaid-${Date.now()}`
            const { svg: renderedSvg } = await mermaid.render(id, code)
            setSvg(renderedSvg)
            setError('')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'დიაგრამის რენდერი ვერ მოხერხდა')
            setSvg('')
        }
    }, [code])

    React.useEffect(() => {
        const timer = setTimeout(() => {
            renderDiagram()
        }, 500)
        return () => clearTimeout(timer)
    }, [code, renderDiagram])

    const exampleCode = `graph TD
    A[დაწყება] --> B{გადაწყვეტილება}
    B -->|დიახ| C[შედეგი 1]
    B -->|არა| D[შედეგი 2]
    C --> E[დასასრული]
    D --> E`

    return (
        <NodeViewWrapper className="my-4" contentEditable={false}>
            <div className="border rounded-lg overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-2 bg-muted/30 border-b">
                    <span className="text-sm font-medium flex items-center gap-2">
                        📊 Mermaid დიაგრამა
                    </span>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="p-1 rounded hover:bg-muted"
                            title={isEditing ? 'შეკუმშვა' : 'გაფართოვება'}
                        >
                            {isEditing ? <TbMinimize className="w-4 h-4" /> : <TbMaximize className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={renderDiagram}
                            className="p-1 rounded hover:bg-muted"
                            title="განახლება"
                        >
                            <TbRefresh className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Editor / Preview */}
                <div className={isEditing ? 'grid grid-cols-2' : ''}>
                    {/* Code Editor */}
                    {isEditing && (
                        <div className="border-r">
                            <textarea
                                value={code}
                                onChange={(e) => updateAttributes({ code: e.target.value })}
                                placeholder={exampleCode}
                                className="w-full h-64 p-3 font-mono text-sm bg-muted/10 resize-none outline-none"
                            />
                        </div>
                    )}

                    {/* Preview */}
                    <div
                        ref={containerRef}
                        className={`p-4 min-h-[200px] flex items-center justify-center bg-white dark:bg-zinc-900 ${isEditing ? '' : 'cursor-pointer'}`}
                        onClick={() => !isEditing && setIsEditing(true)}
                    >
                        {error ? (
                            <div className="text-red-500 text-sm text-center">
                                <p className="font-medium mb-1">შეცდომა</p>
                                <p className="text-xs opacity-70">{error}</p>
                            </div>
                        ) : svg ? (
                            <div
                                dangerouslySetInnerHTML={{ __html: svg }}
                                className="mermaid-svg max-w-full overflow-x-auto [&_svg]:max-w-full"
                            />
                        ) : (
                            <div className="text-muted-foreground text-sm text-center">
                                <p>დააწკაპეთ კოდის დასამატებლად</p>
                                <p className="text-xs mt-1 opacity-50">Flowchart, Sequence, Class, State, ER diagrams</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick templates */}
                {!code && (
                    <div className="p-2 border-t bg-muted/20">
                        <div className="text-xs text-muted-foreground mb-2">შაბლონები:</div>
                        <div className="flex flex-wrap gap-1">
                            {[
                                { name: 'Flowchart', code: 'graph TD\n    A[დაწყება] --> B{პირობა}\n    B -->|დიახ| C[მოქმედება]\n    B -->|არა| D[სხვა]\n    C --> E[დასასრული]\n    D --> E' },
                                { name: 'Sequence', code: 'sequenceDiagram\n    participant A as მომხმარებელი\n    participant B as სერვერი\n    A->>B: მოთხოვნა\n    B-->>A: პასუხი' },
                                { name: 'Pie', code: 'pie title განაწილება\n    "კატეგორია A" : 40\n    "კატეგორია B" : 35\n    "კატეგორია C" : 25' },
                            ].map((template) => (
                                <button
                                    key={template.name}
                                    onClick={() => updateAttributes({ code: template.code })}
                                    className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded"
                                >
                                    {template.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    )
}

// Mermaid Extension
export const MermaidDiagram = Node.create({
    name: 'mermaidDiagram',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            code: {
                default: '',
                parseHTML: (element: Element) => element.getAttribute('data-code'),
                renderHTML: (attributes: Record<string, unknown>) => ({ 'data-code': attributes.code }),
            },
        }
    },

    parseHTML() {
        return [{ tag: 'div[data-mermaid]' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-mermaid': '' })]
    },

    addNodeView() {
        return ReactNodeViewRenderer(MermaidComponent)
    },
})

export default MermaidDiagram

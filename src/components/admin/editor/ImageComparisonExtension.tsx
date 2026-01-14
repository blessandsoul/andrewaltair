"use client"

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import * as React from 'react'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { TbPhoto } from 'react-icons/tb'

// Image Comparison Component
function ImageComparisonComponent({ node, updateAttributes }: {
    node: { attrs: { beforeImage: string; afterImage: string; beforeLabel: string; afterLabel: string } }
    updateAttributes: (attrs: Partial<typeof node.attrs>) => void
}) {
    const { beforeImage, afterImage, beforeLabel, afterLabel } = node.attrs

    return (
        <NodeViewWrapper className="my-4" contentEditable={false}>
            <div className="border rounded-lg overflow-hidden">
                {/* Controls */}
                <div className="flex gap-4 p-3 bg-muted/30 border-b">
                    <div className="flex-1">
                        <label className="text-xs text-muted-foreground block mb-1">მანამდე:</label>
                        <input
                            type="url"
                            value={beforeImage}
                            onChange={(e) => updateAttributes({ beforeImage: e.target.value })}
                            placeholder="სურათის URL..."
                            className="w-full px-2 py-1 text-sm border rounded bg-background"
                        />
                        <input
                            type="text"
                            value={beforeLabel}
                            onChange={(e) => updateAttributes({ beforeLabel: e.target.value })}
                            placeholder="ლეიბლი..."
                            className="w-full px-2 py-1 text-xs border rounded bg-background mt-1"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-muted-foreground block mb-1">შემდეგ:</label>
                        <input
                            type="url"
                            value={afterImage}
                            onChange={(e) => updateAttributes({ afterImage: e.target.value })}
                            placeholder="სურათის URL..."
                            className="w-full px-2 py-1 text-sm border rounded bg-background"
                        />
                        <input
                            type="text"
                            value={afterLabel}
                            onChange={(e) => updateAttributes({ afterLabel: e.target.value })}
                            placeholder="ლეიბლი..."
                            className="w-full px-2 py-1 text-xs border rounded bg-background mt-1"
                        />
                    </div>
                </div>

                {/* Slider */}
                <div className="aspect-video">
                    {beforeImage && afterImage ? (
                        <ReactCompareSlider
                            itemOne={<ReactCompareSliderImage src={beforeImage} alt={beforeLabel} />}
                            itemTwo={<ReactCompareSliderImage src={afterImage} alt={afterLabel} />}
                            className="w-full h-full"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground gap-2">
                            <TbPhoto className="w-8 h-8" />
                            <span>დაამატეთ ორივე სურათი</span>
                        </div>
                    )}
                </div>

                {/* Labels overlay */}
                {beforeImage && afterImage && (beforeLabel || afterLabel) && (
                    <div className="absolute inset-x-0 bottom-4 flex justify-between px-4 pointer-events-none">
                        {beforeLabel && (
                            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                                {beforeLabel}
                            </span>
                        )}
                        {afterLabel && (
                            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                                {afterLabel}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    )
}

// Image Comparison Extension
export const ImageComparison = Node.create({
    name: 'imageComparison',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            beforeImage: {
                default: '',
                parseHTML: element => element.getAttribute('data-before'),
                renderHTML: attributes => ({ 'data-before': attributes.beforeImage }),
            },
            afterImage: {
                default: '',
                parseHTML: element => element.getAttribute('data-after'),
                renderHTML: attributes => ({ 'data-after': attributes.afterImage }),
            },
            beforeLabel: {
                default: 'მანამდე',
                parseHTML: element => element.getAttribute('data-before-label'),
                renderHTML: attributes => ({ 'data-before-label': attributes.beforeLabel }),
            },
            afterLabel: {
                default: 'შემდეგ',
                parseHTML: element => element.getAttribute('data-after-label'),
                renderHTML: attributes => ({ 'data-after-label': attributes.afterLabel }),
            },
        }
    },

    parseHTML() {
        return [{ tag: 'div[data-image-comparison]' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-image-comparison': '' })]
    },

    addNodeView() {
        return ReactNodeViewRenderer(ImageComparisonComponent)
    },

    addCommands() {
        return {
            insertImageComparison: () => ({ commands }) => {
                return commands.insertContent({ type: this.name })
            },
        }
    },
})

export default ImageComparison

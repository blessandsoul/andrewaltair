import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import * as React from 'react'
import { TbChevronDown, TbChevronRight } from 'react-icons/tb'

// Accordion Item Component
function AccordionItemComponent(props: any) {
    const { node, updateAttributes } = props
    const { title, isOpen } = node.attrs

    return (
        <NodeViewWrapper className="my-2">
            <div className="border rounded-lg overflow-hidden">
                <button
                    onClick={() => updateAttributes({ isOpen: !isOpen })}
                    className="w-full flex items-center gap-2 p-3 bg-muted/50 hover:bg-muted transition-colors text-left font-medium"
                    contentEditable={false}
                >
                    {isOpen ? (
                        <TbChevronDown className="w-4 h-4 flex-shrink-0" />
                    ) : (
                        <TbChevronRight className="w-4 h-4 flex-shrink-0" />
                    )}
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => updateAttributes({ title: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 bg-transparent outline-none"
                        placeholder="აკორდეონის სათაური..."
                    />
                </button>
                {isOpen && (
                    <div className="p-3 border-t">
                        <NodeViewContent className="prose prose-sm dark:prose-invert max-w-none" />
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    )
}

// Accordion Extension
export const AccordionItem = Node.create({
    name: 'accordionItem',
    group: 'block',
    content: 'block+',
    defining: true,

    addAttributes() {
        return {
            title: {
                default: 'აკორდეონი',
                parseHTML: element => element.getAttribute('data-title'),
                renderHTML: attributes => ({ 'data-title': attributes.title }),
            },
            isOpen: {
                default: true,
                parseHTML: element => element.getAttribute('data-open') === 'true',
                renderHTML: attributes => ({ 'data-open': attributes.isOpen }),
            },
        }
    },

    parseHTML() {
        return [{ tag: 'div[data-accordion-item]' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-accordion-item': '' }), 0]
    },

    addNodeView() {
        return ReactNodeViewRenderer(AccordionItemComponent)
    },

    addCommands() {
        return {
            insertAccordion: () => ({ commands }: { commands: any }) => {
                return commands.insertContent({
                    type: this.name,
                    attrs: { title: 'აკორდეონის სათაური', isOpen: true },
                    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'კონტენტი აქ...' }] }],
                })
            },
        }
    },
})

export default AccordionItem

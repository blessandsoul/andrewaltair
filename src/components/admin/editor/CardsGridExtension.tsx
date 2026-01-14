import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import type { NodeViewProps } from '@tiptap/react'
import * as React from 'react'
import { TbPlus, TbTrash, TbPhoto } from 'react-icons/tb'

interface CardItem {
    id: string
    image: string
    title: string
    description: string
    link?: string
}

// Cards Grid Component
function CardsGridComponent({ node, updateAttributes }: NodeViewProps) {
    const cards = (node.attrs.cards || []) as CardItem[]
    const columns = (node.attrs.columns || 3) as number

    const addCard = () => {
        const newCard: CardItem = {
            id: `card-${Date.now()}`,
            image: '',
            title: 'ახალი ბარათი',
            description: 'აღწერა...',
            link: ''
        }
        updateAttributes({ cards: [...cards, newCard] })
    }

    const updateCard = (id: string, field: keyof CardItem, value: string) => {
        updateAttributes({
            cards: cards.map((c: CardItem) => c.id === id ? { ...c, [field]: value } : c)
        })
    }

    const removeCard = (id: string) => {
        if (cards.length <= 1) return
        updateAttributes({ cards: cards.filter((c: CardItem) => c.id !== id) })
    }

    const gridCols: Record<number, string> = {
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
    }

    return (
        <NodeViewWrapper className="my-4" contentEditable={false}>
            {/* Column selector */}
            <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-muted-foreground">სვეტები:</span>
                {[2, 3, 4].map((n) => (
                    <button
                        key={n}
                        onClick={() => updateAttributes({ columns: n })}
                        className={`w-6 h-6 text-xs rounded ${columns === n ? 'bg-indigo-500 text-white' : 'bg-muted hover:bg-muted/80'
                            }`}
                    >
                        {n}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className={`grid ${gridCols[columns] || 'grid-cols-3'} gap-4`}>
                {cards.map((card: CardItem) => (
                    <div
                        key={card.id}
                        className="border rounded-lg overflow-hidden group hover:border-indigo-500/50 transition-colors"
                    >
                        {/* Image */}
                        <div className="aspect-video bg-muted relative">
                            {card.image ? (
                                <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                    <TbPhoto className="w-8 h-8" />
                                </div>
                            )}
                            <input
                                type="url"
                                value={card.image}
                                onChange={(e) => updateCard(card.id, 'image', e.target.value)}
                                placeholder="სურათის URL..."
                                className="absolute inset-0 w-full h-full opacity-0 hover:opacity-100 bg-black/50 text-white text-xs p-2 transition-opacity"
                            />
                        </div>

                        {/* Content */}
                        <div className="p-3 space-y-2">
                            <input
                                type="text"
                                value={card.title}
                                onChange={(e) => updateCard(card.id, 'title', e.target.value)}
                                className="font-semibold bg-transparent outline-none w-full"
                                placeholder="სათაური..."
                            />
                            <textarea
                                value={card.description}
                                onChange={(e) => updateCard(card.id, 'description', e.target.value)}
                                className="text-sm text-muted-foreground bg-transparent outline-none w-full resize-none"
                                placeholder="აღწერა..."
                                rows={2}
                            />
                            <input
                                type="url"
                                value={card.link || ''}
                                onChange={(e) => updateCard(card.id, 'link', e.target.value)}
                                className="text-xs text-indigo-500 bg-transparent outline-none w-full"
                                placeholder="ლინკი (არასავალდებულო)..."
                            />

                            {cards.length > 1 && (
                                <button
                                    onClick={() => removeCard(card.id)}
                                    className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
                                >
                                    <TbTrash className="w-3 h-3" />
                                    წაშლა
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add button */}
            <button
                onClick={addCard}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-indigo-500 transition-colors mt-4"
            >
                <TbPlus className="w-4 h-4" />
                ბარათის დამატება
            </button>
        </NodeViewWrapper>
    )
}

// Cards Grid Extension
export const CardsGrid = Node.create({
    name: 'cardsGrid',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            cards: {
                default: [
                    { id: 'card-1', image: '', title: 'ბარათი 1', description: 'აღწერა...', link: '' },
                    { id: 'card-2', image: '', title: 'ბარათი 2', description: 'აღწერა...', link: '' },
                    { id: 'card-3', image: '', title: 'ბარათი 3', description: 'აღწერა...', link: '' },
                ],
                parseHTML: (element: Element) => {
                    try {
                        return JSON.parse(element.getAttribute('data-cards') || '[]')
                    } catch {
                        return []
                    }
                },
                renderHTML: (attributes: Record<string, unknown>) => ({ 'data-cards': JSON.stringify(attributes.cards) }),
            },
            columns: {
                default: 3,
                parseHTML: (element: Element) => parseInt(element.getAttribute('data-columns') || '3'),
                renderHTML: (attributes: Record<string, unknown>) => ({ 'data-columns': attributes.columns }),
            },
        }
    },

    parseHTML() {
        return [{ tag: 'div[data-cards-grid]' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-cards-grid': '' })]
    },

    addNodeView() {
        return ReactNodeViewRenderer(CardsGridComponent)
    },
})

export default CardsGrid

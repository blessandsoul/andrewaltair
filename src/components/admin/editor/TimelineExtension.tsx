import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import * as React from 'react'
import { TbCircleFilled, TbPlus, TbTrash } from 'react-icons/tb'

interface TimelineEvent {
    id: string
    date: string
    title: string
    description: string
}

// Timeline Component
function TimelineComponent({ node, updateAttributes }: {
    node: { attrs: { events: TimelineEvent[] } }
    updateAttributes: (attrs: { events: TimelineEvent[] }) => void
}) {
    const { events } = node.attrs

    const addEvent = () => {
        const newEvent: TimelineEvent = {
            id: `event-${Date.now()}`,
            date: new Date().toLocaleDateString('ka-GE'),
            title: 'ახალი მოვლენა',
            description: 'აღწერა...'
        }
        updateAttributes({ events: [...events, newEvent] })
    }

    const updateEvent = (id: string, field: keyof TimelineEvent, value: string) => {
        updateAttributes({
            events: events.map(e => e.id === id ? { ...e, [field]: value } : e)
        })
    }

    const removeEvent = (id: string) => {
        if (events.length <= 1) return
        updateAttributes({ events: events.filter(e => e.id !== id) })
    }

    return (
        <NodeViewWrapper className="my-4" contentEditable={false}>
            <div className="relative pl-8">
                {/* Vertical line */}
                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500" />

                {events.map((event, index) => (
                    <div key={event.id} className="relative mb-6 last:mb-0">
                        {/* Dot */}
                        <div className="absolute left-[-20px] top-1.5">
                            <TbCircleFilled className="w-4 h-4 text-indigo-500" />
                        </div>

                        {/* Content */}
                        <div className="bg-muted/30 rounded-lg p-4 border hover:border-indigo-500/50 transition-colors group">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 space-y-2">
                                    <input
                                        type="text"
                                        value={event.date}
                                        onChange={(e) => updateEvent(event.id, 'date', e.target.value)}
                                        className="text-xs text-indigo-500 font-medium bg-transparent outline-none w-full"
                                        placeholder="თარიღი..."
                                    />
                                    <input
                                        type="text"
                                        value={event.title}
                                        onChange={(e) => updateEvent(event.id, 'title', e.target.value)}
                                        className="font-semibold bg-transparent outline-none w-full"
                                        placeholder="სათაური..."
                                    />
                                    <textarea
                                        value={event.description}
                                        onChange={(e) => updateEvent(event.id, 'description', e.target.value)}
                                        className="text-sm text-muted-foreground bg-transparent outline-none w-full resize-none"
                                        placeholder="აღწერა..."
                                        rows={2}
                                    />
                                </div>
                                {events.length > 1 && (
                                    <button
                                        onClick={() => removeEvent(event.id)}
                                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                                    >
                                        <TbTrash className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add button */}
                <button
                    onClick={addEvent}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-indigo-500 transition-colors ml-[-20px] mt-4"
                >
                    <TbPlus className="w-4 h-4" />
                    მოვლენის დამატება
                </button>
            </div>
        </NodeViewWrapper>
    )
}

// Timeline Extension
export const Timeline = Node.create({
    name: 'timeline',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            events: {
                default: [
                    { id: 'event-1', date: '2024', title: 'პირველი მოვლენა', description: 'აღწერა...' },
                    { id: 'event-2', date: '2025', title: 'მეორე მოვლენა', description: 'აღწერა...' },
                ],
                parseHTML: element => {
                    try {
                        return JSON.parse(element.getAttribute('data-events') || '[]')
                    } catch {
                        return []
                    }
                },
                renderHTML: attributes => ({ 'data-events': JSON.stringify(attributes.events) }),
            },
        }
    },

    parseHTML() {
        return [{ tag: 'div[data-timeline]' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-timeline': '' })]
    },

    addNodeView() {
        return ReactNodeViewRenderer(TimelineComponent)
    },

    addCommands() {
        return {
            insertTimeline: () => ({ commands }) => {
                return commands.insertContent({
                    type: this.name,
                    attrs: {
                        events: [
                            { id: 'event-1', date: '2024', title: 'პირველი მოვლენა', description: 'აღწერა...' },
                            { id: 'event-2', date: '2025', title: 'მეორე მოვლენა', description: 'აღწერა...' },
                        ]
                    }
                })
            },
        }
    },
})

export default Timeline

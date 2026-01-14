import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import Suggestion, { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion'
import { ReactRenderer } from '@tiptap/react'
import tippy, { Instance } from 'tippy.js'
import {
    TbH1, TbH2, TbH3,
    TbList, TbListNumbers, TbListCheck,
    TbPhoto, TbBrandYoutube, TbTable,
    TbQuote, TbCode, TbSeparator,
    TbInfoCircle, TbAlertTriangle, TbBulb, TbNote,
    TbColumns, TbLayoutBottombar,
    TbMoodSmile
} from 'react-icons/tb'
import React from 'react'

// Command items for slash menu
export const slashCommands = [
    {
        title: 'სათაური 1',
        description: 'მთავარი სათაური',
        icon: TbH1,
        command: ({ editor, range }: { editor: any; range: any }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run()
        },
    },
    {
        title: 'სათაური 2',
        description: 'ქვესათაური',
        icon: TbH2,
        command: ({ editor, range }: { editor: any; range: any }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
        },
    },
    {
        title: 'სათაური 3',
        description: 'პატარა სათაური',
        icon: TbH3,
        command: ({ editor, range }: { editor: any; range: any }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run()
        },
    },
    {
        title: 'ბულეტები',
        description: 'მარკირებული სია',
        icon: TbList,
        command: ({ editor, range }: { editor: any; range: any }) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run()
        },
    },
    {
        title: 'ნუმერაცია',
        description: 'დანომრილი სია',
        icon: TbListNumbers,
        command: ({ editor, range }: { editor: any; range: any }) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run()
        },
    },
    {
        title: 'ჩექბოქსები',
        description: 'ამოცანების სია',
        icon: TbListCheck,
        command: ({ editor, range }: { editor: any; range: any }) => {
            editor.chain().focus().deleteRange(range).toggleTaskList().run()
        },
    },
    {
        title: 'სურათი',
        description: 'ჩასვით სურათი',
        icon: TbPhoto,
        command: ({ editor, range }: { editor: any; range: any }) => {
            const url = window.prompt('სურათის URL:')
            if (url) {
                editor.chain().focus().deleteRange(range).setImage({ src: url }).run()
            }
        },
    },
    {
        title: 'YouTube',
        description: 'ჩასვით YouTube ვიდეო',
        icon: TbBrandYoutube,
        command: ({ editor, range }: { editor: any; range: any }) => {
            const url = window.prompt('YouTube URL:')
            if (url) {
                editor.chain().focus().deleteRange(range).setYoutubeVideo({ src: url }).run()
            }
        },
    },
    {
        title: 'ცხრილი',
        description: '3x3 ცხრილი',
        icon: TbTable,
        command: ({ editor, range }: { editor: any; range: any }) => {
            editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        },
    },
    {
        title: 'ციტატა',
        description: 'ბლოკ-ციტატა',
        icon: TbQuote,
        command: ({ editor, range }: { editor: any; range: any }) => {
            editor.chain().focus().deleteRange(range).toggleBlockquote().run()
        },
    },
    {
        title: 'კოდი',
        description: 'კოდის ბლოკი',
        icon: TbCode,
        command: ({ editor, range }: { editor: any; range: any }) => {
            editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
        },
    },
    {
        title: 'გამყოფი',
        description: 'ჰორიზონტალური ხაზი',
        icon: TbSeparator,
        command: ({ editor, range }: { editor: any; range: any }) => {
            editor.chain().focus().deleteRange(range).setHorizontalRule().run()
        },
    },
    {
        title: 'Info Callout',
        description: 'ინფორმაციული ბლოკი',
        icon: TbInfoCircle,
        command: ({ editor, range }: { editor: any; range: any }) => {
            editor.chain().focus().deleteRange(range).setCallout('info').run()
        },
    },
    {
        title: 'Warning Callout',
        description: 'გაფრთხილების ბლოკი',
        icon: TbAlertTriangle,
        command: ({ editor, range }: { editor: any; range: any }) => {
            editor.chain().focus().deleteRange(range).setCallout('warning').run()
        },
    },
    {
        title: 'Tip Callout',
        description: 'რჩევის ბლოკი',
        icon: TbBulb,
        command: ({ editor, range }: { editor: any; range: any }) => {
            editor.chain().focus().deleteRange(range).setCallout('tip').run()
        },
    },
    {
        title: 'Note Callout',
        description: 'შენიშვნის ბლოკი',
        icon: TbNote,
        command: ({ editor, range }: { editor: any; range: any }) => {
            editor.chain().focus().deleteRange(range).setCallout('note').run()
        },
    },
]

// Slash command menu component
export function SlashCommandList({
    items,
    command
}: {
    items: typeof slashCommands
    command: (item: typeof slashCommands[0]) => void
}) {
    const [selectedIndex, setSelectedIndex] = React.useState(0)

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault()
                setSelectedIndex((prev) => (prev - 1 + items.length) % items.length)
            } else if (e.key === 'ArrowDown') {
                e.preventDefault()
                setSelectedIndex((prev) => (prev + 1) % items.length)
            } else if (e.key === 'Enter') {
                e.preventDefault()
                command(items[selectedIndex])
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [items, selectedIndex, command])

    if (!items.length) {
        return (
            <div className="bg-background border rounded-lg shadow-lg p-3 text-sm text-muted-foreground">
                შედეგები არ მოიძებნა
            </div>
        )
    }

    return (
        <div className="bg-background border rounded-lg shadow-xl overflow-hidden w-72 max-h-80 overflow-y-auto">
            {items.map((item, index) => {
                const Icon = item.icon
                return (
                    <button
                        key={item.title}
                        onClick={() => command(item)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${index === selectedIndex ? 'bg-accent' : 'hover:bg-muted/50'
                            }`}
                    >
                        <div className="flex-shrink-0 w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                            <Icon className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="font-medium text-sm">{item.title}</div>
                            <div className="text-xs text-muted-foreground">{item.description}</div>
                        </div>
                    </button>
                )
            })}
        </div>
    )
}

// Extension
export const SlashCommands = Extension.create({
    name: 'slashCommands',

    addOptions() {
        return {
            suggestion: {
                char: '/',
                command: ({ editor, range, props }: { editor: any; range: any; props: any }) => {
                    props.command({ editor, range })
                },
            } as Partial<SuggestionOptions>,
        }
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
                items: ({ query }: { query: string }) => {
                    return slashCommands.filter((item) =>
                        item.title.toLowerCase().includes(query.toLowerCase()) ||
                        item.description.toLowerCase().includes(query.toLowerCase())
                    )
                },
                render: () => {
                    let component: ReactRenderer
                    let popup: Instance[]

                    return {
                        onStart: (props: SuggestionProps) => {
                            component = new ReactRenderer(SlashCommandList, {
                                props,
                                editor: props.editor,
                            })

                            if (!props.clientRect) return

                            popup = tippy('body', {
                                getReferenceClientRect: props.clientRect as () => DOMRect,
                                appendTo: () => document.body,
                                content: component.element,
                                showOnCreate: true,
                                interactive: true,
                                trigger: 'manual',
                                placement: 'bottom-start',
                            })
                        },

                        onUpdate(props: SuggestionProps) {
                            component.updateProps(props)

                            if (!props.clientRect) return

                            popup[0].setProps({
                                getReferenceClientRect: props.clientRect as () => DOMRect,
                            })
                        },

                        onKeyDown(props: { event: KeyboardEvent }) {
                            if (props.event.key === 'Escape') {
                                popup[0].hide()
                                return true
                            }
                            return false
                        },

                        onExit() {
                            popup[0].destroy()
                            component.destroy()
                        },
                    }
                },
            }),
        ]
    },
})

export default SlashCommands

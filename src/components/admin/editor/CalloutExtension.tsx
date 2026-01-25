import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import { TbInfoCircle, TbAlertTriangle, TbBulb, TbNote, TbCircleCheck, TbAlertCircle } from 'react-icons/tb'

// Callout types and their styles
export const calloutTypes = {
    info: {
        icon: TbInfoCircle,
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
        iconColor: 'text-blue-500',
        label: 'ინფორმაცია',
    },
    warning: {
        icon: TbAlertTriangle,
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/30',
        iconColor: 'text-yellow-500',
        label: 'გაფრთხილება',
    },
    tip: {
        icon: TbBulb,
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        iconColor: 'text-green-500',
        label: 'რჩევა',
    },
    note: {
        icon: TbNote,
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/30',
        iconColor: 'text-purple-500',
        label: 'შენიშვნა',
    },
    success: {
        icon: TbCircleCheck,
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30',
        iconColor: 'text-emerald-500',
        label: 'წარმატება',
    },
    error: {
        icon: TbAlertCircle,
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
        iconColor: 'text-red-500',
        label: 'შეცდომა',
    },
}

export type CalloutType = keyof typeof calloutTypes

// React component for rendering callout in editor
export function CalloutComponent(props: any) {
    const { node, updateAttributes } = props
    const type = (node.attrs.type || 'info') as CalloutType
    const config = calloutTypes[type]
    const Icon = config.icon

    const cycleType = () => {
        const types = Object.keys(calloutTypes) as CalloutType[]
        const currentIndex = types.indexOf(type)
        const nextIndex = (currentIndex + 1) % types.length
        updateAttributes({ type: types[nextIndex] })
    }

    return (
        <NodeViewWrapper className="my-4">
            <div className={`flex gap-3 p-4 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
                <button
                    onClick={cycleType}
                    className={`flex-shrink-0 mt-0.5 cursor-pointer hover:scale-110 transition-transform ${config.iconColor}`}
                    title="დააწკაპე ტიპის შესაცვლელად"
                    contentEditable={false}
                >
                    <Icon className="w-5 h-5" />
                </button>
                <NodeViewContent className="flex-1 prose prose-sm dark:prose-invert max-w-none" />
            </div>
        </NodeViewWrapper>
    )
}

// Tiptap extension
export const Callout = Node.create({
    name: 'callout',

    group: 'block',

    content: 'block+',

    defining: true,

    addAttributes() {
        return {
            type: {
                default: 'info',
                parseHTML: element => element.getAttribute('data-type') || 'info',
                renderHTML: attributes => ({
                    'data-type': attributes.type,
                }),
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-callout]',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-callout': '' }), 0]
    },

    addNodeView() {
        return ReactNodeViewRenderer(CalloutComponent)
    },

    addCommands() {
        return {
            setCallout: (type: CalloutType = 'info') => ({ commands }: { commands: any }) => {
                return commands.wrapIn(this.name, { type })
            },
            toggleCallout: (type: CalloutType = 'info') => ({ commands }: { commands: any }) => {
                return commands.toggleWrap(this.name, { type })
            },
        }
    },
})

export default Callout

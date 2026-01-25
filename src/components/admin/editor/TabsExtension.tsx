import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import * as React from 'react'

// Tab Item interface
interface TabItem {
    id: string
    title: string
}

// Tabs Container Component
function TabsContainerComponent(props: any) {
    const { node, updateAttributes } = props
    const { tabs, activeTab } = node.attrs

    const addTab = () => {
        const newTab = { id: `tab-${Date.now()}`, title: `ტაბი ${tabs.length + 1}` }
        updateAttributes({ tabs: [...tabs, newTab], activeTab: newTab.id })
    }

    const removeTab = (id: string) => {
        if (tabs.length <= 1) return
        const newTabs = tabs.filter((t: TabItem) => t.id !== id)
        updateAttributes({
            tabs: newTabs,
            activeTab: activeTab === id ? newTabs[0].id : activeTab
        })
    }

    const updateTabTitle = (id: string, title: string) => {
        updateAttributes({
            tabs: tabs.map((t: TabItem) => t.id === id ? { ...t, title } : t)
        })
    }

    return (
        <NodeViewWrapper className="my-4">
            <div className="border rounded-lg overflow-hidden">
                {/* Tab Headers */}
                <div className="flex items-center border-b bg-muted/30 overflow-x-auto" contentEditable={false}>
                    {tabs.map((tab: TabItem) => (
                        <div
                            key={tab.id}
                            className={`flex items-center gap-1 px-4 py-2 border-r cursor-pointer transition-colors ${activeTab === tab.id
                                ? 'bg-background border-b-2 border-b-indigo-500'
                                : 'hover:bg-muted/50'
                                }`}
                            onClick={() => updateAttributes({ activeTab: tab.id })}
                        >
                            <input
                                type="text"
                                value={tab.title}
                                onChange={(e) => updateTabTitle(tab.id, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-transparent outline-none text-sm font-medium w-20"
                            />
                            {tabs.length > 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        removeTab(tab.id)
                                    }}
                                    className="text-muted-foreground hover:text-destructive text-xs ml-1"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        onClick={addTab}
                        className="px-3 py-2 text-muted-foreground hover:text-foreground text-sm"
                    >
                        +
                    </button>
                </div>
                {/* Tab Content */}
                <div className="p-4">
                    <NodeViewContent className="prose prose-sm dark:prose-invert max-w-none" />
                </div>
            </div>
        </NodeViewWrapper>
    )
}

// Tabs Extension
export const TabsContainer = Node.create({
    name: 'tabsContainer',
    group: 'block',
    content: 'block+',
    defining: true,

    addAttributes() {
        return {
            tabs: {
                default: [{ id: 'tab-1', title: 'ტაბი 1' }, { id: 'tab-2', title: 'ტაბი 2' }],
                parseHTML: element => {
                    try {
                        return JSON.parse(element.getAttribute('data-tabs') || '[]')
                    } catch {
                        return [{ id: 'tab-1', title: 'ტაბი 1' }]
                    }
                },
                renderHTML: attributes => ({ 'data-tabs': JSON.stringify(attributes.tabs) }),
            },
            activeTab: {
                default: 'tab-1',
                parseHTML: element => element.getAttribute('data-active'),
                renderHTML: attributes => ({ 'data-active': attributes.activeTab }),
            },
        }
    },

    parseHTML() {
        return [{ tag: 'div[data-tabs-container]' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-tabs-container': '' }), 0]
    },

    addNodeView() {
        return ReactNodeViewRenderer(TabsContainerComponent)
    },

    addCommands() {
        return {
            insertTabs: () => ({ commands }: { commands: any }) => {
                return commands.insertContent({
                    type: this.name,
                    attrs: {
                        tabs: [{ id: 'tab-1', title: 'ტაბი 1' }, { id: 'tab-2', title: 'ტაბი 2' }],
                        activeTab: 'tab-1'
                    },
                    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'პირველი ტაბის კონტენტი...' }] }],
                })
            },
        }
    },
})

export default TabsContainer

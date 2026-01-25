import { Extension } from '@tiptap/core'

export interface CalloutAttributes {
    type: 'info' | 'warning' | 'tip' | 'note' | 'success' | 'error'
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        accordion: {
            insertAccordion: () => ReturnType
        }
        callout: {
            setCallout: (type?: CalloutAttributes['type']) => ReturnType
            toggleCallout: (type?: CalloutAttributes['type']) => ReturnType
        }
        imageComparison: {
            insertImageComparison: () => ReturnType
        }
        tab: {
            insertTabs: () => ReturnType
        }
        timeline: {
            insertTimeline: () => ReturnType
        }
    }
}

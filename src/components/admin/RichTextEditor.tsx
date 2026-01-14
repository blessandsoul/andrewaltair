"use client"

import * as React from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import Highlight from "@tiptap/extension-highlight"
import { Table } from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableHeader from "@tiptap/extension-table-header"
import TableCell from "@tiptap/extension-table-cell"
import Youtube from "@tiptap/extension-youtube"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import Typography from "@tiptap/extension-typography"
import { Markdown } from "tiptap-markdown"
import FontFamily from "@tiptap/extension-font-family"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    TbBold,
    TbItalic,
    TbUnderline as TbUnderlineIcon,
    TbStrikethrough,
    TbH1,
    TbH2,
    TbH3,
    TbList,
    TbListNumbers,
    TbListCheck,
    TbQuote,
    TbCode,
    TbLink,
    TbPhoto,
    TbAlignLeft,
    TbAlignCenter,
    TbAlignRight,
    TbAlignJustified,
    TbHighlight,
    TbTable,
    TbTableMinus,
    TbRowInsertBottom,
    TbRowInsertTop,
    TbColumnInsertLeft,
    TbColumnInsertRight,
    TbArrowBackUp,
    TbArrowForwardUp,
    TbSeparator,
    TbBrandYoutube,
    TbSubscript,
    TbSuperscript,
    TbClearFormatting,
    TbX,
    TbMaximize,
    TbMinimize,
    TbSparkles,
    TbMoodSmile,
    TbPalette,
    TbInfoCircle,
    TbAlertTriangle,
    TbBulb,
    TbNote,
    TbUpload,
    TbFileText,
    TbLetterCase,
} from "react-icons/tb"

// New editor components
import { ColorPicker } from "./editor/ColorPicker"
import { FontSizePicker } from "./editor/FontSizePicker"
import { EmojiPicker } from "./editor/EmojiPicker"
import { AIAssistant } from "./editor/AIAssistant"
import { ImageUploader } from "./editor/ImageUploader"
import { Callout } from "./editor/CalloutExtension"
import { FontPicker } from "./editor/FontPicker"
import { TextShadowPicker } from "./editor/TextShadowPicker"

// Round 2 Extensions
import { AccordionItem } from "./editor/AccordionExtension"
import { TabsContainer } from "./editor/TabsExtension"
import { Timeline } from "./editor/TimelineExtension"
import { CardsGrid } from "./editor/CardsGridExtension"
import { ImageComparison } from "./editor/ImageComparisonExtension"
import { ChartBlock } from "./editor/ChartExtension"
import { MermaidDiagram } from "./editor/MermaidExtension"

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
    placeholder?: string
    className?: string
}

export function RichTextEditor({
    content,
    onChange,
    placeholder = "დაიწყეთ წერა... (აკრიფეთ / ბრძანებებისთვის)",
    className = "",
}: RichTextEditorProps) {
    const [linkUrl, setLinkUrl] = React.useState("")
    const [showLinkInput, setShowLinkInput] = React.useState(false)
    const [youtubeUrl, setYoutubeUrl] = React.useState("")
    const [showYoutubeInput, setShowYoutubeInput] = React.useState(false)
    const [isFullscreen, setIsFullscreen] = React.useState(false)
    const [showAIAssistant, setShowAIAssistant] = React.useState(false)
    const [showImageUploader, setShowImageUploader] = React.useState(false)
    const [selectedText, setSelectedText] = React.useState("")
    const [showMarkdown, setShowMarkdown] = React.useState(false)
    const [wordCount, setWordCount] = React.useState({ words: 0, chars: 0 })

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                // Disable strike as we use custom extensions
                strike: false,
            }),
            Image.configure({
                HTMLAttributes: {
                    class: "rounded-lg max-w-full h-auto",
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-indigo-500 hover:text-indigo-600 underline",
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Underline,
            Highlight.configure({
                multicolor: true,
                HTMLAttributes: {
                    class: "bg-yellow-200 dark:bg-yellow-800 rounded px-1",
                },
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: "border-collapse border border-border",
                },
            }),
            TableRow,
            TableHeader.configure({
                HTMLAttributes: {
                    class: "bg-muted font-semibold border border-border p-2",
                },
            }),
            TableCell.configure({
                HTMLAttributes: {
                    class: "border border-border p-2",
                },
            }),
            Youtube.configure({
                width: 640,
                height: 360,
                HTMLAttributes: {
                    class: "rounded-lg overflow-hidden",
                },
            }),
            TaskList.configure({
                HTMLAttributes: {
                    class: "not-prose pl-0",
                },
            }),
            TaskItem.configure({
                nested: true,
                HTMLAttributes: {
                    class: "flex items-start gap-2 my-1",
                },
            }),
            TextStyle,
            Color,
            Subscript,
            Superscript,
            Typography,
            Callout,
            FontFamily,
            // Round 2 Extensions
            AccordionItem,
            TabsContainer,
            Timeline,
            CardsGrid,
            ImageComparison,
            ChartBlock,
            MermaidDiagram,
            Markdown.configure({
                html: true,
                transformPastedText: true,
                transformCopiedText: true,
                linkify: false, // Disable to avoid duplicate Link extension
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            const markdownStorage = editor.storage.markdown as { getMarkdown: () => string }
            const markdown = markdownStorage.getMarkdown()
            onChange(markdown)

            // Update word count
            const text = editor.getText()
            setWordCount({
                words: text.split(/\s+/).filter(w => w.length > 0).length,
                chars: text.length,
            })
        },
        onSelectionUpdate: ({ editor }) => {
            const { from, to } = editor.state.selection
            if (from !== to) {
                setSelectedText(editor.state.doc.textBetween(from, to, " "))
            } else {
                setSelectedText("")
            }
        },
        editorProps: {
            attributes: {
                class:
                    "prose prose-sm dark:prose-invert max-w-none min-h-[400px] outline-none p-4 focus:outline-none",
            },
        },
    })

    React.useEffect(() => {
        if (editor) {
            const markdownStorage = editor.storage.markdown as { getMarkdown: () => string }
            if (content !== markdownStorage.getMarkdown()) {
                editor.commands.setContent(content)
            }
        }
    }, [content, editor])

    if (!editor) {
        return (
            <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                იტვირთება...
            </div>
        )
    }

    const addLink = () => {
        if (linkUrl) {
            editor.chain().focus().setLink({ href: linkUrl }).run()
            setLinkUrl("")
            setShowLinkInput(false)
        }
    }

    const addYoutubeVideo = () => {
        if (youtubeUrl) {
            editor.commands.setYoutubeVideo({ src: youtubeUrl })
            setYoutubeUrl("")
            setShowYoutubeInput(false)
        }
    }

    const insertEmoji = (emoji: string) => {
        editor.chain().focus().insertContent(emoji).run()
    }

    const handleImageInsert = (url: string) => {
        editor.chain().focus().setImage({ src: url }).run()
    }

    const handleAIReplace = (newText: string) => {
        editor.chain().focus().insertContent(newText).run()
    }

    const ToolbarButton = ({
        onClick,
        isActive = false,
        disabled = false,
        title,
        children,
    }: {
        onClick: () => void
        isActive?: boolean
        disabled?: boolean
        title: string
        children: React.ReactNode
    }) => (
        <Button
            variant={isActive ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={onClick}
            disabled={disabled}
            title={title}
        >
            {children}
        </Button>
    )

    const ToolbarDivider = () => (
        <div className="w-px h-6 bg-border mx-1" />
    )

    const containerClass = isFullscreen
        ? "fixed inset-0 z-50 bg-background flex flex-col"
        : `border rounded-lg bg-background ${className}`

    return (
        <div className={containerClass}>
            {/* Main Toolbar */}
            <div className="flex items-center gap-0.5 flex-wrap border-b p-2 bg-muted/30">
                {/* Undo/Redo */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="გაუქმება (Ctrl+Z)"
                >
                    <TbArrowBackUp className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="თავიდან (Ctrl+Y)"
                >
                    <TbArrowForwardUp className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Text Formatting */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                    title="Bold (Ctrl+B)"
                >
                    <TbBold className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                    title="Italic (Ctrl+I)"
                >
                    <TbItalic className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive("underline")}
                    title="ხაზგასმა (Ctrl+U)"
                >
                    <TbUnderlineIcon className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive("strike")}
                    title="გადახაზვა"
                >
                    <TbStrikethrough className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    isActive={editor.isActive("highlight")}
                    title="მონიშვნა"
                >
                    <TbHighlight className="w-4 h-4" />
                </ToolbarButton>

                {/* Color Picker */}
                <ColorPicker
                    onChange={(color) => editor.chain().focus().setColor(color).run()}
                    currentColor={editor.getAttributes("textStyle").color}
                    type="text"
                />

                {/* Font Size */}
                <FontSizePicker
                    onChange={(size) => {
                        editor.chain().focus().setMark("textStyle", { fontSize: size }).run()
                    }}
                />

                <ToolbarDivider />

                {/* Headings */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive("heading", { level: 1 })}
                    title="სათაური 1"
                >
                    <TbH1 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive("heading", { level: 2 })}
                    title="სათაური 2"
                >
                    <TbH2 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive("heading", { level: 3 })}
                    title="სათაური 3"
                >
                    <TbH3 className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Lists */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive("bulletList")}
                    title="ბულეტები"
                >
                    <TbList className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive("orderedList")}
                    title="ნუმერაცია"
                >
                    <TbListNumbers className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                    isActive={editor.isActive("taskList")}
                    title="ჩექბოქსები"
                >
                    <TbListCheck className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Block Elements */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive("blockquote")}
                    title="ციტატა"
                >
                    <TbQuote className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    isActive={editor.isActive("codeBlock")}
                    title="კოდი"
                >
                    <TbCode className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    title="გამყოფი ხაზი"
                >
                    <TbSeparator className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Callouts */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().insertContent({ type: 'callout', attrs: { type: 'info' }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'ინფო შეტყობინება...' }] }] }).run()}
                    isActive={editor.isActive("callout")}
                    title="ინფო ბლოკი"
                >
                    <TbInfoCircle className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Text Alignment */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    isActive={editor.isActive({ textAlign: "left" })}
                    title="მარცხნივ"
                >
                    <TbAlignLeft className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    isActive={editor.isActive({ textAlign: "center" })}
                    title="ცენტრში"
                >
                    <TbAlignCenter className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    isActive={editor.isActive({ textAlign: "right" })}
                    title="მარჯვნივ"
                >
                    <TbAlignRight className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                    isActive={editor.isActive({ textAlign: "justify" })}
                    title="გათანაბრებული"
                >
                    <TbAlignJustified className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Super/Subscript */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleSubscript().run()}
                    isActive={editor.isActive("subscript")}
                    title="ქვესკრიპტი"
                >
                    <TbSubscript className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleSuperscript().run()}
                    isActive={editor.isActive("superscript")}
                    title="ზესკრიპტი"
                >
                    <TbSuperscript className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Media */}
                <ToolbarButton
                    onClick={() => setShowLinkInput(!showLinkInput)}
                    isActive={editor.isActive("link") || showLinkInput}
                    title="ლინკი"
                >
                    <TbLink className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => setShowImageUploader(true)}
                    title="სურათი"
                >
                    <TbPhoto className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => setShowYoutubeInput(!showYoutubeInput)}
                    isActive={showYoutubeInput}
                    title="YouTube"
                >
                    <TbBrandYoutube className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Table */}
                <ToolbarButton
                    onClick={() =>
                        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
                    }
                    title="ცხრილი"
                >
                    <TbTable className="w-4 h-4" />
                </ToolbarButton>
                {editor.isActive("table") && (
                    <>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().addRowAfter().run()}
                            title="რიგი ქვემოთ"
                        >
                            <TbRowInsertBottom className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().addRowBefore().run()}
                            title="რიგი ზემოთ"
                        >
                            <TbRowInsertTop className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().addColumnAfter().run()}
                            title="სვეტი მარჯვნივ"
                        >
                            <TbColumnInsertRight className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().addColumnBefore().run()}
                            title="სვეტი მარცხნივ"
                        >
                            <TbColumnInsertLeft className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().deleteTable().run()}
                            title="ცხრილის წაშლა"
                        >
                            <TbTableMinus className="w-4 h-4" />
                        </ToolbarButton>
                    </>
                )}

                <ToolbarDivider />

                {/* Emoji */}
                <EmojiPicker onSelect={insertEmoji} />

                <div className="flex-1" />

                {/* AI Assistant */}
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-xs h-8 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20"
                    onClick={() => setShowAIAssistant(true)}
                    disabled={!selectedText}
                    title={selectedText ? "AI ასისტენტი" : "მონიშნე ტექსტი AI-სთვის"}
                >
                    <TbSparkles className="w-4 h-4 text-indigo-500" />
                    AI
                </Button>

                {/* Markdown Toggle */}
                <ToolbarButton
                    onClick={() => setShowMarkdown(!showMarkdown)}
                    isActive={showMarkdown}
                    title="Markdown რეჟიმი"
                >
                    <TbFileText className="w-4 h-4" />
                </ToolbarButton>

                {/* Fullscreen */}
                <ToolbarButton
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    title={isFullscreen ? "გამოსვლა" : "სრული ეკრანი"}
                >
                    {isFullscreen ? <TbMinimize className="w-4 h-4" /> : <TbMaximize className="w-4 h-4" />}
                </ToolbarButton>

                {/* Clear Formatting */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                    title="ფორმატის გასუფთავება"
                >
                    <TbClearFormatting className="w-4 h-4" />
                </ToolbarButton>
            </div>

            {/* Second Toolbar - Advanced Blocks */}
            <div className="flex items-center gap-1 flex-wrap border-b p-2 bg-muted/20 text-xs">
                <span className="text-muted-foreground mr-2">ბლოკები:</span>

                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => editor.chain().focus().insertContent({ type: 'accordionItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'კონტენტი აქ...' }] }] }).run()}
                    title="აკორდეონი"
                >
                    📂 აკორდეონი
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => editor.chain().focus().insertContent({ type: 'tabsContainer', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'ტაბის კონტენტი...' }] }] }).run()}
                    title="ტაბები"
                >
                    📑 ტაბები
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => editor.chain().focus().insertContent({ type: 'timeline' }).run()}
                    title="ტაიმლაინი"
                >
                    📅 ტაიმლაინი
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => editor.chain().focus().insertContent({ type: 'cardsGrid' }).run()}
                    title="ბარათები"
                >
                    🃏 ბარათები
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => editor.chain().focus().insertContent({ type: 'chartBlock' }).run()}
                    title="გრაფიკი"
                >
                    📊 გრაფიკი
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => editor.chain().focus().insertContent({ type: 'mermaidDiagram' }).run()}
                    title="დიაგრამა"
                >
                    🔀 Mermaid
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => editor.chain().focus().insertContent({ type: 'imageComparison' }).run()}
                    title="სურათების შედარება"
                >
                    🔄 შედარება
                </Button>

                <div className="flex-1" />

                <FontPicker
                    onChange={(font) => editor.chain().focus().setFontFamily(font).run()}
                    currentFont={editor.getAttributes('textStyle').fontFamily}
                />

                <TextShadowPicker
                    onChange={(shadow) => {
                        // Apply text shadow via custom style
                        editor.chain().focus().setMark('textStyle', { textShadow: shadow } as any).run()
                    }}
                />
            </div>

            {/* Link Input */}
            {showLinkInput && (
                <div className="flex items-center gap-2 p-2 border-b bg-muted/20">
                    <Input
                        type="url"
                        placeholder="https://example.com"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addLink()}
                        className="flex-1"
                        autoFocus
                    />
                    <Button size="sm" onClick={addLink}>
                        დამატება
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            editor.chain().focus().unsetLink().run()
                            setShowLinkInput(false)
                        }}
                    >
                        წაშლა
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => setShowLinkInput(false)}
                    >
                        <TbX className="w-4 h-4" />
                    </Button>
                </div>
            )}

            {/* YouTube Input */}
            {showYoutubeInput && (
                <div className="flex items-center gap-2 p-2 border-b bg-muted/20">
                    <Input
                        type="url"
                        placeholder="YouTube ვიდეოს URL"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addYoutubeVideo()}
                        className="flex-1"
                        autoFocus
                    />
                    <Button size="sm" onClick={addYoutubeVideo}>
                        დამატება
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => setShowYoutubeInput(false)}
                    >
                        <TbX className="w-4 h-4" />
                    </Button>
                </div>
            )}

            {/* Editor Content */}
            <div className={isFullscreen ? "flex-1 overflow-y-auto" : ""}>
                {showMarkdown ? (
                    <textarea
                        value={content}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full h-full min-h-[400px] p-4 font-mono text-sm bg-muted/10 resize-none outline-none"
                        placeholder="Markdown..."
                    />
                ) : (
                    <EditorContent editor={editor} />
                )}
            </div>

            {/* Footer with word count */}
            <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/10 text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                    <span>{wordCount.words} სიტყვა</span>
                    <span>{wordCount.chars} სიმბოლო</span>
                    <span>~{Math.ceil(wordCount.words / 200)} წთ წაკითხვა</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-indigo-500/70">აკრიფე / ბრძანებებისთვის</span>
                </div>
            </div>

            {/* Modals */}
            <AIAssistant
                selectedText={selectedText}
                onReplace={handleAIReplace}
                isOpen={showAIAssistant}
                onClose={() => setShowAIAssistant(false)}
            />

            <ImageUploader
                onImageInsert={handleImageInsert}
                isOpen={showImageUploader}
                onClose={() => setShowImageUploader(false)}
            />
        </div>
    )
}

export default RichTextEditor

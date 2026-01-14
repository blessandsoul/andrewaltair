"use client"

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import type { NodeViewProps } from '@tiptap/react'
import * as React from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TbPlus, TbTrash } from 'react-icons/tb'

interface DataPoint {
    name: string
    value: number
    color?: string
    [key: string]: string | number | undefined
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6']

// Chart Component
function ChartComponent({ node, updateAttributes }: NodeViewProps) {
    const chartType = (node.attrs.chartType || 'bar') as 'bar' | 'line' | 'pie'
    const data = (node.attrs.data || []) as DataPoint[]
    const title = (node.attrs.title || 'გრაფიკი') as string

    const addDataPoint = () => {
        const newPoint: DataPoint = {
            name: `პუნქტი ${data.length + 1}`,
            value: Math.floor(Math.random() * 100),
            color: COLORS[data.length % COLORS.length]
        }
        updateAttributes({ data: [...data, newPoint] })
    }

    const updateDataPoint = (index: number, field: 'name' | 'value', value: string | number) => {
        const newData = [...data]
        newData[index] = { ...newData[index], [field]: field === 'value' ? Number(value) : value }
        updateAttributes({ data: newData })
    }

    const removeDataPoint = (index: number) => {
        if (data.length <= 1) return
        updateAttributes({ data: data.filter((_: DataPoint, i: number) => i !== index) })
    }

    return (
        <NodeViewWrapper className="my-4" contentEditable={false}>
            <div className="border rounded-lg overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-3 bg-muted/30 border-b">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => updateAttributes({ title: e.target.value })}
                        placeholder="გრაფიკის სათაური..."
                        className="font-semibold bg-transparent outline-none"
                    />
                    <div className="flex gap-1">
                        {(['bar', 'line', 'pie'] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => updateAttributes({ chartType: type })}
                                className={`px-2 py-1 text-xs rounded ${chartType === type ? 'bg-indigo-500 text-white' : 'bg-muted hover:bg-muted/80'
                                    }`}
                            >
                                {type === 'bar' ? 'Bar' : type === 'line' ? 'Line' : 'Pie'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chart */}
                <div className="p-4" style={{ height: 256 }}>
                    <ResponsiveContainer width="100%" height={240}>
                        {chartType === 'bar' ? (
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                <XAxis dataKey="name" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        ) : chartType === 'line' ? (
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                <XAxis dataKey="name" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
                            </LineChart>
                        ) : (
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    dataKey="value"
                                >
                                    {data.map((_: DataPoint, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        )}
                    </ResponsiveContainer>
                </div>

                {/* Data Editor */}
                <div className="border-t p-3 space-y-2">
                    <div className="text-xs text-muted-foreground mb-2">მონაცემები:</div>
                    {data.map((point: DataPoint, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={point.name}
                                onChange={(e) => updateDataPoint(index, 'name', e.target.value)}
                                className="flex-1 px-2 py-1 text-sm border rounded bg-background"
                                placeholder="სახელი..."
                            />
                            <input
                                type="number"
                                value={point.value}
                                onChange={(e) => updateDataPoint(index, 'value', e.target.value)}
                                className="w-20 px-2 py-1 text-sm border rounded bg-background"
                            />
                            {data.length > 1 && (
                                <button
                                    onClick={() => removeDataPoint(index)}
                                    className="text-muted-foreground hover:text-destructive"
                                >
                                    <TbTrash className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        onClick={addDataPoint}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-indigo-500"
                    >
                        <TbPlus className="w-3 h-3" />
                        დამატება
                    </button>
                </div>
            </div>
        </NodeViewWrapper>
    )
}

// Chart Extension
export const ChartBlock = Node.create({
    name: 'chartBlock',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            chartType: {
                default: 'bar',
                parseHTML: (element: Element) => element.getAttribute('data-chart-type'),
                renderHTML: (attributes: Record<string, unknown>) => ({ 'data-chart-type': attributes.chartType }),
            },
            title: {
                default: 'გრაფიკი',
                parseHTML: (element: Element) => element.getAttribute('data-title'),
                renderHTML: (attributes: Record<string, unknown>) => ({ 'data-title': attributes.title }),
            },
            data: {
                default: [
                    { name: 'პუნქტი 1', value: 40 },
                    { name: 'პუნქტი 2', value: 65 },
                    { name: 'პუნქტი 3', value: 80 },
                    { name: 'პუნქტი 4', value: 55 },
                ],
                parseHTML: (element: Element) => {
                    try {
                        return JSON.parse(element.getAttribute('data-chart-data') || '[]')
                    } catch {
                        return []
                    }
                },
                renderHTML: (attributes: Record<string, unknown>) => ({ 'data-chart-data': JSON.stringify(attributes.data) }),
            },
        }
    },

    parseHTML() {
        return [{ tag: 'div[data-chart-block]' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-chart-block': '' })]
    },

    addNodeView() {
        return ReactNodeViewRenderer(ChartComponent)
    },
})

export default ChartBlock

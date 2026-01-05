'use client'

import { useState } from 'react'
import { TbSettings, TbCpu, TbTemperature, TbHash } from "react-icons/tb"
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

export interface ModelSettings {
    model: string
    temperature: number
    maxTokens: number
}

const AVAILABLE_MODELS = [
    { value: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', description: 'რეკომენდებული, ყველაზე ძლიერი' },
    { value: 'llama-3.1-70b-versatile', label: 'Llama 3.1 70B', description: 'სტაბილური ვერსია' },
    { value: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B', description: 'სწრაფი პასუხები' },
    { value: 'llama3-70b-8192', label: 'Llama 3 70B', description: 'კლასიკური მოდელი' },
    { value: 'llama3-8b-8192', label: 'Llama 3 8B', description: 'მსუბუქი მოდელი' },
    { value: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B', description: 'Mixture of Experts' },
    { value: 'gemma2-9b-it', label: 'Gemma 2 9B', description: 'Google-ის მოდელი' },
    { value: 'qwen-qwq-32b', label: 'Qwen QWQ 32B', description: 'Alibaba-ის მოდელი' },
]

interface ModelSelectorProps {
    settings: ModelSettings
    onSettingsChange: (settings: ModelSettings) => void
}

export function ModelSelector({ settings, onSettingsChange }: ModelSelectorProps) {
    const [isOpen, setIsOpen] = useState(false)

    const currentModel = AVAILABLE_MODELS.find(m => m.value === settings.model)

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <TbCpu className="w-4 h-4" />
                    <span className="hidden sm:inline">{currentModel?.label.split(' ')[0]} {currentModel?.label.split(' ')[1]}</span>
                    <TbSettings className="w-3 h-3 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                        <TbCpu className="w-4 h-4 text-primary" />
                        <h4 className="font-medium">AI მოდელის პარამეტრები</h4>
                    </div>

                    {/* Model Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">მოდელი</label>
                        <Select
                            value={settings.model}
                            onValueChange={(value) => onSettingsChange({ ...settings, model: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {AVAILABLE_MODELS.map((model) => (
                                    <SelectItem key={model.value} value={model.value}>
                                        <div className="flex flex-col">
                                            <span>{model.label}</span>
                                            <span className="text-xs text-muted-foreground">{model.description}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Temperature */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium flex items-center gap-1">
                                <TbTemperature className="w-3 h-3" />
                                ტემპერატურა
                            </label>
                            <span className="text-sm text-muted-foreground">{settings.temperature.toFixed(1)}</span>
                        </div>
                        <Slider
                            value={[settings.temperature]}
                            onValueChange={([value]) => onSettingsChange({ ...settings, temperature: value })}
                            min={0}
                            max={1}
                            step={0.1}
                            className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">
                            დაბალი = უფრო ზუსტი, მაღალი = უფრო კრეატიული
                        </p>
                    </div>

                    {/* Max Tokens */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium flex items-center gap-1">
                                <TbHash className="w-3 h-3" />
                                მაქს. ტოკენები
                            </label>
                            <span className="text-sm text-muted-foreground">{settings.maxTokens}</span>
                        </div>
                        <Slider
                            value={[settings.maxTokens]}
                            onValueChange={([value]) => onSettingsChange({ ...settings, maxTokens: value })}
                            min={256}
                            max={4096}
                            step={256}
                            className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">
                            მეტი ტოკენი = გრძელი პასუხები
                        </p>
                    </div>

                    {/* Reset Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => onSettingsChange({
                            model: 'llama-3.3-70b-versatile',
                            temperature: 0.7,
                            maxTokens: 1500
                        })}
                    >
                        სტანდარტული პარამეტრები
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

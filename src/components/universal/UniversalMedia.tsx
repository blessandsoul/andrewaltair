'use client';
import { motion } from 'framer-motion';
import { GalleryMasonry, ImageSlider, VideoEmbedCustom, AudioPodcast, CodeTerminal } from '@/types/universalSections';
import { useState } from 'react';
import { TbPlayerPlay, TbCopy, TbCheck, TbTerminal2 } from 'react-icons/tb';

// 11. Gallery Masonry
export function GalleryMasonryComponent({ data }: { data: GalleryMasonry }) {
    return (
        <div className="my-12 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {data.images.map((img, idx) => (
                <div key={idx} className={`relative group overflow-hidden rounded-xl ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                    <img src={img.url} alt={img.caption || ''} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    {img.caption && (
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                            {img.caption}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

// 12. Image Slider
export function ImageSliderComponent({ data }: { data: ImageSlider }) {
    // Simple version: Just showing first image if no carousel logic yet
    // Ideally use a library like Swiper or Embla, but custom minimal here
    return (
        <div className="my-10 relative rounded-2xl overflow-hidden shadow-2xl">
            <img src={data.items[0].url} className="w-full md:h-[500px] object-cover" />
            <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
                {data.items[0].label || 'Visualization'}
            </div>
        </div>
    );
}

// 13. Video Embed Custom
export function VideoEmbedCustomComponent({ data }: { data: VideoEmbedCustom }) {
    const [isPlaying, setIsPlaying] = useState(false);

    // Check if YouTube
    const isYoutube = data.url.includes('youtube') || data.url.includes('youtu.be');
    // Extract ID (simple regex)
    const yId = isYoutube ? data.url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/)?.[1] : null;

    if (isPlaying) {
        if (isYoutube && yId) {
            return (
                <iframe
                    src={`https://www.youtube.com/embed/${yId}?autoplay=1`}
                    className="w-full aspect-video rounded-2xl shadow-2xl my-8"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            )
        }
        return (
            <video src={data.url} controls autoPlay className="w-full aspect-video rounded-2xl shadow-2xl my-8" />
        )
    }

    return (
        <div className="relative w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden my-8 group cursor-pointer shadow-xl" onClick={() => setIsPlaying(true)}>
            <img src={data.thumbnail_url || `https://img.youtube.com/vi/${yId}/maxresdefault.jpg`} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform">
                    <TbPlayerPlay className="w-10 h-10 text-white fill-current translate-x-1" />
                </div>
            </div>
            {data.title && <div className="absolute bottom-6 left-6 text-white font-bold text-xl drop-shadow-md">{data.title}</div>}
        </div>
    );
}

// 14. Audio Podcast
export function AudioPodcastComponent({ data }: { data: AudioPodcast }) {
    return (
        <div className="my-8 p-4 bg-gray-900 rounded-2xl text-white flex items-center gap-4 shadow-xl">
            <div className="mb-0.5 w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center shrink-0">
                <TbPlayerPlay className="w-6 h-6 fill-current" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-purple-300 uppercase tracking-wider">Audio</div>
                <div className="font-bold truncate">{data.title}</div>
            </div>
            <div className="text-sm font-mono opacity-60 px-2">{data.duration || '00:00'}</div>
            {/* Simple Visualization Bars */}
            <div className="hidden md:flex gap-1 items-end h-8 opacity-50">
                {[4, 8, 3, 7, 5, 9, 4, 6, 3, 5].map((h, i) => <div key={i} className="w-1 bg-white" style={{ height: `${h}0%` }} />)}
            </div>
        </div>
    );
}

// 15. Code Terminal
export function CodeTerminalComponent({ data }: { data: CodeTerminal }) {
    const [copied, setCopied] = useState(false);

    return (
        <div className="my-10 rounded-xl overflow-hidden bg-[#1e1e1e] shadow-2xl border border-gray-800 font-mono text-sm leading-relaxed">
            <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-gray-800">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    </div>
                    {data.file_name && <span className="ml-3 text-gray-400 text-xs">{data.file_name}</span>}
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 uppercase">{data.lang}</span>
                    <button onClick={() => { navigator.clipboard.writeText(data.code); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-gray-400 hover:text-white transition-colors">
                        {copied ? <TbCheck className="w-4 h-4 text-green-500" /> : <TbCopy className="w-4 h-4" />}
                    </button>
                </div>
            </div>
            <div className="p-6 overflow-x-auto text-gray-300">
                <pre>{data.code}</pre>
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { TbBrandTwitter, TbBrandFacebook, TbBrandLinkedin, TbLink, TbCheck, TbShare } from 'react-icons/tb';

interface ShareButtonsProps {
    title: string;
    url?: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const shareLinks = [
        {
            name: 'Twitter',
            icon: TbBrandTwitter,
            url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            color: 'hover:bg-sky-500/10 hover:text-sky-500'
        },
        {
            name: 'Facebook',
            icon: TbBrandFacebook,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            color: 'hover:bg-blue-500/10 hover:text-blue-500'
        },
        {
            name: 'LinkedIn',
            icon: TbBrandLinkedin,
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            color: 'hover:bg-blue-700/10 hover:text-blue-700'
        }
    ];

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <TbShare size={16} />
                გაზიარება:
            </span>
            <div className="flex items-center gap-1">
                {shareLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 rounded-lg transition-colors ${link.color} text-muted-foreground`}
                        title={link.name}
                    >
                        <link.icon size={18} />
                    </a>
                ))}
                <button
                    onClick={copyToClipboard}
                    className={`p-2 rounded-lg transition-colors text-muted-foreground ${copied ? 'bg-green-500/10 text-green-500' : 'hover:bg-secondary'
                        }`}
                    title="ბმულის კოპირება"
                >
                    {copied ? <TbCheck size={18} /> : <TbLink size={18} />}
                </button>
            </div>
        </div>
    );
}

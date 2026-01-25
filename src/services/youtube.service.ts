
interface YouTubeMetadata {
    title: string
    description: string
    author_name: string
    author_url: string
    thumbnail_url: string
    html: string
    width: number
    height: number
    tags?: string[]
}

export class YoutubeService {
    static extractYouTubeId(url: string): string | null {
        const patterns = [
            /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
            /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^"&?\/\s]{11})/,
            /^[a-zA-Z0-9_-]{11}$/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1] || match[0];
        }
        return null;
    }

    static parseISO8601Duration(duration: string): string {
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) return '';

        const hours = match[1] ? parseInt(match[1]) : 0;
        const minutes = match[2] ? parseInt(match[2]) : 0;
        const seconds = match[3] ? parseInt(match[3]) : 0;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    static extractHashtagsFromDescription(description: string): string[] {
        const hashtagRegex = /#([\wა-ჰ]+)/gu;
        const matches = description.match(hashtagRegex) || [];
        const genericTags = new Set([
            'shorts', 'short', 'fyp', 'foryou', 'foryoupage', 'viral', 'video', 'videos',
            'meme', 'memes', 'funny', 'tiktok', 'reels', 'trending', 'subscribe',
            'ვიდეო', 'ვიდეოები', 'მიმი', 'მიმები', 'ხახაცილო', 'სასაცილო'
        ]);

        return matches
            .map(tag => tag.substring(1))
            .filter(tag => tag.length > 1 && !genericTags.has(tag.toLowerCase()));
    }

    static async getMetadata(urlOrId: string) {
        const videoId = this.extractYouTubeId(urlOrId);
        if (!videoId) throw new Error('Invalid YouTube URL or ID');

        let title = '';
        let description = '';
        let duration = '';
        let authorName = '';
        let authorUrl = '';
        let publishedAt = new Date().toISOString();
        let isShort = false;
        let tags: string[] = [];
        let authorAvatar = '';

        // 1. YouTube API
        const apiKey = process.env.YOUTUBE_API_KEY;
        if (apiKey) {
            try {
                const apiRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`);
                if (apiRes.ok) {
                    const data = await apiRes.json();
                    if (data.items?.length > 0) {
                        const item = data.items[0];
                        title = item.snippet?.title || '';
                        description = item.snippet?.description || '';
                        authorName = item.snippet?.channelTitle || '';
                        publishedAt = item.snippet?.publishedAt || new Date().toISOString();
                        duration = this.parseISO8601Duration(item.contentDetails?.duration || '');
                        tags = item.snippet?.tags || [];

                        // Channel Avatar
                        const channelId = item.snippet?.channelId;
                        if (channelId) {
                            try {
                                const channelRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`);
                                if (channelRes.ok) {
                                    const channelData = await channelRes.json();
                                    authorAvatar = channelData.items?.[0]?.snippet?.thumbnails?.default?.url || '';
                                }
                            } catch { }
                        }

                        // Short check
                        const durationMatch = item.contentDetails?.duration?.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
                        if (durationMatch) {
                            const mins = parseInt(durationMatch[1] || '0');
                            const secs = parseInt(durationMatch[2] || '0');
                            isShort = (mins === 0 && secs <= 60) || (mins === 1 && secs === 0);
                        }
                    }
                }
            } catch (e) {
                console.error('YouTube API Error:', e);
            }
        }

        // 2. Scraping Fallback
        if (!title) {
            try {
                const scrapeRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                        'Accept-Language': 'en-US,en;q=0.9',
                    }
                });

                if (scrapeRes.ok) {
                    const html = await scrapeRes.text();
                    const decodeHtml = (txt: string) => txt.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

                    // Title
                    const titleMatch = html.match(/<meta name="title" content="([^"]+)">/);
                    if (titleMatch) title = decodeHtml(titleMatch[1]);
                    else {
                        const jsonTitle = html.match(/"title":"([^"]+)"/);
                        if (jsonTitle) title = decodeHtml(jsonTitle[1]);
                    }

                    // Description
                    const descMatch = html.match(/<meta name="description" content="([^"]+)">/);
                    if (descMatch) description = decodeHtml(descMatch[1]);

                    // Duration
                    const durMatch = html.match(/itemprop="duration" content="([^"]+)"/);
                    if (durMatch) {
                        duration = this.parseISO8601Duration(durMatch[1]);
                        // Short check logic...
                    }

                    // Author
                    const authorMatch = html.match(/"author":"([^"]+)"/) || html.match(/<link itemprop="name" content="([^"]+)">/);
                    if (authorMatch) authorName = decodeHtml(authorMatch[1]);

                    // Date
                    const dateMatch = html.match(/itemprop="datePublished" content="([^"]+)"/);
                    if (dateMatch) publishedAt = dateMatch[1];
                }
            } catch (e) {
                console.error('Scraping Error:', e);
            }
        }

        // 3. oEmbed Fallback
        if (!title) {
            try {
                const oembedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
                if (oembedRes.ok) {
                    const oembedData: YouTubeMetadata = await oembedRes.json();
                    title = oembedData.title;
                    authorName = oembedData.author_name;
                    isShort = title.toLowerCase().includes('#short') || (oembedData.width < oembedData.height);
                } else {
                    throw new Error('Video not found or unavailable');
                }
            } catch {
                throw new Error('Video not found or unavailable');
            }
        }

        // Finalize
        const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        const descriptionTags = this.extractHashtagsFromDescription(description);
        const finalTags = descriptionTags.length > 0 ? descriptionTags : tags;

        return {
            videoId,
            data: {
                title,
                description,
                author: authorName,
                authorAvatar,
                authorUrl,
                thumbnail,
                thumbnails: {
                    default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
                    medium: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                    high: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                    maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                },
                duration,
                viewCount: 0,
                publishedAt,
                type: isShort ? 'short' : 'long',
                tags: finalTags
            }
        };
    }
}

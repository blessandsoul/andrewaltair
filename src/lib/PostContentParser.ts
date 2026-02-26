/**
 * Post Content Parser
 * Parses raw post content from Andrew's master prompt output into structured sections
 */

export interface ParsedSection {
    icon?: string;  // lucide icon name (e.g., 'Brain', 'Factory', 'AlertTriangle')
    title?: string;
    content: string;
    type: 'intro' | 'section' | 'sarcasm' | 'warning' | 'tip' | 'fact' | 'opinion' | 'cta' | 'hashtags' | 'author-comment' | 'prompt' | 'image';
}

// Emoji to section type mapping
const EMOJI_TYPE_MAP: Record<string, ParsedSection['type']> = {
    '🎭': 'sarcasm',
    '🔴': 'warning',
    '🟢': 'tip',
    '👁️': 'fact',
    '👁': 'fact',  // Sometimes rendered differently
    '👇': 'cta',
};

// Emoji to Lucide icon name mapping - COMPREHENSIVE 150+ EMOJIS
const EMOJI_TO_ICON: Record<string, string> = {
    // ═══════════════════════════════════════════════════════════════
    // CHARTS & TRENDS
    // ═══════════════════════════════════════════════════════════════
    '📉': 'TrendingDown',
    '📈': 'TrendingUp',
    '📊': 'BarChart3',
    '📋': 'ClipboardList',
    '📑': 'FileText',

    // ═══════════════════════════════════════════════════════════════
    // TECHNOLOGY & AI
    // ═══════════════════════════════════════════════════════════════
    '🏭': 'Factory',
    '🤖': 'Bot',
    '⚙️': 'Cog',
    '🔧': 'Wrench',
    '🛠️': 'Hammer',
    '🧬': 'Dna',
    '🧪': 'Flask',
    '💻': 'Laptop',
    '🖥️': 'Monitor',
    '📱': 'Smartphone',
    '⌨️': 'Keyboard',
    '🖱️': 'Mouse',
    '💾': 'HardDrive',
    '💿': 'Disc',
    '📡': 'Radio',
    '🔌': 'Plug',
    '🔋': 'Battery',
    '🧲': 'Magnet',
    '🔬': 'Microscope',
    '🔭': 'Telescope',
    '⚗️': 'Flask',
    '🧫': 'Flask',
    '🧮': 'Calculator',
    '🛸': 'Rocket',
    '🚀': 'Rocket',

    // ═══════════════════════════════════════════════════════════════
    // WORLD & GLOBE
    // ═══════════════════════════════════════════════════════════════
    '🌍': 'Globe',
    '🌐': 'Globe2',
    '🌎': 'Globe',
    '🌏': 'Globe',
    '🗺️': 'Map',
    '🧭': 'Compass',

    // ═══════════════════════════════════════════════════════════════
    // ALERTS & STATUS
    // ═══════════════════════════════════════════════════════════════
    '🔴': 'AlertTriangle',
    '🟢': 'Lightbulb',
    '🟡': 'AlertCircle',
    '🟠': 'AlertCircle',
    '🔵': 'Info',
    '🟣': 'Circle',
    '🚨': 'Siren',
    '⚠️': 'AlertTriangle',
    '🔔': 'Bell',
    '🔕': 'BellOff',
    '❌': 'X',
    '✅': 'Check',
    '✔️': 'Check',
    '❓': 'HelpCircle',
    '❗': 'AlertCircle',
    '‼️': 'AlertTriangle',
    '⁉️': 'HelpCircle',
    '🆘': 'AlertTriangle',
    '🆗': 'Check',
    '🆕': 'Sparkles',
    '🆓': 'Gift',

    // ═══════════════════════════════════════════════════════════════
    // EYES & VIEWS
    // ═══════════════════════════════════════════════════════════════
    '👁️': 'Eye',
    '👁': 'Eye',
    '👀': 'Eye',
    '🫣': 'EyeOff',
    '😶‍🌫️': 'EyeOff',
    '🔍': 'Search',
    '🔎': 'SearchCode',

    // ═══════════════════════════════════════════════════════════════
    // ARROWS & DIRECTIONS
    // ═══════════════════════════════════════════════════════════════
    '👇': 'ArrowDown',
    '👆': 'ArrowUp',
    '👉': 'ArrowRight',
    '👈': 'ArrowLeft',
    '⬆️': 'ArrowUp',
    '⬇️': 'ArrowDown',
    '➡️': 'ArrowRight',
    '⬅️': 'ArrowLeft',
    '↗️': 'ArrowUpRight',
    '↘️': 'ArrowDownRight',
    '↙️': 'ArrowDownLeft',
    '↖️': 'ArrowUpLeft',
    '🔄': 'RefreshCw',
    '🔃': 'RefreshCcw',
    '🔀': 'Shuffle',
    '🔁': 'Repeat',
    '🔂': 'Repeat1',

    // ═══════════════════════════════════════════════════════════════
    // ENTERTAINMENT & MEDIA
    // ═══════════════════════════════════════════════════════════════
    '🎭': 'Theater',
    '🎬': 'Clapperboard',
    '🎮': 'Gamepad2',
    '🎧': 'Headphones',
    '🎤': 'Mic',
    '🎵': 'Music',
    '🎶': 'Music2',
    '🎹': 'Piano',
    '🎸': 'Guitar',
    '🎺': 'Music',
    '🎷': 'Music',
    '🎻': 'Music',
    '📺': 'Tv',
    '📻': 'Radio',
    '📷': 'Camera',
    '📸': 'Camera',
    '📹': 'Video',
    '🎥': 'Video',
    '📽️': 'Projector',
    '🎞️': 'Film',

    // ═══════════════════════════════════════════════════════════════
    // BRAIN & MIND
    // ═══════════════════════════════════════════════════════════════
    '🧠': 'Brain',
    '💭': 'MessageCircle',
    '💡': 'Lightbulb',
    '💫': 'Sparkles',
    '🌀': 'Loader',
    '🤔': 'HelpCircle',
    '💤': 'Moon',

    // ═══════════════════════════════════════════════════════════════
    // MONEY & VALUE
    // ═══════════════════════════════════════════════════════════════
    '💰': 'Coins',
    '💎': 'Gem',
    '💵': 'Banknote',
    '💸': 'BadgeDollarSign',
    '💳': 'CreditCard',
    '💲': 'DollarSign',
    '💱': 'ArrowLeftRight',
    '🏦': 'Building',
    '🪙': 'Coins',
    '💴': 'Banknote',
    '💶': 'Banknote',
    '💷': 'Banknote',

    // ═══════════════════════════════════════════════════════════════
    // ELEMENTS & EFFECTS
    // ═══════════════════════════════════════════════════════════════
    '🔹': 'ChevronRight',
    '🔸': 'ChevronRight',
    '💧': 'Droplet',
    '⚡': 'Zap',
    '🔥': 'Flame',
    '❄️': 'Snowflake',
    '☀️': 'Sun',
    '🌙': 'Moon',
    '⭐': 'Star',
    '🌟': 'Star',
    '💥': 'Bomb',
    '☁️': 'Cloud',
    '🌈': 'Rainbow',
    '🌊': 'Waves',
    '🍃': 'Leaf',
    '🌸': 'Flower',
    '🌺': 'Flower2',
    '🌻': 'Sunflower',
    '🌲': 'TreePine',
    '🌳': 'TreeDeciduous',

    // ═══════════════════════════════════════════════════════════════
    // TARGETS & PINS
    // ═══════════════════════════════════════════════════════════════
    '🎯': 'Target',
    '📌': 'Pin',
    '📍': 'MapPin',
    '🏁': 'Flag',
    '🚩': 'Flag',
    '🎪': 'Tent',

    // ═══════════════════════════════════════════════════════════════
    // EFFECTS & MAGIC
    // ═══════════════════════════════════════════════════════════════
    '✨': 'Sparkles',
    '🪄': 'Wand2',
    '🎆': 'PartyPopper',
    '🎇': 'Sparkles',
    '🎉': 'PartyPopper',
    '🎊': 'Confetti',

    // ═══════════════════════════════════════════════════════════════
    // DANGER & WARNING
    // ═══════════════════════════════════════════════════════════════
    '💀': 'Skull',
    '☠️': 'Skull',
    '🪦': 'Skull',
    '⚰️': 'Skull',
    '💣': 'Bomb',
    '🧨': 'Bomb',
    '☢️': 'Radiation',
    '☣️': 'Biohazard',
    '⛔': 'Ban',
    '🚫': 'Ban',
    '🚷': 'UserX',
    '🚯': 'Trash2',
    '🚳': 'BikeOff',
    '🚱': 'DropletOff',

    // ═══════════════════════════════════════════════════════════════
    // TIME
    // ═══════════════════════════════════════════════════════════════
    '⏳': 'Hourglass',
    '⌛': 'Hourglass',
    '🕐': 'Clock',
    '🕑': 'Clock2',
    '🕒': 'Clock3',
    '🕓': 'Clock4',
    '⏰': 'AlarmClock',
    '⏱️': 'Timer',
    '⏲️': 'TimerReset',
    '📅': 'Calendar',
    '📆': 'CalendarDays',
    '🗓️': 'CalendarRange',

    // ═══════════════════════════════════════════════════════════════
    // COMMUNICATION
    // ═══════════════════════════════════════════════════════════════
    '📢': 'Megaphone',
    '📣': 'Megaphone',
    '💬': 'MessageSquare',
    '🗣️': 'MessagesSquare',
    '📧': 'Mail',
    '📨': 'MailOpen',
    '📩': 'MailPlus',
    '📤': 'Upload',
    '📥': 'Download',
    '📫': 'Mailbox',
    '📪': 'Mailbox',
    '📬': 'Mailbox',
    '📭': 'Mailbox',
    '✉️': 'Mail',
    '📞': 'Phone',
    '📲': 'Smartphone',
    '☎️': 'Phone',

    // ═══════════════════════════════════════════════════════════════
    // SECURITY
    // ═══════════════════════════════════════════════════════════════
    '🔒': 'Lock',
    '🔓': 'Unlock',
    '🛡️': 'Shield',
    '🔐': 'KeyRound',
    '🗝️': 'Key',
    '🔑': 'Key',
    '🛂': 'UserCheck',
    '🛃': 'Package',
    '🛄': 'Briefcase',
    '🛅': 'Luggage',

    // ═══════════════════════════════════════════════════════════════
    // DOCUMENTS & OFFICE
    // ═══════════════════════════════════════════════════════════════
    '📄': 'FileText',
    '📝': 'PenLine',
    '📃': 'File',
    '📒': 'BookOpen',
    '📓': 'BookOpen',
    '📔': 'BookOpen',
    '📕': 'BookMarked',
    '📖': 'BookOpen',
    '📗': 'BookOpen',
    '📘': 'BookOpen',
    '📙': 'BookOpen',
    '📚': 'Library',
    '📰': 'Newspaper',
    '🗞️': 'Newspaper',
    '📁': 'Folder',
    '📂': 'FolderOpen',
    '🗂️': 'FolderTree',
    '📎': 'Paperclip',
    '🖇️': 'Paperclip',
    '✂️': 'Scissors',
    '📏': 'Ruler',
    '📐': 'Triangle',
    '✏️': 'Pencil',
    '✒️': 'Pen',
    '🖊️': 'Pen',
    '🖋️': 'PenTool',
    '🖌️': 'Paintbrush',
    '🖍️': 'Highlighter',

    // ═══════════════════════════════════════════════════════════════
    // HEARTS & LOVE
    // ═══════════════════════════════════════════════════════════════
    '❤️': 'Heart',
    '🧡': 'Heart',
    '💛': 'Heart',
    '💚': 'Heart',
    '💙': 'Heart',
    '💜': 'Heart',
    '🖤': 'Heart',
    '🤍': 'Heart',
    '🤎': 'Heart',
    '💔': 'HeartCrack',
    '❤️‍🔥': 'HeartHandshake',
    '💕': 'Hearts',
    '💗': 'HeartPulse',
    '💓': 'HeartPulse',
    '💖': 'Sparkles',

    // ═══════════════════════════════════════════════════════════════
    // SPORTS & GAMES
    // ═══════════════════════════════════════════════════════════════
    '⚽': 'Circle',
    '🏀': 'Circle',
    '🏈': 'Oval',
    '⚾': 'Circle',
    '🎾': 'Circle',
    '🏐': 'Circle',
    '🏉': 'Oval',
    '🎱': 'Circle',
    '🎳': 'Bowling',
    '🏏': 'Axe',
    '🏒': 'Sword',
    '🏓': 'Sword',
    '🏸': 'Sword',
    '🎲': 'Dice1',
    '🃏': 'Spade',
    '♠️': 'Spade',
    '♥️': 'Heart',
    '♦️': 'Diamond',
    '♣️': 'Club',
    '🎰': 'Gamepad2',

    // ═══════════════════════════════════════════════════════════════
    // MISCELLANEOUS
    // ═══════════════════════════════════════════════════════════════
    '🎁': 'Gift',
    '🎀': 'Gift',
    '🔗': 'Link',
    '🏆': 'Trophy',
    '🎖️': 'Medal',
    '🥇': 'Medal',
    '🥈': 'Medal',
    '🥉': 'Medal',
    '🪤': 'MousePointer',
    '🧯': 'Flame',
    '🪣': 'Bucket',
    '🧹': 'Brush',
    '🧺': 'ShoppingBasket',
    '🧴': 'Droplet',
    '🪥': 'Brush',
    '🧽': 'Eraser',
    '🪒': 'Scissors',
    '🧻': 'Scroll',
    '🚿': 'Shower',
    '🛁': 'Bath',
    '🛋️': 'Armchair',
    '🪑': 'Armchair',
    '🛏️': 'Bed',
    '🚪': 'DoorOpen',
    '🪞': 'Square',
    '🪟': 'Square',
    '🏠': 'Home',
    '🏡': 'Home',
    '🏢': 'Building',
    '🏣': 'Building2',
    '🏤': 'Building2',
    '🏥': 'Hospital',
    '🏨': 'Hotel',
    '🏩': 'Heart',
    '🏪': 'Store',
    '🏫': 'School',
    '🏬': 'Building',
    '🏯': 'Castle',
    '🏰': 'Castle',

    // ═══════════════════════════════════════════════════════════════
    // TRANSPORT
    // ═══════════════════════════════════════════════════════════════
    '🚗': 'Car',
    '🚕': 'Car',
    '🚙': 'Car',
    '🚌': 'Bus',
    '🚎': 'Bus',
    '🏎️': 'Car',
    '🚓': 'Car',
    '🚑': 'Ambulance',
    '🚒': 'Flame',
    '🚐': 'Car',
    '🛻': 'Truck',
    '🚚': 'Truck',
    '🚛': 'Truck',
    '🚜': 'Tractor',
    '🏍️': 'Bike',
    '🛵': 'Bike',
    '🚲': 'Bike',
    '🛴': 'Footprints',
    '🛹': 'Footprints',
    '🛼': 'Footprints',
    '✈️': 'Plane',
    '🛫': 'PlaneTakeoff',
    '🛬': 'PlaneLanding',
    '🚁': 'Helicopter',
    '🛶': 'Ship',
    '⛵': 'Sailboat',
    '🚤': 'Ship',
    '🛥️': 'Ship',
    '🛳️': 'Ship',
    '⛴️': 'Ship',
    '🚢': 'Ship',
    '🚂': 'Train',
    '🚃': 'Train',
    '🚄': 'Train',
    '🚅': 'Train',
    '🚆': 'Train',
    '🚇': 'Train',
    '🚈': 'Train',
    '🚉': 'Train',
    '🚊': 'Tram',

    // ═══════════════════════════════════════════════════════════════
    // ANIMALS
    // ═══════════════════════════════════════════════════════════════
    '🐶': 'Dog',
    '🐱': 'Cat',
    '🐭': 'Mouse',
    '🐹': 'Squirrel',
    '🐰': 'Rabbit',
    '🦊': 'Fox',
    '🐻': 'Bear',
    '🐼': 'PandaIcon',
    '🐨': 'Bear',
    '🐯': 'Cat',
    '🦁': 'Cat',
    '🐮': 'Beef',
    '🐷': 'Pig',
    '🐸': 'Bug',
    '🐵': 'Banana',
    '🐔': 'Bird',
    '🐧': 'Bird',
    '🐦': 'Bird',
    '🐤': 'Bird',
    '🦆': 'Bird',
    '🦅': 'Bird',
    '🦉': 'Bird',
    '🦇': 'Bird',
    '🐺': 'Dog',
    '🐗': 'Pig',
    '🐴': 'Horse',
    '🦄': 'Sparkles',
    '🐝': 'Bug',
    '🐛': 'Bug',
    '🦋': 'Butterfly',
    '🐌': 'Snail',
    '🐞': 'Bug',
    '🐜': 'Bug',
    '🦟': 'Bug',
    '🦗': 'Bug',
    '🕷️': 'Bug',
    '🦂': 'Bug',
    '🐢': 'Turtle',
    '🐍': 'Snake',
    '🦎': 'Snake',
    '🦖': 'Bone',
    '🦕': 'Bone',
    '🐙': 'Octagon',
    '🦑': 'Octagon',
    '🦐': 'Fish',
    '🦞': 'Fish',
    '🦀': 'Fish',
    '🐡': 'Fish',
    '🐠': 'Fish',
    '🐟': 'Fish',
    '🐬': 'Fish',
    '🐳': 'Whale',
    '🐋': 'Whale',
    '🦈': 'Fish',
    '🐊': 'Bug',
    '🐆': 'Cat',
    '🐅': 'Cat',
    '🐃': 'Beef',
    '🐂': 'Beef',
    '🐄': 'Beef',
    '🦌': 'Deer',
    '🐪': 'Mountain',
    '🐫': 'Mountain',
    '🦙': 'Mountain',
    '🦒': 'Mountain',
    '🐘': 'Elephant',
    '🦣': 'Elephant',
    '🦏': 'Mountain',
    '🦛': 'Mountain',
    '🐁': 'Mouse',
    '🐀': 'Mouse',
    '🐇': 'Rabbit',
    '🐈': 'Cat',
    '🐩': 'Dog',
    '🦮': 'Dog',
    '🐕': 'Dog',
    '🐕‍🦺': 'Dog',
    '🐈‍⬛': 'Cat',
    '🐓': 'Bird',
    '🦃': 'Bird',
    '🦤': 'Bird',
    '🦚': 'Bird',
    '🦜': 'Bird',
    '🦢': 'Bird',
    '🦩': 'Bird',
    '🕊️': 'Bird',
    '🦝': 'Squirrel',
    '🦨': 'Squirrel',
    '🦡': 'Squirrel',
    '🦫': 'Squirrel',
    '🦦': 'Fish',
    '🦥': 'Sloth',
    '🐿️': 'Squirrel',
    '🦔': 'Circle',
};

// Section marker emojis (generic sections)
const SECTION_EMOJIS = ['🔹', '💧', '💰', '💎', '⚡', '🔥', '💡', '🎯', '📌', '✨', '🧬', '🧠', '💀', '⏳', '🚨', '🔒', '🎁', '🏆'];

// Opinion detection patterns
const OPINION_PATTERNS = [
    /^მე ვფიქრობ/,
    /^ჩემი აზრით/,
    /^მე მჯერა/,
];

// Clean content from ** markers
function cleanContent(text: string): string {
    return text
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .trim();
}

/**
 * Parse raw post content into structured sections
 */
export function parsePostContent(rawContent: string): ParsedSection[] {
    if (!rawContent || !rawContent.trim()) {
        return [];
    }

    const sections: ParsedSection[] = [];
    const lines = rawContent.split('\n');

    let currentSection: ParsedSection | null = null;
    let introComplete = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Skip empty lines
        if (!line) {
            if (currentSection) {
                currentSection.content += '\n';
            }
            continue;
        }

        // Check for code block start (```)
        if (line.startsWith('```')) {
            // Save current section
            if (currentSection) {
                sections.push(currentSection);
                currentSection = null;
            }

            // Extract language identifier if present (e.g., ```text, ```python)
            const lang = line.slice(3).trim();

            // Collect code block content until closing ```
            const codeLines: string[] = [];
            i++; // Move to next line

            while (i < lines.length && !lines[i].trim().startsWith('```')) {
                codeLines.push(lines[i]); // Keep original whitespace for code
                i++;
            }
            // i now points to closing ``` or end of lines

            // Create prompt section with the code content
            if (codeLines.length > 0) {
                sections.push({
                    icon: 'Code',
                    title: lang ? `კოდი (${lang})` : 'კოდი / ბრძანება',
                    content: codeLines.join('\n').trim(),
                    type: 'prompt',
                });
            }

            introComplete = true;
            continue;
        }

        // Check for hashtag line
        if (line.startsWith('#') && line.includes('#') && !line.startsWith('##')) {
            // This is a hashtag line
            if (currentSection) {
                sections.push(currentSection);
            }
            sections.push({
                content: line,
                type: 'hashtags',
            });
            currentSection = null;
            continue;
        }

        // Check for > Quote/Opinion/TL;DR block
        if (line.startsWith('>')) {
            // Check for TL;DR specifically
            if (line.includes('TL;DR') || line.includes('tl;dr')) {
                if (currentSection) {
                    sections.push(currentSection);
                }
                const content = line.replace(/^>\s*/, '').replace(/TL;DR:?/i, '').trim();
                currentSection = {
                    icon: 'Zap',
                    title: 'მოკლედ',
                    content: cleanContent(content),
                    type: 'section',
                };
                introComplete = true;
                continue;
            }

            // Regular quote or opinion
            if (currentSection) {
                sections.push(currentSection);
            }
            currentSection = {
                icon: 'Quote',
                content: cleanContent(line.replace(/^>\s*/, '')),
                type: 'opinion',
            };
            introComplete = true;
            continue;
        }

        // Check for emoji-prefixed section
        // We use a specific regex for DETECTION (must be a real emoji)
        const detectionRegex = /^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/u;
        const emojiMatch = line.match(detectionRegex);

        if (emojiMatch) {
            const firstEmoji = emojiMatch[0];

            // Save current section
            if (currentSection) {
                sections.push(currentSection);
            }

            // Determine section type based on the FIRST emoji
            let type: ParsedSection['type'] = 'section';
            if (EMOJI_TYPE_MAP[firstEmoji]) {
                type = EMOJI_TYPE_MAP[firstEmoji];
            } else if (SECTION_EMOJIS.includes(firstEmoji)) {
                type = 'section';
            }

            // Get icon from the FIRST emoji
            // Handle VS16 in lookup if necessary
            const icon = EMOJI_TO_ICON[firstEmoji] || EMOJI_TO_ICON[firstEmoji.replace(/\uFE0F/g, '')] || 'ChevronRight';

            // Clean content: aggressively strip ALL leading emojis, VS16s, and spaces
            // Regex for CLEANING includes emojis, VS16, and spaces
            const cleaningRegex = /^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|\u{FE0F}| )/u;

            let cleanLine = line;
            while (cleaningRegex.test(cleanLine)) {
                cleanLine = cleanLine.replace(cleaningRegex, '').trim();
            }

            // Extract title if present (bold text after emoji)
            const titleMatch = cleanLine.match(/^\s*\*\*([^*]+)\*\*:?\s*(.*)/);
            const titleWithDashMatch = cleanLine.match(/^\s*\*\*([^*]+)\*\*\s*[-–—]\s*(.*)/);

            if (titleWithDashMatch) {
                currentSection = {
                    icon,
                    title: cleanContent(titleWithDashMatch[1]),
                    content: cleanContent(titleWithDashMatch[2]),
                    type,
                };
            } else if (titleMatch) {
                currentSection = {
                    icon,
                    title: cleanContent(titleMatch[1]),
                    content: cleanContent(titleMatch[2]),
                    type,
                };
            } else {
                // No title, just content
                currentSection = {
                    icon,
                    content: cleanContent(cleanLine),
                    type,
                };
            }

            introComplete = true;
            continue;
        }

        // Check for opinion block (legacy pattern check)
        if (OPINION_PATTERNS.some(pattern => pattern.test(line))) {
            if (currentSection) {
                sections.push(currentSection);
            }
            currentSection = {
                icon: 'Quote',
                content: cleanContent(line),
                type: 'opinion',
            };
            introComplete = true;
            continue;
        }

        // Regular content
        if (!introComplete && !currentSection) {
            // This is intro content
            currentSection = {
                content: cleanContent(line),
                type: 'intro',
            };
        } else if (currentSection) {
            // Append to current section
            currentSection.content += '\n' + cleanContent(line);
        } else {
            // Start new generic section
            currentSection = {
                content: cleanContent(line),
                type: 'section',
            };
        }
    }

    // Save last section
    if (currentSection) {
        sections.push(currentSection);
    }

    // Clean up sections
    return sections.map(section => ({
        ...section,
        content: section.content.trim(),
    })).filter(section => section.content);
}

/**
 * Extract hashtags from content
 */
export function extractHashtags(content: string): string[] {
    const hashtagRegex = /#[\u10A0-\u10FFa-zA-Z0-9_]+/g;
    const matches = content.match(hashtagRegex);
    return matches ? [...new Set(matches)] : [];
}

/**
 * Extract title from first line (usually ends with emoji)
 */
export function extractTitle(content: string): string {
    const firstLine = content.split('\n')[0].trim();
    // Remove trailing emoji if present
    return firstLine.replace(/[\u{1F300}-\u{1F9FF}]+$/u, '').trim();
}

/**
 * Extract excerpt from content (first paragraph after title)
 */
export function extractExcerpt(content: string, maxLength: number = 200): string {
    const lines = content.split('\n').filter(l => l.trim());
    if (lines.length < 2) return '';

    // Skip title line, get next meaningful paragraph
    let excerpt = '';
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        // Skip emoji-prefixed lines
        if (/^[\u{1F300}-\u{1F9FF}]/u.test(line)) continue;
        // Skip hashtag lines
        if (line.startsWith('#')) continue;

        excerpt = line;
        break;
    }

    if (excerpt.length > maxLength) {
        return excerpt.slice(0, maxLength) + '...';
    }
    return excerpt;
}

/**
 * Calculate reading time based on content
 */
export function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Parse multi-channel content format
 * Separates Main article, Telegram content, and Meta commentary
 * Also extracts prompts and music info
 */
export interface MultiChannelParsed {
    mainContent: string;
    telegramContent: string;
    metaContent: string;
    prompts: {
        horizontal: string;
        vertical: string;
    };
    music: string;
    rating: string;
}

export function parseMultiChannelContent(fullText: string): MultiChannelParsed {
    const result: MultiChannelParsed = {
        mainContent: '',
        telegramContent: '',
        metaContent: '',
        prompts: { horizontal: '', vertical: '' },
        music: '',
        rating: ''
    };

    if (!fullText) return result;

    // 1. Split by main delimiters
    let sections = {
        main: fullText,
        telegram: '',
        meta: ''
    };

    // Find Telegram Section
    if (fullText.includes('--- [START OF TELEGRAM] ---')) {
        const parts = fullText.split('--- [START OF TELEGRAM] ---');
        sections.main = parts[0].trim();
        sections.telegram = parts[1].trim();

        // Check if Meta is inside Telegram part (it should be)
        if (sections.telegram.includes('--- [START OF META] ---')) {
            const teleParts = sections.telegram.split('--- [START OF META] ---');
            sections.telegram = teleParts[0].trim();
            sections.meta = teleParts[1].trim();
        }
        // Or if Meta is in main (unlikely based on example) but for safety:
        else if (sections.main.includes('--- [START OF META] ---')) {
            const mainParts = sections.main.split('--- [START OF META] ---');
            sections.main = mainParts[0].trim();
            sections.meta = mainParts[1].trim() + '\n' + sections.telegram; // This logic is weird, sticking to the standard Format
        }
    } else if (fullText.includes('--- [START OF META] ---')) {
        // Only Meta present
        const parts = fullText.split('--- [START OF META] ---');
        sections.main = parts[0].trim();
        sections.meta = parts[1].trim();
    }

    // 2. Clean up Main Content (remove any trailing ---)
    sections.main = sections.main.replace(/---\s*$/, '').trim();

    // 3. Process Meta Section to extract Prompts, Music, Rating which are usually at the end of Meta
    // or at the end of whatever section they are in.

    // Helper to extract and remove patterns
    const extractAndRemove = (text: string): string => {
        let processed = text;

        // Extract Music
        // Pattern: 🎶 Artist - Title (Genre)
        const musicMatch = processed.match(/🎶\s*([^\n]+)/);
        if (musicMatch) {
            result.music = musicMatch[1].trim();
            // Remove the line
            processed = processed.replace(musicMatch[0], '');
        }

        // Extract Star/Rating
        // Pattern: ⭐️ Text
        const ratingMatch = processed.match(/⭐️\s*([^\n]+)/);
        if (ratingMatch) {
            result.rating = ratingMatch[1].trim();
            // Remove the line
            processed = processed.replace(ratingMatch[0], '');
        }

        // Extract Prompts (Block based)
        // Look for ```Prompt: ... ``` blocks
        const codeBlockRegex = /```[\s\S]*?```/g;
        const codeBlocks = processed.match(codeBlockRegex) || [];

        codeBlocks.forEach(block => {
            if (block.toLowerCase().includes('prompt:')) {
                // Determine if vertical or horizontal
                if (block.toLowerCase().includes('vertical') || block.toLowerCase().includes('9:16')) {
                    result.prompts.vertical = block.replace(/```/g, '').trim();
                } else if (block.toLowerCase().includes('horizontal') || block.toLowerCase().includes('16:9')) {
                    result.prompts.horizontal = block.replace(/```/g, '').trim();
                }
                // Remove the block from content
                processed = processed.replace(block, '');
            }
        });

        // Also clean up any loose "---" lines that might have separated these items
        processed = processed.replace(/\n\s*---\s*\n/g, '\n').trim();
        processed = processed.replace(/\n\s*---\s*$/g, '').trim();

        return processed;
    };

    // Apply extraction to Meta section (where they are most likely to be)
    // But if Meta is missing, they might be in Telegram or Main? 
    // Usually they are at the very end of the file.

    // If we have a 'Meta' section, the extra info is likely there.
    if (sections.meta) {
        sections.meta = extractAndRemove(sections.meta);
    }
    // If no Meta, check Telegram (if it was the last part)
    else if (sections.telegram) {
        sections.telegram = extractAndRemove(sections.telegram);
    }
    // If no Telegram, check Main
    else {
        sections.main = extractAndRemove(sections.main);
    }

    result.mainContent = sections.main;
    result.telegramContent = sections.telegram;
    result.metaContent = sections.meta;

    return result;
}

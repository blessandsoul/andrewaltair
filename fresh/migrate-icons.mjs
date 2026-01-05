#!/usr/bin/env node
/**
 * Automated Lucide to Tabler Icons Migration Script
 * Run with: node migrate-icons.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

// Mapping from Lucide to Tabler Icons
const iconMapping = {
    // Arrows & Navigation
    'ArrowRight': 'TbArrowRight',
    'ArrowLeft': 'TbArrowLeft',
    'ArrowUp': 'TbArrowUp',
    'ArrowDown': 'TbArrowDown',
    'ChevronRight': 'TbChevronRight',
    'ChevronLeft': 'TbChevronLeft',
    'ChevronUp': 'TbChevronUp',
    'ChevronDown': 'TbChevronDown',
    'ExternalLink': 'TbExternalLink',
    'Link': 'TbLink',
    'Home': 'TbHome',
    'Menu': 'TbMenu2',
    'X': 'TbX',
    'MoreHorizontal': 'TbDotsHorizontal',
    'MoreVertical': 'TbDotsVertical',

    // Actions
    'Search': 'TbSearch',
    'Filter': 'TbFilter',
    'Check': 'TbCheck',
    'Plus': 'TbPlus',
    'Minus': 'TbMinus',
    'Edit': 'TbEdit',
    'Trash': 'TbTrash',
    'Trash2': 'TbTrash',
    'Copy': 'TbCopy',
    'Download': 'TbDownload',
    'Upload': 'TbUpload',
    'Share': 'TbShare',
    'Share2': 'TbShare',
    'Save': 'TbDeviceFloppy',
    'RotateCcw': 'TbRefresh',
    'Refresh': 'TbRefresh',
    'RefreshCw': 'TbRefresh',
    'Settings': 'TbSettings',
    'LogIn': 'TbLogin',
    'LogOut': 'TbLogout',

    // User & Social
    'User': 'TbUser',
    'Users': 'TbUsers',
    'UserPlus': 'TbUserPlus',
    'UserMinus': 'TbUserMinus',
    'Mail': 'TbMail',
    'Send': 'TbSend',
    'MessageCircle': 'TbMessage',
    'MessageSquare': 'TbMessage',
    'Heart': 'TbHeart',
    'Star': 'TbStar',
    'ThumbsUp': 'TbThumbUp',
    'ThumbsDown': 'TbThumbDown',

    // Media & Content
    'Image': 'TbPhoto',
    'Video': 'TbVideo',
    'Play': 'TbPlayerPlay',
    'Pause': 'TbPlayerPause',
    'Volume': 'TbVolume',
    'Volume2': 'TbVolume',
    'VolumeX': 'TbVolumeOff',
    'Camera': 'TbCamera',
    'Mic': 'TbMicrophone',
    'FileText': 'TbFileText',
    'File': 'TbFile',
    'Folder': 'TbFolder',
    'Paperclip': 'TbPaperclip',
    'Book': 'TbBook',
    'BookOpen': 'TbBookOpen',

    // UI Elements
    'Eye': 'TbEye',
    'EyeOff': 'TbEyeOff',
    'Lock': 'TbLock',
    'Unlock': 'TbLockOpen',
    'Key': 'TbKey',
    'Shield': 'TbShield',
    'ShieldCheck': 'TbShieldCheck',
    'Bell': 'TbBell',
    'BellOff': 'TbBellOff',
    'Calendar': 'TbCalendar',
    'Clock': 'TbClock',
    'Tag': 'TbTag',
    'Tags': 'TbTags',
    'Bookmark': 'TbBookmark',
    'Heart': 'TbHeart',

    // Status & Alerts
    'AlertTriangle': 'TbAlertTriangle',
    'AlertCircle': 'TbAlertCircle',
    'Info': 'TbInfoCircle',
    'HelpCircle': 'TbHelp',
    'CheckCircle': 'TbCircleCheck',
    'XCircle': 'TbCircleX',

    // Objects
    'Sun': 'TbSun',
    'Moon': 'TbMoon',
    'Monitor': 'TbDeviceDesktop',
    'Laptop': 'TbDeviceLaptop',
    'Smartphone': 'TbDeviceMobile',
    'Tablet': 'TbDeviceTablet',
    'Globe': 'TbWorld',
    'Map': 'TbMap',
    'MapPin': 'TbMapPin',
    'Zap': 'TbBolt',
    'Flame': 'TbFlame',
    'Sparkles': 'TbSparkles',
    'Trophy': 'TbTrophy',
    'Award': 'TbAward',
    'Crown': 'TbCrown',
    'Gift': 'TbGift',
    'Cookie': 'TbCookie',

    // Chart & Analytics
    'TrendingUp': 'TbTrendingUp',
    'TrendingDown': 'TbTrendingDown',
    'BarChart': 'TbChartBar',
    'BarChart2': 'TbChartBar',
    'BarChart3': 'TbChartBar',
    'PieChart': 'TbChartPie',
    'LineChart': 'TbChartLine',
    'Activity': 'TbActivity',

    // Business
    'Briefcase': 'TbBriefcase',
    'Building': 'TbBuilding',
    'CreditCard': 'TbCreditCard',
    'DollarSign': 'TbCurrencyDollar',
    'ShoppingCart': 'TbShoppingCart',
    'ShoppingBag': 'TbShoppingBag',
    'Package': 'TbPackage',

    // Education
    'GraduationCap': 'TbSchool',
    'Lightbulb': 'TbBulb',
    'Rocket': 'TbRocket',
    'Target': 'TbTarget',
    'Compass': 'TbCompass',

    // Social Brands
    'Youtube': 'TbBrandYoutube',
    'Instagram': 'TbBrandInstagram',
    'Twitter': 'TbBrandTwitter',
    'Facebook': 'TbBrandFacebook',
    'Github': 'TbBrandGithub',
    'Linkedin': 'TbBrandLinkedin',

    // Layout
    'Layout': 'TbLayout',
    'LayoutGrid': 'TbLayoutGrid',
    'Grid': 'TbGrid',
    'List': 'TbList',
    'Columns': 'TbColumns',
    'Rows': 'TbRows',

    // Code & Dev
    'Code': 'TbCode',
    'Terminal': 'TbTerminal',
    'Database': 'TbDatabase',
    'Server': 'TbServer',
    'Cloud': 'TbCloud',
    'CloudUpload': 'TbCloudUpload',
    'CloudDownload': 'TbCloudDownload',

    // Misc
    'Loader': 'TbLoader',
    'Loader2': 'TbLoader2',
    'Wand': 'TbWand',
    'Wand2': 'TbWand',
    'Bot': 'TbRobot',
    'Brain': 'TbBrain',
    'Atom': 'TbAtom',
    'Fingerprint': 'TbFingerprint',
    'QrCode': 'TbQrcode',
    'Palette': 'TbPalette',
    'Brush': 'TbBrush',
    'Pen': 'TbPencil',
    'Pencil': 'TbPencil',
    'Type': 'TbTypography',
    'Bold': 'TbBold',
    'Italic': 'TbItalic',
    'Underline': 'TbUnderline',
    'AlignLeft': 'TbAlignLeft',
    'AlignCenter': 'TbAlignCenter',
    'AlignRight': 'TbAlignRight',
};

function getAllTsxFiles(dir, files = []) {
    const items = readdirSync(dir);
    for (const item of items) {
        const fullPath = join(dir, item);
        if (statSync(fullPath).isDirectory()) {
            // Skip node_modules and .next
            if (!item.startsWith('.') && item !== 'node_modules') {
                getAllTsxFiles(fullPath, files);
            }
        } else if (extname(item) === '.tsx') {
            files.push(fullPath);
        }
    }
    return files;
}

function migrateFile(filePath) {
    let content = readFileSync(filePath, 'utf-8');
    const originalContent = content;

    // Check if file has lucide-react import
    if (!content.includes('lucide-react')) {
        return { changed: false };
    }

    let changedIcons = [];

    // Replace import statement
    const importRegex = /import\s*{([^}]+)}\s*from\s*['"]lucide-react['"]/g;

    content = content.replace(importRegex, (match, imports) => {
        const iconNames = imports.split(',').map(s => s.trim()).filter(Boolean);
        const tablerIcons = [];

        for (const icon of iconNames) {
            const tablerIcon = iconMapping[icon];
            if (tablerIcon) {
                tablerIcons.push(tablerIcon);
                changedIcons.push({ from: icon, to: tablerIcon });
            } else {
                console.warn(`  Warning: No mapping for icon "${icon}" in ${filePath}`);
                tablerIcons.push(icon); // Keep original if no mapping
            }
        }

        return `import { ${tablerIcons.join(', ')} } from "react-icons/tb"`;
    });

    // Replace component usages
    for (const [lucide, tabler] of Object.entries(iconMapping)) {
        // Replace <IconName (including className, etc)
        const regex = new RegExp(`<${lucide}(\\s|\\/)`, 'g');
        if (content.match(regex)) {
            content = content.replace(regex, `<${tabler}$1`);
        }

        // Replace icon: IconName in objects
        const objRegex = new RegExp(`icon:\\s*${lucide}([,\\s\\n}])`, 'g');
        if (content.match(objRegex)) {
            content = content.replace(objRegex, `icon: ${tabler}$1`);
        }
    }

    if (content !== originalContent) {
        writeFileSync(filePath, content, 'utf-8');
        return { changed: true, icons: changedIcons };
    }

    return { changed: false };
}

// Main execution
const srcDir = './src';
console.log('🔍 Scanning for .tsx files...');
const files = getAllTsxFiles(srcDir);
console.log(`Found ${files.length} .tsx files`);

let migratedCount = 0;
let totalIcons = 0;

for (const file of files) {
    const result = migrateFile(file);
    if (result.changed) {
        migratedCount++;
        totalIcons += result.icons?.length || 0;
        console.log(`✅ Migrated: ${file} (${result.icons?.length} icons)`);
    }
}

console.log('\\n📊 Migration Summary:');
console.log(`   Files processed: ${files.length}`);
console.log(`   Files migrated: ${migratedCount}`);
console.log(`   Total icons converted: ${totalIcons}`);
console.log('\\n✨ Migration complete!');

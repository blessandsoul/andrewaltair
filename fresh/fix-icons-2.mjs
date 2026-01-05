#!/usr/bin/env node
/**
 * Fix remaining unmapped icons to Tabler - Second pass
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

// Additional mappings missed in first pass
const iconMapping = {
    // Arrows
    'ArrowUpRight': 'TbArrowUpRight',
    'ArrowDownRight': 'TbArrowDownRight',
    'ArrowUpLeft': 'TbArrowUpLeft',
    'ArrowDownLeft': 'TbArrowDownLeft',

    // Files
    'FileSpreadsheet': 'TbFileSpreadsheet',
    'FileCode': 'TbFileCode',
    'FileImage': 'TbFileImage',
    'FileVideo': 'TbFileVideo',
    'FilePen': 'TbFilePencil',
    'FileCheck': 'TbFileCheck',

    // Devices & Browser
    'MousePointer': 'TbPointer',
    'Chrome': 'TbBrandChrome',
    'Apple': 'TbBrandApple',
    'Gauge': 'TbGauge',
    'Timer': 'TbClock',
    'Route': 'TbRoute',
    'Cpu': 'TbCpu',
    'HardDrive': 'TbDeviceSdCard',
    'Wifi': 'TbWifi',

    // Editing
    'Edit2': 'TbEdit',
    'GripVertical': 'TbGripVertical',
    'Link2': 'TbLink',
    'Sparkles': 'TbSparkles',
    'Hash': 'TbHash',
    'Folder': 'TbFolder',
    'FolderOpen': 'TbFolderOpen',
    'Layers': 'TbStack2',
    'History': 'TbHistory',

    // Media
    'Newspaper': 'TbNews',
    'Megaphone': 'TbSpeakerphone',
    'Music': 'TbMusic',
    'Headphones': 'TbHeadphones',
    'Gamepad2': 'TbDeviceGamepad2',

    // Tools
    'PenTool': 'TbPencil',
    'Wrench': 'TbTool',
    'Quote': 'TbQuote',
    'Building2': 'TbBuilding',
    'Calculator': 'TbCalculator',
    'ZoomIn': 'TbZoomIn',
    'ZoomOut': 'TbZoomOut',
    'Reply': 'TbArrowBackUp',
    'TestTube': 'TbTestPipe',
    'FlaskConical': 'TbFlask',
    'Move': 'TbArrowsMove',
    'Medal': 'TbMedal',
    'Settings2': 'TbSettings',
    'Thermometer': 'TbTemperature',
    'CheckCircle2': 'TbCircleCheck',
    'ImageIcon': 'TbPhoto',
    'EyeIcon': 'TbEye',
    'MousePointerClick': 'TbClick',

    // Type aliases that shouldn't be there
    'type LucideIcon': '',
    'Search as SearchIcon': 'TbSearch',
    'Image as ImageIcon': 'TbPhoto',
    'CheckIcon': 'TbCheck',
    'ChevronDownIcon': 'TbChevronDown',

    // Video
    'Video': 'TbVideo',
};

function getAllTsxFiles(dir, files = []) {
    const items = readdirSync(dir);
    for (const item of items) {
        const fullPath = join(dir, item);
        if (statSync(fullPath).isDirectory()) {
            if (!item.startsWith('.') && item !== 'node_modules') {
                getAllTsxFiles(fullPath, files);
            }
        } else if (extname(item) === '.tsx') {
            files.push(fullPath);
        }
    }
    return files;
}

const srcDir = './src';
const files = getAllTsxFiles(srcDir);

let fixedCount = 0;
for (const file of files) {
    let content = readFileSync(file, 'utf-8');
    let changed = false;

    // Fix imports - replace icon names in import statements
    for (const [lucide, tabler] of Object.entries(iconMapping)) {
        if (!tabler) continue; // Skip empty mappings

        // Match in imports: word boundary match for icon name
        const importRegex = new RegExp(`\\b${lucide}\\b(?!\\.)`, 'g');
        if (content.match(importRegex)) {
            content = content.replace(importRegex, tabler);
            changed = true;
        }
    }

    // Also fix <TbLink back to <Link (Next.js component)
    if (content.includes('<TbLink')) {
        content = content.replace(/<TbLink/g, '<Link');
        changed = true;
    }

    // Remove "type LucideIcon" from imports
    content = content.replace(/,?\s*type LucideIcon/g, '');

    if (changed) {
        writeFileSync(file, content, 'utf-8');
        fixedCount++;
        console.log(`Fixed: ${file}`);
    }
}

console.log(`\\nFixed ${fixedCount} files`);

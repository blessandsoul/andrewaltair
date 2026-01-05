#!/usr/bin/env node
/**
 * Fourth pass - final cleanups
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

// Final corrections
const corrections = {
    'TbLink': 'TbExternalLink',  // Where TbLink is used as icon (not Link component)
    'Tb,': '',  // Remove broken Tb, entries
    ', Tb ': ', ',
    'Languages': 'TbLanguage',
    'Webhook': 'TbWebhook',
    'Construction': 'TbConstruction',
    'MemoryStick': 'TbCpu',
    'ListTodo': 'TbListCheck',
    'CalendarDays': 'TbCalendarEvent',
    'LayoutList': 'TbLayoutList',
    'Maximize2': 'TbMaximize',
    'Minimize2': 'TbMinimize',
    'Command': 'TbCommand',
    'TbExternal': 'TbExternalLink',
    'TbBrandedin': 'TbBrandLinkedin',
    'Image,': 'TbPhoto,',
    'Image ': 'TbPhoto ',
    'SearchIcon': 'TbSearch',
    'LinkIcon': 'TbLink',
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

    for (const [wrong, correct] of Object.entries(corrections)) {
        if (content.includes(wrong)) {
            content = content.split(wrong).join(correct);
            changed = true;
        }
    }

    // Remove ", Tb," or "Tb," from imports
    content = content.replace(/, Tb,/g, ',');
    content = content.replace(/Tb,\s*}/g, '}');
    content = content.replace(/{\s*Tb,/g, '{');
    content = content.replace(/, Tb\b(?![\w])/g, '');

    // Fix double commas in imports
    content = content.replace(/,\s*,/g, ',');

    // Fix Link in categories - it should probably be TbLink icon for linking
    // But in categories/page.tsx, Link2 was used as icon - needs TbLink
    if (file.includes('categories')) {
        if (content.includes('Link2')) {
            // Already should be TbLink from earlier
        }
    }

    if (changed) {
        writeFileSync(file, content, 'utf-8');
        fixedCount++;
        console.log(`Fixed: ${file}`);
    }
}

console.log(`\\nFixed ${fixedCount} files`);

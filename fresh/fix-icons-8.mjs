#!/usr/bin/env node
/**
 * Eighth pass - fix remaining tools page icons
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const corrections = {
    'TbBuildingBlocks': 'TbBuildingBank',
    'Box': 'TbBox',
    'PlayCircle': 'TbPlayerPlay',
    'Shuffle': 'TbArrowsShuffle',
    'MessageSquare': 'TbMessage',
    'Code': 'TbCode',
    'Search': 'TbSearch',
    'FileText': 'TbFileText',
    'TrendingUp': 'TbTrendingUp',
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
        const regex = new RegExp(`\\b${wrong}\\b`, 'g');
        if (content.match(regex)) {
            content = content.replace(regex, correct);
            changed = true;
        }
    }

    if (changed) {
        writeFileSync(file, content, 'utf-8');
        fixedCount++;
        console.log(`Fixed: ${file}`);
    }
}

console.log(`\\nFixed ${fixedCount} files`);

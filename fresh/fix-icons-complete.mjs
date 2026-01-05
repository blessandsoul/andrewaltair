#!/usr/bin/env node
/**
 * Final comprehensive fix for remaining issues
 * - User -> TbUser in JSX usage (not imports)
 * - TbPhotos -> TbPhoto everywhere
 * - Images -> TbPhoto in tab text
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

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

    // Check if file imports from phosphor - if so, skip User changes
    const usesPhosphor = content.includes('@phosphor-icons/react');

    // Fix TbPhotos to TbPhoto everywhere
    if (content.includes('TbPhotos')) {
        content = content.replace(/\bTbPhotos\b/g, 'TbPhoto');
        changed = true;
    }

    // Only fix User -> TbUser if file doesn't use phosphor and has react-icons/tb
    if (!usesPhosphor && content.includes('react-icons/tb')) {
        // Fix <User className to <TbUser className
        if (content.includes('<User className')) {
            content = content.replace(/<User className/g, '<TbUser className');
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

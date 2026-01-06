#!/usr/bin/env node
/**
 * Fix TbLink -> Link in all TSX files
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
    if (content.includes('<TbLink ') || content.includes('<TbLink>')) {
        const newContent = content
            .replace(/<TbLink /g, '<Link ')
            .replace(/<TbLink>/g, '<Link>');
        if (newContent !== content) {
            writeFileSync(file, newContent, 'utf-8');
            fixedCount++;
            console.log(`Fixed: ${file}`);
        }
    }
}

console.log(`\\nFixed ${fixedCount} files`);

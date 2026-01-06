#!/usr/bin/env node
/**
 * Final pass - fix User to TbUser only in react-icons imports
 * And TbClock back to Clock in phosphor imports
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

// Only apply to specific patterns
const fixes = [
    // react-icons/tb: User -> TbUser
    {
        pattern: /from\s*["']react-icons\/tb["']/,
        replacements: { 'User': 'TbUser', 'TbPhotos': 'TbPhoto' }
    },
    // phosphor: TbClock -> Clock
    {
        pattern: /from\s*["']@phosphor-icons\/react["']/,
        replacements: { 'TbClock': 'Clock', 'TbUser': 'User' }
    }
];

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

    // Check for phosphor imports and fix TbClock/TbUser back
    const phosphorMatch = content.match(/import\s*{([^}]+)}\s*from\s*["']@phosphor-icons\/react["']/);
    if (phosphorMatch) {
        let imports = phosphorMatch[1];
        const origImports = imports;
        imports = imports.replace(/\bTbClock\b/g, 'Clock');
        imports = imports.replace(/\bTbUser\b/g, 'User');
        if (imports !== origImports) {
            content = content.replace(phosphorMatch[0], `import {${imports}} from "@phosphor-icons/react"`);
            changed = true;
        }
    }

    // Check for react-icons/tb imports and fix to TbUser
    const tbMatch = content.match(/import\s*{([^}]+)}\s*from\s*["']react-icons\/tb["']/);
    if (tbMatch) {
        let imports = tbMatch[1];
        const origImports = imports;
        // User in react-icons/tb should be TbUser
        imports = imports.replace(/\bUser\b/g, 'TbUser');
        // TbPhotos doesn't exist, use TbPhoto
        imports = imports.replace(/\bTbPhotos\b/g, 'TbPhoto');
        // TreePine doesn't exist in tabler, use TbTree
        imports = imports.replace(/\bTreePine\b/g, 'TbTree');
        if (imports !== origImports) {
            content = content.replace(tbMatch[0], `import { ${imports.split(',').map(s => s.trim()).filter(Boolean).join(', ')} } from "react-icons/tb"`);
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

#!/usr/bin/env node
/**
 * Fifth pass - fix double replacements and final issues
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const corrections = {
    // Fix double replacements
    'TbExternalLinkLink': 'TbExternalLink',
    'coverTbPhoto': 'coverImage',
    'TbConstruction': 'TbTools',

    // More missing icons
    'Merge': 'TbGitMerge',
    'FileJson': 'TbJson',
    'ArrowRightLeft': 'TbArrowsRightLeft',
    'ShieldOff': 'TbShieldOff',
    'TbDotsHorizontal': 'TbDots',
    'Power': 'TbPower',
    'RefreshCcw': 'TbRefresh',

    // Link in imports from react-icons (should be removed or TbLink)
    // A Link import from react-icons/tb shouldn't exist
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

    // Remove 'Link' and 'Link,' from react-icons/tb imports
    const tbImportMatch = content.match(/import\s*{([^}]+)}\s*from\s*["']react-icons\/tb["']/);
    if (tbImportMatch) {
        let importList = tbImportMatch[1];
        if (importList.includes('Link')) {
            // Remove Link but keep TbLink
            importList = importList.replace(/\bLink\b(?![\w])/g, '').replace(/,\s*,/g, ',').replace(/^\s*,|,\s*$/g, '').trim();
            const newImport = `import { ${importList} } from "react-icons/tb"`;
            content = content.replace(tbImportMatch[0], newImport);
            changed = true;
        }
    }

    // Fix duplicate imports
    const tbMatch = content.match(/import\s*{([^}]+)}\s*from\s*["']react-icons\/tb["']/);
    if (tbMatch) {
        const imports = tbMatch[1].split(',').map(s => s.trim()).filter(Boolean);
        const unique = [...new Set(imports)];
        if (imports.length !== unique.length) {
            const newImport = `import { ${unique.join(', ')} } from "react-icons/tb"`;
            content = content.replace(tbMatch[0], newImport);
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

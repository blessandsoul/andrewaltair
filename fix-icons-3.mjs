#!/usr/bin/env node
/**
 * Third pass - fix remaining icon issues
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

// Corrections for wrong mappings and missing icons
const corrections = {
    // These don't exist and need correction  
    'TbBookOpen': 'TbBook',
    'TbFileImage': 'TbPhoto',
    'TbFileVideo': 'TbVideo',
    'Palette': 'TbPalette',
    'Edit3': 'TbEdit',
    'ArrowUpDown': 'TbArrowsUpDown',
    'Ban': 'TbBan',
    'ListOrdered': 'TbListNumbers',
    'Heading1': 'TbH1',
    'Heading2': 'TbH2',
    'Undo': 'TbArrowBackUp',
    'Redo': 'TbArrowForwardUp',
    'TbGrid': 'TbLayoutGrid',
    'ImagePlus': 'TbPhotoPlus',
    'FolderPlus': 'TbFolderPlus',
    'RotateCw': 'TbRefresh',
    'Crop': 'TbCrop',
    'WifiOff': 'TbWifiOff',
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

    // Apply corrections
    for (const [wrong, correct] of Object.entries(corrections)) {
        const regex = new RegExp(`\\b${wrong}\\b`, 'g');
        if (content.match(regex)) {
            content = content.replace(regex, correct);
            changed = true;
        }
    }

    // Fix duplicate imports by removing duplicates
    // Match import statement and clean duplicates
    const importMatch = content.match(/import\s*{([^}]+)}\s*from\s*["']react-icons\/tb["']/);
    if (importMatch) {
        const imports = importMatch[1].split(',').map(s => s.trim()).filter(Boolean);
        const uniqueImports = [...new Set(imports)];
        if (imports.length !== uniqueImports.length) {
            const newImport = `import { ${uniqueImports.join(', ')} } from "react-icons/tb"`;
            content = content.replace(/import\s*{[^}]+}\s*from\s*["']react-icons\/tb["']/, newImport);
            changed = true;
        }
    }

    // Remove 'Link' from react-icons/tb imports if it exists (Link is from next/link, not react-icons)
    if (content.includes('from "react-icons/tb"') && content.includes('Link,')) {
        // Check if Link is imported from react-icons/tb - need to be careful
        const tbImportMatch = content.match(/import\s*{([^}]+)}\s*from\s*["']react-icons\/tb["']/);
        if (tbImportMatch && tbImportMatch[1].includes('Link')) {
            let importContent = tbImportMatch[1];
            // Remove Link from the import
            importContent = importContent.replace(/,?\s*Link\b/g, '').replace(/Link\s*,?/g, '');
            // Clean up double commas
            importContent = importContent.replace(/,\s*,/g, ',').replace(/^\s*,|,\s*$/g, '').trim();
            const newImport = `import { ${importContent} } from "react-icons/tb"`;
            content = content.replace(tbImportMatch[0], newImport);
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

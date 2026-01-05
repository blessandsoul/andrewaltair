const fs = require('fs');
const content = fs.readFileSync('src/components/vibe-coding/VibeCodingLibraryV2.tsx', 'utf8');
const lines = content.split('\n');

let openParens = 0;

console.log('Checking isArticleAccessible function (lines 373-384)...\n');

for(let i = 372; i <= 391; i++) {
    const line = lines[i];
    const prevParens = openParens;
    
    for(let char of line) {
        if(char === '(') openParens++;
        if(char === ')') openParens--;
    }
    
    console.log(`Line ${i+1}: (=${openParens} (change: ${openParens - prevParens}) | ${line.trim()}`);
}

console.log('\nFinal paren count:', openParens);

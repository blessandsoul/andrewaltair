const fs = require('fs');
const content = fs.readFileSync('src/components/vibe-coding/VibeCodingLibraryV2.tsx', 'utf8');
const lines = content.split('\n');

let openParens = 0;
let maxParens = 0;
let maxLine = 0;

console.log('Scanning from line 248 (function start) to line 393 (return)...\n');

for(let i = 247; i < 393; i++) {
    const prevParens = openParens;
    
    for(let char of lines[i]) {
        if(char === '(') openParens++;
        if(char === ')') openParens--;
    }
    
    if(openParens > maxParens) {
        maxParens = openParens;
        maxLine = i + 1;
    }
    
    // Show lines where paren count changes or is non-zero
    if(openParens !== prevParens || openParens !== 0) {
        console.log(`Line ${i+1}: (=${openParens} | ${lines[i].trim().substring(0,70)}`);
    }
}

console.log('\n=== RESULT ===');
console.log('At line 393 (return statement):');
console.log('Open parentheses:', openParens);
console.log('Expected: 0');
console.log('\nMax open parens:', maxParens, 'at line', maxLine);

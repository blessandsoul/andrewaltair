const fs = require('fs');
const content = fs.readFileSync('src/components/vibe-coding/VibeCodingLibraryV2.tsx', 'utf8');
const lines = content.split('\n');

let openBraces = 0;
let openParens = 0;

console.log('Checking from line 248 (function start) to line 395...\n');

for(let i = 247; i < 395; i++) {
    const prevBraces = openBraces;
    const prevParens = openParens;
    
    for(let char of lines[i]) {
        if(char === '{') openBraces++;
        if(char === '}') openBraces--;
        if(char === '(') openParens++;
        if(char === ')') openParens--;
    }
    
    // Show lines where counts change or near the problem area
    if(prevBraces !== openBraces || prevParens !== openParens || i >= 385) {
        console.log(`Line ${i+1}: {=${openBraces} (=${openParens} | ${lines[i].trim().substring(0,70)}`);
    }
}

console.log('\n=== PROBLEM ===');
console.log('At line 393 (return statement), we should have:');
console.log('- Braces: 1 (function body open)');
console.log('- Parens: 0 (no open parens before return)');
console.log('\nActual counts:', 'Braces:', openBraces, 'Parens:', openParens);

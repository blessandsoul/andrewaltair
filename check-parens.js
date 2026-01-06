const fs = require('fs');
const content = fs.readFileSync('src/components/vibe-coding/VibeCodingLibraryV2.tsx', 'utf8');
const lines = content.split('\n');

let openParens = 0;

console.log('Checking parentheses from line 363 to 371...\n');

for(let i = 362; i <= 370; i++) {
    const line = lines[i];
    let lineParens = 0;
    
    for(let j = 0; j < line.length; j++) {
        const char = line[j];
        if(char === '(') {
            openParens++;
            lineParens++;
            console.log(`Line ${i+1}, col ${j+1}: OPEN ( - total=${openParens}`);
        }
        if(char === ')') {
            openParens--;
            lineParens--;
            console.log(`Line ${i+1}, col ${j+1}: CLOSE ) - total=${openParens}`);
        }
    }
    
    console.log(`Line ${i+1}: ${line.trim()}`);
    console.log(`  Line change: ${lineParens > 0 ? '+' : ''}${lineParens}, Running total: ${openParens}\n`);
}

console.log('Final paren count:', openParens);

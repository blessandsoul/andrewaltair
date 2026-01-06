const fs = require('fs');
const content = fs.readFileSync('src/components/vibe-coding/VibeCodingLibraryV2.tsx', 'utf8');
const lines = content.split('\n');

let openParens = 0;

for(let i = 247; i < 393; i++) {
    const prevParens = openParens;
    
    for(let char of lines[i]) {
        if(char === '(') openParens++;
        if(char === ')') openParens--;
    }
    
    // Only show lines where count is non-zero after processing
    if(openParens !== 0 || prevParens !== 0) {
        const change = openParens - prevParens;
        const changeStr = change > 0 ? `+${change}` : change < 0 ? `${change}` : '0';
        console.log(`${String(i+1).padStart(3)}: (=${openParens} [${changeStr}] ${lines[i].trim().substring(0,60)}`);
    }
}

console.log('\n=== Line 393 has', openParens, 'open parens (should be 0) ===');

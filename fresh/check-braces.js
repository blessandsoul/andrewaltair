const fs = require('fs');
const content = fs.readFileSync('src/components/vibe-coding/VibeCodingLibraryV2.tsx', 'utf8');
const lines = content.split('\n');

let openBraces = 0;

console.log('Checking braces from line 248 to 393...\n');

for(let i = 247; i < 393; i++) {
    const prevBraces = openBraces;
    
    for(let char of lines[i]) {
        if(char === '{') openBraces++;
        if(char === '}') openBraces--;
    }
    
    if(openBraces !== prevBraces || openBraces !== 1) {
        const change = openBraces - prevBraces;
        const changeStr = change > 0 ? `+${change}` : change < 0 ? `${change}` : '0';
        console.log(`${String(i+1).padStart(3)}: {=${openBraces} [${changeStr}] ${lines[i].trim().substring(0,60)}`);
    }
}

console.log('\n=== At line 393, brace count:', openBraces, '(should be 1 for function body) ===');

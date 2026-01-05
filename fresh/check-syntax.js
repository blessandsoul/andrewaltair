const fs = require('fs');
const content = fs.readFileSync('src/components/vibe-coding/VibeCodingLibraryV2.tsx', 'utf8');
const lines = content.split('\n');

let openBraces = 0;
let openParens = 0;
let openBrackets = 0;
let openDivs = 0;

for(let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for(let j = 0; j < line.length; j++) {
        const char = line[j];
        if(char === '{') openBraces++;
        if(char === '}') openBraces--;
        if(char === '(') openParens++;
        if(char === ')') openParens--;
        if(char === '[') openBrackets++;
        if(char === ']') openBrackets--;
    }
    
    // Simple naive check for unclosed divs (not perfect but helpful)
    const divMatches = (line.match(/<div/g) || []).length;
    const closeDivMatches = (line.match(/<\/div>/g) || []).length;
    openDivs += divMatches - closeDivMatches;

    if (openBraces < 0) console.log(`Line ${i+1}: Negative braces!`);
    if (openParens < 0) console.log(`Line ${i+1}: Negative parens!`);
    if (openBrackets < 0) console.log(`Line ${i+1}: Negative brackets!`);
}

console.log('\nFinal counts:');
console.log('Braces:', openBraces);
console.log('Parens:', openParens);
console.log('Brackets:', openBrackets);
console.log('Open Divs (approx):', openDivs);


const fs = require('fs');
const path = require('path');
const https = require('https');

// Load env
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const apiKeyMatch = envContent.match(/YOUTUBE_API_KEY=(.+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

if (!apiKey) {
    console.error('❌ YOUTUBE_API_KEY not found in .env.local');
    process.exit(1);
}

console.log('✅ Found API Key:', apiKey.substring(0, 5) + '...');

const videoId = 'epfWZPZ4tqE';
const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`;

console.log('🔄 Fetching from YouTube API...');

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        if (res.statusCode === 200) {
            const json = JSON.parse(data);
            if (json.items && json.items.length > 0) {
                console.log('✅ API Success! Found video:', json.items[0].snippet.title);
                console.log('📝 Description preview:', json.items[0].snippet.description.substring(0, 50));
            } else {
                console.log('⚠️ API returned no items (Video not found or private?)');
                console.log(JSON.stringify(json, null, 2));
            }
        } else {
            console.error(`❌ API Request Failed: ${res.statusCode}`);
            console.error(data);
        }
    });
}).on('error', (err) => {
    console.error('❌ Network Error:', err.message);
});

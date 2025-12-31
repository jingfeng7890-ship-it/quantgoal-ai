
const fs = require('fs');
const path = require('path');

// 1. Read Keys Manually (skipping dotenv to be sure)
const envPath = path.resolve(__dirname, 'backend', '.env');
let keys = {};
try {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            keys[parts[0].trim()] = parts[1].trim();
        }
    });
} catch (e) {
    console.error("Failed to read backend/.env");
    process.exit(1);
}

// 2. Test Function
async function testKey(provider, url, headers, body) {
    console.log(`Testing ${provider}...`);
    try {
        const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
        if (res.ok) {
            console.log(`✅ ${provider} SUCCESS (200 OK)`);
        } else {
            console.log(`❌ ${provider} FAILED (${res.status} ${res.statusText})`);
            const txt = await res.text();
            console.log(`   Error: ${txt.substring(0, 100)}...`);
        }
    } catch (e) {
        console.log(`❌ ${provider} ERROR: ${e.message}`);
    }
}

// 3. Run Tests
async function run() {
    // OpenAI
    if (keys.OPENAI_API_KEY) {
        await testKey('OpenAI', 'https://api.openai.com/v1/chat/completions',
            { 'Content-Type': 'application/json', 'Authorization': `Bearer ${keys.OPENAI_API_KEY}` },
            { model: "gpt-3.5-turbo", messages: [{ role: "user", content: "hi" }], max_tokens: 5 }
        );
    } else { console.log("⚠️ OpenAI Key missing"); }

    // Anthropic
    if (keys.ANTHROPIC_API_KEY) {
        await testKey('Anthropic', 'https://api.anthropic.com/v1/messages',
            { 'Content-Type': 'application/json', 'x-api-key': keys.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
            { model: "claude-3-haiku-20240307", max_tokens: 5, messages: [{ role: "user", content: "hi" }] }
        );
    } else { console.log("⚠️ Anthropic Key missing"); }

    // DeepSeek
    if (keys.DEEPSEEK_API_KEY) {
        await testKey('DeepSeek', 'https://api.deepseek.com/chat/completions',
            { 'Content-Type': 'application/json', 'Authorization': `Bearer ${keys.DEEPSEEK_API_KEY}` },
            { model: "deepseek-chat", messages: [{ role: "user", content: "hi" }], max_tokens: 5 }
        );
    } else { console.log("⚠️ DeepSeek Key missing"); }

    // xAI (Grok)
    if (keys.XAI_API_KEY) {
        await testKey('xAI (Grok)', 'https://api.x.ai/v1/chat/completions',
            { 'Content-Type': 'application/json', 'Authorization': `Bearer ${keys.XAI_API_KEY}` },
            { model: "grok-beta", messages: [{ role: "user", content: "hi" }], stream: false }
        );
    } else { console.log("⚠️ xAI Key missing"); }
}

run();

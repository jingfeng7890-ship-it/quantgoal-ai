
// Removed node-fetch import since Node 22 has global fetch
async function testApi() {
    try {
        console.log("Testing API Endpoint /api/chat ...");
        const res = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: 'Analysis',
                matchInfo: { home: 'Real Madrid', away: 'Barcelona' }
            })
        });

        console.log(`Status: ${res.status} ${res.statusText}`);
        const text = await res.text();
        try {
            const json = JSON.parse(text);
            console.log("Response JSON:", JSON.stringify(json, null, 2));
        } catch (e) {
            console.log("Response text (Not JSON):", text);
        }

    } catch (err) {
        console.error("Fetch failed:", err);
    }
}

testApi();

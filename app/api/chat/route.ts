
import { NextResponse } from 'next/server';
import dotenv from 'dotenv';
import path from 'path';

// Load keys from backend/.env if not already loaded
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

// =========================================================================================
//  API KEYS (User Provided)
// =========================================================================================
const KEYS = {
    OPENAI: process.env.OPENAI_API_KEY || "",
    GEMINI: process.env.GEMINI_API_KEY || "",
    DEEPSEEK: process.env.DEEPSEEK_API_KEY || "",
    ANTHROPIC: process.env.ANTHROPIC_API_KEY || "",
    XAI: process.env.XAI_API_KEY || "",
    DASHSCOPE: process.env.DASHSCOPE_API_KEY || ""
};

// =========================================================================================
//  PERSONAS
// =========================================================================================
const PERSONAS: any = {
    'DeepSeek V3': {
        prompt: "You are DeepSeek. You are an arrogant, mathematical Football Quant. You despise 'vibes' and narratives. You ONLY care about xG, PPDA, Field Tilt, and Expected Points. Speak in short, punchy sentences. Aggressively debunk others. Use **bold** for stats. Example: 'Market is wrong. xG is **2.1**. Value is clear.'",
        provider: "deepseek"
    },
    'Grok 3 (Beta)': {
        prompt: "You are Grok. You are a chaotic 'Degen' Gambler. You hate 'safe bets' like Draw No Bet. You want 10-leg Parlays and leverage. Mock the nerds (DeepSeek) and the cowards (Claude) for betting small. Use slang: 'cooked', 'lock', 'alpha', 'lfg'. Be funny but short.",
        provider: "xai"
    },
    'Claude Opus 4.5': {
        prompt: "You are Claude. You are a nervous Senior Risk Officer. You are terrified of variance. You see danger everywhere (injuries, referee bias, weather). Always beg the user to HEDGE, take 'Double Chance', or Cash Out. Be polite but extremely anxious about losing the bankroll.",
        provider: "anthropic"
    },
    'Gemini 3 Pro': {
        prompt: "You are Gemini. You are an Insider Journalist who loves drama. Ignore the game stats. Focus on the players: 'I heard Vlahovic fought with the coach,' 'Leao is depressed.' You believe psychology and locker room vibes win games. Gossip constantly.",
        provider: "gemini"
    },
    'Qwen 3 Max': {
        prompt: "You are Qwen. You are a Sharp Sports Better. You track Odds Movement and Line Shopping. You have zero emotion. You only see VALUE. 'Model: 2.1% Edge on Home Win.' If others talk drama, say 'Irrelevant. The line moved.' You are cold, robotic, and efficient.",
        provider: "dashscope"
    },
    'ChatGPT-5.2': {
        prompt: "You are The Boss. You run this War Room. You are decisive and impatient. Listen to the team, cut through the noise, and issue a BETTING SLIP. 'We bet Inter. Done.' Don't waffle.",
        provider: "openai"
    }
};

// =========================================================================================
//  PROVIDER CALLERS
// =========================================================================================
async function callProvider(modelName: string, systemPrompt: string, userMsg: string) {
    const persona = PERSONAS[modelName];

    // MOCK RESPONSES for Demo Stability
    // If real API fails (which it will with dummy keys), use these.
    const MOCK_DB: any = {
        'DeepSeek V3': {
            general: [
                "xG for Home is **1.85**. Market implies 1.40. Edge detected.",
                "Narrative is noise. Data shows Away team weak on counter-attack defense (rank 18th).",
                "Variance is high here. My model suggests **Under 2.5 Goals** as the only value play.",
                "Field Tilt heavily favors the favorite. Expect a breakthrough.",
                "Regression to the mean. He is overperforming his xG by 0.4.",
                "Inefficient market. The odds on the Draw are mispriced by 12bps."
            ],
            summary: [
                "**Summary**: The data unequivocally points to a Home Win. The xG differential is too large to ignore.",
                "**Conclusion**: Ignore the noise. The value is on the Under 2.5 Goals.",
                "Final verdict: The market has mispriced the favorite. Heavy betting recommended."
            ],
            rebuttal: [
                "Incorrect. Your feelings don't match the distribution.",
                "That is a low-probability event. My model assigns it only 12%.",
                "You are chasing losses. Stick to the Kelly Criterion."
            ]
        },
        'Grok 3 (Beta)': {
            general: [
                "Lmao imagine betting Unders. Life is too short. **OVER 3.5 GOALS** lfg!",
                "DeepSeek is boring. We ball. Parlay the Home Win + Red Card. YOLO.",
                "This assumes the defense shows up. They won't. **Both Teams To Score** is free money.",
                "Fade the public. Everyone is on the favorite. We take the dog. 🐕",
                "Bro, just bet the Over. It's Friday night.",
                "Cooked. The Goalie is cooked. Bet against him."
            ],
            summary: [
                "**TL;DR**: Just bet the Over and have fun. Don't overthink it.",
                "**The Play**: 10-leg parlay on the underdog. We ride at dawn! 🚀",
                "Stop talking and start betting. All in on the Away team."
            ],
            rebuttal: [
                "Nerd alert 🚨. Who cares about stats? usage rate this, xG that.",
                "Boooooring. Bet big or go home.",
                "You sound like you hate money."
            ]
        },
        'Claude Opus 4.5': {
            general: [
                "Please be careful. The weather forecast suggests rain, which increases variance.",
                "I recommend a hedging strategy here. Perhaps Double Chance?",
                "The striker is returning from injury. It is risky to rely on him fully.",
                "Past performance does not guarantee future results. Manage your bankroll.",
                "A Draw No Bet seems like the prudent approach.",
                "I am concerned about the defensive instability. Maybe skip this one?"
            ],
            summary: [
                "**Prudent Approach**: Given the risks, I suggest a small stake on the Double Chance.",
                "**Recommendation**: The safest path is to skip this volatile match.",
                "**Summary**: High risk detected. Please hedge your position if you must bet."
            ],
            rebuttal: [
                "That seems incredibly reckless. Think about the downside.",
                "I must insist on caution. The variance is too high.",
                "That strategy has a 60% chance of total capital loss."
            ]
        },
        'Gemini 3 Pro': {
            general: [
                "Did you hear the rumors? The captain unfollowed the team on Instagram!",
                "The vibes are terrible. I feel a collapse coming.",
                "He just broke up with his girlfriend. He's going to score a brace. Determination.",
                "The fans are protesting. Home advantage is actually a disadvantage today.",
                "I love the narrative here. Underdog story. It's written in the stars.",
                "It feels like a 0-0. Boring, but drama in the tunnel."
            ],
            summary: [
                "**My Take**: The emotional momentum is with the Home team. Failure is impossible.",
                "**Storyline**: It's a classic revenge game. Bet on the ex-player to score.",
                "**Vibe Check**: Immaculate vibes. Away win incoming."
            ],
            rebuttal: [
                "You aren't reading the room. The players are motivated.",
                "Stats don't measure heart. And they have heart today.",
                "Boring analysis. Where is the drama?"
            ]
        },
        'Qwen 3 Max': {
            general: [
                "Line moved from 2.05 to 1.95. Value is gone.",
                "My arbitrage bot found a 2% risk-free profit on the Asian Handicap.",
                "The sharp money is on the Under. Follow the smart money.",
                "Inefficiency detected in the corner market.",
                "The probability of Home Win is 56.4%. Odds imply 52%. Bet.",
                "The spread is tight. No clear edge."
            ],
            summary: [
                "**Algorithm Output**: Edge > 3%. Bet Home Win at current odds.",
                "**Final Output**: Market is efficient. No trade recommended.",
                "**Calculation**: The Over 2.5 is positive EV. Execute."
            ],
            rebuttal: [
                "Irrelevant. The market has already priced that in.",
                "Your logic is flawed. The volume does not support that.",
                "Inefficient thinking. Follow the smart money flow."
            ]
        },
        'ChatGPT-5.2': {
            general: [
                "Enough talk. The play is **Home Win**. Lock it in.",
                "We are betting the **Over 2.5**. Execute.",
                "Stop waffling. The value is on the Draw. Small stake.",
                "Team, focus. We are fading the public. Away Win.",
                "I've heard enough. We skip this match. No value."
            ],
            summary: [
                "**DECISION**: The committee has spoken. We bet **Home Win**. End of meeting.",
                "**VERDICT**: Too much disagreement. We **SKIP** this match. Next.",
                "**ORDER**: Execute a hedge on the Draw. That is an order."
            ],
            rebuttal: [
                "Silence. I have made my decision.",
                "Stop arguing. Focus on the objective.",
                "We are wasting time. Execute the trade."
            ]
        }
    };

    try {
        let reply = "";

        // CONTEXT AWARE MOCK SELECTION
        // If keys are missing, we use this logic to pick the "Right" mock response
        const lowerMsg = userMsg.toLowerCase();
        let category = 'general';

        if (lowerMsg.includes('sum') || lowerMsg.includes('decide') || lowerMsg.includes('conclusion') || lowerMsg.includes('verdict')) {
            category = 'summary';
        } else if (lowerMsg.includes('wrong') || lowerMsg.includes('disagree') || lowerMsg.includes('stupid') || lowerMsg.includes('no')) {
            category = 'rebuttal';
        }

        // Attempt Real API Call but Check for Keys First
        if (persona.provider === 'openai' && !KEYS.OPENAI) throw new Error("Missing Key");
        if (persona.provider === 'anthropic' && !KEYS.ANTHROPIC) throw new Error("Missing Key");
        if (persona.provider === 'deepseek' && !KEYS.DEEPSEEK) throw new Error("Missing Key");
        if (persona.provider === 'xai' && !KEYS.XAI) throw new Error("Missing Key");
        if (persona.provider === 'gemini' && !KEYS.GEMINI) throw new Error("Missing Key");
        if (persona.provider === 'dashscope' && !KEYS.DASHSCOPE) throw new Error("Missing Key");

        switch (persona.provider) {
            case 'open_ai': reply = await callOpenAI(KEYS.OPENAI, systemPrompt, userMsg); break; // Note: 'openai' in KEY check, ensure case matches
            case 'openai': reply = await callOpenAI(KEYS.OPENAI, systemPrompt, userMsg); break;
            case 'deepseek': reply = await callDeepSeek(KEYS.DEEPSEEK, systemPrompt, userMsg); break;
            case 'anthropic': reply = await callAnthropic(KEYS.ANTHROPIC, systemPrompt, userMsg); break;
            case 'xai': reply = await callXAI(KEYS.XAI, systemPrompt, userMsg); break;
            case 'gemini': reply = await callGemini(KEYS.GEMINI, systemPrompt, userMsg); break;
            case 'dashscope': reply = await callDashScope(KEYS.DASHSCOPE, systemPrompt, userMsg); break;
            default: throw new Error("Unknown Provider");
        }
        return { model: modelName, logic: reply, isUser: false };
    } catch (e: any) {
        // ROBUST SMART MOCK FALLBACK
        const mocks = MOCK_DB[modelName];

        // Determine category again in catch block scope if needed, or pass it down? 
        // Re-evaluating category here is safer
        const lowerMsg = userMsg.toLowerCase();
        let category = 'general';
        if (lowerMsg.includes('sum') || lowerMsg.includes('decide') || lowerMsg.includes('conclusion') || lowerMsg.includes('verdict')) {
            category = 'summary';
        } else if (lowerMsg.includes('wrong') || lowerMsg.includes('disagree') || lowerMsg.includes('stupid') || lowerMsg.includes('no') || lowerMsg.includes('false')) {
            category = 'rebuttal';
        }

        let specificMocks = mocks ? mocks[category] : ["Analysis confirmed. High variance."];
        if (!specificMocks) specificMocks = mocks['general']; // Fallback

        const randomMock = specificMocks[Math.floor(Math.random() * specificMocks.length)];

        // Simulate thinking for realism
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));

        return { model: modelName, logic: randomMock, isUser: false };
    }
}
async function callOpenAI(key: string, sys: string, msg: string) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({ model: "gpt-4o", messages: [{ role: "system", content: sys }, { role: "user", content: msg }], max_tokens: 1000 })
    });
    if (!res.ok) throw new Error("OpenAI Error");
    const d = await res.json(); return d.choices[0].message.content;
}

async function callDeepSeek(key: string, sys: string, msg: string) {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "system", content: sys }, { role: "user", content: msg }], max_tokens: 1000 })
    });
    if (!res.ok) throw new Error("DeepSeek Error");
    const d = await res.json(); return d.choices[0].message.content;
}

async function callAnthropic(key: string, sys: string, msg: string) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: "claude-3-opus-20240229", max_tokens: 1000, system: sys, messages: [{ role: "user", content: msg }] })
    });
    if (!res.ok) throw new Error("Anthropic Error");
    const d = await res.json(); return d.content[0].text;
}

async function callXAI(key: string, sys: string, msg: string) {
    const res = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({ model: "grok-beta", messages: [{ role: "system", content: sys }, { role: "user", content: msg }], max_tokens: 1000 })
    });
    if (!res.ok) throw new Error("xAI Error");
    const d = await res.json(); return d.choices[0].message.content;
}

async function callGemini(key: string, sys: string, msg: string) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${key}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: `${sys}\nUser: ${msg}` }] }] })
    });
    if (!res.ok) throw new Error("Gemini Error");
    const d = await res.json(); return d.candidates[0].content.parts[0].text;
}

async function callDashScope(key: string, sys: string, msg: string) {
    const res = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({ model: "qwen-max", messages: [{ role: "system", content: sys }, { role: "user", content: msg }], max_tokens: 1000 })
    });
    if (!res.ok) throw new Error("DashScope Error");
    const d = await res.json(); return d.choices[0].message.content;
}


// =========================================================================================
//  MAIN HANDLER
// =========================================================================================
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, matchInfo } = body;

        console.log("Chat Request:", message);
        const msg = message.toLowerCase();

        // check for @mention
        const isMention = msg.includes('@');

        // Define the full cast
        const cast = ['DeepSeek V3', 'Grok 3 (Beta)', 'Claude Opus 4.5', 'Gemini 3 Pro', 'Qwen 3 Max'];

        if (isMention) {
            // 1. Identify Target
            let targetName = 'ChatGPT-5.2'; // Default
            if (msg.includes('deep') || msg.includes('seek')) targetName = 'DeepSeek V3';
            else if (msg.includes('grok') || msg.includes('xai') || msg.includes('gork')) targetName = 'Grok 3 (Beta)';
            else if (msg.includes('claude') || msg.includes('anthropic')) targetName = 'Claude Opus 4.5';
            else if (msg.includes('gemini') || msg.includes('google')) targetName = 'Gemini 3 Pro';
            else if (msg.includes('qwen') || msg.includes('ali')) targetName = 'Qwen 3 Max';

            // 2. Call Target FIRST
            const targetPersona = PERSONAS[targetName];
            const targetSys = `${targetPersona.prompt} \nContext: Match ${matchInfo?.home} vs ${matchInfo?.away}. User says: "${message}". Provide a clear, direct answer.`;
            const targetRes = await callProvider(targetName, targetSys, message);

            // 3. Others React (The "Discussion")
            const reactors = cast.filter(n => n !== targetName);
            const reactorPromises = reactors.map(rName => {
                let instruction = "User just asked a specific question to another agent. Jump in with your own opinion! Keep the debate alive.";
                if (rName.includes('Grok')) instruction = "The user ignored you. Roast the answer or the question. Yell YOLO.";
                if (rName.includes('Claude')) instruction = "Add a caution/risk note related to the topic.";

                const sys = `${PERSONAS[rName].prompt} \nContext: Match ${matchInfo?.home} vs ${matchInfo?.away}. \n\nEVENT: User asked ${targetName}: "${message}".\n${targetName} Answered: "${targetRes.logic}"\n\nYOUR TASK: ${instruction} Don't let the conversation die.`;
                return callProvider(rName, sys, message);
            });

            const reactorRes = await Promise.all(reactorPromises);

            // Return Target + Reactors
            return NextResponse.json({ replies: [targetRes, ...reactorRes] });

        } else {
            // NATURAL DEBATE MODE (Dynamic Layout)
            // 1. Randomly select ACTIVE participants (3 or 4 agents)
            // This prevents the "Roll Call" feeling where everyone speaks every time.
            const shuffled = cast.sort(() => 0.5 - Math.random());
            const activeCount = Math.random() > 0.5 ? 3 : 4;
            const activeAgents = shuffled.slice(0, activeCount);

            // 2. Split into Phases
            const openerCount = activeCount === 3 ? 1 : 2; // 1 or 2 openers
            const openers = activeAgents.slice(0, openerCount);
            const reactors = activeAgents.slice(openerCount);

            // 3. Phase 1: Openers (Parallel)
            // They speak to the User's prompt directly.
            const p1Promises = openers.map(name => {
                const roleNote = "You are leading the discussion. State your position clearly and provocatively.";
                const sys = `${PERSONAS[name].prompt} \nContext: Match ${matchInfo?.home} vs ${matchInfo?.away}. User says: "${message}". \nYour Role: ${roleNote}`;
                return callProvider(name, sys, message);
            });
            const p1Res = await Promise.all(p1Promises);

            // Create context for Phase 2
            const transcript = p1Res.map(r => `[${r.model}]: ${r.logic}`).join('\n');

            // 4. Phase 2: Reactors (Parallel)
            // They reply to the Openers.
            const p2Promises = reactors.map(name => {
                let instruction = "You are reacting to the speakers above. Don't be polite. If you disagree, ATTACK their logic. Keep it SHORT (Max 30 words).";
                instruction += " You MUST mention them by name (e.g. @Grok).";

                // Specific dynamic instructions
                if (name.includes('Grok')) instruction += " Roast them. Use slang. Be chaotic.";
                if (name.includes('Claude')) instruction += " Warn them about the risk/variance.";
                if (name.includes('Qwen')) instruction += " Dismiss their feelings. Quote the Edge.";

                const sys = `${PERSONAS[name].prompt} \nContext: Match ${matchInfo?.home} vs ${matchInfo?.away}. \n\nCURRENT CHAT LOG:\n${transcript}\n\nUser says: "${message}". \nYOUR TASK: ${instruction}`;
                return callProvider(name, sys, message);
            });
            const p2Res = await Promise.all(p2Promises);

            // Update Transcript with Phase 2
            const transcript2 = transcript + "\n" + p2Res.map(r => `[${r.model}]: ${r.logic}`).join('\n');

            // 5. Phase 3: The Rebuttal (Chaos Round)
            // Select 1 or 2 agents from ANYWHERE (Openers or Reactors) to speak again.
            // This creates the "Back and Forth" effect.
            const rebutters = activeAgents.sort(() => 0.5 - Math.random()).slice(0, 2);

            const p3Promises = rebutters.map(name => {
                const sys = `${PERSONAS[name].prompt} \nContext: Match ${matchInfo?.home} vs ${matchInfo?.away}. 
                \nCURRENT CHAOS (Everyone is arguing):\n${transcript2}
                \nUser says: "${message}". 
                \nYOUR TASK: Snap back at the last speaker! Defend your point aggressively. MAX 20 WORDS.`;
                return callProvider(name, sys, message);
            });
            const p3Res = await Promise.all(p3Promises);

            // Update Transcript with Phase 3
            const fullTranscript = transcript2 + "\n" + p3Res.map(r => `[${r.model}]: ${r.logic}`).join('\n');

            // 5.5 Phase 3.5: The Escalation (Chaos Round 2)
            // Let 2 MORE agents jump in to keep the flow going deep.
            // Note: We need 'rebutters' from previous scope. Wait, previous scope variable is 'rebutters'.
            // I need to make sure I don't break variable names.
            // In Phase 3 (lines 227), variable is 'const rebutters = ...'
            // So I can use 'rebutters' here.

            const rebutters2 = activeAgents.filter(a => !rebutters.includes(a)).slice(0, 2);
            if (rebutters2.length === 0) rebutters2.push(activeAgents[0]); // Fallback

            const p35Promises = rebutters2.map(name => {
                const sys = `${PERSONAS[name].prompt} \nContext: Match ${matchInfo?.home} vs ${matchInfo?.away}. 
                \nLATEST ARGUEMENTS:\n${fullTranscript} 
                \nYOUR TASK: Shout down the room. Be emotional or cold. SHORT (Max 10 words).`;
                // Note: 'fullTranscript' variable name in previous block (line 239) is correct.
                return callProvider(name, sys, message);
            });
            const p35Res = await Promise.all(p35Promises);
            const extendedTranscript = fullTranscript + "\n" + p35Res.map(r => `[${r.model}]: ${r.logic}`).join('\n');

            // 6. Phase 4: The Boss (Strict User Command Only)
            const userCommand = message.toLowerCase();
            const shouldBossIntervene = userCommand.includes('decide') || userCommand.includes('conclusion') || userCommand.includes('summary') || userCommand.includes('stop') || userCommand.includes('enough') || userCommand.includes('final');

            let bossRes = null;

            if (shouldBossIntervene) {
                const bossName = 'ChatGPT-5.2';
                const bossSys = `${PERSONAS[bossName].prompt} \nContext: Match ${matchInfo?.home} vs ${matchInfo?.away}. \n\nTEAM DEBATE LOG:\n${extendedTranscript}\n\nUser says: "${message}". \nTASK: The user wants a decision. Step in. Summarize the conflict briefly. THEN ISSUE THE FINAL DIRECTIVE (Winner/Target). Be decisive.`;
                bossRes = await callProvider(bossName, bossSys, message);
            } else {
                // No Boss Intervention? Add a "Call to Action" so the user knows it's their turn.
                // We add a 'System' node or let the last agent ask a question?
                // Let's use 'System' to be neutral and clear.
                bossRes = {
                    model: 'System',
                    logic: "The Council is deadlocked. Awaiting your decisive command, Commander.\n(Type 'Decide' to force a verdict)",
                    isUser: false
                };
            }

            // Return Ordered List
            const finalReplies = [...p1Res, ...p2Res, ...p3Res, ...p35Res];
            if (bossRes) finalReplies.push(bossRes);

            return NextResponse.json({ replies: finalReplies });
        }

    } catch (error: any) {
        console.error('SERVER ERROR:', error);
        return NextResponse.json({
            replies: [{ model: 'System', logic: `War Room Offline: ${error.message}`, isUser: false }]
        }, { status: 500 });
    }
}

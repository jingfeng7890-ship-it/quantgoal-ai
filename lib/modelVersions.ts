// Central "Source of Truth" for AI Model Versions & Display Names
// Import this usage in UI components to ensure consistency.

export const AI_MODELS = {
    CHATGPT: {
        ID: "ChatGPT-5.2",
        NAME: "ChatGPT-5.2",
        ROLE: "Chairman",
        TRAITS: ["⚖️ Balancer", "🧠 Big Brain"]
    },
    DEEPSEEK: {
        ID: "DeepSeek V3",
        NAME: "DeepSeek V3",
        ROLE: "Tactician",
        TRAITS: ["🔥 God Slayer", "⚔️ Aggressive"]
    },
    CLAUDE: {
        ID: "Claude Opus 4.5",
        NAME: "Claude Opus 4.5",
        ROLE: "Risk Officer",
        TRAITS: ["🛡️ Iron Shield", "🧊 Zero Drawdown"]
    },
    QWEN: {
        ID: "Qwen 3 Max",
        NAME: "Qwen 3 Max",
        ROLE: "Algo Trader",
        TRAITS: ["📐 Kelly Master", "🤖 Pure Math"]
    },
    GROK: {
        ID: "Grok 3 (Beta)",
        NAME: "Grok 3 (Beta)",
        ROLE: "Contrarian",
        TRAITS: ["🃏 Chaos Agent", "🚀 Moonshot"]
    },
    GEMINI: {
        ID: "Gemini 3 Pro",
        NAME: "Gemini 3 Pro",
        ROLE: "Intel Scout",
        TRAITS: ["🔍 Deep Dive", "🩹 Injury Hawk"]
    }
} as const;

// Helper to get ALL model IDs
export const ALL_MODEL_IDS = Object.values(AI_MODELS).map(m => m.ID);

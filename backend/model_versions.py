# Centralized configuration for AI Model Versions
# Update this file when models are upgraded (e.g. "ChatGPT-5.2" -> "ChatGPT-6.0")

class ModelVersions:
    # Model IDs / Display Names
    CHATGPT = "ChatGPT-5.2"
    CLAUDE = "Claude Opus 4.5"
    DEEPSEEK = "DeepSeek V3"
    QWEN = "Qwen 3 Max"
    GROK = "Grok 3 (Beta)"
    GEMINI = "Gemini 3 Pro"
    
    # Optional: Short Codes or Tags if needed
    TAGS = {
        CHATGPT: "The Boss",
        CLAUDE: "Risk Officer",
        DEEPSEEK: "Tactician",
        QWEN: "Algo Trader",
        GROK: "Contrarian",
        GEMINI: "Intel Scout"
    }

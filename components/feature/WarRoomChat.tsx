'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Bot, User, AlertTriangle, Trophy, Zap, MessageSquare } from 'lucide-react';

interface WarRoomChatProps {
    isOpen: boolean;
    onClose: () => void;
    match: any; // Match context
}

export function WarRoomChat({ isOpen, onClose, match }: WarRoomChatProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial "Welcome" from System
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    model: 'System',
                    logic: `WAR ROOM ACTIVE. Connected to 5 Neural Engines.\nTopic: ${match.match} (${match.league}).\nAsk a question or type "Analysis" to start the debate.`,
                    isUser: false
                }
            ]);
        }
    }, [isOpen, match]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = { model: 'User', logic: input, isUser: true };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input, matchInfo: match })
            });

            if (!res.ok) throw new Error("Connection Failed");

            const data = await res.json();
            const replies = data.replies || [];

            // "Stream" the replies one by one with a delay
            for (let i = 0; i < replies.length; i++) {
                await new Promise(r => setTimeout(r, 1500)); // 1.5s delay per message
                setMessages(prev => [...prev, replies[i]]);
            }

        } catch (error) {
            // FALLBACK SIMULATION (If API fails/offline)
            const mockReplies = [
                { model: 'DeepSeek V3', logic: 'API connection failed. Simulating locally: xG predicts 2.4 vs 0.8. Heavy favorite edge.', isUser: false },
                { model: 'Grok 3 (Beta)', logic: 'Server is cooked but we ball. Just bet the Over. Trust.', isUser: false },
                { model: 'Claude Opus 4.5', logic: 'Without live data, I strongly advise caution. Cash out now.', isUser: false },
                { model: 'System', logic: 'Connection lost. Displaying offline simulation.', isUser: false }
            ];

            for (let i = 0; i < mockReplies.length; i++) {
                await new Promise(r => setTimeout(r, 1000));
                setMessages(prev => [...prev, mockReplies[i]]);
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // Helper for Avatar Colors
    const getAvatar = (model: string) => {
        if (model.includes('DeepSeek')) return { bg: 'bg-blue-900', icon: <Brain size={16} />, color: 'text-blue-400' };
        if (model.includes('Grok')) return { bg: 'bg-purple-900', icon: <Zap size={16} />, color: 'text-purple-400' };
        if (model.includes('Claude')) return { bg: 'bg-amber-900', icon: <AlertTriangle size={16} />, color: 'text-amber-400' };
        if (model.includes('Gemini')) return { bg: 'bg-rose-900', icon: <MessageSquare size={16} />, color: 'text-rose-400' };
        if (model.includes('Qwen')) return { bg: 'bg-cyan-900', icon: <Activity size={16} />, color: 'text-cyan-400' };
        if (model.includes('Boss') || model.includes('ChatGPT')) return { bg: 'bg-emerald-900', icon: <Trophy size={16} />, color: 'text-emerald-400' };
        return { bg: 'bg-zinc-800', icon: <Bot size={16} />, color: 'text-zinc-400' };
    };

    return (
        <div className="fixed inset-0 z-[10001] bg-black/90 backdrop-blur-md flex items-center justify-center p-0 md:p-4">
            <div className="w-full h-full md:h-[600px] max-w-2xl bg-zinc-950 border-x-0 border-y-0 md:border md:border-zinc-800 md:rounded-2xl shadow-2xl flex flex-col overflow-hidden">

                {/* Header */}
                <div className="bg-zinc-900 p-4 border-b border-zinc-800 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <div>
                            <h3 className="font-black text-white text-lg tracking-tight">THE WAR ROOM</h3>
                            <div className="text-[10px] text-zinc-500 font-mono uppercase">
                                LIVE DEBATE: {match?.match}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[url('/grid.svg')] bg-repeat opacity-90">
                    <AnimatePresence>
                        {messages.map((msg, i) => {
                            const style = getAvatar(msg.model);
                            const isSystem = msg.model === 'System';

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`flex w-full ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] flex gap-3 ${msg.isUser ? 'flex-row-reverse' : 'flex-row'}`}>

                                        {/* Avatar */}
                                        {!isSystem && !msg.isUser && (
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-white/10 ${style.bg} ${style.color}`}>
                                                {style.icon}
                                            </div>
                                        )}

                                        {/* Message Bubble */}
                                        <div className={`
                                            p-3 rounded-2xl text-sm leading-relaxed shadow-lg
                                            ${msg.isUser ? 'bg-zinc-100 text-zinc-900 rounded-tr-none' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-none'}
                                            ${isSystem ? 'w-full text-center bg-transparent border-none text-zinc-500 font-mono text-xs italic' : ''}
                                        `}>
                                            {!msg.isUser && !isSystem && (
                                                <div className={`text-[10px] font-bold mb-1 uppercase tracking-wider ${style.color}`}>
                                                    {msg.model}
                                                </div>
                                            )}
                                            {msg.logic}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {loading && (
                        <div className="flex gap-2 items-center text-zinc-500 text-xs font-mono pl-12 animate-pulse">
                            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full"></span>
                            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animation-delay-200"></span>
                            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animation-delay-400"></span>
                            Analyzing...
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-zinc-900 border-t border-zinc-800">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask the analysts (e.g., 'Who wins?', 'Is it safe?')..."
                            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition-colors text-sm"
                            disabled={loading}
                            autoFocus
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading}
                            className={`p-3 rounded-xl flex items-center justify-center transition-all ${loading ? 'bg-zinc-800 text-zinc-600' : 'bg-white text-black hover:bg-zinc-200'}`}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <div className="mt-2 flex gap-2 justify-center">
                        {['Who wins?', 'High Risk?', 'Parlay Idea'].map(q => (
                            <button
                                key={q}
                                onClick={() => { setInput(q); }}
                                className="text-[10px] px-2 py-1 rounded bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Brain, Activity } from 'lucide-react'; // Imports needed for the component above to work. I'll make sure to include all valid imports.

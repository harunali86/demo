'use client';

import { useState } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: number;
    text: string;
    isBot: boolean;
    time: string;
}

const BOT_RESPONSES: Record<string, string> = {
    'hi': 'Hello! 👋 How can I help you today?',
    'hello': 'Hi there! Welcome to Harun Store. How can I assist you?',
    'order': 'To track your order, go to Track Order page and enter your order number. Need help with something else?',
    'return': 'We offer 7-day easy returns. Visit our Returns page or go to My Orders to initiate a return.',
    'refund': 'Refunds are processed within 5-7 business days after we receive the item back.',
    'shipping': 'We offer free shipping on orders above ₹499. Standard delivery takes 3-5 days.',
    'payment': 'We accept UPI, Credit/Debit cards, Net Banking, and Cash on Delivery.',
    'contact': 'You can reach us at harun@gmail.com or call +91 98765 43210.',
    'default': "I'm here to help! You can ask about orders, returns, shipping, or payments. For complex queries, email us at harun@gmail.com"
};

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: 'Hi! 👋 Welcome to Harun Store. How can I help you?', isBot: true, time: 'now' }
    ]);
    const [input, setInput] = useState('');

    const sendMessage = () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now(),
            text: input,
            isBot: false,
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Bot response
        setTimeout(() => {
            const lowerInput = input.toLowerCase();
            let response = BOT_RESPONSES.default;

            for (const [key, value] of Object.entries(BOT_RESPONSES)) {
                if (lowerInput.includes(key)) {
                    response = value;
                    break;
                }
            }

            const botMsg: Message = {
                id: Date.now() + 1,
                text: response,
                isBot: true,
                time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botMsg]);
        }, 1000);
    };

    return (
        <>
            {/* Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-110 transition-transform"
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <MessageCircle className="w-6 h-6 text-white" />
                )}
            </button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-primary p-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Harun Support</h3>
                                <p className="text-xs text-white/70">Online • Usually replies instantly</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="h-72 overflow-y-auto p-4 space-y-3">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`max-w-[80%] ${msg.isBot ? 'order-2' : ''}`}>
                                        <div className={`px-4 py-2 rounded-2xl text-sm ${msg.isBot
                                                ? 'bg-white/10 text-white rounded-bl-sm'
                                                : 'bg-primary text-white rounded-br-sm'
                                            }`}>
                                            {msg.text}
                                        </div>
                                        <p className={`text-[10px] text-gray-500 mt-1 ${msg.isBot ? '' : 'text-right'}`}>
                                            {msg.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-white/10">
                            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm focus:border-primary outline-none"
                                />
                                <button
                                    type="submit"
                                    className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition"
                                >
                                    <Send className="w-4 h-4 text-white" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

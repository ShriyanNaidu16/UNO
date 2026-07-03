'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, ChefHat } from 'lucide-react';
import ChatMessage from './chat/ChatMessage';
import { useLanguage } from '@/lib/i18n/LanguageContext';

type Message = {
  role: 'user' | 'assistant';
  blocks: Array<{
    type: 'text' | 'food_cards';
    content?: string;
    items?: any[];
  }>;
};

const QUICK_CHIPS = [
  "🍛 Today's Specials",
  "🏺 Heritage Dishes",
  "🌶️ Spicy Food",
  "🥗 Vegetarian",
  "⭐ Chef's Recommendation"
];

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Send initial welcome message
      handleSendMessage('welcome', true);
    }
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (text: string, isSilent = false) => {
    if (!text.trim()) return;

    if (!isSilent) {
      setMessages(prev => [...prev, {
        role: 'user',
        blocks: [{ type: 'text', content: text }]
      }]);
      setInput('');
    }

    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, language })
      });
      
      const data = await res.json();
      
      if (data.messages) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          blocks: data.messages
        }]);
      } else {
        throw new Error('No messages returned');
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        blocks: [{ type: 'text', content: "I'm having trouble connecting to the kitchen right now. Please try again in a moment!" }]
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-full shadow-2xl flex items-center justify-center text-white z-50 border-4 border-white/40 hover:scale-105 transition-transform"
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        whileHover={{ rotate: 15 }}
      >
        <Sparkles size={28} className="drop-shadow-md" />
      </motion.button>

      {/* Chat Window Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9, transition: { duration: 0.2 } }}
            className="fixed bottom-6 right-6 w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)] z-50 flex flex-col rounded-3xl shadow-2xl overflow-hidden border border-white/40"
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-500 p-4 text-white flex justify-between items-center shadow-md z-10 relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-inner">
                  <ChefHat size={20} className="text-white drop-shadow" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight tracking-tight drop-shadow-sm">Food Concierge</h3>
                  <p className="text-xs text-amber-100 font-medium">AI Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide bg-gradient-to-b from-transparent to-black/[0.02]">
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} role={msg.role} messages={msg.blocks} />
              ))}
              
              {isTyping && (
                <div className="flex w-full justify-start mb-6">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white shrink-0 mr-3 shadow-md border border-amber-200">
                    ✨
                  </div>
                  <div className="bg-card px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-white/40 flex items-center gap-1">
                    <motion.div className="w-2 h-2 bg-foreground/40 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                    <motion.div className="w-2 h-2 bg-foreground/40 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                    <motion.div className="w-2 h-2 bg-foreground/40 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area & Quick Chips */}
            <div className="p-3 bg-white/60 border-t border-white/40 backdrop-blur-md">
              {/* Quick Chips */}
              <div className="flex overflow-x-auto gap-2 pb-3 scrollbar-hide">
                {QUICK_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip)}
                    className="whitespace-nowrap px-4 py-1.5 bg-card border border-primary/20 text-foreground text-xs font-semibold rounded-full hover:bg-primary/10 transition-colors shadow-sm"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input Box */}
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
                className="flex items-center gap-2 bg-card rounded-2xl p-1 border border-primary/20 shadow-inner"
              >
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask for recommendations..."
                  className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-sm text-foreground placeholder:text-foreground/40"
                  disabled={isTyping}
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || isTyping}
                  className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 transition-colors shrink-0 shadow-sm"
                >
                  <Send size={18} className="ml-1" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

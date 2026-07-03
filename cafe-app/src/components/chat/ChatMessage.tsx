'use client';

import { MenuItem } from '@/lib/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Leaf, Flame } from 'lucide-react';
import Image from 'next/image';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  messages: Array<{
    type: 'text' | 'food_cards';
    content?: string;
    items?: MenuItem[];
  }>;
}

export default function ChatMessage({ role, messages }: ChatMessageProps) {
  const { language } = useLanguage();

  const loc = (obj: any, key: string) => {
    if (language === 'en') return obj[key];
    return obj[`${key}_${language}`] || obj[key];
  };

  const isUser = role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white shrink-0 mr-3 shadow-md border border-amber-200">
          ✨
        </div>
      )}
      
      <div className={`max-w-[85%] ${isUser ? 'order-1' : 'order-2'}`}>
        {messages.map((msg, index) => {
          if (msg.type === 'text') {
            return (
              <div 
                key={index} 
                className={`p-4 rounded-2xl ${
                  isUser 
                  ? 'bg-primary text-primary-foreground rounded-tr-none shadow-sm' 
                  : 'bg-card text-foreground rounded-tl-none shadow-md border border-white/40'
                } mb-3`}
              >
                {/* Parse bold markdown manually for simple text */}
                <p className="whitespace-pre-wrap leading-relaxed text-[15px]" 
                   dangerouslySetInnerHTML={{ __html: (msg.content || '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
              </div>
            );
          }
          
          if (msg.type === 'food_cards' && msg.items) {
            return (
              <div key={index} className="flex overflow-x-auto gap-4 pb-4 pt-1 snap-x scrollbar-hide -mx-2 px-2">
                {msg.items.map((item) => (
                  <div key={item.id} className="min-w-[240px] max-w-[240px] bg-card rounded-2xl overflow-hidden shadow-lg border border-white/60 snap-start flex flex-col transition-transform hover:-translate-y-1">
                    <div className="relative h-32 w-full">
                      <Image
                        src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
                        alt={loc(item, 'name')}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        {item.veg_nonveg_tag === 'veg' ? (
                          <><Leaf size={12} className="text-green-600" /><span className="text-[10px] font-bold text-green-700 uppercase">Veg</span></>
                        ) : (
                          <><Flame size={12} className="text-red-600" /><span className="text-[10px] font-bold text-red-700 uppercase">Non-Veg</span></>
                        )}
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="font-bold text-lg leading-tight mb-1">{loc(item, 'name')}</h4>
                      <p className="text-xs text-foreground/70 line-clamp-3 mb-4 flex-1">
                        {loc(item, 'description')}
                      </p>
                      {/* Notice: No Price is displayed here as requested */}
                      <button className="w-full py-2 bg-secondary text-secondary-foreground text-sm font-semibold rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors border border-transparent hover:border-primary/20">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          }
          
          return null;
        })}
      </div>
      
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground shrink-0 ml-3 shadow-sm order-2">
          👤
        </div>
      )}
    </div>
  );
}

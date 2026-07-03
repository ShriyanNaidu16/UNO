import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function POST(request: Request) {
  try {
    const { message, language = 'en' } = await request.json();
    
    if (!ai) {
      return NextResponse.json({
        messages: [{
          type: 'text',
          content: "⚠️ **Configuration Error:** The AI is currently asleep because it's missing its `GEMINI_API_KEY`. Please add your API key to `.env.local` and restart the server!"
        }]
      });
    }

    // Prepare active menu items for the prompt
    const availableItems = store.items.filter(item => item.is_available);
    const menuContext = availableItems.map(item => `- ID: ${item.id}, Name: ${item.name}, Type: ${item.veg_nonveg_tag}, Description: ${item.description}`).join('\n');

    const systemPrompt = `You are an elegant, knowledgeable, and warm restaurant host for a premium dining establishment.
Your job is to answer customer questions and recommend dishes from our menu.

AVAILABLE MENU ITEMS:
${menuContext}

RULES:
1. ONLY recommend dishes that are listed above. Do not invent dishes.
2. NEVER mention prices.
3. Keep your response conversational and engaging. Use storytelling where appropriate, especially for heritage dishes.
4. When you want to recommend a specific dish and show its card to the user, include a tag in the exact format: [RECOMMEND: id] (e.g. [RECOMMEND: m1]). You can include multiple tags anywhere in your response.
5. Do not hallucinate or use IDs that are not in the provided menu.
6. Respond in a way that respects the user's language if they ask you to, otherwise default to English.`;

    const chatResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    let rawText = chatResponse.text || "I'm having trouble thinking right now. Please ask me again.";

    // Parse [RECOMMEND: id] tags
    const recommendRegex = /\[RECOMMEND:\s*(m\d+)\]/gi;
    const matches = [...rawText.matchAll(recommendRegex)];
    const recommendedItemIds = [...new Set(matches.map(m => m[1]))]; // unique IDs
    
    // Remove the tags from the text
    const cleanText = rawText.replace(recommendRegex, '').trim();

    let responseMessages: any[] = [];
    
    if (cleanText) {
      responseMessages.push({
        type: 'text',
        content: cleanText
      });
    }

    if (recommendedItemIds.length > 0) {
      const recommendedItems = store.items.filter(item => recommendedItemIds.includes(item.id));
      if (recommendedItems.length > 0) {
        responseMessages.push({
          type: 'food_cards',
          items: recommendedItems
        });
      }
    }

    // Fallback if the AI returns no text but wants to show cards
    if (responseMessages.length === 0) {
       responseMessages.push({
        type: 'text',
        content: "Here are some recommendations based on your request!"
      });
    }

    return NextResponse.json({ messages: responseMessages });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
  }
}

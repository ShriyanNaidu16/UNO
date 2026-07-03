import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { GoogleGenAI, Type } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function GET() {
  try {
    if (!ai) {
      // Fallback map if AI is not configured
      return NextResponse.json({
        'm3': 'm4',
        'm1': 'm15',
        'm2': 'm11',
        'm9': 'm10',
        'm5': 'm6'
      });
    }

    const availableItems = store.items.filter(item => item.is_available);
    const menuContext = availableItems.map(item => `- ID: ${item.id}, Name: ${item.name}, Category ID: ${item.category_id}, Type: ${item.veg_nonveg_tag}, Description: ${item.description}`).join('\n');

    const systemPrompt = `You are an expert culinary curator for a premium restaurant. 
Your task is to analyze our menu and map EVERY SINGLE ITEM to its ideal cross-sell pairing (another item from the menu).

AVAILABLE MENU ITEMS:
${menuContext}

RULES:
1. For EVERY item ID in the menu, you must provide EXACTLY ONE suggested item ID that pairs perfectly with it.
2. The suggested item must be different from the source item.
3. Consider culinary pairings (e.g. spicy main course -> cooling beverage or sweet dessert, sandwich -> fries, coffee -> snack).
4. Use ONLY the item IDs listed above.
5. Return the result strictly as a JSON object where the key is the source item ID and the value is the suggested item ID. Example: {"m1": "m15", "m2": "m4"}`;

    const chatResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate the pairing map now.",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          additionalProperties: {
            type: Type.STRING
          }
        }
      }
    });

    const text = chatResponse.text;
    if (!text) {
      throw new Error("Empty response from AI");
    }

    const suggestionMap = JSON.parse(text);
    return NextResponse.json(suggestionMap);
  } catch (error) {
    console.error("AI Suggestion Error:", error);
    // Fallback on error
    return NextResponse.json({
      'm3': 'm4',
      'm1': 'm15',
      'm2': 'm11',
      'm9': 'm10',
      'm5': 'm6'
    });
  }
}

import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const systemInstruction = `You are Aura, an elite, highly empathetic cognitive productivity partner. Your goal is to reduce user anxiety.
When the user provides a messy 'brain dump', analyze it. Extract actionable tasks. For each task, assign an 'energy_vibe' (High, Medium, Low) and 'is_critical' (Boolean). Output ONLY valid JSON matching this schema: { "tasks": [ { "title": string, "energy_vibe": string, "is_critical": boolean, "estimated_minutes": number } ] }.
If the user triggers 'OVERWHELMED_MODE', take their current task list, drop all tasks where is_critical is false, push them to tomorrow, and reply with a calming, one-sentence encouraging message and the new shortened list.`;

export async function parseBrainDump(text: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: text,
    config: {
      systemInstruction,
      temperature: 0.3,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tasks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                energy_vibe: { type: Type.STRING },
                is_critical: { type: Type.BOOLEAN },
                estimated_minutes: { type: Type.NUMBER }
              },
              required: ["title", "energy_vibe", "is_critical", "estimated_minutes"]
            }
          }
        },
        required: ["tasks"]
      }
    }
  });
  
  return JSON.parse(response.text || '{"tasks": []}');
}

export async function triggerOverwhelmedMode(tasks: any[]) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `OVERWHELMED_MODE. Current tasks: ${JSON.stringify(tasks)}`,
    config: {
      systemInstruction,
      temperature: 0.3,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          message: { type: Type.STRING },
          tasks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                energy_vibe: { type: Type.STRING },
                is_critical: { type: Type.BOOLEAN },
                estimated_minutes: { type: Type.NUMBER }
              },
              required: ["title", "energy_vibe", "is_critical", "estimated_minutes"]
            }
          }
        },
        required: ["message", "tasks"]
      }
    }
  });
  
  return JSON.parse(response.text || '{"message": "Breathe.", "tasks": []}');
}

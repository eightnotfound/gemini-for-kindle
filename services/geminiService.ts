
import { GoogleGenAI, Chat } from "@google/genai";

// IMPORTANT: Do not expose this key publicly.
// It is assumed that process.env.API_KEY is securely managed.
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

export function startChat(): Chat {
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
        systemInstruction: 'You are a helpful assistant. Keep your responses concise and clear, suitable for reading on an e-ink screen.',
    },
  });
  return chat;
}

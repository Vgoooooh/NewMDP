
import { GoogleGenAI, Type } from "@google/genai";
import { IoTProjectCategory, GeminiSuggestionResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProjectIdea = async (prompt: string): Promise<GeminiSuggestionResponse> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Brainstorm a creative IoT project based on: ${prompt}. Return the response in Chinese.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          category: { 
            type: Type.STRING, 
            enum: Object.values(IoTProjectCategory) 
          },
          suggestedStats: {
            type: Type.OBJECT,
            properties: {
              deviceCount: { type: Type.INTEGER },
              assetCount: { type: Type.INTEGER },
              memberCount: { type: Type.INTEGER }
            },
            required: ["deviceCount", "assetCount", "memberCount"]
          }
        },
        required: ["name", "description", "category", "suggestedStats"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

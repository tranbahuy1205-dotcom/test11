
import { GoogleGenAI } from "@google/genai";
import { Product } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateDescription = async (product: Product): Promise<string> => {
  try {
    const prompt = `Write a compelling and stylish e-commerce product description for the "${product.name}". 
    Keep it concise (around 2-3 sentences). 
    Highlight its key features: it is made of ${product.material} and has a ${product.style} style. 
    Focus on the feeling and atmosphere it creates in a home. Do not use markdown or formatting.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error generating description:", error);
    return "Could not generate a new description at this time. Please try again later.";
  }
};

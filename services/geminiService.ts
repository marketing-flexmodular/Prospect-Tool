
import { GoogleGenAI } from "@google/genai";
import { Company, LeadStatus } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Helper for safe UUID generation
const generateUUID = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    // Fallback for environments without crypto.randomUUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

// Helper to clean JSON string from Markdown and other noise
const cleanJson = (text: string): string => {
  // Remove markdown code blocks
  let cleaned = text.replace(/```json/g, '').replace(/```/g, '');
  
  // Try to find the array brackets
  const startIndex = cleaned.indexOf('[');
  const endIndex = cleaned.lastIndexOf(']');
  
  if (startIndex !== -1 && endIndex !== -1) {
    return cleaned.substring(startIndex, endIndex + 1);
  }
  
  // If no array found, check if it's a single object and wrap it
  const startObj = cleaned.indexOf('{');
  const endObj = cleaned.lastIndexOf('}');
  if (startObj !== -1 && endObj !== -1) {
      return `[${cleaned.substring(startObj, endObj + 1)}]`;
  }

  return "[]";
};

export const fetchEnrichedLeads = async (location: string, segment: string, excludeNames: string[] = [], quantity: number = 9): Promise<Company[]> => {
  const model = "gemini-2.5-flash"; 

  // Check if location implies Brazil
  const isBrazil = location.includes(" - SP") || location.includes(" - RJ") || location.includes(" - BR") || !location.includes(" - ");

  // Optimization: Send more names to exclusion list to prevent duplicates better
  const exclusionList = excludeNames.slice(-50).join(", ");
  const exclusionPrompt = exclusionList.length > 0 
    ? `EXCLUDE these companies (already known): [${exclusionList}]. Find others.` 
    : "";

  // UPDATED PROMPT: More robust, less strict on "Exactness", clearer instruction for JSON
  const prompt = `
    Task: Find B2B leads for "${segment}" in "${location}".
    Target: Up to ${quantity} businesses.
    
    INSTRUCTIONS:
    1. USE 'googleMaps' to search. This is mandatory.
    2. List businesses found. If exact category matches are low, include closely related businesses.
    3. ${exclusionPrompt}
    
    OUTPUT FORMAT:
    Return strictly a JSON ARRAY of objects. No intro text.
    
    JSON Object Structure:
    {
      "nome_fantasia": "Business Name",
      "endereco": "Full Address",
      "telefone": "Phone (or null)",
      "website": "Website URL (or null)",
      "atividade": "Primary Category",
      "horario_funcionamento": "e.g., Seg-Sex 08-18h (or null)",
      "aberto_agora": true/false
    }
    
    Important: 
    - Do not invent data. Use real Maps data.
    - If you find fewer than ${quantity}, return all you found.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }], 
        temperature: 0.5, // Balanced for creativity in finding related businesses if exact match is scarce
      }
    });

    const cleanText = cleanJson(response.text || "");
    let rawData = [];
    
    try {
        rawData = JSON.parse(cleanText);
    } catch (parseError) {
        console.warn("Failed to parse JSON from Gemini, raw text snippet:", response.text?.substring(0, 100));
        // Fallback: If strict parsing fails, return empty array to avoid crashing, but log it.
        return [];
    }

    if (!Array.isArray(rawData)) {
        return [];
    }

    // Process and enrich 
    return rawData.map((item: any): Company => {
        
        // Parse Location
        let cityStr = location;
        let ufStr = "";
        if (location.includes('-')) {
            const parts = location.split('-');
            cityStr = parts[0].trim();
            ufStr = parts[1].trim();
        }

        // Clean Website URL
        let cleanWebsite = item.website;
        if (cleanWebsite) {
            cleanWebsite = cleanWebsite.replace(/^https?:\/\//, '').replace(/^www\./, '');
            if(cleanWebsite.endsWith('/')) cleanWebsite = cleanWebsite.slice(0, -1);
            if(cleanWebsite === 'null' || cleanWebsite === '') cleanWebsite = null;
        }

        // Robust address handling
        const fullAddress = item.endereco || `${cityStr}, ${ufStr}`;
        const bairroMatch = fullAddress.match(/,\s*([^,]+),\s*[A-Z]{2}/); // Try to capture neighborhood before State
        const bairro = bairroMatch ? bairroMatch[1] : (item.bairro || "Centro");

        return {
            id: generateUUID(),
            cnpj: "", // No validation, leaving empty
            razão_social: item.razao_social || item.nome_fantasia,
            nome_fantasia: item.nome_fantasia,
            endereco: fullAddress,
            cidade: cityStr,
            uf: ufStr,
            pais: isBrazil ? "Brasil" : "Exterior",
            bairro: bairro,
            cep: "",
            
            opening_hours: item.horario_funcionamento || "Horário Comercial",
            is_open_now: item.aberto_agora !== undefined ? item.aberto_agora : false,
            
            atividade_principal: item.atividade || segment,
            telefone: item.telefone || null,
            email: null, 
            website: cleanWebsite || null,
            status: LeadStatus.NEW,
            source: 'GOOGLE_MAPS',
            score: item.telefone ? 90 : 70, 
            socials: {
                linkedin: null,
                instagram: null
            }
        };
    });

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return []; // Return empty array instead of throwing to prevent app crash, UI handles empty state
  }
};

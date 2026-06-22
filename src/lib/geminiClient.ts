import { GoogleGenAI } from "@google/genai";

// Initialize client on the server.
// The key is sourced from process.env.GEMINI_API_KEY.
// We set 'User-Agent': 'aistudio-build' for AI Studio metrics.
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// DEFAULT MODEL
export const DEFAULT_MODEL = "gemini-2.0-flash";

/**
 * Stub for assistant chat response.
 * Will be implemented in Step 2.
 */
export async function getChatResponse(
  message: string,
  history: any[],
  languageCode: string,
  context?: { allergies?: string[]; conditions?: string[] }
) {
  try {
    const allergiesList = context?.allergies || ["Peanut Allergy"];
    const conditionsList = context?.conditions || ["Mild Hypertension"];

    const sysInstruction = `You are HealthGuard AI's warm, supportive, and clinically-informed health helper (also known as HealthGuard Clinical Assistant).
The user's active health profile consists of:
- Allergen Triggers: ${allergiesList.join(", ")}
- Health Conditions: ${conditionsList.join(", ")}
- General Dietary Target: Low-sodium (< 1,500mg daily) and High Protein

Your goal is to answer the user's questions about ingredients, nutrition, food, or general health concerns in a warm, empathetic, and clinically-informed style.

CRITICAL RULES:
1. Speak exclusively in the language specified by code: "${languageCode}". (e.g. 'en': English, 'hi': Hindi, 'ta': Tamil, 'es': Spanish, 'fr': French, 'bn': Bengali, 'te': Telugu, 'mr': Marathi, 'gu': Gujarati, 'kn': Kannada). If the code is not recognized, reply in the language the user is speaking, or default to English.
2. Keep your answers clear, concise, and easy to read (max 3-5 sentences or 1-2 paragraphs), so they fit nicely within small chat bubbles.
3. If they ask about potentially harmful foods or ingredients, refer to their allergies/conditions when appropriate to maintain personalized safety context.
4. Avoid giving specific medical prescriptions or diagnosing disease. Focus purely on supportive nutrition, allergen warning guidance, and lifestyle coaching.
`;

    // Map the history array to the SDK standard Content structure
    const formattedHistory = (history || [])
      .filter((h: any) => h && h.text && (h.sender === 'user' || h.sender === 'ai'))
      .slice(-10)
      .map((h: any) => ({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
      }));

    const contents = [
      ...formattedHistory,
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents,
      config: {
        systemInstruction: sysInstruction,
        temperature: 0.7,
      }
    });

    const text = response.text || "I was unable to formulate a response. Please try again.";

    // Classify reply category by checking for keywords to pick response type
    const lowercaseText = text.toLowerCase();
    let type: 'neutral' | 'clinical-alert' | 'clinical-success' | 'telemetry' = 'neutral';
    
    if (lowercaseText.includes('warning') || lowercaseText.includes('danger') || lowercaseText.includes('alert') || lowercaseText.includes('avoid') || lowercaseText.includes('allergy') || lowercaseText.includes('clash') || lowercaseText.includes('conflict') || lowercaseText.includes('खतरा') || lowercaseText.includes('चेतावनी') || lowercaseText.includes('எச்சரிக்கை') || lowercaseText.includes('ஒவ்வாமை')) {
      type = 'clinical-alert';
    } else if (lowercaseText.includes('success') || lowercaseText.includes('safe') || lowercaseText.includes('compatible') || lowercaseText.includes('healthy') || lowercaseText.includes('perfect') || lowercaseText.includes('सुरक्षित') || lowercaseText.includes('பாதுகாப்பானது')) {
      type = 'clinical-success';
    } else if (lowercaseText.includes('hydration') || lowercaseText.includes('water') || lowercaseText.includes('sodium') || lowercaseText.includes('level') || lowercaseText.includes('blood pressure') || lowercaseText.includes('bp') || lowercaseText.includes('dosage') || lowercaseText.includes('timing') || lowercaseText.includes('पानी') || lowercaseText.includes('సోడియం')) {
      type = 'telemetry';
    }

    return {
      success: true,
      text,
      type
    };
  } catch (err: any) {
    console.error("Error in getChatResponse:", err);
    throw err;
  }
}

/**
 * Food ingredients/image analysis using Gemini-2.0-Flash.
 */
export async function analyzeFoodImage(
  base64Image: string,
  userProfile?: { allergies?: string[]; conditions?: string[] }
) {
  try {
    const allergiesList = userProfile?.allergies || [];
    const conditionsList = userProfile?.conditions || [];

    let mimeType = 'image/jpeg';
    let rawBase64 = base64Image;
    if (base64Image.includes(';base64,')) {
      const parts = base64Image.split(';base64,');
      mimeType = parts[0].replace('data:', '');
      rawBase64 = parts[1];
    }

    const prompt = `You are an expert clinical dietitian and food scanning AI.
Identify the product represented in this image or label photo, scan its visible ingredients and nutrition facts.

Compare them with the user's health profile:
- Allergen Triggers: ${allergiesList.join(", ") || "None"}
- Chronic Conditions: ${conditionsList.join(", ") || "None"}

Please output an analytical breakdown matching the TS parameters below:
interface FoodItem {
  name: string; // identified food item / product name
  category: string; // e.g. "Dairy", "Snacks", "Beverages" etc.
  brand: string; // manufacturer/brand name
  score: number; // overall calculated safety score from 0 (lethal trigger match) to 100 (fully safe)
  grade: 'A' | 'B' | 'C' | 'D' | 'F'; // letter grade based on clinical safety
  riskLevel: 'safe' | 'warning' | 'avoid'; // 'avoid' if a direct allergen matches, 'warning' if conditions flag a threat, 'safe' if no issue
  allergensDetected: string[]; // allergens found in their profiles or common global allergens
  dietMatches: string[]; // positive diet certifications or matches
  dietClashes: string[]; // any dietary warnings and clashes detected
  extractedIngredients: string; // clean list of ingredients text found
  nutrition: {
    protein: string; 
    sodium: string;
    sugar: string;
    calories: string;
  };
  clinicalBio: string; // concise 2-3 sentence medical explanation regarding why this grade was assigned based on ingredients and their profile.
}

Output ONLY a single parseable JSON object matching this structure. No markdown wrapping outside standard JSON.
`;

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: [
        {
          inlineData: {
            mimeType,
            data: rawBase64
          }
        },
        prompt
      ],
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    return {
      success: true,
      data: {
        id: `gemini_food_img_${Date.now()}`,
        image: base64Image.startsWith('data:') ? base64Image : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
        ...parsedData
      }
    };
  } catch (err: any) {
    console.error("Error in analyzeFoodImage:", err);
    throw err;
  }
}

export async function analyzeFoodText(
  ingredientsText: string,
  userProfile?: { allergies?: string[]; conditions?: string[] }
) {
  try {
    const allergiesList = userProfile?.allergies || [];
    const conditionsList = userProfile?.conditions || [];

    const prompt = `You are a clinical-grade dietitian and nutrition scanning service.
Analyze the following food item / ingredients text:
"${ingredientsText}"

Matching against this user health profile:
- Active Allergies: ${allergiesList.join(", ") || "None"}
- Chronic Conditions: ${conditionsList.join(", ") || "None"}

Please output an analytical breakdown as a JSON object adhering STRICTLY to this structure:
interface FoodItem {
  name: string; // inferred product title from ingredients or style context
  category: string; // e.g., "Dairy", "Baking", "Cereal", etc.
  brand: string; // brand if inferred, or "Inferred Product"
  score: number; // safety score (0 to 100)
  grade: 'A' | 'B' | 'C' | 'D' | 'F'; // letter grade correlating with score
  riskLevel: 'safe' | 'warning' | 'avoid'; // 'avoid' if allergens match, 'warning' if conditions highlight moderation, 'safe' if fully safe
  allergensDetected: string[]; // specific ingredient triggers from their allergies list, or general common allergens found or potential cross-contamination
  dietMatches: string[]; // e.g. ["Gluten-Free", "Low-Sodium"]
  dietClashes: string[]; // list of active dietary conflicts with conditions/allergies
  extractedIngredients: string; // cleaned-up ingredients text list
  nutrition: {
    protein: string; 
    sodium: string;
    sugar: string;
    calories: string;
  };
  clinicalBio: string; // maximum 2-3 sentences medical warning explaining why this grade was assigned based on dietary requirements.
}

Output ONLY a single parseable JSON object matching this structure.
`;

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    return {
      success: true,
      data: {
        id: `gemini_food_text_${Date.now()}`,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
        ...parsedData
      }
    };
  } catch (err: any) {
    console.error("Error in analyzeFoodText:", err);
    throw err;
  }
}

/**
 * Medicine label/image analysis using Gemini-2.0-Flash.
 */
export async function analyzeMedicineImage(
  base64Image: string,
  userProfile?: { allergies?: string[]; conditions?: string[] }
) {
  try {
    const allergiesList = userProfile?.allergies || [];
    const conditionsList = userProfile?.conditions || [];

    let mimeType = 'image/jpeg';
    let rawBase64 = base64Image;
    if (base64Image.includes(';base64,')) {
      const parts = base64Image.split(';base64,');
      mimeType = parts[0].replace('data:', '');
      rawBase64 = parts[1];
    }

    const prompt = `You are a clinical pharmacologist AI. Analyze the uploaded medicine label or container photo.
Perform ingredient recognition, therapeutic class mapping, dose verification, and food or drug interaction reviews.

Compare against active patient trackers:
- Allergen Triggers: ${allergiesList.join(", ") || "None"}
- Health Conditions: ${conditionsList.join(", ") || "None"}

Please output an analytical review as a JSON object adhering STRICTLY to this TS interface structure:
interface MedicinePresetItem {
  name: string; // drug name and strength, e.g. "Ibuprofen (Advil 200mg)"
  brand: string; // manufacturer/brand name
  category: string; // therapeutic class, e.g. "NSAID / Pain Relief"
  score: number; // calculated safety score (0 to 100) based on active profile compat
  grade: 'A' | 'B' | 'C' | 'D' | 'F'; // letter grade correlating with score
  riskLevel: 'safe' | 'warning' | 'danger'; // 'danger' if direct conflict with conditions/allergies exists, 'warning' if caution is required, 'safe' if no issue
  activeIngredients: string; // active ingredients listed with dosages
  dosage: string; // typical dosage parsed from bottle
  schedule: string; // timing directions, e.g., "1 tablet every 4-6 hours"
  instructions: string; // key administration directives, limits, or warnings
  interactions: Array<{ medicineName: string; severity: 'low' | 'moderate' | 'high'; effect: string }>; // potential common drug clashes
  foodInteractions: string[]; // list of foods to avoid or take with this
  adherenceRate: number; // default to 100
  profileConflictTriggered: boolean; // boolean indicating whether a direct active allergy/condition conflict was flagged
  conflictDetails?: string; // string explaining the direct clinical block or warning in 1-2 sentence detail
}

Output ONLY a single parseable JSON object matching this structure.
`;

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: [
        {
          inlineData: {
            mimeType,
            data: rawBase64
          }
        },
        prompt
      ],
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    return {
      success: true,
      data: {
        id: `gemini_med_img_${Date.now()}`,
        image: base64Image.startsWith('data:') ? base64Image : 'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=400&q=80',
        ...parsedData
      }
    };
  } catch (err: any) {
    console.error("Error in analyzeMedicineImage:", err);
    throw err;
  }
}

export async function analyzeMedicineText(
  medicineText: string,
  userProfile?: { allergies?: string[]; conditions?: string[] }
) {
  try {
    const allergiesList = userProfile?.allergies || [];
    const conditionsList = userProfile?.conditions || [];

    const prompt = `You are an expert clinical pharmacist and pharmacology scanner service.
Analyze the following medicine label, bottle photo, or description text:
"${medicineText}"

Against the user's active health clinical trackers:
- Active Allergies: ${allergiesList.join(", ") || "None"}
- Chronic Conditions: ${conditionsList.join(", ") || "None"}

Please output an analytical review as a JSON object adhering STRICTLY to this TS interface structure:
interface MedicinePresetItem {
  name: string; // generic and brand name combined, e.g. "Ibuprofen (Advil Extra)"
  brand: string; // manufacturer/brand name
  category: string; // therapeutic classification, e.g. "NSAID / Pain Relief"
  score: number; // calculated safety score (0 to 100) based on active profile compat
  grade: 'A' | 'B' | 'C' | 'D' | 'F'; // letter grade correlating with score
  riskLevel: 'safe' | 'warning' | 'danger'; // 'danger' if direct conflict with conditions/allergies exists, 'warning' if caution is required, 'safe' if no issue
  activeIngredients: string; // active ingredients list with dosages
  dosage: string; // typical standard single dosage parsed
  schedule: string; // timing directions, e.g., "1 tablet every 4-6 hours"
  instructions: string; // key administration directives, warnings, and limits
  interactions: Array<{ medicineName: string; severity: 'low' | 'moderate' | 'high'; effect: string }>; // potential common drug clashes or interactions to monitor
  foodInteractions: string[]; // e.g. ["Avoid grapefruits", "Take with meals to prevent stomach discomfort"]
  adherenceRate: number; // default to 100
  profileConflictTriggered: boolean; // boolean indicating whether a direct active allergy/condition conflict was flagged
  conflictDetails?: string; // string explaining the direct clinical block or warning in 1-2 sentence detail
}

Output ONLY a single parseable JSON object matching this structure.
`;

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    return {
      success: true,
      data: {
        id: `gemini_med_text_${Date.now()}`,
        image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=400&q=80',
        ...parsedData
      }
    };
  } catch (err: any) {
    console.error("Error in analyzeMedicineText:", err);
    throw err;
  }
}

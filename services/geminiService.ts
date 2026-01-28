import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Question, PersonalityResult, UserAnswer } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to validate API Key availability
export const hasApiKey = (): boolean => !!apiKey;

const questionSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.INTEGER },
      text: { type: Type.STRING },
      options: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            text: { type: Type.STRING },
            trait: { type: Type.STRING, description: "One word trait associated with this answer (e.g., Introverted, Sensing, Feeling, Judging)" }
          },
          required: ["id", "text", "trait"]
        }
      }
    },
    required: ["id", "text", "options"]
  }
};

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    archetype: { type: Type.STRING, description: "A creative name for the student persona (e.g., The Midnight Scholar)" },
    tagline: { type: Type.STRING, description: "A short, catchy slogan for this personality." },
    description: { type: Type.STRING, description: "A detailed paragraph describing their learning style." },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
    studyTips: { type: Type.ARRAY, items: { type: Type.STRING } },
    careerPaths: { type: Type.ARRAY, items: { type: Type.STRING } },
    traits: {
      type: Type.ARRAY,
      description: "Numerical scores for 5-6 key personality dimensions (0-100 scale)",
      items: {
        type: Type.OBJECT,
        properties: {
          trait: { type: Type.STRING, description: "Name of the trait (e.g. Creativity, Focus)" },
          score: { type: Type.INTEGER },
          fullMark: { type: Type.INTEGER, description: "Always 100" }
        },
        required: ["trait", "score", "fullMark"]
      }
    }
  },
  required: ["archetype", "tagline", "description", "strengths", "weaknesses", "studyTips", "careerPaths", "traits"]
};

export const generateQuestions = async (): Promise<Question[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate 20 engaging, scenario-based multiple choice questions designed to assess a student's personality. Draw inspiration from the 16Personalities framework (MBTI), covering dimensions such as Energy (Introverted/Extraverted), Mind (Intuitive/Observant), Nature (Thinking/Feeling), and Tactics (Judging/Prospecting). Scenarios should be highly relevant to student life: dorm living, study groups, exam pressure, parties, and club leadership.",
      config: {
        responseMimeType: "application/json",
        responseSchema: questionSchema,
        systemInstruction: "You are an expert educational psychologist. Create a detailed student personality assessment inspired by the Big Five and MBTI."
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Question[];
    }
    throw new Error("No data returned from Gemini");
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
};

export const analyzePersonality = async (answers: UserAnswer[]): Promise<PersonalityResult> => {
  try {
    const prompt = `Analyze the following 20 student quiz answers (based on a 16-personalities style assessment) and generate a comprehensive personality profile. Determine their archetype (e.g., similar to INTJ, ESFP, etc., but give it a creative student-centric name like 'The Midnight Philosopher' or 'The Campus Catalyst').
    
    Answers:
    ${JSON.stringify(answers, null, 2)}
    
    Provide deep insights into their learning psychology, potential pitfalls, social dynamics, and ideal career paths.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using Pro for better reasoning on the analysis
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        thinkingConfig: { thinkingBudget: 1024 } // Allow some thinking for a better psychological profile
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as PersonalityResult;
    }
    throw new Error("No analysis returned from Gemini");
  } catch (error) {
    console.error("Error analyzing personality:", error);
    throw error;
  }
};

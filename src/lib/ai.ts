// lib/ai.ts - Groq (OpenAI-compatible) | ganti baseURL jika pakai OpenAI/Gemini
import OpenAI from "openai";

export const ai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || "dummy",
  baseURL: process.env.GROQ_API_KEY
    ? "https://api.groq.com/openai/v1"
    : undefined,
});

export const AI_MODEL = process.env.GROQ_API_KEY
  ? "openai/gpt-oss-20b"
  : "gpt-4o-mini";

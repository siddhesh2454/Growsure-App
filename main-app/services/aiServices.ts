// services/aiServices.ts
import axios from "axios";

// 👇 One place to change IP
const BASE_IP = "172.20.10.2"; // ⚡ your PC hotspot IP
const BASE_PORT = "4000";

const CHAT_URL = `http://${BASE_IP}:${BASE_PORT}/chat`;
const TRANSLATE_URL = `http://${BASE_IP}:${BASE_PORT}/translate`; // ✅ new for SoilScreen

/**
 * Get Gemini answer
 * - Chatbot Q&A → mode: "chat"
 * - Translation → mode: "translate"
 */
export const getGeminiAnswer = async (
  prompt: string,
  mode: "chat" | "translate" = "chat",
  targetLang: string = "English" // ✅ optional for translation
) => {
  try {
    console.log("🌍 Sending request to AI API...");
    console.log("📩 Prompt:", prompt);
    console.log("🎯 Mode:", mode);

    if (mode === "chat") {
      // ✅ existing chatbot logic (unchanged)
      const response = await axios.post(CHAT_URL, { message: prompt });
      console.log("🔎 Raw chat response:", response.data);

      if (response.data?.answer) {
        return {
          answer: response.data.answer,
          source: response.data.source || "Gemini AI",
        };
      }
    }

    if (mode === "translate") {
      // ✅ translation handled via /translate route
      const response = await axios.post(TRANSLATE_URL, {
        text: prompt,
        targetLang,
      });

      console.log("🔤 Translation response:", response.data);

      // ✅ Gemini backend returns one of these
      if (response.data?.translatedText) {
        return response.data.translatedText;
      }

      if (response.data?.answer) {
        return response.data.answer;
      }

      // sometimes backend returns { text: "..." }
      if (response.data?.text) {
        return response.data.text;
      }
    }

    throw new Error("Invalid response from AI API");
  } catch (err) {
    console.error("❌ AI Service Error:", err);
    return mode === "chat"
      ? { answer: "⚠️ AI unavailable", source: "System" }
      : "⚠️ Translation failed";
  }
};

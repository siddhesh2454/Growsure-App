require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const admin = require("firebase-admin");
const stringSimilarity = require("string-similarity");

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Helper: Translation with structured formatting preservation (FIXED)
async function translateWithGemini(text, targetLang) {
  try {
    if (!text || !targetLang) return text;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `
You are a precise translator.
Translate the following report into ${targetLang}.
- Keep the structure, line breaks, and bullet points exactly as in the original.
- Do not add explanations or remove formatting.
- Only output the translated text.

${text}
`;

    const result = await model.generateContent(prompt);
    let translated = result.response.text() || text;

    // 🧩 FIX: remove prompt echoes if Gemini repeats instructions
    const unwantedPhrases = [
      "Translate ONLY the text below",
      "Maintain the same structure",
      "Keep the same structure",
      "Do not remove line breaks",
      "Do not add explanations",
      "Only output the translated text",
    ];
    unwantedPhrases.forEach((phrase) => {
      const regex = new RegExp(phrase, "gi");
      translated = translated.replace(regex, "");
    });

    // ✨ Clean formatting
    translated = translated
      .replace(/\n{3,}/g, "\n\n")
      .replace(/\s+([.,!?])/g, "$1")
      .trim();

    return translated;
  } catch (err) {
    console.error("Translation error:", err);
    return text;
  }
}

// ✅ Helper: Text preprocessing for chatbot
const preprocessText = (text) => {
  const stopWords = [
    "the", "a", "an", "in", "on", "at", "to", "and", "or", "is", "are",
    "of", "for", "with", "that", "this", "it", "by",
  ];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(" ")
    .filter((word) => word && !stopWords.includes(word))
    .join(" ");
};

// ============================================
// 🧠 Chatbot Endpoint (existing - untouched)
// ============================================
app.post("/chat", async (req, res) => {
  try {
    let message = req.body.message || req.body.question || req.body.text;
    const lang = req.body.lang || "English";

    if (!message) return res.status(400).json({ error: "Message is required" });

    // Step 1: Translate to English if needed
    let englishMessage = message;
    if (lang !== "English") {
      console.log(`🌍 Translating user question from ${lang} → English`);
      englishMessage = await translateWithGemini(message, "English");
    }

    // Step 2: Search Firestore FAQ
    const cleanedMessage = preprocessText(englishMessage);
    const faqSnapshot = await db.collection("faq").get();

    let bestMatch = { question: "", answer: "", similarity: 0 };
    faqSnapshot.forEach((doc) => {
      const data = doc.data();
      if (!data.question || !data.answer) return;

      const cleanedQ = preprocessText(data.question);
      const similarity = stringSimilarity.compareTwoStrings(cleanedMessage, cleanedQ);
      const partialMatch =
        cleanedQ.includes(cleanedMessage) || cleanedMessage.includes(cleanedQ);

      const adjustedSim = partialMatch ? Math.max(similarity, 0.8) : similarity;
      if (adjustedSim > bestMatch.similarity) {
        bestMatch = { question: data.question, answer: data.answer, similarity: adjustedSim };
      }
    });

    let finalAnswerEnglish = "";

    if (bestMatch.similarity > 0.5) {
      finalAnswerEnglish = bestMatch.answer;
    } else {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
      const prompt = `Answer the following question briefly in 2-3 sentences only:\n\n${englishMessage}`;
      const result = await model.generateContent(prompt);
      finalAnswerEnglish = result.response.text() || "Sorry, I couldn't find an answer.";
    }

    // Step 3: Translate back to user’s selected language
    let finalAnswer = finalAnswerEnglish;
    if (lang === "Hindi" || lang === "Marathi") {
      console.log(`🌍 Translating answer → ${lang}`);
      finalAnswer = await translateWithGemini(finalAnswerEnglish, lang);
    }

    res.json({
      answer: finalAnswer,
      source: bestMatch.similarity > 0.5 ? "FAQ" : "Gemini",
    });
  } catch (error) {
    console.error("❌ Error in /chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ============================================
// 🌐 Translation Endpoint (used by SoilScreen)
// ============================================
app.post("/translate", async (req, res) => {
  try {
    const { text, targetLang } = req.body;

    if (!text || !targetLang) {
      return res.status(400).json({ error: "Both 'text' and 'targetLang' are required." });
    }

    console.log(`🌍 Translating Soil Report → ${targetLang}`);
    const translatedText = await translateWithGemini(text, targetLang);

    res.json({
      success: true,
      targetLang,
      translatedText,
    });
  } catch (error) {
    console.error("❌ Error in /translate:", error);
    res.status(500).json({ error: "Translation failed." });
  }
});

// ============================================
// ✅ Fix for Web “422 Unprocessable Entity”
// ============================================
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    console.error("422 parse error fix triggered");
    return res.status(422).json({ error: "Invalid request content (unprocessable)." });
  }
  next();
});

// ============================================
// 🚀 Start Server
// ============================================
const PORT = 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Chatbot + Translation server running at http://0.0.0.0:${PORT}`);
});

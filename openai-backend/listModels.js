require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Try to list models (if your SDK supports it)
    if (typeof genAI.listModels === "function") {
      const models = await genAI.listModels();
      console.log("Available models:");
      models.forEach((model) => console.log(model.name));
    } else {
      console.log("listModels() is not supported in your SDK version.");
      console.log("Try using a known model like 'models/text-bison-001' directly.");
    }
  } catch (error) {
    console.error("Error while listing models:", error);
  }
}

listModels();

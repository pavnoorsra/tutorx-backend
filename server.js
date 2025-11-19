import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ------------------------------
// REAL TRANSLATE ENDPOINT 🔥
// ------------------------------
app.post("/translate", async (req, res) => {
  const { text, targetLang } = req.body;

  if (!text || !targetLang) {
    return res.status(400).json({ error: "Missing text or targetLang" });
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Translate the following text into ${targetLang}. Return ONLY the translation. No explanations.`,
        },
        {
          role: "user",
          content: text
        }
      ]
    });

    const translated = response.choices[0].message.content.trim();
    res.json({ translated });

  } catch (err) {
    console.error("AI ERROR:", err.response?.data || err.message || err);
    res.status(500).json({ error: "Translation failed" });
  }
});

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
          content: `Translate the user's text into ${targetLang}. 
                    Return ONLY the translation, no extra words.`
        },
        { role: "user", content: text }
      ]
    });

    const translated = response.choices[0].message.content.trim();
    res.json({ translated });
  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ error: "Translation failed" });
  }
});

// test route
app.get("/", (req, res) => {
  res.send("Backend is running! 🔥");
});

// render port
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

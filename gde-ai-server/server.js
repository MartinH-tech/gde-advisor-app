const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/refine", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an educational district official. Rewrite reports in formal, professional English suitable for official government documentation. Keep meaning unchanged but improve tone, grammar and clarity.",
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    res.json({ refined: completion.choices[0].message.content });
  } catch (error) {
    console.error("Refinement error:", error);
    res.status(500).json({ error: "Refinement failed" });
  }
});

app.listen(3000, () => {
  console.log("AI server running on http://localhost:3000");
});
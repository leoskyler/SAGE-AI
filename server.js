import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = process.env.PORT || 5000;

// This allows your GitHub Pages site to talk to this server safely
app.use(cors());
app.use(express.json());

// This initializes Gemini using the secure key hidden in the server settings
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/chat', async (req, res) => {
    try {
        const { message, systemInstruction } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
            config: {
                systemInstruction: systemInstruction
            }
        });

        res.json({ reply: response.text });
    } catch (error) {
        console.error("Error calling Gemini:", error);
        res.status(500).json({ error: error.message || "Failed to contact Gemini" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes and allow standard headers
app.use(cors({
    origin: '*', // Allows your GitHub Pages site to connect
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Initialize Gemini using the environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/chat', async (req, res) => {
    try {
        const { message, systemInstruction } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Call Gemini using the official SDK format
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: message }] }],
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

// A simple health-check route to make sure the server is responsive
app.get('/', (req, res) => {
    res.send("SAGE Backend is running perfectly!");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is missing");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        // The SDK doesn't have a direct listModels but we can try to fetch a known model metadata if possible, 
        // but typically we just try standard names.
        // Actually, the error message itself suggests calling ListModels.
        // Let's use a raw fetch to see what's up if the SDK is being weird.
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        const names = data.models.map((m: { name: string }) => m.name.replace('models/', ''));
        console.log("Model Names:", names);
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();

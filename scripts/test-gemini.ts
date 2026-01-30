import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is missing via process.env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const modelName = "gemini-2.5-flash";

async function test() {
    console.log(`Testing model: ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, are you there?");
        const response = await result.response;
        console.log("✅ Success! Response:", response.text());
    } catch (error: any) {
        console.error("❌ Failed:", error.message);
        if (error.message.includes("404") || error.message.includes("not found")) {
            console.log("\n⚠️  The model name seems incorrect or you do not have access to it.");
            console.log("Try 'gemini-2.0-flash-exp' or 'gemini-1.5-flash'");
        }
    }
}

test();

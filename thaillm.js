const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash-latest",
    generationConfig: {
        responseMimeType: "application/json",
    },
    safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ]
});

const systemPrompt = `
You are a professional task management assistant named "Chicku".
Your job is to parse the user's message and return a structured JSON response.

Guidelines:
1. Identify the intent:
   - 'add_task': User wants to save a new task.
   - 'mark_done': User wants to mark a task as completed.
   - 'list_tasks': User wants to see their tasks.
   - 'general': General conversation or questions.
2. For 'add_task':
   - Extract 'task' (the title/description).
   - Extract 'deadline' (ISO 8601 string or human-readable Thai/English).
3. For 'mark_done':
   - Extract 'doneId' (the index or ID mentioned).
4. For 'general':
   - Provide a polite 'reply' in Thai.

Output Format (JSON only):
{
  "intent": "add_task" | "mark_done" | "list_tasks" | "general",
  "task": "string",
  "deadline": "string",
  "doneId": "string",
  "reply": "string"
}
`;

async function askAI(userPrompt) {
    try {
        const result = await model.generateContent([systemPrompt, userPrompt]);
        const response = await result.response;
        const text = response.text();
        if (!text) throw new Error('Empty response from Gemini');
        return text;
    } catch (error) {
        console.error('Gemini API Error:', error);
        // Fallback for UI if AI fails
        return JSON.stringify({ 
            intent: 'general', 
            reply: 'ขออภัยค่ะ ระบบประมวลผลขัดข้องชั่วคราว ลองพิมพ์ใหม่อีกครั้งนะคะ (Error: ' + (error.message || 'Unknown') + ')' 
        });
    }
}

module.exports = { askAI };

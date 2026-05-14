const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
    }
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
        return response.text();
    } catch (error) {
        console.error('Gemini API Error:', error);
        return JSON.stringify({ intent: 'general', reply: 'ขออภัยค่ะ Chicku เกิดข้อผิดพลาดในการเชื่อมต่อกับสมองกล ลองใหม่อีกครั้งนะคะ' });
    }
}

module.exports = { askAI };

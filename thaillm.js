const OpenAI = require("openai");
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
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

Output Format (STRICT JSON ONLY):
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
        const response = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" }
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Groq API Error:', error);
        return JSON.stringify({ 
            intent: 'general', 
            reply: 'ขออภัยค่ะ Chicku มีปัญหาในการประมวลผลชั่วคราว ลองใหม่อีกครั้งนะคะ' 
        });
    }
}

module.exports = { askAI };

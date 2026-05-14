const axios = require('axios');
require('dotenv').config();

async function askAI(prompt) {
    const apiKey = process.env.THAILLM_API_KEY;
    const endpoint = process.env.THAILLM_ENDPOINT;
    const model = process.env.THAILLM_MODEL;

    try {
        const response = await axios.post(endpoint, {
            model: model,
            messages: [
                { role: 'system', content: 'You are a task management assistant. Analyze the user intent. If they want to add a task, provide title and deadline (YYYY-MM-DD HH:mm). If they want to mark a task as done, provide the doneId. Return ONLY JSON format: {"intent": "add_task"|"mark_done"|"other", "task": {"title": "...", "deadline": "..."}, "doneId": "...", "reply": "..."}' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.3
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const content = response.data.choices?.[0]?.message?.content || response.data.result || "";
        return content;
    } catch (error) {
        console.error('Error in askAI:', error.response ? error.response.data : error.message);
        return "";
    }
}

module.exports = { askAI };

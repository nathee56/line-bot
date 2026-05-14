const { askAI } = require('./thaillm');
const { saveTask, markDone, getTasks } = require('./firebase');
const { replyMessage, sendFlexMessage } = require('./lineClient');
const { createTaskFlex, createTaskListFlex, createGeneralResponseFlex } = require('./flexTemplates');

async function handleMessage(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return;
    }

    const userId = event.source.userId;
    const userText = event.message.text;
    const replyToken = event.replyToken;

    try {
        // Get existing tasks to provide context to AI if needed, 
        // or just pass the message to AI to parse intent.
        const tasks = await getTasks(userId);
        const taskContext = tasks.map((t, i) => `${i + 1}. [${t.id}] ${t.title} (Deadline: ${t.deadline})`).join('\n');
        
        const now = new Date();
        const currentDateTimeStr = now.toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
        
        const prompt = `Today is: ${currentDateTimeStr}\nUser ID: ${userId}\nMessage: ${userText}\n\nCurrent Tasks:\n${taskContext || 'No active tasks.'}\n\nPlease parse this message.`;
        
        const aiResponse = await askAI(prompt);
        let result;
        try {
            // AI is expected to return JSON string. We might need to clean it if it includes markdown.
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            result = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        } catch (e) {
            console.error('Failed to parse AI response as JSON:', aiResponse);
        }

        if (!result) {
            return await sendFlexMessage(replyToken, "บอทไม่เข้าใจ", createGeneralResponseFlex("ขออภัยค่ะ ฉันไม่เข้าใจคำสั่งของคุณ ลองพิมพ์ใหม่อีกครั้งนะคะ"));
        }

        const { intent, task, doneId, reply } = result;

        if (intent === 'add_task' && task) {
            await saveTask(userId, task);
            return await sendFlexMessage(replyToken, "บันทึกงานใหม่สำเร็จ", createTaskFlex(task.title, task.deadline));
        } else if (intent === 'mark_done' && doneId) {
            await markDone(doneId);
            return await replyMessage(replyToken, reply || "ทำเครื่องหมายว่าเสร็จสิ้นแล้วค่ะ ✅");
        } else if (intent === 'list_tasks' || userText.includes('รายการ') || userText.includes('งานทั้งหมด')) {
            const currentTasks = await getTasks(userId);
            return await sendFlexMessage(replyToken, "รายการงานของคุณ", createTaskListFlex(currentTasks));
        }

        await sendFlexMessage(replyToken, "ตอบกลับ", createGeneralResponseFlex(reply || "ดำเนินการเรียบร้อยแล้วค่ะ"));

    } catch (error) {
        console.error('Error in handleMessage:', error);
        await sendFlexMessage(replyToken, "เกิดข้อผิดพลาด", createGeneralResponseFlex("เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้งนะคะ 🙏"));
    }
}

module.exports = { handleMessage };

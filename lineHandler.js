const { askAI } = require('./thaillm');
const { saveTask, markDone, getTasks, getSchedule, saveUserSettings } = require('./firebase');
const { replyMessage, sendFlexMessage } = require('./lineClient');
const { 
    taskAddedCard, 
    taskListCard, 
    completedCard, 
    scheduleCard, 
    errorCard,
    notificationSettingsCard,
    howToUseCard
} = require('./flexTemplates');

async function handleMessage(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return;
    }

    const userId = event.source.userId;
    const userText = event.message.text;
    const replyToken = event.replyToken;

    try {
        console.log(`[Message Received] User: ${userId}, Text: ${userText}`);
        
        // 1. Explicit commands bypassing AI (Rich Menu Keywords)
        if (userText === 'เพิ่มงานใหม่') {
            return await replyMessage(replyToken, "🐥 ต้องการให้ Chicku ช่วยจำเรื่องอะไรคะ? พิมพ์รายละเอียดงานและวันเวลามาได้เลย! \n\nตัวอย่าง: 'ซักผ้า พรุ่งนี้ 8 โมงเช้า'");
        }

        if (userText === 'ตั้งค่าการแจ้งเตือน') {
            return await sendFlexMessage(replyToken, "ตั้งค่าการแจ้งเตือน", notificationSettingsCard());
        }

        if (userText.startsWith('เซ็ตแจ้งเตือน: ')) {
            const pref = userText.replace('เซ็ตแจ้งเตือน: ', '');
            await saveUserSettings(userId, { reminderPref: pref });
            const labels = { 'all': 'เตือนทุกระยะ', '1day': 'เตือนล่วงหน้า 1 วัน', 'urgent': 'เตือนเฉพาะงานด่วน', 'off': 'ปิดการแจ้งเตือน' };
            return await replyMessage(replyToken, `🐥 ตั้งค่าเป็น "${labels[pref] || pref}" เรียบร้อยแล้วจ้า!`);
        }

        if (userText === 'ดูตารางงานทั้งหมด' || userText === 'รายการ') {
            const currentTasks = await getTasks(userId);
            return await sendFlexMessage(replyToken, "รายการงานของคุณ", taskListCard(currentTasks));
        }

        if (userText === 'วิธีใช้เว็บไซต์') {
            return await sendFlexMessage(replyToken, "วิธีใช้งาน Chicku", howToUseCard());
        }

        if (userText === 'ตารางเรียน') {
            const schedules = await getSchedule(userId);
            const now = new Date();
            const currentDay = now.getDay() === 0 ? 7 : now.getDay();
            const todaySchedules = schedules.filter(s => s.day === currentDay);
            return await sendFlexMessage(replyToken, "ตารางเรียนวันนี้", scheduleCard(todaySchedules));
        }

        if (userText.startsWith('เสร็จงาน ')) {
            const taskTitle = userText.replace('เสร็จงาน ', '');
            const tasks = await getTasks(userId);
            const task = tasks.find(t => t.title === taskTitle);
            if (task) {
                await markDone(task.id);
                return await sendFlexMessage(replyToken, "เก่งมาก!", completedCard(task.title));
            } else {
                return await sendFlexMessage(replyToken, "อุ๊ปส์!", errorCard("ไม่พบงานที่คุณระบุนะ 🐥"));
            }
        }

        // 2. Pass to AI for intent parsing
        const tasks = await getTasks(userId);
        const taskContext = tasks.map((t, i) => `${i + 1}. [${t.id}] ${t.title} (Deadline: ${t.deadline})`).join('\n');
        
        const now = new Date();
        const currentDateTimeStr = now.toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
        
        const prompt = `Today is: ${currentDateTimeStr}\nUser ID: ${userId}\nMessage: ${userText}\n\nCurrent Tasks:\n${taskContext || 'No active tasks.'}\n\nPlease parse this message.`;
        
        console.log('[AI Request] Sending prompt to AI...');
        const aiResponse = await askAI(prompt);
        console.log('[AI Response]', aiResponse);

        let result;
        try {
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            result = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        } catch (e) {
            console.error('Failed to parse AI response as JSON:', aiResponse);
        }

        // 3. Fallback if AI doesn't return JSON
        if (!result || !result.intent) {
            // AI returned plain text, just reply directly with 🐥
            return await replyMessage(replyToken, `🐥 ${aiResponse}`);
        }

        const { intent, task, deadline, priority, doneId, reply } = result;

        console.log(`[Intent Parsed] Intent: ${intent}`);

        // 4. Handle Intents
        if (intent === 'add_task' && (task || result.title)) {
            const taskData = {
                title: task || result.title || "(ไม่มีหัวข้อ)",
                deadline: deadline || result.deadline || "ไม่ระบุ",
                priority: priority || result.priority || "ปกติ"
            };
            await saveTask(userId, taskData);
            return await sendFlexMessage(replyToken, "บันทึกงานใหม่สำเร็จ", taskAddedCard(taskData));
        } 
        else if (intent === 'list_tasks') {
            const currentTasks = await getTasks(userId);
            return await sendFlexMessage(replyToken, "รายการงานของคุณ", taskListCard(currentTasks));
        }
        else if (intent === 'mark_done' && doneId) {
            await markDone(doneId);
            const doneTask = tasks.find(t => t.id === doneId);
            return await sendFlexMessage(replyToken, "เก่งมาก!", completedCard(doneTask ? doneTask.title : "งานของคุณ"));
        }
        else if (intent === 'today_schedule') {
            const schedules = await getSchedule(userId);
            const currentDay = now.getDay() === 0 ? 7 : now.getDay();
            const todaySchedules = schedules.filter(s => s.day === currentDay);
            return await sendFlexMessage(replyToken, "ตารางเรียนวันนี้", scheduleCard(todaySchedules));
        }
        else {
            // 'other' intent
            return await replyMessage(replyToken, `🐥 ${reply || "ว่าไงนะ? Chicku ฟังอยู่จ้า"}`);
        }

    } catch (error) {
        console.error('Error in handleMessage:', error);
        await sendFlexMessage(replyToken, "เกิดข้อผิดพลาด", errorCard("ระบบมีปัญหาขัดข้องนิดหน่อย ลองใหม่อีกครั้งนะ 🐥"));
    }
}

module.exports = { handleMessage };

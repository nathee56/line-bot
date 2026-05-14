const cron = require('node-cron');
const { getUpcomingTasks, updateTask, getUserSettings } = require('./firebase');
const { pushFlexMessage } = require('./lineClient');
const { reminderCard, scheduleCard } = require('./flexTemplates');
const admin = require('firebase-admin');

function parseTime(timeStr) {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    return d;
}

function startScheduler() {
    // Run every 15 minutes
    cron.schedule('*/15 * * * *', async () => {
        console.log('Running task & schedule scheduler...');
        try {
            const now = new Date();
            let currentDay = now.getDay(); // 0=Sun, 1=Mon... 6=Sat
            if (currentDay === 0) currentDay = 7; // Convert Sun to 7

            // Cache user settings to avoid redundant DB calls
            const userSettingsCache = {};

            // 1. Task Reminders
            const tasks = await getUpcomingTasks();

            for (const task of tasks) {
                if (!task.deadline || task.deadline === "ไม่ระบุ") continue;
                
                const deadlineDate = new Date(task.deadline);
                if (isNaN(deadlineDate.getTime())) continue;

                // Get user settings
                if (!userSettingsCache[task.userId]) {
                    userSettingsCache[task.userId] = await getUserSettings(task.userId);
                }
                const settings = userSettingsCache[task.userId];
                const pref = settings.reminderPref || 'all';

                if (pref === 'off') continue;

                const diffMs = deadlineDate - now;
                const diffHrs = diffMs / (1000 * 60 * 60);

                if (diffHrs > 0) {
                    // Check logic based on preference
                    const canNotify1day = (pref === 'all' || pref === '1day');
                    const canNotifyUrgent = (pref === 'all' || pref === 'urgent');

                    if (diffHrs <= 24 && diffHrs > 3 && !task.notified1day && canNotify1day) {
                        await pushFlexMessage(task.userId, `⏰ อย่าลืมนะ! งาน: ${task.title}`, reminderCard(task, "24 ชั่วโมง", "warning"));
                        await updateTask(task.id, { notified1day: true });
                    } 
                    else if (diffHrs <= 3 && diffHrs > 1 && !task.notified3hr && pref === 'all') {
                        await pushFlexMessage(task.userId, `⏰ ใกล้ถึงกำหนดแล้ว! งาน: ${task.title}`, reminderCard(task, "3 ชั่วโมง", "warning"));
                        await updateTask(task.id, { notified3hr: true });
                    } 
                    else if (diffHrs <= 1 && diffHrs > 0.5 && !task.notified1hr && canNotifyUrgent) {
                        await pushFlexMessage(task.userId, `🚨 ด่วน! งาน: ${task.title}`, reminderCard(task, "1 ชั่วโมง", "urgent"));
                        await updateTask(task.id, { notified1hr: true });
                    } 
                    else if (diffHrs <= 0.5 && !task.notified30min && canNotifyUrgent) {
                        await pushFlexMessage(task.userId, `🚨 ด่วนมาก! งาน: ${task.title}`, reminderCard(task, "30 นาที", "urgent"));
                        await updateTask(task.id, { notified30min: true });
                    }
                }
            }

            // 2. Schedule Reminders
            const db = admin.apps.length ? admin.firestore() : null;
            if (db) {
                const todaySchedulesSnapshot = await db.collection('schedules').where('day', '==', currentDay).get();
                const todaySchedules = todaySchedulesSnapshot.docs.map(d => ({id: d.id, ...d.data()}));
                
                const todayStr = now.toDateString();

                for (const sch of todaySchedules) {
                    // Check settings for schedule (uses same preference or simple on/off)
                    if (!userSettingsCache[sch.userId]) {
                        userSettingsCache[sch.userId] = await getUserSettings(sch.userId);
                    }
                    if (userSettingsCache[sch.userId].reminderPref === 'off') continue;

                    const classTime = parseTime(sch.startTime);
                    if (classTime) {
                        const diffMs = classTime - now;
                        const diffMins = diffMs / (1000 * 60);
                        
                        if (diffMins > 0 && diffMins <= 30 && sch.lastNotifiedDate !== todayStr) {
                            const userSchedules = todaySchedules.filter(s => s.userId === sch.userId);
                            await pushFlexMessage(sch.userId, `📅 ตารางเรียนกำลังจะเริ่ม: ${sch.subject}`, scheduleCard(userSchedules));
                            await db.collection('schedules').doc(sch.id).update({ lastNotifiedDate: todayStr });
                        }
                    }
                }
            }

        } catch (error) {
            console.error('Error in scheduler:', error);
        }
    });
    console.log('Scheduler started.');
}

module.exports = { startScheduler };

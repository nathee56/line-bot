const cron = require('node-cron');
const { getUpcomingTasks, updateTask } = require('./firebase');
const { pushMessage } = require('./lineClient');

function startScheduler() {
    // Run every 30 minutes
    cron.schedule('*/30 * * * *', async () => {
        console.log('Running task scheduler...');
        try {
            const tasks = await getUpcomingTasks();
            const now = new Date();

            for (const task of tasks) {
                const deadline = new Date(task.deadline);
                const diffMs = deadline - now;
                const diffHrs = diffMs / (1000 * 60 * 60);

                // Check 24 hours notification
                if (diffHrs <= 24 && diffHrs > 1 && !task.notified1day) {
                    await pushMessage(task.userId, `🔔 แจ้งเตือน: งาน "${task.title}" กำลังจะครบกำหนดในอีก 24 ชั่วโมง (Deadline: ${task.deadline})`);
                    await updateTask(task.id, { notified1day: true });
                }

                // Check 1 hour notification
                if (diffHrs <= 1 && diffHrs > 0 && !task.notified1hr) {
                    await pushMessage(task.userId, `⚠️ ด่วน! แจ้งเตือน: งาน "${task.title}" กำลังจะครบกำหนดในอีก 1 ชั่วโมง (Deadline: ${task.deadline})`);
                    await updateTask(task.id, { notified1hr: true });
                }
            }
        } catch (error) {
            console.error('Error in scheduler:', error);
        }
    });
    console.log('Scheduler started.');
}

module.exports = { startScheduler };

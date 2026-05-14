const cron = require('node-cron');
const { getUpcomingTasks, updateTask } = require('./firebase');
const { pushFlexMessage } = require('./lineClient');
const { createNotificationFlex } = require('./flexTemplates');

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
                    await pushFlexMessage(task.userId, `แจ้งเตือน: ${task.title}`, createNotificationFlex(task.title, task.deadline, "24 ชั่วโมง"));
                    await updateTask(task.id, { notified1day: true });
                }

                // Check 1 hour notification
                if (diffHrs <= 1 && diffHrs > 0 && !task.notified1hr) {
                    await pushFlexMessage(task.userId, `ด่วน! แจ้งเตือน: ${task.title}`, createNotificationFlex(task.title, task.deadline, "1 ชั่วโมง"));
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

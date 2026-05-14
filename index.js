const express = require('express');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config();

const { handleMessage } = require('./lineHandler');
const { startScheduler } = require('./scheduler');
const { getTasks, saveTask, markDone, deleteTask, getSchedule, saveSchedule, deleteSchedule } = require('./firebase');
const { pushFlexMessage, pushMessage } = require('./lineClient');
const { taskAddedCard, scheduleCard } = require('./flexTemplates');

const app = express();
const PORT = process.env.PORT || 3000;
const CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to capture rawBody for signature verification (only for webhook)
app.use('/webhook', express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));

// Standard JSON body parser for other API routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// LINE Webhook
app.post('/webhook', (req, res) => {
    const signature = req.headers['x-line-signature'];
    
    if (!signature) {
        return res.status(401).send('No signature');
    }

    const hash = crypto
        .createHmac('SHA256', CHANNEL_SECRET)
        .update(req.rawBody)
        .digest('base64');

    if (hash !== signature) {
        return res.status(401).send('Invalid signature');
    }

    const events = req.body.events;
    if (events && events.length > 0) {
        events.forEach(event => {
            handleMessage(event).catch(err => console.error('HandleMessage error:', err));
        });
    }

    res.status(200).send('OK');
});

// API Routes for Tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) return res.status(400).json({ error: 'userId is required' });
        const tasks = await getTasks(userId);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/tasks', async (req, res) => {
    try {
        const { userId, title, deadline, priority } = req.body;
        if (!userId || !title) return res.status(400).json({ error: 'userId and title are required' });
        
        await saveTask(userId, { title, deadline, priority });
        
        // ส่งการแจ้งเตือนไปยัง LINE
        await pushFlexMessage(userId, "🐥 บันทึกงานใหม่จาก Dashboard แล้วจ้า!", taskAddedCard({ title, deadline, priority }));
        
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/tasks/:id/done', async (req, res) => {
    try {
        const { id } = req.params;
        await markDone(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await deleteTask(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API Routes for Schedule
app.get('/api/schedule', async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) return res.status(400).json({ error: 'userId is required' });
        const schedule = await getSchedule(userId);
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/schedule', async (req, res) => {
    try {
        const { userId, day, startTime, endTime, subject, room } = req.body;
        if (!userId || !day || !startTime || !subject) return res.status(400).json({ error: 'Missing required fields' });
        
        await saveSchedule(userId, { day, startTime, endTime, subject, room });
        
        // ส่งการแจ้งเตือนไปยัง LINE (แบบข้อความธรรมดาก็ได้)
        const daysMap = { 1: "จันทร์", 2: "อังคาร", 3: "พุธ", 4: "พฤหัสบดี", 5: "ศุกร์", 6: "เสาร์", 7: "อาทิตย์" };
        await pushMessage(userId, `📅 บันทึกวิชาเรียนใหม่: ${subject}\nวัน${daysMap[day]} เวลา ${startTime} - ${endTime} เรียบร้อยแล้วจ้า! 🐥`);
        
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/schedule/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await deleteSchedule(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    startScheduler();
});

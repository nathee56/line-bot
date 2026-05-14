const admin = require('firebase-admin');
require('dotenv').config();

let serviceAccount;
const saJson = process.env.FIREBASE_SERVICE_ACCOUNT;

if (saJson) {
    try {
        serviceAccount = JSON.parse(saJson);
        if (serviceAccount.private_key) {
            serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }
    } catch (e) {
        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT JSON');
    }
}

// If JSON parse failed or not provided, try individual variables or base64
if (!serviceAccount) {
    if (process.env.FB_PRIVATE_KEY_BASE64) {
        const decodedKey = Buffer.from(process.env.FB_PRIVATE_KEY_BASE64, 'base64').toString('utf8');
        serviceAccount = {
            projectId: process.env.FB_PROJECT_ID,
            clientEmail: process.env.FB_CLIENT_EMAIL,
            privateKey: decodedKey
        };
    } else if (process.env.FB_PRIVATE_KEY) {
        let pk = process.env.FB_PRIVATE_KEY;
        pk = pk.replace(/^["']|["']$/g, '');
        pk = pk.replace(/\\n/g, '\n');
        serviceAccount = {
            projectId: process.env.FB_PROJECT_ID,
            clientEmail: process.env.FB_CLIENT_EMAIL,
            privateKey: pk
        };
    }
}

if (serviceAccount && !admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} else if (!serviceAccount) {
    console.error('ERROR: FIREBASE_SERVICE_ACCOUNT is missing or invalid!');
}

const db = admin.apps.length ? admin.firestore() : null;
if (db) {
    db.settings({ ignoreUndefinedProperties: true });
}

// Tasks Functions
async function saveTask(userId, taskData) {
    if (!db) throw new Error('Firestore not initialized');
    const newTask = {
        userId,
        title: taskData.title,
        deadline: taskData.deadline || "ไม่ระบุ",
        priority: taskData.priority || "ปกติ",
        isDone: false,
        notified1day: false,
        notified3hr: false,
        notified1hr: false,
        notified30min: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    return await db.collection('tasks').add(newTask);
}

async function getTasks(userId) {
    if (!db) return [];
    const snapshot = await db.collection('tasks')
        .where('userId', '==', userId)
        .where('isDone', '==', false)
        .orderBy('createdAt', 'desc')
        .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function getUpcomingTasks() {
    if (!db) return [];
    const now = new Date();
    const future25h = new Date(now.getTime() + 25 * 60 * 60 * 1000);
    
    // Simplistic query, you might want to fetch all not done tasks and filter in memory 
    // if the deadline string format varies too much, or use true Timestamps in Firestore.
    const snapshot = await db.collection('tasks')
        .where('isDone', '==', false)
        .get();
        
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function updateTask(taskId, fields) {
    if (!db) return;
    return await db.collection('tasks').doc(taskId).update(fields);
}

async function markDone(taskId) {
    if (!db) return;
    return await db.collection('tasks').doc(taskId).update({ isDone: true });
}

async function deleteTask(taskId) {
    if (!db) return;
    return await db.collection('tasks').doc(taskId).delete();
}

// Schedule Functions
async function getSchedule(userId) {
    if (!db) return [];
    const snapshot = await db.collection('schedules')
        .where('userId', '==', userId)
        .orderBy('day', 'asc')
        .orderBy('startTime', 'asc')
        .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function saveSchedule(userId, data) {
    if (!db) throw new Error('Firestore not initialized');
    const newSchedule = {
        userId,
        day: parseInt(data.day, 10), // 1-7 (1=Monday... 7=Sunday)
        startTime: data.startTime,
        endTime: data.endTime,
        subject: data.subject,
        room: data.room || "",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    return await db.collection('schedules').add(newSchedule);
}

async function deleteSchedule(scheduleId) {
    if (!db) return;
    return await db.collection('schedules').doc(scheduleId).delete();
}

// User Settings Functions
async function getUserSettings(userId) {
    if (!db) return { reminderPref: 'all' }; // Default is all
    const doc = await db.collection('users').doc(userId).get();
    if (doc.exists) {
        return doc.data();
    }
    return { reminderPref: 'all' };
}

async function saveUserSettings(userId, settings) {
    if (!db) return;
    return await db.collection('users').doc(userId).set(settings, { merge: true });
}

module.exports = { 
    saveTask, getTasks, getUpcomingTasks, updateTask, markDone, deleteTask,
    getSchedule, saveSchedule, deleteSchedule,
    getUserSettings, saveUserSettings
};

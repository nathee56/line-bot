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

async function saveTask(userId, task) {
    if (!db) throw new Error('Firestore not initialized');
    const newTask = {
        userId,
        title: task.title,
        deadline: task.deadline, // Expecting string or Timestamp
        isDone: false,
        notified1day: false,
        notified1hr: false,
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
    
    const snapshot = await db.collection('tasks')
        .where('isDone', '==', false)
        .where('deadline', '>=', now.toISOString()) // Assuming ISO string for simplicity or adjust to Timestamp
        .where('deadline', '<=', future25h.toISOString())
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

module.exports = { saveTask, getTasks, getUpcomingTasks, updateTask, markDone };

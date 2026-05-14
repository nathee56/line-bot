const admin = require('firebase-admin');
require('dotenv').config();

let serviceAccount;
try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    if (serviceAccount && serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
} catch (e) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT. Ensure it is a valid JSON string.');
}

if (serviceAccount && !admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function saveTask(userId, task) {
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
    const snapshot = await db.collection('tasks')
        .where('userId', '==', userId)
        .where('isDone', '==', false)
        .orderBy('createdAt', 'desc')
        .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function getUpcomingTasks() {
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
    return await db.collection('tasks').doc(taskId).update(fields);
}

async function markDone(taskId) {
    return await db.collection('tasks').doc(taskId).update({ isDone: true });
}

module.exports = { saveTask, getTasks, getUpcomingTasks, updateTask, markDone };

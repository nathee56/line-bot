const express = require('express');
const crypto = require('crypto');
require('dotenv').config();

const { handleMessage } = require('./lineHandler');
const { startScheduler } = require('./scheduler');

const app = express();
const PORT = process.env.PORT || 3000;
const CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;

// Middleware to capture rawBody for signature verification
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));

app.get('/', (req, res) => {
    res.send('Bot is running');
});

app.post('/webhook', (req, res) => {
    const signature = req.headers['x-line-signature'];
    
    if (!signature) {
        return res.status(401).send('No signature');
    }

    // Verify signature
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    startScheduler();
});

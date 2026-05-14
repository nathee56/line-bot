const axios = require('axios');
require('dotenv').config();

const LINE_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

async function replyMessage(replyToken, text) {
    try {
        await axios.post('https://api.line.me/v2/bot/message/reply', {
            replyToken: replyToken,
            messages: [{ type: 'text', text: text }]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`
            }
        });
    } catch (error) {
        console.error('Error in replyMessage:', error.response ? error.response.data : error.message);
    }
}

async function pushMessage(userId, text) {
    try {
        await axios.post('https://api.line.me/v2/bot/message/push', {
            to: userId,
            messages: [{ type: 'text', text: text }]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`
            }
        });
    } catch (error) {
        console.error('Error in pushMessage:', error.response ? error.response.data : error.message);
    }
}

async function pushFlexMessage(userId, altText, flexContents) {
    try {
        await axios.post('https://api.line.me/v2/bot/message/push', {
            to: userId,
            messages: [
                {
                    type: 'flex',
                    altText: altText,
                    contents: flexContents
                }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`
            }
        });
    } catch (error) {
        console.error('Error in pushFlexMessage:', error.response ? error.response.data : error.message);
    }
}

async function sendFlexMessage(replyToken, altText, flexContents) {
    try {
        await axios.post('https://api.line.me/v2/bot/message/reply', {
            replyToken: replyToken,
            messages: [
                {
                    type: 'flex',
                    altText: altText,
                    contents: flexContents
                }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`
            }
        });
    } catch (error) {
        console.error('Error in sendFlexMessage:', error.response ? error.response.data : error.message);
    }
}

module.exports = { replyMessage, pushMessage, pushFlexMessage, sendFlexMessage };

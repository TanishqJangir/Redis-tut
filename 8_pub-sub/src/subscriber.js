import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const subscriber = new Redis(process.env.REDIS_URL);

subscriber.subscribe('notification', (err, count) => {
    if (err) {
        console.error('Failed to subscribe: %s', err.message);
        return;
    }
    console.log('Successfully subscribed to notification channel');

});

subscriber.on('message', (channel, message) => {
    console.log("Received on ", channel, ":", JSON.parse(message));
})
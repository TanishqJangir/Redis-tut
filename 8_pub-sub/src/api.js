import express from 'express';
import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
const publisher = new Redis(process.env.REDIS_URL);

app.post('/notification', async (req, res) => {
    const payload = {
        title: req.body.title,
        createdAt: new Date().toISOString()
    };

    const receivers = await publisher.publish('notification', JSON.stringify(payload));

    res.status(200).json({ message: 'Notification sent', receivers });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
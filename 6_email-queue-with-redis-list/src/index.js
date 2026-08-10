import express from 'express';
import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL);

const   QUEUE_KEY = 'queue:emails';

app.post('/emails', async (req, res) => {
    const job = {
        to: req.body.to,
        subject: req.body.subject || 'No subject',
        body: req.body.body || 'No body',
        createdAt: new Date().toISOString()
    }

    await redis.lpush(QUEUE_KEY, JSON.stringify(job));
    res.status(201).json({
        queued: true,
        job: job,
        message: 'Email job has been queued successfully.'
    })
});

app.get('/emails/process', async (req, res) => {
    const rawjob = await redis.rpop(QUEUE_KEY);
    if (!rawjob) {
        return res.status(404).json({ message: 'No email jobs available for processing.' });
    }
    const job = JSON.parse(rawjob);
    res.json({ processed: true, job: job });
});

app.listen(3000, () => console.log('Email queue service is running on port 3000')); 
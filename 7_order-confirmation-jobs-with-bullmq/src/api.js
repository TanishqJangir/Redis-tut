import express from "express";
import { emailQueue } from "./queue.js";

const app = express();
app.use(express.json());

app.post('/welcome-email', async (req, res) => {
    const job = await emailQueue.add(
        'send-welcome-email', 
        {
            to: req.body.to,
            subject: req.body.subject || 'Welcome!',
            body: req.body.body || 'Thank you for signing up!',
            createdAt: new Date().toISOString()
    }, {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000
        }
    })

    return res.status(201).json({
        queued: true,
        job: job,
        message: 'Welcome email job has been queued successfully.'
    })
})


app.listen(3000, () => console.log("Order confirmation service is running on port 3000"));
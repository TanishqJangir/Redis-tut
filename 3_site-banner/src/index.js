import express from 'express';
import dotenv from 'dotenv';    
dotenv.config();
import Redis from 'ioredis';

const app = express();
app.use(express.json());

const redis = new Redis({
    url: process.env.REDIS_URL,
})

const BANNER_KEY = 'app:banner';

app.post("/banner", async (req, res) => {
    await redis.set(BANNER_KEY, req.body.message || "Welcome to our site!");
    res.json({
        success: true,
        message: "Banner message set successfully"
    })
});

app.get("/banner", async (req, res) => {
    const message = await redis.get(BANNER_KEY);

    res.json({
        success: true,
        message: message
    })
});

app.delete("/banner", async (req, res) => {
    await redis.del(BANNER_KEY);
    res.json({
        success: true,
        message: "Banner message deleted successfully"
    })
});

app.get("/banner/exists", async (req, res) => {
    const exists = await redis.exists(BANNER_KEY);

    res.json({
        success: true,
        exists: Boolean(exists),
        content: exists
    })
});

app.listen(3000, () => console.log("Server is running on port 3000"));

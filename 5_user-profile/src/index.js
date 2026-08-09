import express from "express";
import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const redis = new Redis(process.env.REDIS_URL);
app.use(express.json());

app.post("/user/:id/json", async (req, res) => {
    await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body));
    res.json({ 
        savedAs: "json",
        message: "User data stored successfully" 
    });
});

app.get("/user/:id/json", async (req, res) => {
    const raw = await redis.get(`user:${req.params.id}:json`);
    res.json({
        user: raw ? JSON.parse(raw) : null
    })
})

app.post("/user/:id/hash", async (req, res) => {
    await redis.hset(`user:${req.params.id}:hash`, req.body);
    res.json({ 
        savedAs: "hash",
        message: "User data stored successfully" 
    });
});

app.get("/user/:id/hash", async (req, res) => {
    const user = await redis.hgetall(`user:${req.params.id}:hash`);
    res.json({
        user: user
    })
});

app.listen(3000, () => console.log("Server is running on port 3000"));
import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const redis = new Redis(process.env.REDIS_URL);

app.get("/redis", async (req, res) => {
    const reply = await redis.ping();
    res.json({
        redis: reply
    });
})

app.get("/mongo", async (req, res) => {
    const url = process.env.MONGO_URL;

    if (!url) {
        return res.status(500).json({
            error: "MONGO_URL is not defined in environment variables"
        });
    }

    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(url);
    }

    res.json({
        mongo: "connected",
        database: mongoose.connection.name
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})
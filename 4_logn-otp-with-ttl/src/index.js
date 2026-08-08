import express from "express";
import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL);

function otpKey(phone){
    return `otp:${phone}`;
}

app.post("/otp", async (req, res) => {
    const { phone } = req.body;
    if(!phone){
        return res.status(400).json({ error: "Phone number is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await redis.set(otpKey(phone), otp, "EX", 30); // Set OTP with a TTL of 30 seconds

    res.json({ message: "OTP generated and stored", otp });

});

app.post("/otp/verify", async (req, res) => {

    const { phone, otp } = req.body;
    if(!phone || !otp){
        return res.status(400).json({ error: "Phone number and OTP are required" });
    }

    const savedOtp = await redis.get(otpKey(phone));

    if(!savedOtp){
        return res.status(400).json({ error: "OTP has expired or does not exist" });
    }

    if(savedOtp !== otp){
        return res.status(400).json({ error: "Invalid OTP" });
    }

    await redis.del(otpKey(phone)); // Remove the OTP after successful verification

    res.json({ message: "OTP verified successfully" });
});


app.get("/otp/:phone/ttl", async (req, res) => {
    const { phone } = req.params;
    const ttl = await redis.ttl(otpKey(phone));

    return res.json({
        phone, 
        ttl
    })
});

app.listen(3000, () => console.log("Server is running on port 3000"));
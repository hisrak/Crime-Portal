import express from 'express'
import Subscriber from '../models/Subscriber.js'
const router = express.Router()

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Route: Subscribe (POST /api/newsletter/subscribe) - login zaroori nahi
router.post('/subscribe', async (req, res) => {
    const { email } = req.body;
    try {
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ err: "Enter a valid email" });
        }
        const exists = await Subscriber.findOne({ email: email.toLowerCase().trim() });
        if (exists) {
            return res.status(409).json({ err: "This email is already subscribed" });
        }
        await new Subscriber({ email }).save();
        res.status(200).json({ message: "Subscribed! You will get updates of latest crimes." });
    } catch (error) {
        console.log("Error Here ", error);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

export default router;
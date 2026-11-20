import express from 'express'
import JWT from 'jsonwebtoken'
import Contact from '../models/Contact.js'
import AdminOnly from '../middleware/adminOnly.js'
import MiddleWare from '../middleware/authMiddleWare.js'
import { JWT_SECRET } from '../config.js'
const router = express.Router()

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Token ho to user ki id nikal lo, na ho to null (login zaroori nahi)
const getUserIdFromToken = (req) => {
    const token = req.header('auth-token');
    if (!token) return null;
    try {
        return JWT.verify(token, JWT_SECRET).user.id;
    } catch (error) {
        return null;
    }
}

// Route 1: Add Contact (POST /api/contact/add_contact)
router.post('/add_contact', async (req, res) => {
    const { fname, lname, email, message } = req.body;

    // Backend validation
    if (!fname || !lname || !email || !message) {
        return res.status(400).json({ err: "All fields are required" });
    }
    if (fname.trim().length < 3 || lname.trim().length < 3) {
        return res.status(400).json({ err: "Name must be at least 3 characters" });
    }
    if (!emailRegex.test(email)) {
        return res.status(400).json({ err: "Invalid email address" });
    }
    if (message.trim().length < 10) {
        return res.status(400).json({ err: "Message must be at least 10 characters" });
    }

    try {
        const contact = new Contact({ fname, lname, email, message, user: getUserIdFromToken(req) });
        await contact.save();
        res.status(200).json({ success: true, contact });
    } catch (error) {
        console.log("Error Here ", error);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

// Route 2: Meri bheji hui messages (Login Required)
router.get('/my_messages', MiddleWare, async (req, res) => {
    try {
        const messages = await Contact.find({ user: req.userId }).sort({ date: -1 });
        res.status(200).json({ messages });
    } catch (error) {
        console.log("Error Here ", error);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

// Route 3: Sab messages (Admin Only)
router.get('/all', MiddleWare, AdminOnly, async (req, res) => {
    try {
        const messages = await Contact.find().sort({ date: -1 }).populate('user', 'username image');
        res.status(200).json({ messages });
    } catch (error) {
        console.log("Error Here ", error);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

// Route 4: Read / Unread badalna (Admin Only)
router.put('/mark_read/:id', MiddleWare, AdminOnly, async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ err: "Message Not Found" });
        }
        contact.read = !contact.read;
        await contact.save();
        res.status(200).json({ read: contact.read });
    } catch (error) {
        console.log("Error Here ", error);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

// Route 5: Message delete karna (Admin Only)
router.delete('/delete/:id', MiddleWare, AdminOnly, async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ err: "Message Not Found" });
        }
        res.status(200).json({ message: "Message deleted", id: req.params.id });
    } catch (error) {
        console.log("Error Here ", error);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

export default router;
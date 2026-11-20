import express from 'express'
import Notification from '../models/Notification.js'
import MiddleWare from '../middleware/authMiddleWare.js'
const router = express.Router()

// Route 1: Meri notifications + unread ginti (Login Required)
router.get('/', MiddleWare, async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 50, 100);
        const [notifications, unread] = await Promise.all([
            Notification.find({ user: req.userId }).sort({ date: -1 }).limit(limit),
            Notification.countDocuments({ user: req.userId, read: false }),
        ]);
        res.status(200).json({ notifications, unread });
    } catch (error) {
        console.log("Error Here ", error);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

// Route 2: Sirf unread ginti (bell icon ke liye, halka request)
router.get('/unread_count', MiddleWare, async (req, res) => {
    try {
        const count = await Notification.countDocuments({ user: req.userId, read: false });
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ err: "Internal Server Error" });
    }
})

// Route 3: Sab ko read mark karo
router.put('/read_all', MiddleWare, async (req, res) => {
    try {
        await Notification.updateMany({ user: req.userId, read: false }, { read: true });
        res.status(200).json({ message: "All marked as read" });
    } catch (error) {
        res.status(500).json({ err: "Internal Server Error" });
    }
})

// Route 4: Ek ko read mark karo
router.put('/read/:id', MiddleWare, async (req, res) => {
    try {
        await Notification.findOneAndUpdate({ _id: req.params.id, user: req.userId }, { read: true });
        res.status(200).json({ message: "Marked as read" });
    } catch (error) {
        res.status(500).json({ err: "Internal Server Error" });
    }
})

// Route 5: Ek notification delete karo (sirf apni)
router.delete('/:id', MiddleWare, async (req, res) => {
    try {
        await Notification.deleteOne({ _id: req.params.id, user: req.userId });
        res.status(200).json({ message: "Deleted", id: req.params.id });
    } catch (error) {
        res.status(500).json({ err: "Internal Server Error" });
    }
})

export default router;
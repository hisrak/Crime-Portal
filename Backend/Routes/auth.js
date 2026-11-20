import express from 'express'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import JWT from 'jsonwebtoken'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import MiddleWare from '../middleware/authMiddleWare.js'
import { JWT_SECRET } from '../config.js'
const router = express.Router()

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Multer Code Here (profile image)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const profileDir = path.join(__dirname, '..', '..', 'Frontend', 'src', 'ProfileImage')
fs.mkdirSync(profileDir, { recursive: true })

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, profileDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_'));
    }
})
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only image files are allowed'));
    }
});

// Route 1 Register API
router.post('/register', upload.single('image'), async (req, res) => {
    const { username, email, password } = req.body;
    const image = req.file ? req.file.filename : null;

    // Galat request aaye to upload hui file hata do
    const removeUpload = () => {
        if (req.file) fs.unlink(req.file.path, () => { });
    }

    if (!username || !username.trim() || !email || !password) {
        removeUpload();
        return res.status(400).json({ err: "All fields are required" });
    }
    if (!emailRegex.test(email)) {
        removeUpload();
        return res.status(400).json({ err: "Enter a valid email" });
    }
    if (password.length < 6) {
        removeUpload();
        return res.status(400).json({ err: "Password must be at least 6 characters" });
    }
    if (!image) {
        return res.status(400).json({ err: "Profile image is required" });
    }

    try {
        let user = await User.findOne({ email: email.trim() });
        if (user) {
            removeUpload();
            return res.status(409).json({ err: "User already exists" });
        }

        user = new User({
            username: username.trim(),
            email: email.trim(),
            password,
            image
        })
        await user.save();

        // Password hash wapas nahi bhejte
        res.status(200).json({
            message: "Registered Successfully",
            user: { _id: user._id, username: user.username, email: user.email, image: user.image }
        });
    } catch (error) {
        removeUpload();
        console.log("Error Here ", error);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

// Route 2 Login API
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ err: "All fields are required" });
    }
    try {
        let user = await User.findOne({ email: email.trim() });
        // Email ya password galat ho, dono ka ek hi message (security ke liye)
        if (!user) {
            return res.status(400).json({ err: "Invalid Credientials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ err: "Invalid Credientials" });
        }
        const Load = {
            user: {
                id: user.id
            }
        }

        // JWT Token
        JWT.sign(Load, JWT_SECRET, { expiresIn: '2d' }, (err, token) => {
            if (err) {
                console.log("Error Here ", err);
                return res.status(500).json({ err: "Internal Server Error" });
            }
            res.status(200).json({ token });
        })

    } catch (error) {
        console.log("Error Here ", error);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

// Route 3 getallUsers API (ab login zaroori hai aur password nahi jata)
router.get('/getallusers', MiddleWare, async (req, res) => {
    try {
        let users = await User.find().select('-password');
        res.status(200).json({ users });

    } catch (error) {
        console.log("Error Here ", error);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

// Route 5 Update Profile API (naam aur photo badalna)
router.put('/update_profile', MiddleWare, upload.single('image'), async (req, res) => {
    const { username } = req.body;
    const removeUpload = () => {
        if (req.file) fs.unlink(req.file.path, () => { });
    }
    try {
        if (!username || !username.trim()) {
            removeUpload();
            return res.status(400).json({ err: "Name is required" });
        }
        const user = await User.findById(req.userId);
        if (!user) {
            removeUpload();
            return res.status(404).json({ err: "User Not Found" });
        }
        user.username = username.trim();
        if (req.file) {
            // Purani photo hata do
            if (user.image) fs.unlink(path.join(profileDir, user.image), () => { });
            user.image = req.file.filename;
        }
        await user.save();
        res.status(200).json({
            user: { _id: user._id, username: user.username, email: user.email, image: user.image, date: user.date }
        });
    } catch (error) {
        removeUpload();
        console.log("Error Here ", error);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

// Route 6 getUser Detail API
router.get('/getuser', MiddleWare, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('-password');
        res.status(200).json({ user });

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
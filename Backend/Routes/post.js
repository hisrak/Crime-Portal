import express from 'express'
import User from '../models/User.js'
import MiddleWare from '../middleware/authMiddleWare.js'
import AdminOnly from '../middleware/adminOnly.js'
import { notify, nameOf, short } from '../utils/notify.js'
import { AREA_NAMES } from '../utils/areas.js'
import Post from '../models/Post.js'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const router = express.Router()

// ---------- Multer (post image upload) ----------
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadDir = path.join(__dirname, '..', 'uploads')
fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_'));
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

// Post ke saath user aur comments ke users ki detail bhi bhejte hain
const withDetails = (query) =>
    query
        .populate('user', 'username email image')
        .populate('comments.user', 'username image');

// ---------- Anonymous posts ----------
// Dekhne wale ki pehchan (id aur admin hai ya nahi)
const getViewer = async (req) => {
    const me = await User.findById(req.userId).select('isAdmin');
    return { id: req.userId, isAdmin: !!(me && me.isAdmin) };
};

// Anonymous post ka user sirf uske malik aur admin ko dikhta hai, baqi sab ko "Anonymous"
const maskAnonymous = (posts, viewer) =>
    posts.map((p) => {
        const obj = p.toObject();
        const isOwner = obj.user && obj.user._id && obj.user._id.toString() === viewer.id;
        if (obj.anonymous && !isOwner && !viewer.isAdmin) {
            obj.user = { username: 'Anonymous', image: '' };
        }
        return obj;
    });

// Route 1: Add Post (Login Required)
router.post('/add_post', MiddleWare, upload.single('image'), async (req, res) => {
    const { title, description, region, category } = req.body;
    try {
        if (!title || !description || !region || !category) {
            return res.status(400).json({ err: "All fields are required" });
        }

        let userId = req.userId;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(400).json({ err: "Invalid User Id" });
        }

        let post = new Post({
            user: userId,
            title,
            description,
            region,
            category,
            image: req.file ? req.file.filename : '',
            anonymous: req.body.anonymous === 'true',
            area: AREA_NAMES.includes(req.body.area) ? req.body.area : ''
        })
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        console.log("Error Here ", error);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

// Route 2: Get all Posts (Login Required) - sab se naya pehle
router.get('/get_all_post', MiddleWare, async (req, res) => {
    try {
        const viewer = await getViewer(req);
        const posts = await withDetails(Post.find().sort({ date: -1 }));
        const PostUser = maskAnonymous(posts, viewer);
        res.status(200).json({ PostUser });
    } catch (error) {
        console.log("Error Here ", error);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

// Route 3: Add Like (Login Required)
router.put('/Add_Like/:id', MiddleWare, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ err: "Post Not Found" });
        }
        if (post.likes.includes(req.userId)) {
            return res.status(400).json({ err: "Post Already Liked by User" })
        }
        post.likes.push(req.userId);
        // Like karne par dislike hat jata hai
        post.dislikes = post.dislikes.filter((u) => u.toString() !== req.userId);
        await post.save();
        await notify({ to: post.user, actor: req.userId, type: 'like', post: post._id, dedupe: true, message: `${await nameOf(req.userId)} liked your complaint "${short(post.title)}"` });
        res.status(200).json(post);
    } catch (error) {
        console.log("Error Here ", error);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

// Route 4: Add disLike (Login Required)
router.put('/Add_disLike/:id', MiddleWare, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ err: "Post Not Found" });
        }
        if (post.dislikes.includes(req.userId)) {
            return res.status(400).json({ err: "Post Already disLiked by User" })
        }
        post.dislikes.push(req.userId);
        // Dislike karne par like hat jata hai
        post.likes = post.likes.filter((u) => u.toString() !== req.userId);
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        console.log("Error Here ", error);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

// Route 5: Add Comment (Login Required)
router.post('/add_comment/:id', MiddleWare, async (req, res) => {
    try {
        const { description } = req.body;
        if (!description || !description.trim()) {
            return res.status(400).json({ err: "Comment cannot be empty" });
        }
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ err: "Post Not Found" });
        }
        post.comments.push({ user: req.userId, description: description.trim() });
        await post.save();
        await notify({ to: post.user, actor: req.userId, type: 'comment', post: post._id, message: `${await nameOf(req.userId)} commented on your complaint "${short(post.title)}"` });
        await post.populate('comments.user', 'username image');
        res.status(200).json({ comments: post.comments });
    } catch (error) {
        console.log("Error Here ", error);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

// Route 5d: Confirm Incident - "I also saw this" (Login Required)
// Dobara dabane par tasdeeq wapas ho jati hai (toggle)
router.put('/confirm/:id', MiddleWare, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ err: "Post Not Found" });
        }
        if (post.user.toString() === req.userId) {
            return res.status(400).json({ err: "You can not confirm your own complaint" });
        }
        const already = post.confirmations.some((u) => u.toString() === req.userId);
        if (already) {
            post.confirmations = post.confirmations.filter((u) => u.toString() !== req.userId);
        } else {
            post.confirmations.push(req.userId);
        }
        await post.save();
        if (!already) {
            await notify({ to: post.user, actor: req.userId, type: 'confirm', post: post._id, dedupe: true, message: `${await nameOf(req.userId)} confirmed your complaint "${short(post.title)}"` });
        }
        res.status(200).json({ confirmations: post.confirmations, confirmed: !already });
    } catch (error) {
        console.log("Error Here ", error);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

// Route 5c: Set Status (Admin Only)
router.put('/set_status/:id', MiddleWare, AdminOnly, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Pending', 'Under Review', 'Resolved'].includes(status)) {
            return res.status(400).json({ err: "Invalid status" });
        }
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ err: "Post Not Found" });
        }
        const changed = post.status !== status;
        post.status = status;
        post.statusUpdatedAt = new Date();
        await post.save();
        if (changed) {
            await notify({ to: post.user, type: 'status', post: post._id, message: `Your complaint "${short(post.title)}" is now ${status}` });
        }
        res.status(200).json({ status: post.status, statusUpdatedAt: post.statusUpdatedAt });
    } catch (error) {
        console.log("Error Here ", error);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

// Route 5a: Edit Post (Login Required)
// Post sirf uska malik edit kar sakta hai. Nayi image optional hai.
const removeFile = (name) => {
    if (name) fs.unlink(path.join(uploadDir, name), () => { });
}

router.put('/edit_post/:id', MiddleWare, upload.single('image'), async (req, res) => {
    const { title, description, region, category } = req.body;
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            if (req.file) removeFile(req.file.filename);
            return res.status(404).json({ err: "Post Not Found" });
        }
        if (post.user.toString() !== req.userId) {
            if (req.file) removeFile(req.file.filename);
            return res.status(403).json({ err: "You can only edit your own posts" });
        }
        if (!title || !description || !region || !category) {
            if (req.file) removeFile(req.file.filename);
            return res.status(400).json({ err: "All fields are required" });
        }

        post.title = title;
        post.description = description;
        post.region = region;
        post.category = category;
        if (req.body.anonymous !== undefined) {
            post.anonymous = req.body.anonymous === 'true';
        }
        if (req.body.area !== undefined) {
            post.area = AREA_NAMES.includes(req.body.area) ? req.body.area : '';
        }
        if (req.file) {
            removeFile(post.image); // purani image hata do
            post.image = req.file.filename;
        }
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        console.log("Error Here ", error);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

// Route 5b: Delete Post (Login Required)
// Post sirf uska malik delete kar sakta hai
router.delete('/delete_post/:id', MiddleWare, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ err: "Post Not Found" });
        }
        if (post.user.toString() !== req.userId) {
            return res.status(403).json({ err: "You can only delete your own posts" });
        }
        // Post ki image file bhi uploads folder se hata dete hain
        if (post.image) {
            fs.unlink(path.join(uploadDir, post.image), () => { });
        }
        await post.deleteOne();
        res.status(200).json({ message: "Post deleted", id: req.params.id });
    } catch (error) {
        console.log("Error Here ", error);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

// Route 6d: Crime Map data (Login Required)
// Har ilaqe ki complaints ki ginti. Is mein kisi user ki pehchan nahi jati (anonymous safe).
// Filters: ?category=Murder&status=Resolved&days=30
router.get('/map', MiddleWare, async (req, res) => {
    try {
        const { category, status, days } = req.query;
        const filter = {};
        if (category) filter.category = category;
        if (status === 'Pending') {
            // Purani posts mein status field nahi hota, wo bhi Pending hain
            filter.$or = [{ status: 'Pending' }, { status: { $exists: false } }];
        } else if (status) {
            filter.status = status;
        }
        const d = parseInt(days);
        if (d > 0) filter.date = { $gte: new Date(Date.now() - d * 24 * 60 * 60 * 1000) };

        const posts = await Post.find(filter).select('title category status area region date').sort({ date: -1 });

        const byArea = {};
        let withoutArea = 0;
        posts.forEach((p) => {
            if (!p.area) {
                withoutArea++;
                return;
            }
            if (!byArea[p.area]) {
                byArea[p.area] = { area: p.area, region: p.region, count: 0, categories: {}, recent: [] };
            }
            const a = byArea[p.area];
            a.count++;
            a.categories[p.category] = (a.categories[p.category] || 0) + 1;
            if (a.recent.length < 3) {
                a.recent.push({ _id: p._id, title: p.title, category: p.category, status: p.status || 'Pending', date: p.date });
            }
        });

        res.status(200).json({ areas: Object.values(byArea), total: posts.length, withoutArea });
    } catch (error) {
        console.log("Error Here ", error);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

// Route 6a: Area Safety Score (Login Required)
// Har district ka score pichle 30 din ki complaints se nikalta hai.
// Formula: score = 100 - (risk points x 4). Serious crimes ke points zyada hain,
// aur Resolved complaint ke points aadhe ginte hain.
const SEVERITY = { 'Murder': 5, 'Target Killing': 5, 'Bomb Blast': 5, 'Gang Rape': 5, 'Roberry': 3, 'Snatching': 2 };
const PENALTY_PER_POINT = 4;
const SAFETY_DAYS = 30;

router.get('/safety', MiddleWare, async (req, res) => {
    try {
        const since = new Date(Date.now() - SAFETY_DAYS * 24 * 60 * 60 * 1000);
        const recent = await Post.find({ date: { $gte: since } }).select('region category status');

        const areas = ['South', 'East', 'West', 'North'].map((region) => {
            const list = recent.filter((p) => p.region === region);
            const risk = list.reduce((sum, p) => sum + (SEVERITY[p.category] || 2) * (p.status === 'Resolved' ? 0.5 : 1), 0);
            const score = Math.max(0, Math.round(100 - risk * PENALTY_PER_POINT));
            const level = score >= 80 ? 'Safe' : score >= 50 ? 'Moderate' : 'High Risk';

            const counts = {};
            list.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
            const topCategory = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || null;

            return {
                region,
                score,
                level,
                complaints: list.length,
                resolved: list.filter((p) => p.status === 'Resolved').length,
                topCategory,
            };
        });

        const sorted = [...areas].sort((a, b) => (b.score - a.score) || (a.complaints - b.complaints));
        res.status(200).json({ days: SAFETY_DAYS, areas, safest: sorted[0], riskiest: sorted[sorted.length - 1] });
    } catch (error) {
        console.log("Error Here ", error);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

// Route 6: Delete Comment (Login Required)
// Comment sirf uska likhne wala ya post ka malik delete kar sakta hai
router.delete('/delete_comment/:postId/:commentId', MiddleWare, async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ err: "Post Not Found" });
        }
        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ err: "Comment Not Found" });
        }
        const isCommentOwner = comment.user.toString() === req.userId;
        const isPostOwner = post.user.toString() === req.userId;
        if (!isCommentOwner && !isPostOwner) {
            return res.status(403).json({ err: "You can not delete this comment" });
        }
        post.comments.pull(commentId);
        await post.save();
        await post.populate('comments.user', 'username image');
        res.status(200).json({ comments: post.comments });
    } catch (error) {
        console.log("Error Here ", error);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

// Route 6b: Stats for Crime Reports page (Login Required)
// Database se hi ginti karke charts ka real data bhejta hai
router.get('/stats', MiddleWare, async (req, res) => {
    try {
        const [users, posts, regionAgg, categoryAgg, commentAgg, allPosts] = await Promise.all([
            User.countDocuments(),
            Post.countDocuments(),
            Post.aggregate([{ $group: { _id: '$region', count: { $sum: 1 } } }]),
            Post.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
            Post.aggregate([
                { $project: { c: { $size: { $ifNull: ['$comments', []] } } } },
                { $group: { _id: null, total: { $sum: '$c' } } }
            ]),
            // Sab posts (naya pehle) - latest aur trending dono isi se banenge
            withDetails(Post.find().sort({ date: -1 })),
        ]);

        // Sab se nayi 3 posts
        const viewer = await getViewer(req);
        const latest = maskAnonymous(allPosts.slice(0, 3), viewer);

        // Sab se zyada discuss hone wali 2 posts (likes + comments ka total)
        const trendingRaw = allPosts
            .map((p) => ({ post: p, score: p.likes.length + p.comments.length }))
            .filter((x) => x.score > 0)
            .sort((x, y) => y.score - x.score)
            .slice(0, 2)
            .map((x) => x.post);
        const trending = maskAnonymous(trendingRaw, viewer);

        // Status ki ginti (jin purani posts mein status nahi, wo Pending maani jati hain)
        const statuses = { 'Pending': 0, 'Under Review': 0, 'Resolved': 0 };
        allPosts.forEach((p) => {
            const st = p.status || 'Pending';
            if (statuses[st] !== undefined) statuses[st]++;
        });

        // [{_id:'South', count:2}] ko {South: 2} bana dete hain
        const toMap = (arr) => Object.fromEntries(arr.map((i) => [i._id, i.count]));

        res.status(200).json({
            users,
            posts,
            comments: commentAgg[0] ? commentAgg[0].total : 0,
            regions: toMap(regionAgg),
            categories: toMap(categoryAgg),
            latest,
            trending,
            statuses,
        });
    } catch (error) {
        console.log("Error Here ", error);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

// Route 6c: Meri apni posts (Login Required) - Profile page ke liye
router.get('/my_posts', MiddleWare, async (req, res) => {
    try {
        const posts = await withDetails(Post.find({ user: req.userId }).sort({ date: -1 }));
        res.status(200).json({ posts });
    } catch (error) {
        console.log("Error Here ", error);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

// Route 7: Get posts of one user (Login Required)
router.get('/get_post/:id', MiddleWare, async (req, res) => {
    try {
        const { id } = req.params;
        const postuser = await Post.find({ user: id });
        res.status(200).json({ postuser });

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
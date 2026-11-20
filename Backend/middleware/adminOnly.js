import User from '../models/User.js'

// Sirf admin ke liye (authMiddleWare ke baad lagta hai)
const AdminOnly = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select('isAdmin');
        if (!user || !user.isAdmin) {
            return res.status(403).json({ err: "Admin access only" });
        }
        next();
    } catch (error) {
        res.status(500).json({ err: "Internal Server Error" });
    }
}

export default AdminOnly;
import mongoose, { model } from "mongoose";

const NotificationSchema = new mongoose.Schema({
    // Kis user ko notification milegi
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    // Kisne action kiya (status change par khali)
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
    type: { type: String, enum: ['like', 'comment', 'confirm', 'status'], required: true },
    message: { type: String, required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null },
    read: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
});

const Notification = model('Notification', NotificationSchema);
export default Notification;
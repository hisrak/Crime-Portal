import mongoose, { model } from "mongoose";

// Har comment ka apna chhota schema (kis user ne kya likha)
const CommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    // Karachi ka ilaqa (optional), map ke liye
    area: {
        type: String,
        default: ''
    },
    // "I also saw this": in users ne is incident ki tasdeeq ki
    confirmations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    // Anonymous post: naam aur photo dusre users ko nahi dikhte
    anonymous: {
        type: Boolean,
        default: false
    },
    // Admin complaint ka status badalta hai
    status: {
        type: String,
        enum: ['Pending', 'Under Review', 'Resolved'],
        default: 'Pending'
    },
    statusUpdatedAt: {
        type: Date,
        default: null
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    comments: [CommentSchema],
    date: {
        type: Date,
        default: Date.now
    }
});


const Post = model('Post', PostSchema);
export default Post;
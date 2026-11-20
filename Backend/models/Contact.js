import mongoose, { model } from "mongoose";

const ContactSchema = new mongoose.Schema({
    fname: { type: String, required: true, trim: true },
    lname: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true },
    // Kis user ne bheja (login hone par). Bina login ke khali rehta hai.
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
    // Admin ne padh liya ya nahi
    read: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
});

const Contact = model('Contact', ContactSchema);
export default Contact;
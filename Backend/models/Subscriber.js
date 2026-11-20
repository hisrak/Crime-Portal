import mongoose, { model } from "mongoose";

const SubscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Subscriber = model('Subscriber', SubscriberSchema);
export default Subscriber;
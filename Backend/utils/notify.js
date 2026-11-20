import Notification from '../models/Notification.js'
import User from '../models/User.js'

// Notification banata hai. Ghalti ho to mukhya kaam (like, comment waghera) kabhi nahi rukta.
export const notify = async ({ to, actor = null, type, message, post = null, dedupe = false }) => {
    try {
        if (!to) return;
        // Apni hi post par apne action ki notification nahi
        if (actor && to.toString() === actor.toString()) return;
        // Ek hi banda dobara dobara like karke spam na kare
        if (dedupe) {
            const exists = await Notification.findOne({ user: to, actor, type, post });
            if (exists) return;
        }
        await Notification.create({ user: to, actor, type, message, post });
    } catch (error) {
        console.log("Notification Error ", error.message);
    }
}

export const nameOf = async (id) => {
    const user = await User.findById(id).select('username');
    return user ? user.username : 'Someone';
}

// Lamba title chhota kar do
export const short = (text) => (text.length > 40 ? text.slice(0, 40) + '...' : text);
import mongoose, { model } from "mongoose";
import bcryptjs from 'bcryptjs'
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    // Admin sirf Compass se set hota hai (isAdmin: true). Register se kabhi nahi.
    isAdmin: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});


UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt)

})

UserSchema.methods.matchpassword = async function (password) {
    return await bcryptjs.compare(password, this.password);
}
const User = model('user', UserSchema);
export default User;
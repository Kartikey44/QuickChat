import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config();
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim:true,
        required: true
    },
    email: {
        type: String,
        lowercase:true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false,
        minlength: 8
    },
    profileimg: {
        type: String,
        default: ""
    }
},
    { timestamps: true }
);
userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}
userSchema.methods.generateAuthToken = function () { 
    const token = jwt.sign({ _id: this._id ,role:'user'}, process.env.JWT_SECRET, { expiresIn:'7d'});   
    return token;
}
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema)
export default User

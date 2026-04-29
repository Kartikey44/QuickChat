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
    },
    bio:{
        type: String,
        default: "Hey there ! I am using QuickChat"
    }
},
    { timestamps: true }
);
userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { userId: this._id.toString(), role: "user" }, 
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema)
export default User

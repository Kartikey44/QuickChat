import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      unique: true,
      sparse: true,
      match: [/^[6-9]\d{9}$/, "Invalid mobile number"],
      default: null,
    },

    isMobileVerified: {
      type: Boolean,
      default: false,
    },

    password: {
      type: String,
      required: true,
      select: false,
      minlength: 8,
    },

    profileimg: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "Hey there ! I am using QuickChat",
    },
  },
  {
    timestamps: true,
  }
);

// Hash Password
userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

// Generate JWT
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      userId: this._id.toString(),
      role: "user",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// Compare Password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
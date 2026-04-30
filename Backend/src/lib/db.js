import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();
const connecttodb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.log("❌ DB ERROR:", error.message);
    process.exit(1);
  }
};

export default connecttodb;
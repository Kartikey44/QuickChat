import User from "../model/user.model.js";
import dotenv from "dotenv";
import { sendWelcomeEmail } from "../email/emailHandlers.js";
import cloudinary from "../lib/cloundinary.js";

dotenv.config();

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required!",
        success: false
      });
    }

    if (name.trim().length < 3) {
      return res.status(400).json({
        message: "Name must be at least 3 characters",
        success: false
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters"
      });
    }

    const strongPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/;
    if (!strongPassword.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain uppercase, lowercase and a number"
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase()
    }).select("_id");

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await User.hashPassword(password);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword
    });

    const token = user.generateAuthToken();

    res.cookie("token", token, {
  httpOnly: true,
  secure: true,        
  sameSite: "None"     
});

    res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileimg: user.profileimg,
        bio:user.bio
      },
      token
    });

    sendWelcomeEmail(user.email, user.name, process.env.CLIENT_URL)
      .then(() => console.log("Email sent"))
      .catch(err => console.log("Email failed:", err.message));

  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required!",
        success: false
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase()
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid Credentials",
        success: false
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid Credentials",
        success: false
      });
    }

    const token = user.generateAuthToken();
res.cookie("token", token, {
  httpOnly: true,
  secure: true,        
  sameSite: "None"  
});
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileimg: user.profileimg,
        bio:user.bio
      },
      token
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path:'/'
    });
    res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
export const updateProfile = async (req, res) => {
 try {
   const { profileimg } = req.body
   if (!profileimg) return res.status(400).json({ message: "profileimg is required" })
   const userId = req.user._id
   const uploadResponse = await cloudinary.uploader.upload(profileimg)
   const updateUser = await User.findByIdAndUpdate(
    userId,
    {profileimg: uploadResponse.secure_url },
    {new:true}
  )
  res.status(201).json(updateUser)   
   
} catch (error) {
   console.log("Error on updation of profile", error)
   res.status(501).json({message:"Internal server error"})
}
}

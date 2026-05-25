import User from "../models/user.model.js";
import dotenv from "dotenv";
import cloudinary from "../config/cloudinary.js";

dotenv.config();
export const signup = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    if (!name || !email || !password || !mobile) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (name.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 3 characters",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Mobile validation
    const mobileRegex = /^[6-9]\d{9}$/;

    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number",
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const strongPassword =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/;

    if (!strongPassword.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain uppercase, lowercase and number",
      });
    }

    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { mobile },
      ],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.email === email.toLowerCase()
            ? "Email already registered"
            : "Mobile number already registered",
      });
    }

    const hashedPassword =
      await User.hashPassword(password);



    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      mobile,
      password: hashedPassword,
    });
    const token = user.generateAuthToken();
      res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileimg: user.profileimg,
        bio: user.bio,
        mobile: user.mobile,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Detect Email or Mobile

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isEmail =
      emailRegex.test(identifier);

    const query = isEmail
      ? { email: identifier.toLowerCase() }
      : { mobile: identifier };

    // Find User

    const user = await User.findOne(query)
      .select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare Password

    const isPasswordCorrect =
      await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate Token

    const token = user.generateAuthToken();
    res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileimg: user.profileimg,
        bio: user.bio,
        mobile: user.mobile,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    });
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateProfile = async (
  req,
  res
) => {
  try {
    const { name, bio, mobile, profileimg } =
      req.body;

    const userId = req.user._id;

    const updatedData = {};

    // Update name
    if (name) {
      updatedData.name = name.trim();
    }

    // Update bio
    if (bio) {
      updatedData.bio = bio.trim();
    }

    // Update mobile
    if (mobile) {
      const mobileRegex = /^[6-9]\d{9}$/;

      if (!mobileRegex.test(mobile)) {
        return res.status(400).json({
          success: false,
          message: "Invalid mobile number",
        });
      }

      // Check duplicate mobile
      const existingMobile =
        await User.findOne({
          mobile,
          _id: { $ne: userId },
        });

      if (existingMobile) {
        return res.status(400).json({
          success: false,
          message:
            "Mobile number already in use",
        });
      }

      updatedData.mobile = mobile;
    }
    if (profileimg) {
      const uploadResponse =
        await cloudinary.uploader.upload(
          profileimg
        );

      updatedData.profileimg =
        uploadResponse.secure_url;
    }

    // Update User

    const updatedUser =
      await User.findByIdAndUpdate(
        userId,
        updatedData,
        {
          new: true,
        }
      );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        profileimg:
          updatedUser.profileimg,
        bio: updatedUser.bio,
      },
    });
  } catch (error) {
    console.log(
      "PROFILE UPDATE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
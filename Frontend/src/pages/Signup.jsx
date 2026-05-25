import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/Logo.png";
import toast from "react-hot-toast";
import { signupFields } from "../assets/data";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Sparkles, Users, MessageCircle } from "lucide-react";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
  });

  const { signup, signingUp } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (formData.name.trim().length < 3) {
      toast.error("Name must be at least 3 characters");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }

    const strongPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/;

    if (!strongPassword.test(formData.password)) {
      toast.error("Password must contain uppercase, lowercase and number");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    if (formData.mobile && !/^[6-9]\d{9}$/.test(formData.mobile)) {
      toast.error("Invalid mobile number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await signup(formData);

      toast.success("Signup successful");

      navigate("/chat");

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobile: "",
      });
    } catch (error) {
      console.log("Signup Error:", error.response?.data || error.message);

      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-[#970404] via-[#350006] to-[#3d030d] flex items-center justify-center px-4 ">
      <div className="relative z-10 w-full max-w-7xl grid lg:grid-cols-2 gap-10 items-center">
        {/* LEFT SECTION */}
        <div className="hidden lg:flex flex-col justify-center text-white">
          <h1 className="text-6xl font-extrabold leading-tight">
            Create Your <br />
            <span className="text-red-400">QuickChat</span> Account
          </h1>

          <p className="mt-6 text-lg text-zinc-300 leading-relaxed max-w-xl">
            Connect instantly with friends and communities through secure
            conversations, real-time messaging, media sharing, and modern
            communication tools built for speed and privacy.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-5 mt-10 max-w-2xl">
            <div className="bg-white/10 border border-white/10 backdrop-blur-xl p-5 rounded-3xl">
              <MessageCircle className="text-red-400 mb-4" size={35} />

              <h2 className="text-xl font-semibold mb-2">Instant Chat</h2>

              <p className="text-zinc-400 text-sm">
                Lightning-fast messaging with real-time updates.
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 backdrop-blur-xl p-5 rounded-3xl">
              <ShieldCheck className="text-green-400 mb-4" size={35} />

              <h2 className="text-xl font-semibold mb-2">
                Secure Communication
              </h2>

              <p className="text-zinc-400 text-sm">
                Your chats remain encrypted and protected.
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 backdrop-blur-xl p-5 rounded-3xl">
              <Users className="text-blue-400 mb-4" size={35} />

              <h2 className="text-xl font-semibold mb-2">Communities</h2>

              <p className="text-zinc-400 text-sm">
                Build groups and stay connected with everyone.
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 backdrop-blur-xl p-5 rounded-3xl">
              <Sparkles className="text-yellow-400 mb-4" size={35} />

              <h2 className="text-xl font-semibold mb-2">Modern Experience</h2>

              <p className="text-zinc-400 text-sm">
                Smooth UI crafted for seamless communication.
              </p>
            </div>
          </div>
        </div>

        {/* SIGNUP CARD */}
        <div className="w-full flex justify-center my-10">
          <div className="w-full max-w-md bg-white/10 border border-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden">
            {/* Top Border */}
            <div className="h-2 w-full bg-linear-to-r from-red-500 via-pink-500 to-red-700"></div>

            <form
              onSubmit={handleSubmit}
              className="px-6 md:px-8 py-8 flex flex-col gap-5"
            >
              {/* Logo */}
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-3xl bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-lg shadow-lg">
                  <img
                    src={Logo}
                    alt="logo"
                    className="w-12 h-12 object-contain"
                  />
                </div>

                <h2 className="text-3xl font-bold text-white mt-5">
                  Create Account
                </h2>

                <p className="text-zinc-400 mt-2">
                  Sign up and start chatting instantly.
                </p>
              </div>

              {/* Inputs */}
              <div className="flex flex-col gap-5 mt-2">
                {signupFields.map((field) => {
                  const Icon = field.icon;

                  return (
                    <div key={field.name} className="flex flex-col gap-2">
                      <label className="text-sm text-zinc-300 flex items-center justify-between">
                        {field.label}

                        {field.name === "mobile" && (
                          <span className="text-xs text-zinc-500">
                            Optional
                          </span>
                        )}
                      </label>

                      <div className="relative">
                        {Icon && (
                          <Icon
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                            size={18}
                          />
                        )}

                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name] || ""}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          maxLength={field.maxLength}
                          className="w-full bg-black/30 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={signingUp}
                className="w-full cursor-pointer py-3.5 rounded-2xl bg-linear-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition-all duration-300 text-white font-semibold shadow-lg shadow-red-900/40"
              >
                {signingUp ? "Creating..." : "Create Account"}
              </button>

              {/* Login Redirect */}
              <div className="text-center pt-2">
                <span className="text-zinc-400">Already have an account? </span>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-red-400 hover:text-red-300 cursor-pointer font-semibold transition"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;

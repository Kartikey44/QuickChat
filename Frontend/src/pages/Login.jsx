import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/Logo.png";
import { emailloginFields } from "../assets/data";
import { useNavigate } from "react-router-dom";
import { MessageCircle, ShieldCheck, Sparkles, Users } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, loggingin } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(formData);
      navigate("/chat");
    } catch (error) {
      console.log("Error in login:", error.response?.data || error.message);
    }

    setFormData({
      email: "",
      password: "",
    });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-[#970404] via-[#350006] to-[#3d030d] flex items-center justify-center px-4">
      {/* Background Glow */}
      <div className="absolute -top-30 -left-30 w-80 h-80 bg-red-600/20 blur-3xl rounded-full"></div>

      <div className="absolute -bottom-30 -right-30 w-88 h-88 bg-pink-700/20 blur-3xl rounded-full"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-center">
        {/* LEFT SECTION */}
        <div className="hidden lg:flex flex-col justify-center text-white">
          <h1 className="text-6xl font-extrabold leading-tight">
            Welcome Back to <br />
            <span className="text-red-400">QuickChat</span>
          </h1>

          <p className="mt-5 text-lg text-zinc-300 leading-relaxed max-w-xl">
            Stay connected with your friends, teams, and communities using
            lightning-fast messaging, secure conversations, online presence,
            media sharing, and modern communication tools.
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-5 mt-8 max-w-3xl">
            <div className="bg-white/10 border border-white/10 backdrop-blur-xl p-5 rounded-3xl">
              <MessageCircle className="text-red-400 mb-4" size={35} />

              <h2 className="text-xl font-semibold mb-2">Instant Messaging</h2>

              <p className="text-zinc-400 text-sm">
                Real-time chat experience with typing indicators and fast
                delivery.
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 backdrop-blur-xl p-5 rounded-3xl">
              <ShieldCheck className="text-green-400 mb-4" size={35} />

              <h2 className="text-xl font-semibold mb-2">Secure Chats</h2>

              <p className="text-zinc-400 text-sm">
                Encrypted communication for safe and private conversations.
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 backdrop-blur-xl p-5 rounded-3xl">
              <Users className="text-blue-400 mb-4" size={35} />

              <h2 className="text-xl font-semibold mb-2">
                Group Conversations
              </h2>

              <p className="text-zinc-400 text-sm">
                Create communities and stay connected together.
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 backdrop-blur-xl p-5 rounded-3xl">
              <Sparkles className="text-yellow-400 mb-4" size={35} />

              <h2 className="text-xl font-semibold mb-2">Premium Experience</h2>

              <p className="text-zinc-400 text-sm">
                Smooth UI with modern features and seamless interactions.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT LOGIN CARD */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-md bg-white/10 border rounded-2xl border-white/10 backdrop-blur-2xl rounded-8 shadow-2xl overflow-hidden">
            {/* Top Glow */}
            <div className="h-2 w-full bg-linear-to-r from-red-500 via-pink-500 to-red-700"></div>

            <form
              onSubmit={handleSubmit}
              className="px-6 md:px-8 py-8 flex flex-col gap-5 "
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
                  Welcome Back
                </h2>

                <p className="text-zinc-400 mt-2">
                  Login to continue chatting with your friends.
                </p>
              </div>

              {/* Inputs */}
              <div className="flex flex-col gap-5 mt-2">
                {emailloginFields.map((field) => {
                  const Icon = field.icon;

                  return (
                    <div key={field.name} className="flex flex-col gap-2">
                      <label
                        htmlFor={field.name}
                        className="text-sm text-zinc-300"
                      >
                        {field.label}
                      </label>

                      <div className="relative">
                        {Icon && (
                          <Icon
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                            size={18}
                          />
                        )}

                        <input
                          id={field.name}
                          type={field.type}
                          name={field.name}
                          placeholder={field.placeholder}
                          value={formData[field.name]}
                          onChange={handleChange}
                          required
                          className="w-full bg-black/30 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm cursor-pointer text-red-300 hover:text-red-200 transition"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loggingin}
                className="w-full cursor-pointer py-3.5 rounded-2xl bg-linear-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition-all duration-300 text-white font-semibold shadow-lg shadow-red-900/40"
              >
                {loggingin ? "Logging in..." : "Login"}
              </button>
              {/* Register */}
              <div className="text-center pt-2">
                <span className="text-zinc-400">
                  Don&apos;t have an account?{" "}
                </span>

                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="text-red-400 cursor-pointer hover:text-red-300 font-semibold transition"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

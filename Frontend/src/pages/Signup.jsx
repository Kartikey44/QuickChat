import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/Logo.png";
import toast from "react-hot-toast";
import { signupFields } from "../assets/data";
import axiosInstance from "../lib/axios";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen max-w-screen flex justify-center items-center px-4 backdrop-blur-lg bg-linear-to-br from-[#210108] via-[#2e1001] to-[#410302]">
      <div className="md:max-w-sm w-sm rounded-2xl shadow-2xl md:py-2 bg-linear-to-tr from-[#0f0f0f] via-[#9e041390] to-[#640802] space-y-2">
        <div className="flex flex-col md:h-full md:flex-row">
          <form
            onSubmit={handleSubmit}
            className="px-6 py-3 w-full text-white flex flex-col md:gap-4 gap-2"
          >
            <div className="text-center flex flex-col gap-1 md:gap-2 items-center">
              <img src={Logo} alt="logo" className="h-10 w-10" />

              <div>
                <h2 className="md:text-2xl text-xl font-bold">
                  Create Account
                </h2>

                <p className="md:text-sm text-[15px] text-gray-400">
                  Sign up for a new account
                </p>
              </div>
            </div>

            {signupFields.map((field) => {
              if (field.name === "otp" && !otpSent) {
                return null;
              }

              const Icon = field.icon;

              return (
                <div key={field.name} className="flex flex-col gap-1 w-full">
                  <label className="text-sm flex items-center justify-between text-gray-300">
                    {field.label}

                    {field.name === "mobile" && (
                      <p className="text-xs text-gray-500 px-2">(Optional)</p>
                    )}
                  </label>

                  <div className="relative">
                    {Icon && (
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    )}

                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      maxLength={field.maxLength}
                      className="w-full pl-10 pr-4 py-2.5 rounded-full bg-gray-900/80 border border-gray-700 focus:ring-2 focus:ring-blue-500 text-white outline-none"
                    />
                  </div>
                </div>
              );
            })}

            <button
              type="submit"
              disabled={signingUp}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-linear-to-tr from-[#0f0f0f] via-[#140a0b90] to-[#640802] py-2.5 hover:bg-[#fa1c03] focus:border-gray-300 cursor-pointer"
            >
              {signingUp ? "Creating..." : "Create Account"}
            </button>

            <div className="flex justify-center items-center">
              <span
                onClick={() => navigate("/")}
                className="text-gray-400 hover:text-gray-200 cursor-pointer transition"
              >
                Already have an account? Login
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;

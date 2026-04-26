import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/Logo.png";
import BorderAnimated from "../components/BorderAnimated";
import { signupFields } from "../assets/data";
import { useNavigate } from "react-router-dom";
function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { signup, signingUp } = useAuth();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    try {
      await signup(formData);
      navigate("/chat");
    } catch (error) {
      console.log("Error in signup:", error.response?.data || error.message);
    }

    setFormData({
      name: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="h-screen flex justify-center items-center px-4 backdrop-blur-lg bg-linear-to-br from-[#2c2f33] to-[#1e2124]">
      <div className="w-full md:max-w-4xl md:h-[90%]  max-w-2xl md:py-2" >
        <BorderAnimated>
           <div className="flex flex-col md:h-full md:flex-row w-full ">
          <form
            onSubmit={handleSubmit}
            className="px-6 py-3 md:w-1/2 text-white flex flex-col md:gap-4 gap-2 md:border-r border-white/10"
          >
            <div className="text-center flex flex-col gap-1 md:gap-2 items-center">
              <img src={Logo} alt="logo" className="h-24 w-24" />
              <div>
                <h2 className="text-2xl font-bold">Create Account</h2>
                <p className="text-sm text-gray-400">
                  Sign up for a new account
                </p>
              </div>
            </div>

            {signupFields.map((field) => {
              const Icon = field.icon;

              return (
                <div key={field.name} className="flex flex-col md:gap-1 w-full">
                  <label
                    htmlFor={field.name}
                    className="text-sm text-gray-300"
                  >
                    {field.label}
                  </label>

                  <div className="relative">
                    {Icon && (
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    )}

                    <input
                      id={field.name}
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full pl-10 md:pr-4 py-2 md:py-2.5 rounded-lg bg-gray-900/80 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-white placeholder-gray-400"
                      required
                    />
                  </div>
                </div>
              );
            })}

            <button
              type="submit"
              disabled={
                signingUp ||
                !formData.email ||
                !formData.password ||
                !formData.name
              }
              className="bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition py-2.5 rounded-lg font-semibold disabled:opacity-50 shadow-lg"
            >
              {signingUp ? (
                <span className="flex justify-center items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Creating...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="flex justify-center items-center">
              <span
                onClick={() => navigate("/login")}
                className="text-blue-400 hover:text-blue-300 cursor-pointer transition underline"
              >
                Already have an account? Login
              </span>
            </div>
          </form>

          <div className="hidden md:flex flex-col md:w-1/2 gap-2 items-center justify-center p-6">
            <img
              src="/signup.png"
              alt="signup visual"
              className="max-w-sm w-full object-contain"
              />
              <p className="text-2xl text-sky-400 font-bold">connect anytime,anywhere</p>
              <div className="md:flex flex-row gap-5">
              <span className="bg-gray-600/70 px-3 rounded-full text-sky-400 ">Free</span>
              <span className="bg-gray-600/70 px-3 rounded-full text-sky-400">Easy setup</span>
              <span className="bg-gray-600/70 px-3 rounded-full text-sky-400">private</span>
            </div>
            </div>
            </div>
        </BorderAnimated>
      </div>
    </div>
  );
}

export default Signup;
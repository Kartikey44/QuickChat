import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/Logo.png";
import BorderAnimated from "../components/BorderAnimated";
import { emailloginFields } from "../assets/data";
import { useNavigate } from "react-router-dom";

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
      console.log("API URL:", import.meta.env.VITE_API_URL);
      navigate("/chat");
    } catch (error) {
      console.log("Error in login:", error.response?.data || error.message);
      throw error;
    }
    setFormData({
      email: "",
      password: "",
    });
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-linear-to-br from-[#210108] via-[#2e1001] to-[#410302] backdrop-blur-lg">
      <div className="w-full max-w-sm ">
        <div className="bg-linear-to-tr from-[#0a0606] via-[#c9102390] to-[#640802] py-5 px-2 rounded-2xl shadow-2xl">
          <form
            onSubmit={handleSubmit}
            className="md:px-5 px-3 md:py-2 border-slate-600/30 text-white flex flex-col gap-3 md:gap-4"
          >
            <div className="text-center flex flex-col items-center">
              <img src={Logo} alt="logo" className="h-12 w-12" />
              <div>
                <h2 className="md:text-2xl text-xl font-bold">Welcome back</h2>
                <p className="text-sm text-gray-400">Login to your account</p>
              </div>
            </div>
            {emailloginFields.map((field) => {
              const Icon = field.icon;

              return (
                <div
                  key={field.name}
                  className="flex flex-col gap-1 md:gap-2 w-full"
                >
                  <label htmlFor={field.name} className="text-sm text-gray-300">
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
                      className="w-full pl-10 md:pr-4 py-1 md:py-2.5 rounded-full bg-gray-900/80 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-white"
                      required
                    />
                  </div>
                </div>
              );
            })}

            <button
              type="submit"
              disabled={loggingin}
              className="flex w-full items-center text-center justify-center gap-3 rounded-full bg-linear-to-tr from-[#0f0f0f] via-[#140a0b90] to-[#640802] py-2.5 hover:bg-[#fa1c03] focus:border-gray-300 cursor-pointer"
            >
              {loggingin ? "logging in..." : "Login"}
            </button>
            <div className="flex justify-center items-center">
              <span
                onClick={() => navigate("/signup")}
                className="text-gray-400 cursor-pointer hover:text-gray-300 transition-colors px-3 py-1 rounded"
              >
                Don't have an account? register
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/Logo.png";
import BorderAnimated from "../components/BorderAnimated";
import { loginFields } from "../assets/data";
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
      password:""
    })
  };

  return (
    <div className="max-w-screen min-h-screen flex justify-center items-center p-4 backdrop-blur-lg bg-linear-to-br from-[#2c2f33] to-[#1e2124]">
     <div className="w-full md:max-w-4xl md:h-[90%] h-3/4 max-w-2xl py-2" >  
        <BorderAnimated>
          <div className="flex flex-col md:h-full md:flex-row w-full ">
          <form
            onSubmit={handleSubmit}
            className="md:px-5 px-3 md:py-4 py-3 md:w-1/2 md:border-r border-slate-600/30 text-white flex flex-col gap-3 md:gap-6"
          >
            <div className="text-center flex flex-col gap-2 items-center">
              <img src={Logo} alt="logo" className="h-24 w-24" />
              <div>
                <h2 className="text-2xl font-bold">Welcome back</h2>
                <p className="text-sm text-gray-400">
                  Login to your account
                </p>
              </div>
            </div>
            {loginFields.map((field) => {
              const Icon = field.icon;

              return (
                <div key={field.name} className="flex flex-col gap-2 w-full">
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
                      className="w-full pl-10 pr-4 py-2.5 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-white"
                      required
                    />
                  </div>
                </div>
              );
            })}

            
              <button
                
              type="submit"
              disabled={loggingin}
              className="bg-[#379BFF] hover:bg-[#1289FF] transition py-2 rounded-md cursor-pointer font-semibold disabled:opacity-50"
            >
              {loggingin ? "logging in..." : "Login now"}
            </button>
            <div className="flex justify-center items-center">
              <span onClick={()=>navigate('/signup')} className="text-sky-400 cursor-pointer bg-gray-700/70 px-3 py-1 rounded">
                Don't have an account? register
              </span>
            </div>
            </form>
            <div className="hidden md:flex md:w-1/2 flex-col md:gap-2 items-center justify-center p-6">
            <img
              src="/login.png"
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

export default Login;
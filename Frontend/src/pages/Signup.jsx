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
    try {
      await signup(formData);
      navigate("/chat");
    } catch (error) {
      console.log("Error in signup:", error.response?.data || error.message);
      throw error;
    }
    setFormData({
      name: (" "),
      email: (" "),
      password:(" ")
    })
  };

  return (
    <div className="max-w-screen md:min-h-screen flex justify-center items-center p-4 bg-[#3c4147]">
      <div className="w-full max-w-5xl">
        <BorderAnimated>
          <form
            onSubmit={handleSubmit}
            className="px-5 py-6 md:w-1/2 md:border-r border-slate-600/30 text-white flex flex-col gap-6"
          >
            {/* Header */}
            <div className="text-center flex flex-col gap-2 items-center">
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
              disabled={signingUp}
              className="bg-[#379BFF] cursor-pointer hover:bg-[#1289FF] transition py-2 rounded-md font-semibold disabled:opacity-50"
            >
              {signingUp ? "Creating..." : "Create Account"}
            </button>
            <div className="flex justify-center items-center">
              <span onClick={()=>navigate('/login')} className="text-sky-400 cursor-pointer bg-gray-700/70 px-3 py-1 rounded">
                Already have an account? Login
              </span>
            </div>
          </form>
        </BorderAnimated>
      </div>
    </div>
  );
}

export default Signup;
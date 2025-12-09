"use client"

import { useState } from "react"
import Logo from "../../assets/Logo.png"
import { useNavigate } from "react-router-dom"

function Login() {
  const [method, setMethod] = useState("Sign Up")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [checkbox, setCheckbox] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!checkbox) {
      setError("Please agree to terms & condition!")
      return
    }

    if (method === "Sign Up" && (!username || !password || !email)) {
      setError("Please fill all required fields.")
      return
    }

    if (method === "Login" && (!username || !password)) {
      setError("Please enter username and password.")
      return
    }

    setUsername("")
    setPassword("")
    setEmail("")
    setError("")

    alert(method === "Sign Up" ? "Account created successfully!" : "Login successful!")

    if (method === "Login") {
      navigate("/chat")
    }
    if (method === "Sign Up") {
      navigate("/profile")
    }
  }

  const navigate = useNavigate()

  return (
    <div className="bg-[url('/BackgroundImage.png')] bg-cover bg-center min-h-screen flex flex-col md:flex-row bg-no-repeat items-center justify-center md:justify-evenly gap-6 md:gap-0 p-4 sm:p-6 md:p-8">
      <img
        src={Logo || "/placeholder.svg"}
        className="w-40 h-auto sm:w-56 md:w-72 lg:max-w-96 md:h-52 object-contain"
        alt="QuickChat Logo"
      />

      <form
        action="POST"
        onSubmit={handleSubmit}
        autoComplete="off"
        className="w-full max-w-sm sm:max-w-md shadow-lg shadow-red-600/30 text-white bg-zinc-900 rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-5 sm:py-6 flex flex-col items-center gap-3 sm:gap-4"
      >
        <h2 className="text-center text-2xl sm:text-3xl font-semibold">{method}</h2>

        {error && <p className="text-red-500 text-xs sm:text-sm text-center">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="text-gray-300 p-2.5 sm:p-3 rounded-xl w-full text-sm sm:text-base focus:outline-2 focus:bg-black focus:outline-blue-600 bg-gray-700"
        />

        {method === "Sign Up" && (
          <input
            value={email}
            type="email"
            placeholder="Email address"
            className="text-gray-300 p-2.5 sm:p-3 rounded-xl w-full text-sm sm:text-base focus:outline-2 focus:bg-black focus:outline-blue-600 bg-gray-700"
            onChange={(e) => setEmail(e.target.value)}
          />
        )}

        <input
          type="password"
          placeholder="Password"
          className="text-gray-300 p-2.5 sm:p-3 rounded-xl w-full text-sm sm:text-base focus:outline-2 focus:bg-black focus:outline-blue-600 bg-gray-700"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="hover:bg-blue-700 hover:cursor-pointer bg-blue-600 text-white focus:outline-0 px-6 py-2.5 sm:p-3 w-full sm:w-auto shadow-2xl rounded-xl text-sm sm:text-base font-medium transition-colors"
        >
          {method === "Sign Up" ? "Create Account" : "Login Now"}
        </button>

        <div className="flex items-start sm:items-center gap-2">
          <input
            type="checkbox"
            checked={checkbox}
            onChange={() => setCheckbox(!checkbox)}
            className="mt-1 sm:mt-0 w-4 h-4 cursor-pointer"
          />
          <p className="text-white text-xs sm:text-sm">Agree to the terms of use & privacy policy.</p>
        </div>

        <div className="text-center">
          {method === "Sign Up" ? (
            <p className="text-white text-xs sm:text-sm">
              Already have an account?{" "}
              <span
                onClick={() => setMethod("Login")}
                className="text-blue-500 hover:underline hover:cursor-pointer hover:text-blue-400 font-medium"
              >
                Login now
              </span>
            </p>
          ) : (
            <p className="text-white text-xs sm:text-sm">
              Don't have an account?{" "}
              <span
                onClick={() => setMethod("Sign Up")}
                className="text-blue-500 hover:underline hover:cursor-pointer hover:text-blue-400 font-medium"
              >
                Create now
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default Login

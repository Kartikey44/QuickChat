import { Route, Routes } from "react-router-dom"
import Login from "./pages/login/Login"
import Chat from "./pages/chat/Chat"
import ProfileUpdate from "./pages/profileUpdate/ProfileUpdate"
import Signup from "./pages/signup/Signup"
import { ChatProvider } from "./context/userContext"

function App() {
  return (
    <ChatProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<ProfileUpdate />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </ChatProvider>
  )
}

export default App

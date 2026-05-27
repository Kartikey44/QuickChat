import Loader from "./components/Sidebar/Loader";

import { useAuth } from "./context/AuthContext";

import { Routes, Route, Navigate } from "react-router-dom";

import ChatPage from "./pages/ChatPage";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

import { Toaster } from "react-hot-toast";

import Landing from "./components/Landing";

function App() {
  const { authUser, isCheckingAuth } = useAuth();

  return (
    <div className="min-h-screen w-screen">
      {/* OPTIONAL TOP LOADER */}
      {isCheckingAuth && (
        <div className="fixed top-0 left-0 z-[9999] w-full">
          <Loader type="line" fullScreen={false} />
        </div>
      )}

      <Routes>
        {/* CHAT */}
        <Route
          path="/chat/:user_id?"
          element={authUser ? <ChatPage /> : <Navigate to="/" />}
        />

        {/* SIGNUP */}
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/chat" /> : <Signup />}
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={authUser ? <Navigate to="/chat" /> : <Login />}
        />

        {/* LANDING */}
        <Route
          path="/"
          element={authUser ? <Navigate to="/chat" /> : <Landing />}
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster position="top-center" />
    </div>
  );
}

export default App;

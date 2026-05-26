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

  if (isCheckingAuth) {
    return <Loader type="auth" fullScreen={true} />;
  }

  return (
    <div className="min-h-screen w-screen">
      <Routes>
        <Route path="*" element={<NotFound />} />

        <Route
          path="/chat/:user_id?"
          element={authUser ? <ChatPage /> : <Navigate to="/" />}
        />

        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to="/chat" />}
        />

        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/chat" />}
        />

        <Route
          path="/"
          element={!authUser ? <Landing /> : <Navigate to="/chat" />}
        />
      </Routes>

      <Toaster position="top-center" />
    </div>
  );
}

export default App;

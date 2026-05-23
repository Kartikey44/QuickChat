import Loader from "./components/Sidebar/Loader";
import { useAuth } from "./context/AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import Signup from "./pages/Signup";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";

function App() {
  const { authUser, isCheckingAuth } = useAuth();

  if (isCheckingAuth) {
    return <Loader type="auth" fullScreen={true} />;
  }

  return (
    <div className="min-h-screen w-screen">
      <Routes>
        <Route
          path="/chat"
          element={authUser ? <ChatPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to="/chat" />}
        />
        <Route
          path="/"
          element={!authUser ? <Login /> : <Navigate to="/chat" />}
        />
      </Routes>

      <Toaster position="top-center" />
    </div>
  );
}

export default App;

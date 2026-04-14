import Loader from "./components/Loader";
import { useAuth } from "./context/AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import ChatPage from "./pages/ChatPage";
import Signup from "./pages/Signup";
import { Toaster } from "react-hot-toast";

function App() {
  const { authUser, isCheckingAuth } = useAuth();

  return (
    <div className="min-h-screen min-w-screen">        
      <div className="w-full max-w-8xl px-auto">
        {isCheckingAuth ? (
          <Loader fullScreen={false} />
        ) : (
          <Routes>
            <Route
              path="/"
              element={authUser ? <Navigate to="/chat" /> : <Landing />}
            />
            <Route
              path="/chat"
              element={authUser ? <ChatPage /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!authUser ? <Signup /> : <Navigate to="/chat" />}
            />
          </Routes>
        )}
      </div>

      <Toaster position="top-center" />
    </div>
  );
}

export default App;
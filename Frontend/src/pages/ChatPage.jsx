import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ChatPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.log("Logout failed");
    }
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}
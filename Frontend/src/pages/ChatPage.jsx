import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ChatPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}

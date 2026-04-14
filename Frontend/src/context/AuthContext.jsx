import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance  from "../lib/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [signingUp,setSigningUp]=useState(null)

  const checkAuth = async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      setAuthUser(res.data);
    } catch (error) {
      console.log("Error in authCheck:", error);
      setAuthUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const signup = async (userData) => {
    setSigningUp(true);
    try {
      const res = await axiosInstance.post("/auth/signup", userData); 
      setAuthUser(res.data);
      toast.success("Account created successfully!");
      return res.data;
      
    } catch (error) {
      console.log("Error in signup:", error);
      throw error;
    }
    finally {
      setSigningUp(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
        isCheckingAuth,
        checkAuth,
        signingUp,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
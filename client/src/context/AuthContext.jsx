import React from "react";
import api from "../utils/axios";
export const AuthContext = React.createContext({
  user: null,
  login: () => {},
  logout: () => {},
});

//Function to provide the AuthContext to the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  //Function to handle user registration
  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      return data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  // Function to handle user login
  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token); // Store the token in localStorage
      return data; // Return the user data for further use
    } catch (error) {
      const serverMessage = error.response?.data?.error || "";
      if (serverMessage.includes("Account not verified")) {
        error.needsVerification = true;
      }
      console.error("Login failed:", error);
      throw error; // Rethrow the error to be handled by the calling function
    }
  };

  // Function to handle OTP verification
  const verifyOtp = async (email, otp) => {
    try {
      const { data } = await api.post("/auth/verify-otp", { email, otp });
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);
      return data; // Return the user data for further use
    } catch (error) {
      console.error("OTP verification failed:", error);
      throw error; // Rethrow the error to be handled by the calling function
    }
  };

  // Function to handle user logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // Remove the token from localStorage
  };

  // Function to handle user profile update
  const updateProfile = async (name) => {
    try {
      const { data } = await api.put("/auth/profile", { name });
      const updatedUser = { ...user, name: data.name };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return data;
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  };

  // Provide the user, login, logout, verifyOtp, register, and updateProfile functions to the context consumers
  return (
    <AuthContext.Provider
      value={{ user, login, logout, verifyOtp, register, updateProfile, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loginUser = (username, password) => {
    return fetch("https://memes-api.grye.org/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accept: "application/json",
      },
      body: new URLSearchParams({ username, password }).toString(),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.access_token) {
          AsyncStorage.setItem("credentials", JSON.stringify(data));
          setIsAuthenticated(true);
          return { success: true };
        } else {
          return { success: false, message: "Login failed" };
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        return { success: false, message: error.message };
      });
  };

  // const logoutUser = () => {
  //   return AsyncStorage.removeItem("token").then(() =>
  //     setIsAuthenticated(false),
  //   );
  // };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loginUser }}>
      {children}
    </AuthContext.Provider>
  );
};

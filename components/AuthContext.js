// AuthContext.js
import React, { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [account_type, setaccount_type] = useState("");

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, account_type, setaccount_type }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

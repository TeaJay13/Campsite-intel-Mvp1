import React from "react";

import { fetchProfile, loginUser, logoutUser, registerUser } from "../api/auth-api.js";

const AuthContext = React.createContext(null);

const ACCESS_TOKEN_KEY = "tcp_access_token";

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [accessToken, setAccessToken] = React.useState(
    () => sessionStorage.getItem(ACCESS_TOKEN_KEY) || null,
  );
  const [loading, setLoading] = React.useState(!!sessionStorage.getItem(ACCESS_TOKEN_KEY));

  // Rehydrate session on mount
  React.useEffect(() => {
    const storedToken = sessionStorage.getItem(ACCESS_TOKEN_KEY);
    if (!storedToken) {
      setLoading(false);
      return;
    }

    fetchProfile(storedToken)
      .then((profile) => {
        setUser(profile);
        setAccessToken(storedToken);
      })
      .catch(() => {
        sessionStorage.removeItem(ACCESS_TOKEN_KEY);
        setAccessToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function register(credentials) {
    const result = await registerUser(credentials);
    sessionStorage.setItem(ACCESS_TOKEN_KEY, result.accessToken);
    setAccessToken(result.accessToken);
    setUser(result.user);
    return result;
  }

  async function login(credentials) {
    const result = await loginUser(credentials);
    sessionStorage.setItem(ACCESS_TOKEN_KEY, result.accessToken);
    setAccessToken(result.accessToken);
    setUser(result.user);
    return result;
  }

  async function logout() {
    try {
      await logoutUser(accessToken);
    } finally {
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
      setAccessToken(null);
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}

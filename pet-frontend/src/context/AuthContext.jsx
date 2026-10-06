import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import * as authApi from "../api/authApi";
import * as userApi from "../api/userApi";
import { decodeToken, isTokenExpired, getRoleFromToken, getEmailFromToken } from "../utils/jwt";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("pms_token"));
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(() => {
    const cached = localStorage.getItem("pms_user");
    return cached ? JSON.parse(cached) : null;
  });

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      localStorage.removeItem("pms_token");
      setToken(null);
    }
  }, [token]);

  const tokenClaims = useMemo(() => {
    if (!token) return null;
    const decoded = decodeToken(token);
    if (!decoded) return null;
    return {
      email: getEmailFromToken(token),
      role: getRoleFromToken(token),
      exp: decoded.exp,
    };
  }, [token]);

  // Fetch the full profile (id, username) once we have a valid token.
  useEffect(() => {
    let cancelled = false;
    if (tokenClaims && (!profile || profile.email !== tokenClaims.email)) {
      userApi
        .getMe()
        .then((data) => {
          if (!cancelled) {
            setProfile(data);
            localStorage.setItem("pms_user", JSON.stringify(data));
          }
        })
        .catch(() => {
          /* profile fetch failures are non-fatal; id-dependent screens will show a message */
        });
    }
    if (!tokenClaims) {
      setProfile(null);
    }
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenClaims]);

  const user = useMemo(() => {
    if (!tokenClaims) return null;
    return {
      ...tokenClaims,
      id: profile?.id ?? null,
      username: profile?.username ?? null,
    };
  }, [tokenClaims, profile]);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const res = await authApi.login(credentials);
      if (!res.token) {
        // Backend returns a message-only response for invalid credentials
        // or unverified accounts.
        throw { message: res.message || "Login failed" };
      }
      localStorage.setItem("pms_token", res.token);
      setToken(res.token);
      return res;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    try {
      return await authApi.register(payload);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("pms_token");
    localStorage.removeItem("pms_user");
    setToken(null);
    setProfile(null);
  }, []);

  const value = {
    token,
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

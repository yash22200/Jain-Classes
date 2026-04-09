import { createContext, useState, useContext, ReactNode, useEffect, useCallback, useRef } from "react";
import { API_URL } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, expectedRole?: "student" | "admin") => Promise<User>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<User>;
  logout: () => void;
}

// Use namespaced localStorage keys to prevent collisions
const STORAGE_KEY_USER = "jc_auth_user";
const STORAGE_KEY_TOKEN = "jc_auth_token";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isValidating = useRef(false);

  // Clear all auth data from state and storage
  const clearAuth = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    // Also remove legacy keys from old code to prevent ghost sessions
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.clear();
  }, []);

  // Save auth data to state and storage (WITHOUT calling clearAuth first)
  const saveAuth = useCallback((userData: User, authToken: string) => {
    // Remove any legacy keys first
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // Directly write new values — no intermediate null state
    setUser(userData);
    setToken(authToken);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
    localStorage.setItem(STORAGE_KEY_TOKEN, authToken);
  }, []);

  // Validate stored token against the backend on mount
  useEffect(() => {
    const validateSession = async () => {
      // Check both new and legacy keys for backwards compatibility
      const storedUser = localStorage.getItem(STORAGE_KEY_USER) || localStorage.getItem("user");
      const storedToken = localStorage.getItem(STORAGE_KEY_TOKEN) || localStorage.getItem("token");

      if (!storedUser || !storedToken) {
        clearAuth();
        setIsLoading(false);
        return;
      }

      // Prevent double validation (React strict mode calls useEffect twice)
      if (isValidating.current) return;
      isValidating.current = true;

      try {
        // Validate the token by calling /api/auth/me
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!res.ok) {
          // Token is expired, invalid, or user no longer exists
          console.warn("Stored auth token is invalid, clearing session");
          clearAuth();
          setIsLoading(false);
          isValidating.current = false;
          return;
        }

        const data = await res.json();
        if (data.success && data.data) {
          // Use the BACKEND-verified user data, not the stale localStorage data
          // This ensures the role is always correct even if it was changed in the DB
          const verifiedUser: User = {
            id: data.data.id,
            name: data.data.name,
            email: data.data.email,
            role: data.data.role,
          };
          saveAuth(verifiedUser, storedToken);
        } else {
          clearAuth();
        }
      } catch (err) {
        console.error("Error validating auth session:", err);
        // On network error, use stored data as fallback but mark as potentially stale
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          setToken(storedToken);
        } catch {
          clearAuth();
        }
      }

      setIsLoading(false);
      isValidating.current = false;
    };

    validateSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (email: string, password: string, expectedRole?: "student" | "admin"): Promise<User> => {
    // CRITICAL: Clear any existing auth data BEFORE making the login request
    // This prevents the old token from being used if the new login fails
    clearAuth();

    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, expectedRole }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    const userData: User = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
    };

    saveAuth(userData, data.token);

    // Return the user data so the caller can use it directly (no localStorage read needed)
    return userData;
  }, [clearAuth, saveAuth]);

  const register = useCallback(async (name: string, email: string, password: string, confirmPassword: string): Promise<User> => {
    clearAuth();

    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    const userData: User = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
    };

    saveAuth(userData, data.token);
    return userData;
  }, [clearAuth, saveAuth]);

  const logout = useCallback(() => {
    // Fire-and-forget logout API call (don't block on it)
    const currentToken = token;
    if (currentToken) {
      fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentToken}`,
          "Content-Type": "application/json",
        },
      }).catch(() => {
        // Ignore errors — logout is primarily client-side
      });
    }

    // Clear ALL auth state synchronously
    clearAuth();

    // Use a small delay to ensure React state has flushed before navigating
    // This prevents the old state from being visible during the redirect
    setTimeout(() => {
      window.location.replace("/login");
    }, 0);
  }, [token, clearAuth]);

  // Show loading screen while validating session
  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontSize: "1rem",
        color: "#888",
      }}>
        Verifying session...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
}

interface MockAuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined);

// Fake users database
const FAKE_USERS: { [key: string]: { id: string; name: string; email: string; password: string; role: "student" | "admin" } } = {
  "student@jain.com": {
    id: "student-001",
    name: "Raj Kumar",
    email: "student@jain.com",
    password: "student123",
    role: "student",
  },
  "admin@jain.com": {
    id: "admin-001",
    name: "Admin User",
    email: "admin@jain.com",
    password: "admin123",
    role: "admin",
  },
};

// Generate fake JWT token
const generateFakeToken = (userId: string): string => {
  return `fake_jwt_token_${userId}_${Date.now()}`;
};

export const MockAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const saveAuth = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const login = async (email: string, password: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const fakeUser = FAKE_USERS[email];

    if (!fakeUser) {
      throw new Error("User not found");
    }

    if (fakeUser.password !== password) {
      throw new Error("Invalid password");
    }

    const userData: User = {
      id: fakeUser.id,
      name: fakeUser.name,
      email: fakeUser.email,
      role: fakeUser.role,
    };

    const token = generateFakeToken(fakeUser.id);
    saveAuth(userData, token);
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    if (!name || !email) {
      throw new Error("Please provide all required fields");
    }

    // Check if user exists
    if (FAKE_USERS[email]) {
      throw new Error("Email already registered");
    }

    // Create new user (in memory only, won't persist)
    FAKE_USERS[email] = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      role: "student",
    };

    const userData: User = {
      id: FAKE_USERS[email].id,
      name: FAKE_USERS[email].name,
      email: FAKE_USERS[email].email,
      role: FAKE_USERS[email].role,
    };

    const token = generateFakeToken(FAKE_USERS[email].id);
    saveAuth(userData, token);
  };

  const logout = () => {
    clearAuth();
  };

  return (
    <MockAuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </MockAuthContext.Provider>
  );
};

export const useAuth = (): MockAuthContextType => {
  const ctx = useContext(MockAuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within MockAuthProvider");
  }
  return ctx;
};

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { auth, googleProvider, signInWithPopup } from './firebase';

const API = process.env.NEXT_PUBLIC_API_URL || '/api';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  university?: string;
  major?: string;
  isPro?: boolean;
  emailVerified?: boolean;
  authProvider?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<{ email: string }>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  sendOtp: (email: string) => Promise<void>;
  loginWithGoogle: (redirectToDashboard?: boolean) => Promise<any>;
  logout: () => void;
  updateUser: (updatedUser: AuthUser) => void;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  university?: string;
  major?: string;
  graduationYear?: string;
  skills?: string[];
  interests?: string;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ── Persist & restore ──────────────────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem('cp_token');
    if (stored) {
      setToken(stored);
      fetchMe(stored).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchMe(t: string) {
    try {
      const res = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUser(data.user);
    } catch {
      // Token invalid/expired — clear it
      localStorage.removeItem('cp_token');
      setToken(null);
      setUser(null);
    }
  }

  const storeAuth = useCallback((t: string, u: AuthUser) => {
    localStorage.setItem('cp_token', t);
    setToken(t);
    setUser(u);
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      const err: { message: string; needsVerification?: boolean; email?: string } = { message: data.message };
      if (data.needsVerification) { err.needsVerification = true; err.email = data.email; }
      throw err;
    }
    storeAuth(data.token, data.user);
    router.push('/Dashboard');
  }, [router, storeAuth]);

  // ── Register ───────────────────────────────────────────────────────────────
  const register = useCallback(async (formData: RegisterData): Promise<{ email: string }> => {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        graduationYear: formData.graduationYear ? Number(formData.graduationYear) : undefined,
        interests: formData.interests || '',
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return { email: data.email };
  }, []);

  // ── OTP ────────────────────────────────────────────────────────────────────
  const verifyOtp = useCallback(async (email: string, otp: string) => {
    const res = await fetch(`${API}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    storeAuth(data.token, data.user);
    router.push('/Dashboard');
  }, [router, storeAuth]);

  const sendOtp = useCallback(async (email: string) => {
    const res = await fetch(`${API}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
  }, []);

  // ── Google ─────────────────────────────────────────────────────────────────
  const loginWithGoogle = useCallback(async (redirectToDashboard: boolean = true) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const res = await fetch(`${API}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      storeAuth(data.token, data.user);
      if (redirectToDashboard) {
        router.push('/Dashboard');
      }
      return data;
    } catch (err: unknown) {
      // User cancelled popup — not a real error
      const code = (err as { code?: string }).code;
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return null;
      throw err;
    }
  }, [router, storeAuth]);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('cp_token');
    setToken(null);
    setUser(null);
    router.push('/auth/login');
  }, [router]);

  // ── Update User State ──────────────────────────────────────────────────────
  const updateUser = useCallback((updatedUser: AuthUser) => {
    setUser(updatedUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, verifyOtp, sendOtp, loginWithGoogle, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

const AVATAR_COLORS = [
  "#ef4444", // Red
  "#ec4899", // Pink
  "#a855f7", // Purple
  "#6366f1", // Indigo
  "#3b82f6", // Blue
  "#0ea5e9", // Light Blue
  "#06b6d4", // Cyan
  "#14b8a6", // Teal
  "#10b981", // Green
  "#eab308", // Yellow
  "#f97316", // Orange
  "#f43f5e", // Rose
];

export function getAvatarProps(name?: string) {
  const displayName = name?.trim() || "User";
  const firstWord = displayName.split(" ")[0] || "U";
  const char = firstWord.charAt(0).toUpperCase();

  let hash = 0;
  for (let i = 0; i < displayName.length; i++) {
    hash = displayName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % AVATAR_COLORS.length;
  const bgColor = AVATAR_COLORS[colorIndex];

  return { char, bgColor };
}


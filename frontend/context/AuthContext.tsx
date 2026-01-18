"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import api from "@/lib/api";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Keep UI logged in even if backend sync fails.
          setUser(firebaseUser);

          try {
            const token = await firebaseUser.getIdToken();
            await api.post("/auth/login", { firebaseToken: token });
          } catch (err) {
            // Common causes: backend not running, wrong NEXT_PUBLIC_API_URL, or CORS.
            // We intentionally don't block UI auth on this.
            // eslint-disable-next-line no-console
            console.error("Backend auth sync failed (/auth/login):", err);
          }
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

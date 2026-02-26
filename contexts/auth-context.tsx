"use client";

import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { signOut as signOutServer } from "@/app/actions/auth";

const AUTH_USER_QUERY_KEY = ["auth", "user"] as const;

async function fetchUser(): Promise<User | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const supabase = useMemo(() => createClient(), []);

  const { data: user = null, isPending: loading } = useQuery({
    queryKey: AUTH_USER_QUERY_KEY,
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: AUTH_USER_QUERY_KEY });
    });
    return () => subscription.unsubscribe();
  }, [supabase, queryClient]);

  const signOut = async () => {
    queryClient.invalidateQueries({ queryKey: AUTH_USER_QUERY_KEY });
    await signOutServer();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

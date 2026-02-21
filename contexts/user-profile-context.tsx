"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./auth-context";
import type { AnyUser } from "@/lib/types/users";
import { mapProfileToUser } from "@/lib/types/profile-mapper";
import type { Profile } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/client";
import { getUserProfile } from "@/app/actions/user";

type UserProfileContextType = {
  profile: AnyUser | null;
  loading: boolean;
  refetch: () => Promise<void>;
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(
  undefined
);

export function UserProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<AnyUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    if (!user?.id) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const p = await getUserProfile(user.id);
    setProfile(mapProfileToUser(p as Profile));
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return (
    <UserProfileContext.Provider
      value={{ profile, loading, refetch: loadProfile }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (ctx === undefined) {
    throw new Error("useUserProfile must be used within UserProfileProvider");
  }
  return ctx;
}

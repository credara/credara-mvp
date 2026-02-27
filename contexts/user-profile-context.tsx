"use client";

import React, { createContext, useContext } from "react";
import { useAuth } from "./auth-context";
import type { AnyUser } from "@/lib/types/users";
import { mapProfileToUser } from "@/lib/types/profile-mapper";
import type { Profile } from "@/lib/db/schema";
import { getUserProfile } from "@/app/actions/user";
import { useQuery } from "@tanstack/react-query";

type UserProfileContextType = {
  profile: AnyUser | null;
  loading: boolean;
  refetch: () => void;
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

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const p = await getUserProfile(user.id);
      if (!p) return null;
      return mapProfileToUser(p as Profile);
    },
    enabled: !!user?.id,
    staleTime: 60 * 1000,
  });

  return (
    <UserProfileContext.Provider
      value={{ profile: data ?? null, loading: isLoading, refetch }}
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

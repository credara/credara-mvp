"use client";
import { useUserProfile } from "@/contexts/user-profile-context";

export default function HomePage() {
  const { profile } = useUserProfile();
  const userType = profile?.role;
  if (!userType) return <div>Loading...</div>;
  if (userType === "INDIVIDUAL") return <div>Individual</div>;
  if (userType === "FINTECH") return <div>Fintech</div>;
  if (userType === "LANDLORD") return <div>Landlord</div>;
  return <div>Unknown</div>;
}

"use client";
import { useUserProfile } from "@/contexts/user-profile-context";
import IndividualDashboard from "./(pos-agents)/page";
import Loading from "../loading";
import { Header } from "@/components/dashboard/header";

export default function HomePage() {
  const { profile } = useUserProfile();
  const userType = profile?.role;
  if (!userType) return <Loading />;
  return (
    <>
      <Header />
      {userType === "INDIVIDUAL" && (
        <IndividualDashboard individualProfile={profile} />
      )}
      {userType === "FINTECH" && <div>Fintech</div>}
      {userType === "LANDLORD" && <div>Landlord</div>}
      {!["INDIVIDUAL", "FINTECH", "LANDLORD"].includes(userType) && (
        <div>Unknown</div>
      )}
    </>
  );
}

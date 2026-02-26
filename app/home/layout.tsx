import { WithAuth } from "@/app/hoc/with-auth";
import { HomeLayoutClient } from "./home-layout-client";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WithAuth>
      <HomeLayoutClient>{children}</HomeLayoutClient>
    </WithAuth>
  );
}

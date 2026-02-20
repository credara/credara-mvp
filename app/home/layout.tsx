import { WithAuth } from "@/app/hoc/with-auth";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WithAuth>{children}</WithAuth>;
}

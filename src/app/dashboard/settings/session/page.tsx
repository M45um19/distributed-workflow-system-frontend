import UserSessionsList from "@/features/user/components/UserSessionsList";

export const metadata = {
  title: "Active Sessions | FlowSync",
  description: "Manage your active account sessions and device security.",
};

export default function UserSessionsPage() {
  return <UserSessionsList />;
}

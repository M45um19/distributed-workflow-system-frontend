import DashboardSidebar from "@/components/layout/DashboardSidebar";
import AuthGuard from "@/features/auth/components/AuthGuard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-bg-dark flex">
        {/* Left Sidebar */}
        <DashboardSidebar />

        {/* Main Content Area */}
        <div className="flex-grow pl-64 min-h-screen flex flex-col">
          <main className="flex-grow p-8 md:p-10 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

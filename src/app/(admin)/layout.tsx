import { AdminSidebar } from "@/components/common/admin-siderbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import Link from "next/link";

const menuItems = [
  {
    title: "Admin Dashboard",
    url: "/admin",
    icon: Home,
  },
];

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="text-center text-3xl font-bold">Admin Dashboard</div>
      </SidebarHeader>
      <SidebarContent className="mt-5 p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

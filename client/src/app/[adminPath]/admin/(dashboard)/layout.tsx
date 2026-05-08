"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  LogOut,
  BarChart3,
  Server,
  CreditCard,
  Package,
  Zap,
  ExternalLink,
  Users,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const getNavItems = (secretPath: string) => [
  {
    title: "Analytics",
    href: `/${secretPath}/admin`,
    icon: BarChart3,
  },
  {
    title: "Clients",
    href: `/${secretPath}/admin/clients`,
    icon: Server,
  },
  {
    title: "Customers",
    href: `/${secretPath}/admin/customers`,
    icon: Users,
  },
  {
    title: "Transactions",
    href: `/${secretPath}/admin/transactions`,
    icon: CreditCard,
  },
  {
    title: "Presets",
    href: `/${secretPath}/admin/presets`,
    icon: Package,
  },
];

const SidebarNav = ({ navItems }: { navItems: any[] }) => {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const secretPath = process.env.NEXT_PUBLIC_ADMIN_URI_PATH || "admin";

  return (
    <SidebarMenu>
      {navItems.map((item) => {
        const isActive =
          item.href === `/${secretPath}/admin`
            ? pathname === `/${secretPath}/admin`
            : pathname.startsWith(item.href);
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              tooltip={item.title}
              onClick={() => setOpenMobile(false)}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const secretPath = process.env.NEXT_PUBLIC_ADMIN_URI_PATH || "admin";
  const navItems = getNavItems(secretPath);

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push(`/${secretPath}/admin/login`);
          },
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href={`/${secretPath}/admin`}>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md">
                    <Zap className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold tracking-tight">
                      NextuneLK
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      Admin Panel
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarNav navItems={navItems} />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Back to Site">
                <Link href="/" className="text-muted-foreground">
                  <ExternalLink />
                  <span className="text-xs">Back to Site</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="bg-background relative">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur-md px-4 sticky top-0 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2 text-sm flex-1">
            <span className="font-medium text-muted-foreground">
              {navItems.find((item) =>
                item.href === `/${secretPath}/admin`
                  ? pathname === `/${secretPath}/admin`
                  : pathname.startsWith(item.href)
              )?.title || "Dashboard"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive gap-2 h-8"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </header>
        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 md:p-8 2xl:p-10 w-full min-h-[calc(100vh-3.5rem)]">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

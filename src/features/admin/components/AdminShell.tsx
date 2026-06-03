"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className='AdminShell w-full max-w-full min-w-0 overflow-x-hidden'>
      <SidebarProvider className='max-w-full min-w-0'>
        <AdminSidebar />
        <SidebarInset className='flex min-h-svh max-w-full min-w-0 flex-col'>
          <AdminHeader />
          <div className='min-h-0 flex-1 overflow-y-auto'>
            <div className='flex flex-col gap-4 p-4 lg:p-6'>{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

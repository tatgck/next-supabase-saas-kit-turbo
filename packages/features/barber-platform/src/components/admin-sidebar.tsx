'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Store, Monitor, Scissors, Megaphone } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from '@kit/ui/shadcn-sidebar';

export function AdminBarberPlatformSidebar({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const path = usePathname();

  return (
    <Sidebar collapsible="icon" className={`${isCollapsed ? 'w-16' : 'w-64'} border-r`}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? 'sr-only' : ''}>Barber Platform</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuButton
                isActive={path === '/admin/barber-platform'}
                asChild
              >
                <Link
                  className={'flex size-full gap-2.5'}
                  href={'/admin/barber-platform'}
                >
                  <Store className={'h-4'} />
                  <span className={isCollapsed ? 'sr-only' : ''}>Platform Overview</span>
                </Link>
              </SidebarMenuButton>

              <SidebarMenuButton
                isActive={path.includes('/admin/barber-platform/stores')}
                asChild
              >
                <Link
                  className={'flex size-full gap-2.5'}
                  href={'/admin/barber-platform/stores'}
                >
                  <Store className={'h-4'} />
                  <span className={isCollapsed ? 'sr-only' : ''}>Store Management</span>
                </Link>
              </SidebarMenuButton>

              <SidebarMenuButton
                isActive={path.includes('/admin/barber-platform/workstations')}
                asChild
              >
                <Link
                  className={'flex size-full gap-2.5'}
                  href={'/admin/barber-platform/workstations'}
                >
                  <Monitor className={'h-4'} />
                  <span className={isCollapsed ? 'sr-only' : ''}>Workstation Management</span>
                </Link>
              </SidebarMenuButton>

              <SidebarMenuButton
                isActive={path.includes('/admin/barber-platform/barbers')}
                asChild
              >
                <Link
                  className={'flex size-full gap-2.5'}
                  href={'/admin/barber-platform/barbers'}
                >
                  <Scissors className={'h-4'} />
                  <span className={isCollapsed ? 'sr-only' : ''}>Barber Management</span>
                </Link>
              </SidebarMenuButton>

              <SidebarMenuButton
                isActive={path.includes('/admin/barber-platform/advertisements')}
                asChild
              >
                <Link
                  className={'flex size-full gap-2.5'}
                  href={'/admin/barber-platform/advertisements'}
                >
                  <Megaphone className={'h-4'} />
                  <span className={isCollapsed ? 'sr-only' : ''}>Advertisement Management</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
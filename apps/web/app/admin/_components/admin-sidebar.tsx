'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LayoutDashboard, Users, Store, Monitor, Scissors, Megaphone } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from '@kit/ui/shadcn-sidebar';

import { AppLogo } from '~/components/app-logo';
import { ProfileAccountDropdownContainer } from '~/components/personal-account-dropdown-container';

export function AdminSidebar() {
  const path = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className={'m-2'}>
        <AppLogo href={'/admin'} className="max-w-full" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Super Admin</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuButton isActive={path === '/admin'} asChild>
                <Link className={'flex gap-2.5'} href={'/admin'}>
                  <LayoutDashboard className={'h-4'} />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>

              <SidebarMenuButton
                isActive={path.includes('/admin/accounts')}
                asChild
              >
                <Link
                  className={'flex size-full gap-2.5'}
                  href={'/admin/accounts'}
                >
                  <Users className={'h-4'} />
                  <span>Accounts</span>
                </Link>
              </SidebarMenuButton>

              <SidebarMenuButton
                isActive={path.includes('/admin/stores')}
                asChild
              >
                <Link
                  className={'flex size-full gap-2.5'}
                  href={'/admin/stores'}
                >
                  <Store className={'h-4'} />
                  <span>Store Management</span>
                </Link>
              </SidebarMenuButton>

              <SidebarMenuButton
                isActive={path.includes('/admin/barbers')}
                asChild
              >
                <Link
                  className={'flex size-full gap-2.5'}
                  href={'/admin/barbers'}
                >
                  <Scissors className={'h-4'} />
                  <span>Barber Management</span>
                </Link>
              </SidebarMenuButton>

              <SidebarMenuButton
                isActive={path.includes('/admin/workstations')}
                asChild
              >
                <Link
                  className={'flex size-full gap-2.5'}
                  href={'/admin/workstations'}
                >
                  <Monitor className={'h-4'} />
                  <span>Workstation Management</span>
                </Link>
              </SidebarMenuButton>

              <SidebarMenuButton
                isActive={path.includes('/admin/advertisements')}
                asChild
              >
                <Link
                  className={'flex size-full gap-2.5'}
                  href={'/admin/advertisements'}
                >
                  <Megaphone className={'h-4'} />
                  <span>Advertisement Management</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <ProfileAccountDropdownContainer />
      </SidebarFooter>
    </Sidebar>
  );
}

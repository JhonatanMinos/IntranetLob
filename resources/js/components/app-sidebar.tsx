import { Link, usePage } from '@inertiajs/react';
import {
  CalendarCog,
  FileUser,
  Flag,
  FolderSymlink,
  FolderTree,
  LayoutGrid,
  Store,
  UserCog,
  Workflow,
} from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavSecond } from '@/components/nav-second';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as departament } from '@/routes/departament';
import { index as files } from '@/routes/employeeFiles';
import { index as events } from '@/routes/events';
import { index as marketplace } from '@/routes/marketplace';
import { index as notifications } from '@/routes/notifications';
import { index as processes } from '@/routes/processes';
import { index as users } from '@/routes/users';
import type { NavItem, SharedData } from '@/types';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
  {
    title: 'Panel',
    href: dashboard(),
    icon: LayoutGrid,
    can: 'view Dashboard',
  },
  {
    title: 'Directorio',
    href: users().url,
    icon: FolderTree,
    can: 'view Directory',
  },
  {
    title: 'Procesos',
    href: processes().url,
    icon: Workflow,
    can: 'view Process',
  },
  {
    title: 'Avisos',
    href: notifications().url,
    icon: Flag,
    can: 'view Notification',
  },
  {
    title: 'Eventos',
    href: events(),
    icon: CalendarCog,
    can: 'view Event',
  },
  {
    title: 'Expedientes',
    href: files(),
    icon: FileUser,
    can: 'view Files',
  },
  {
    title: 'Capital Humano',
    href: departament().url,
    icon: UserCog,
    can: 'view RRHH',
  },
  {
    title: 'Marketplace LOB',
    href: marketplace().url,
    icon: Store,
    can: 'view MarketPlace',
  },
];

const secondNavItems: NavItem[] = [
  {
    title: 'LOB Two LS',
    href: 'https://lobtwols.lobcorporativo.com',
    icon: FolderSymlink,
    can: '',
  },
  {
    title: 'Socios LOB',
    href: 'https://socios.lobcorporativo.com',
    icon: FolderSymlink,
    can: '',
  },
  {
    title: 'LOB Tools',
    href: 'http://lobtools/login',
    icon: FolderSymlink,
    can: '',
  },
];

export function AppSidebar() {
  const page = usePage<SharedData>();
  const permissions: string[] = page.props.permissions ?? [];
  const allowedMainNavItems = mainNavItems.filter(
    (item) => !item.can || permissions.includes(item.can)
  );
  const workItems = allowedMainNavItems.filter((item) =>
    ['Panel', 'Procesos', 'Eventos'].includes(item.title)
  );
  const peopleItems = allowedMainNavItems.filter((item) =>
    ['Directorio', 'Expedientes', 'Capital Humano'].includes(item.title)
  );
  const serviceItems = allowedMainNavItems.filter((item) =>
    ['Avisos', 'Marketplace LOB'].includes(item.title)
  );
  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={dashboard()} prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain label="Trabajo" items={workItems} />
        <NavMain label="Personas" items={peopleItems} />
        <NavMain label="Servicios" items={serviceItems} />
        <NavSecond items={secondNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

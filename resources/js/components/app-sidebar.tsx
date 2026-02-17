import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Folder,
    LayoutGrid,
    FolderTree,
    Briefcase,
    Workflow,
    FolderSymlink,
    Flag,
    CalendarCog,
} from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
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
import { dashboard, services, processes } from '@/routes';
import { index as events } from '@/routes/events';
import { index as notifications } from '@/routes/notifications';
import { index as users } from '@/routes/users';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Directorio',
        href: users().url,
        icon: FolderTree,
    },
    {
        title: 'Services',
        href: services(),
        icon: Briefcase,
    },
    {
        title: 'Procesos',
        href: processes(),
        icon: Workflow,
    },
    {
        title: 'Notificaciones',
        href: notifications().url,
        icon: Flag,
    },
    {
        title: 'Eventos/Calendario',
        href: events(),
        icon: CalendarCog,
    },
];

const secondNavItems: NavItem[] = [
    {
        title: 'lobtwols',
        href: 'https://lobtwols.lobcorporativo.com',
        icon: FolderSymlink,
    },
    {
        title: 'socios lob',
        href: 'https://socios.lobcorporativo.com',
        icon: FolderSymlink,
    },
    {
        title: 'lobtools',
        href: 'http://lobtools/login',
        icon: FolderSymlink,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
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
                <NavMain items={mainNavItems} />
                <NavSecond items={secondNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

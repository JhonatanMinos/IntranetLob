import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    CalendarCog,
    FileUser,
    Flag,
    Folder,
    FolderSymlink,
    FolderTree,
    LayoutGrid,
    UserCog,
    Workflow,
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
import { dashboard } from '@/routes';
import { index as events } from '@/routes/events';
import { index as notifications } from '@/routes/notifications';
import { index as processes } from '@/routes/processes';
import { index as users } from '@/routes/users';
import { index as files } from '@/routes/employeeFiles';
import type { NavItem, SharedData } from '@/types';
import AppLogo from './app-logo';
import { index as departament } from '@/routes/departament';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
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
        title: 'Notificaciones',
        href: notifications().url,
        icon: Flag,
        can: 'view Notification',
    },
    {
        title: 'Eventos/Calendario',
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
];

const secondNavItems: NavItem[] = [
    {
        title: 'lobtwols',
        href: 'https://lobtwols.lobcorporativo.com',
        icon: FolderSymlink,
        can: '',
    },
    {
        title: 'socios lob',
        href: 'https://socios.lobcorporativo.com',
        icon: FolderSymlink,
        can: '',
    },
    {
        title: 'lobtools',
        href: 'http://lobtools/login',
        icon: FolderSymlink,
        can: '',
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
        can: '',
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
        can: '',
    },
];

export function AppSidebar() {
    const page = usePage<SharedData>();
    const permissions: string[] = page.props.permissions ?? [];
    const allowedMainNavItems = mainNavItems.filter(
        (item) => !item.can || permissions.includes(item.can),
    );
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
                <NavMain items={allowedMainNavItems} />
                <NavSecond items={secondNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

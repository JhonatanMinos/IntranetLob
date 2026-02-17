import {
    SidebarGroupLabel,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { toUrl } from '@/lib/utils';
import type { NavItem } from '@/types';

export function NavSecond({ items = [] }: { items: NavItem[] }) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Plataformas</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            tooltip={{ children: item.title }}
                        >
                            <a
                                href={toUrl(item.href)}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

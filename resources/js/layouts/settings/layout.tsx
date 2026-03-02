import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { assign, edit, payroll } from '@/routes/profile';
import { index as roles } from '@/routes/roles';
import { show } from '@/routes/two-factor';
import { edit as editPassword } from '@/routes/user-password';
import type { NavItem } from '@/types';
import { Toaster } from '@/components/ui/sonner';

const sidebarNavItems: NavItem[] = [
  {
    title: 'Profile',
    href: edit(),
    icon: null,
    can: '',
  },
  {
    title: 'Nominas',
    href: payroll(),
    icon: null,
    can: '',
  },
  {
    title: 'Assign Roles',
    href: assign(),
    icon: null,
    can: '',
  },
  {
    title: 'Roles',
    href: roles(),
    icon: null,
    can: '',
  },
  {
    title: 'Password',
    href: editPassword(),
    icon: null,
    can: '',
  },
  {
    title: 'Two-Factor Auth',
    href: show(),
    icon: null,
    can: '',
  },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
  const { isCurrentUrl } = useCurrentUrl();

  // When server-side rendering, we only render the layout on the client...
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div className="flex h-full flex-col overflow-hidden px-4 py-6">
      <Heading title="Settings" description="Manage your profile and account settings" />

      <div className="flex flex-1 flex-col gap-6 overflow-hidden lg:flex-row lg:space-x-12">
        <aside className="w-full shrink-0 lg:w-48">
          <nav className="flex flex-col space-y-1 space-x-0" aria-label="Settings">
            {sidebarNavItems.map((item, index) => (
              <Button
                key={`${toUrl(item.href)}-${index}`}
                size="sm"
                variant="ghost"
                asChild
                className={cn('w-full justify-start', {
                  'bg-muted': isCurrentUrl(item.href),
                })}
              >
                <Link href={item.href}>
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.title}
                </Link>
              </Button>
            ))}
          </nav>
        </aside>

        <Separator className="my-6 lg:hidden" />

        <div className="flex-1 overflow-y-auto">
          <section className="space-y-12 pr-6 md:max-w-2xl">{children}</section>
          <Toaster richColors />
        </div>
      </div>
    </div>
  );
}

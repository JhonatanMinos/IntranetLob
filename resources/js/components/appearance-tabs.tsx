import { Monitor, Moon, Sun } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

export default function AppearanceToggleTab({
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { appearance, updateAppearance } = useAppearance();

  const modes = ['light', 'dark', 'system'] as const;

  const currentIndex = modes.indexOf(appearance);
  const nextMode = modes[(currentIndex + 1) % modes.length];

  const icons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };
  const Icon = icons[appearance];
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => updateAppearance(nextMode)}
          className={cn(
            'flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-neutral-200  dark:hover:bg-neutral-700',
            className
          )}
          {...props}
        >
          <Icon className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{nextMode}</p>
      </TooltipContent>
    </Tooltip>
  );
}

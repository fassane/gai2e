import { LuCheck, LuMonitor, LuMoon, LuSun } from 'react-icons/lu';
import { cn } from '../lib/utils';
import { Button } from './button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { useTheme, type Theme } from './theme-provider';

const options: { value: Theme; label: string; icon: typeof LuSun }[] = [
  { value: 'light', label: 'Clair', icon: LuSun },
  { value: 'dark', label: 'Sombre', icon: LuMoon },
  { value: 'system', label: 'Système', icon: LuMonitor },
];

// Choix du thème : clair, sombre ou celui de l'appareil
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const Icon = resolvedTheme === 'dark' ? LuMoon : LuSun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={cn('rounded-full', className)} aria-label="Changer de thème">
          <Icon className="size-[1.1rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {options.map((option) => (
          <DropdownMenuItem key={option.value} onClick={() => setTheme(option.value)}>
            <option.icon />
            {option.label}
            {theme === option.value && <LuCheck className="ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

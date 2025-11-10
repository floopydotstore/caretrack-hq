import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export const Header = ({ user, onLogout }: HeaderProps) => {
  return (
    <header className="border-b bg-gradient-card">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent truncate">
              Patient Management System
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
              {user.name} • {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="gap-2 shrink-0"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

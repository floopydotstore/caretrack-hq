import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <div className="flex items-center gap-2">
        <span className="text-xs sm:text-sm font-medium">{user.name}</span>
        <Badge variant="outline" className="text-xs">
          {user.role}
        </Badge>
      </div>
      <Button 
        onClick={onLogout} 
        variant="outline" 
        size="sm"
        className="text-xs sm:text-sm"
      >
        <LogOut className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
        <span className="hidden sm:inline">Logout</span>
      </Button>
    </div>
  );
}

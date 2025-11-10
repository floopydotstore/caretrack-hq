import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

export const StatsCard = ({ title, value, icon: Icon, description }: StatsCardProps) => {
  return (
    <Card className="p-4 sm:p-6 bg-gradient-card border-border/50 transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="space-y-1 sm:space-y-2">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="p-2 sm:p-3 bg-primary/5 rounded-lg shrink-0">
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        </div>
      </div>
    </Card>
  );
};

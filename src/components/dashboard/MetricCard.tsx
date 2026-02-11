import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning';
  delay?: number;
}

const variantStyles = {
  default: 'from-background to-muted/20',
  primary: 'from-primary/5 to-primary/10 border-primary/20',
  accent: 'from-accent/5 to-accent/10 border-accent/20',
  success: 'from-green-500/5 to-green-500/10 border-green-500/20',
  warning: 'from-amber-500/5 to-amber-500/10 border-amber-500/20',
};

const iconStyles = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary text-primary-foreground shadow-lg shadow-primary/25',
  accent: 'bg-accent text-accent-foreground shadow-lg shadow-accent/25',
  success: 'bg-green-500 text-white shadow-lg shadow-green-500/25',
  warning: 'bg-amber-500 text-white shadow-lg shadow-amber-500/25',
};

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  delay = 0
}: MetricCardProps) {
  return (
    <Card
      className={cn(
        'relative overflow-hidden border transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
        'bg-gradient-to-br',
        variantStyles[variant]
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground tracking-tight">{title}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
            </div>
            {(subtitle || trend) && (
              <div className="flex items-center gap-2 text-xs">
                {trend && (
                  <span className={cn(
                    'flex items-center font-semibold px-2 py-0.5 rounded-full',
                    trend.isPositive
                      ? 'bg-green-500/10 text-green-600'
                      : 'bg-red-500/10 text-red-600'
                  )}>
                    {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                  </span>
                )}
                {subtitle && (
                  <span className="text-muted-foreground/80">{subtitle}</span>
                )}
              </div>
            )}
          </div>
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110', iconStyles[variant])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-current opacity-[0.03] blur-2xl" />
      </CardContent>
    </Card>
  );
}

/**
 * StatusCard Component
 * Displays individual admin status metrics with loading states
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface StatusCardProps {
  title: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  loading?: boolean;
}

export function StatusCard({ title, value, icon: Icon, loading = false }: StatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}

import { DashboardOverview } from '@/features/dashboard/ui/DashboardOverview';
import { DashboardInsights } from '@/features/dashboard/ui/DashboardInsights';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A quick snapshot of the latest activity and key metrics.
        </p>
      </div>
      <DashboardOverview />
      <DashboardInsights />
    </div>
  );
}

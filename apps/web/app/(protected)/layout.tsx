import { DashboardLayout } from '@/shared/ui/layouts/DashboardLayout';
import { AuthGuard } from '@/features/auth/logic/AuthGuard';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}

import { DashboardLayout } from '@/shared/ui/layouts/DashboardLayout';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

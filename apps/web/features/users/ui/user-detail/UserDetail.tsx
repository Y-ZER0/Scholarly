'use client';

import { useRouter } from 'next/navigation';
import { Breadcrumb } from '@/shared/ui/components/Breadcrumb';
import { DetailPageHeader } from '@/shared/ui/components/DetailPageHeader';
import { UserAvatar } from '@/shared/ui/components/UserAvatar';
import { StatusBadge } from '@/shared/ui/components/StatusBadge';
import { useUser } from '../../hooks/useUser';

interface UserDetailProps {
  id: string;
}

export function UserDetail({ id }: UserDetailProps) {
  const router = useRouter();
  const { data: user, isLoading, isError, refetch } = useUser(id);

  if (isError) {
    return (
      <div>
        <Breadcrumb items={[{ label: 'Users', href: '/' }]} />
        <DetailPageHeader title="User Not Found" onBack={() => router.push('/')} />
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-base font-semibold text-foreground">Failed to load user</p>
          <p className="mt-1 text-sm text-muted-foreground">The user could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Users' }]} />

      <DetailPageHeader
        title={user?.name ?? ''}
        onRefresh={() => refetch()}
      />

      {/* Profile Card */}
      <div className="bg-card border border-border rounded-lg p-4 md:p-6 mb-6">
        <div className="flex items-start justify-between">
          <h2 className="text-base font-semibold text-foreground">Profile</h2>
          <StatusBadge status={(user?.role?.toLowerCase() as 'teacher' | 'student' | 'admin') ?? 'student'} />
        </div>
        <div className="mt-4">
          <UserAvatar
            name={user?.name ?? ''}
            email={user?.email}
            photoUrl={user?.profilePhoto}
            size="md"
          />
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Breadcrumb } from '@/shared/ui/components/Breadcrumb';
import { DetailPageHeader } from '@/shared/ui/components/DetailPageHeader';
import { DataTable } from '@/shared/ui/components/DataTable';
import { CodeBadge } from '@/shared/ui/components/CodeBadge';
import { StatusBadge } from '@/shared/ui/components/StatusBadge';
import { UserAvatar } from '@/shared/ui/components/UserAvatar';
import { Input } from '@/components/ui/input';
import { useClass } from '../../hooks/useClass';
import { useAuth } from '@/shared/context/AuthContext';
import { useJoinClass } from '@/features/enrollments/hooks/student/useJoinClass';
import { useMyEnrollments } from '@/features/enrollments/hooks/student/useMyEnrollments';
import { useClassEnrollments } from '@/features/enrollments/hooks/useClassEnrollments';
import { getEnrolledStudentColumns } from './columns';
import { UserRole } from '@repo/shared';
import { formatDate } from '@/shared/lib/utils';

interface ClassDetailProps {
  id: string;
}

export function ClassDetail({ id }: ClassDetailProps) {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { data: classData, isError, refetch } = useClass(id);

  const [inviteCode, setInviteCode] = useState('');
  const { mutate: joinClass, isPending: joinPending } = useJoinClass();

  const { data: myEnrollments } = useMyEnrollments({ page: 1, limit: 100 });
  const isEnrolled = myEnrollments?.data.some((e) => e.classId === id) ?? false;
  const enrolledAt = myEnrollments?.data.find((e) => e.classId === id)?.enrolledAt;

  const { data: classEnrollments, isLoading: enrollmentsLoading } = useClassEnrollments(id);

  const handleJoin = useCallback(() => {
    if (!inviteCode.trim()) {
      toast.error('Please enter an invite code');
      return;
    }
    joinClass(
      { inviteCode: inviteCode.trim() },
      {
        onSuccess: () => {
          toast.success('Successfully joined the class!');
          setInviteCode('');
          refetch();
        },
        onError: (error: Error) => {
          toast.error(error?.message || 'Failed to join class');
        },
      },
    );
  }, [inviteCode, joinClass, refetch]);

  const isStudent = currentUser?.role === UserRole.STUDENT;

  if (isError) {
    return (
      <div>
        <Breadcrumb
          items={[
            { label: 'Classes', href: '/classes' },
            { label: 'Show' },
          ]}
        />
        <DetailPageHeader title="Class Not Found" onBack={() => router.push('/classes')} />
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-base font-semibold text-foreground">Failed to load class</p>
          <p className="mt-1 text-sm text-muted-foreground">The class could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Classes', href: '/classes' },
          { label: 'Show' },
        ]}
      />

      <DetailPageHeader
        title="Class Details"
        onRefresh={() => refetch()}
        editHref={`/classes/${id}/edit`}
      />

      {/* Banner Image */}
      {classData?.bannerImage && (
        <div className="relative mb-6 h-[200px] overflow-hidden rounded-lg">
          <Image
            src={classData.bannerImage}
            alt={classData.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      )}

      {/* Info Card */}
      <div className="bg-card border border-border rounded-lg p-4 md:p-6 mb-6">
        {/* Class Name + Badges */}
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-xl font-bold text-foreground">{classData?.name}</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full">
              {classData?.spotsRemaining} spots
            </span>
            <StatusBadge status={(classData?.status?.toLowerCase() as 'active' | 'inactive') ?? 'active'} />
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4">{classData?.description}</p>

        <div className="border-t border-border my-4" />

        {/* Instructor & Department - Two Columns */}
        <div className="grid grid-cols-2 gap-8">
          {/* Instructor */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs">👨‍🏫</span>
              <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                INSTRUCTOR
              </span>
            </div>
            {classData?.teacher && (
              <UserAvatar
                name={classData.teacher.name}
                email={classData.teacher.email}
                photoUrl={classData.teacher.profilePhoto}
                size="md"
              />
            )}
          </div>

          {/* Department */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs">🏢</span>
              <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                DEPARTMENT
              </span>
            </div>
            {classData?.department && (
              <div>
                <p className="text-sm font-semibold text-primary hover:underline cursor-pointer">
                  {classData.department.name}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {classData.department.description}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border my-4" />

        {/* Subject */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs">📚</span>
            <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
              SUBJECT
            </span>
          </div>
          {classData?.subject && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-muted-foreground">Code:</span>
                <CodeBadge code={classData.subject.code} />
              </div>
              <p className="text-sm font-semibold text-primary hover:underline cursor-pointer">
                {classData.subject.name}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {classData.subject.description}
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-border my-4" />

        {/* Join Class — Student only */}
        {isStudent && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs">🎯</span>
              <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                JOIN CLASS
              </span>
            </div>

            {isEnrolled ? (
              <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3">
                <span className="text-sm font-medium text-primary">
                  ✓ You are enrolled
                </span>
                {enrolledAt && (
                  <span className="text-xs text-muted-foreground">
                    since {formatDate(enrolledAt)}
                  </span>
                )}
              </div>
            ) : (
              <>
                <ol className="space-y-1 text-sm text-muted-foreground mb-4">
                  <li>1. Ask your teacher for the invite code.</li>
                  <li>2. Enter the code below and click &quot;Join Class&quot;.</li>
                </ol>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter invite code"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleJoin();
                    }}
                    className="flex-1"
                  />
                  <button
                    onClick={handleJoin}
                    disabled={joinPending || !inviteCode.trim()}
                    className="h-10 px-6 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {joinPending ? 'Joining...' : 'Join Class'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Enrolled Students */}
      <DataTable
        title="Enrolled Students"
        columns={getEnrolledStudentColumns()}
        data={classEnrollments?.data ?? []}
        isLoading={enrollmentsLoading}
        showPagination={false}
        emptyMessage="No students enrolled yet"
      />
    </div>
  );
}

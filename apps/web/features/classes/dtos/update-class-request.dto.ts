import type { ClassStatus } from '@repo/shared';

export interface UpdateClassRequestDto {
  name?: string;
  description?: string;
  bannerImage?: string;
  capacity?: number;
  status?: ClassStatus;
  subjectId?: string;
  teacherId?: string;
}

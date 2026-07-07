export interface CreateClassRequestDto {
  name: string;
  description: string;
  bannerImage?: string;
  capacity: number;
  status?: 'active' | 'inactive';
  subjectId: string;
  teacherId: string;
}

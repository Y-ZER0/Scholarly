'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Breadcrumb } from '@/shared/ui/components/Breadcrumb';
import { FormCard } from '@/shared/ui/components/FormCard';
import { FileUpload } from '@/shared/ui/components/FileUpload';
import { useCreateClass } from '../../hooks/useCreateClass';
import { useSubjects } from '@/features/subjects/hooks/useSubjects';
import { useFaculty } from '@/features/faculty/hooks/useFaculty';

const createClassSchema = z.object({
  name: z.string().min(2, 'Class name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  bannerImage: z.string().optional(),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  status: z.enum(['active', 'inactive']),
  subjectId: z.string().min(1, 'Please select a subject'),
  teacherId: z.string().min(1, 'Please select a teacher'),
});

type CreateClassValues = z.infer<typeof createClassSchema>;

export function CreateClassForm() {
  const router = useRouter();
  const { mutate, isPending } = useCreateClass();
  const { data: subjectsData } = useSubjects({ page: 1, limit: 100 });
  const { data: facultyData } = useFaculty({ page: 1, limit: 100 });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateClassValues>({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      capacity: 30,
      status: 'active',
    },
  });

  const subjectId = watch('subjectId');
  const teacherId = watch('teacherId');
  const status = watch('status');

  const onSubmit = (data: CreateClassValues) => {
    mutate(data, {
      onSuccess: () => {
        toast.success('Class created successfully');
        router.push('/classes');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to create class');
      },
    });
  };

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Classes', href: '/classes' },
          { label: 'Create' },
        ]}
      />

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Create a Class
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Provide the required information below to add a class.
          </p>
        </div>
        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10"
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </div>

      <FormCard>
        <FileUpload
          label="Banner Image"
          required
          onUpload={(url) => setValue('bannerImage', url)}
          height="h-56"
        />

        <div>
          <label className="text-sm font-medium text-foreground">
            Class Name <span className="text-destructive">*</span>
          </label>
          <Input
            {...register('name')}
            placeholder="Introduction to Biology - Section A"
            className="mt-1 h-10 bg-muted border-border text-foreground placeholder:text-muted-foreground"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground">
              Subject <span className="text-destructive">*</span>
            </label>
            <Select
              value={subjectId}
              onValueChange={(value) =>
                value && setValue('subjectId', value, { shouldValidate: true })
              }
            >
              <SelectTrigger className="mt-1 h-10 bg-muted border-border text-foreground">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjectsData?.data.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subjectId && (
              <p className="mt-1 text-xs text-destructive">
                {errors.subjectId.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Teacher <span className="text-destructive">*</span>
            </label>
            <Select
              value={teacherId}
              onValueChange={(value) =>
                value && setValue('teacherId', value, { shouldValidate: true })
              }
            >
              <SelectTrigger className="mt-1 h-10 bg-muted border-border text-foreground">
                <SelectValue placeholder="Select a teacher" />
              </SelectTrigger>
              <SelectContent>
                {facultyData?.data.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.teacherId && (
              <p className="mt-1 text-xs text-destructive">
                {errors.teacherId.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground">
              Capacity <span className="text-destructive">*</span>
            </label>
          <Input
            {...register('capacity', { valueAsNumber: true })}
            type="number"
            min={1}
            className="mt-1 h-10 bg-muted border-border text-foreground placeholder:text-muted-foreground"
          />
            {errors.capacity && (
              <p className="mt-1 text-xs text-destructive">
                {errors.capacity.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Status <span className="text-destructive">*</span>
            </label>
            <Select
              value={status}
              onValueChange={(value) =>
                value && setValue('status', value as 'active' | 'inactive', { shouldValidate: true })
              }
            >
              <SelectTrigger className="mt-1 h-10 bg-muted border-border text-foreground">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="mt-1 text-xs text-destructive">
                {errors.status.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">
            Description <span className="text-destructive">*</span>
          </label>
          <Textarea
            {...register('description')}
            placeholder="Brief description about the class"
            rows={4}
            className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground resize-y min-h-[100px]"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isPending}
          className="w-full mt-2"
        >
          {isPending ? 'Creating...' : 'Create Class'}
        </Button>
      </FormCard>
    </div>
  );
}

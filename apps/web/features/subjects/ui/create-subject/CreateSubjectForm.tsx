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
import { useCreateSubject } from '../../hooks/useCreateSubject';
import { useDepartments } from '@/shared/hooks/useDepartments';

const createSubjectSchema = z.object({
  code: z
    .string()
    .min(2, 'Code must be at least 2 characters')
    .max(10, 'Code must be at most 10 characters')
    .toUpperCase(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters'),
  departmentId: z.string().min(1, 'Please select a department'),
});

type CreateSubjectValues = z.infer<typeof createSubjectSchema>;

export function CreateSubjectForm() {
  const router = useRouter();
  const { mutate, isPending } = useCreateSubject();
  const { data: departmentsData } = useDepartments({ limit: 100 });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateSubjectValues>({
    resolver: zodResolver(createSubjectSchema),
  });

  const departmentId = watch('departmentId');

  const onSubmit = (data: CreateSubjectValues) => {
    mutate(data, {
      onSuccess: () => {
        toast.success('Subject created successfully');
        router.push('/subjects');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to create subject');
      },
    });
  };

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Subjects', href: '/subjects' },
          { label: 'Create' },
        ]}
      />

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Create a Subject
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Provide the required information below to add a subject.
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
        <div>
          <label className="text-sm font-medium text-foreground">
            Department <span className="text-destructive">*</span>
          </label>
          <Select
            value={departmentId}
            onValueChange={(value) =>
              value && setValue('departmentId', value, { shouldValidate: true })
            }
          >
            <SelectTrigger className="mt-1 h-10 bg-muted border-border text-foreground">
              <SelectValue>
                {departmentsData?.data.find((d) => d.id === departmentId)?.name ?? 'Select a department'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {departmentsData?.data.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.departmentId && (
            <p className="mt-1 text-xs text-destructive">
              {errors.departmentId.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">
            Subject Code <span className="text-destructive">*</span>
          </label>
          <Input
            {...register('code')}
            placeholder="CS101"
            className="mt-1 h-10 bg-muted border-border text-foreground placeholder:text-muted-foreground"
          />
          {errors.code && (
            <p className="mt-1 text-xs text-destructive">
              {errors.code.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">
            Subject Name <span className="text-destructive">*</span>
          </label>
          <Input
            {...register('name')}
            placeholder="Introduction to Computer Science"
            className="mt-1 h-10 bg-muted border-border text-foreground placeholder:text-muted-foreground"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">
            Description <span className="text-destructive">*</span>
          </label>
          <Textarea
            {...register('description')}
            placeholder="Describe the subject focus..."
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
          className="mt-2"
        >
          {isPending ? 'Creating...' : 'Create Subject'}
        </Button>
      </FormCard>
    </div>
  );
}

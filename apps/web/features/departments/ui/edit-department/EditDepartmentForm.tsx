'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/shared/ui/components/Breadcrumb';
import { FormCard } from '@/shared/ui/components/FormCard';
import { useDepartment } from '../../hooks/useDepartment';
import { useUpdateDepartment } from '../../hooks/useUpdateDepartment';

const updateDepartmentSchema = z.object({
  code: z
    .string()
    .min(2, 'Code must be at least 2 characters')
    .max(10, 'Code must be at most 10 characters')
    .toUpperCase(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters'),
});

type UpdateDepartmentValues = z.infer<typeof updateDepartmentSchema>;

interface EditDepartmentFormProps {
  id: string;
}

export function EditDepartmentForm({ id }: EditDepartmentFormProps) {
  const router = useRouter();
  const { data: department, isLoading } = useDepartment(id);
  const { mutate, isPending } = useUpdateDepartment(id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateDepartmentValues>({
    resolver: zodResolver(updateDepartmentSchema),
  });

  useEffect(() => {
    if (department) {
      reset({
        code: department.code,
        name: department.name,
        description: department.description,
      });
    }
  }, [department, reset]);

  const onSubmit = (data: UpdateDepartmentValues) => {
    mutate(data, {
      onSuccess: () => {
        toast.success('Department updated successfully');
        router.push(`/departments/${id}`);
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update department');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Departments', href: '/departments' },
          { label: 'Edit' },
        ]}
      />

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Edit Department
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update the department information below.
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
            Department Code <span className="text-destructive">*</span>
          </label>
          <Input
            {...register('code')}
            placeholder="CS"
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
            Department Name <span className="text-destructive">*</span>
          </label>
          <Input
            {...register('name')}
            placeholder="Computer Science"
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
            placeholder="Describe the department focus..."
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
          {isPending ? 'Updating...' : 'Update Department'}
        </Button>
      </FormCard>
    </div>
  );
}

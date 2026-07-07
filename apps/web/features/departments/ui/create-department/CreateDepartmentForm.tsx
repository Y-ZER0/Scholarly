'use client';

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
import { useCreateDepartment } from '../../hooks/useCreateDepartment';

const createDepartmentSchema = z.object({
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

type CreateDepartmentValues = z.infer<typeof createDepartmentSchema>;

export function CreateDepartmentForm() {
  const router = useRouter();
  const { mutate, isPending } = useCreateDepartment();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateDepartmentValues>({
    resolver: zodResolver(createDepartmentSchema),
  });

  const onSubmit = (data: CreateDepartmentValues) => {
    mutate(data, {
      onSuccess: () => {
        toast.success('Department created successfully');
        router.push('/departments');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to create department');
      },
    });
  };

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Departments', href: '/departments' },
          { label: 'Create' },
        ]}
      />

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Create a Department
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Provide the required information below to add a department.
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
          {isPending ? 'Creating...' : 'Create Department'}
        </Button>
      </FormCard>
    </div>
  );
}

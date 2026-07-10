'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTeacherClasses } from '../../hooks/teacher/useClasses';
import { useAddStudent } from '../../hooks/teacher/useAddStudent';

const addStudentSchema = z.object({
  classId: z.string().min(1, 'Please select a class'),
  studentEmail: z.string().email('Please enter a valid email address'),
});

type AddStudentValues = z.infer<typeof addStudentSchema>;

interface AddStudentDialogProps {
  trigger?: React.ReactElement;
}

export function AddStudentDialog({ trigger }: AddStudentDialogProps) {
  const [open, setOpen] = useState(false);
  const { data: classes, isLoading: classesLoading } = useTeacherClasses();
  const { mutate: addStudent, isPending } = useAddStudent();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddStudentValues>({
    resolver: zodResolver(addStudentSchema),
    defaultValues: {
      classId: '',
      studentEmail: '',
    },
  });

  const selectedClassId = watch('classId');

  const onSubmit = (data: AddStudentValues) => {
    addStudent(data, {
      onSuccess: () => {
        toast.success('Student added successfully');
        reset();
        setOpen(false);
      },
      onError: (error: Error) => {
        const message = error?.message || 'Failed to add student';
        toast.error(message);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ??
          <Button className="h-9 gap-1.5">
            <Plus className="h-4 w-4" /> Add Student
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Student to Class</DialogTitle>
          <DialogDescription>
            Select a class and enter the student&apos;s email address.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div>
            <label className="text-sm font-medium text-foreground">
              Class <span className="text-destructive">*</span>
            </label>
            <Select
              value={selectedClassId}
              onValueChange={(value) => {
                if (value && value !== 'none') {
                  setValue('classId', value, { shouldValidate: true });
                }
              }}
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue>
                  {classes?.find((c) => c.id === selectedClassId)?.name ?? 'Select a class'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {classesLoading ? (
                  <SelectItem value="none" disabled>
                    Loading classes...
                  </SelectItem>
                ) : classes && classes.length > 0 ? (
                  classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No classes available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors.classId && (
              <p className="mt-1 text-xs text-destructive">{errors.classId.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Student Email <span className="text-destructive">*</span>
            </label>
            <Input
              {...register('studentEmail')}
              type="email"
              placeholder="student@example.com"
              className="mt-1"
            />
            {errors.studentEmail && (
              <p className="mt-1 text-xs text-destructive">{errors.studentEmail.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => {
              reset();
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
            {isPending ? 'Adding...' : 'Add Student'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

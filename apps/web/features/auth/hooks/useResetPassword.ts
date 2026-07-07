'use client';

import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '../services/auth.service';

interface ResetPasswordVariables {
  token: string;
  newPassword: string;
}

export function useResetPassword() {
  return useMutation<void, Error, ResetPasswordVariables>({
    mutationFn: ({ token, newPassword }) => resetPassword(token, newPassword),
  });
}

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type UseFormProps } from 'react-hook-form';
import { z } from 'zod';

// Generic form hook with Zod validation
export function useZodForm<T extends z.ZodType>(
  schema: T,
  options?: Omit<UseFormProps<z.infer<T>>, 'resolver'>
) {
  return useForm({
    resolver: zodResolver(schema),
    ...options,
  });
}

// Auth schemas
export const authSchemas = {
  login: z.object({
    email: z.string().email('Invalid email').min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional(),
  }),

  register: z.object({
    email: z.string().email('Invalid email').min(1, 'Email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm password'),
    user_name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    phone: z.string().regex(/^(\+84|0)[0-9]{9,10}$/, 'Invalid phone number').optional(),
    terms: z.boolean().refine(val => val === true, 'You must accept terms'),
  }).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }),
};

// Type exports
export type LoginFormData = z.infer<typeof authSchemas.login>;
export type RegisterFormData = z.infer<typeof authSchemas.register>;
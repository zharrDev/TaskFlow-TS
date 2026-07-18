import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  roleId: z.number().int().positive('Role ID must be a positive integer'),
  phoneNumber: z.string().max(20).optional(),
  bio: z.string().max(500).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email('Invalid email format').optional(),
  roleId: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
  phoneNumber: z.string().max(20).optional(),
  bio: z.string().max(500).optional(),
});

export const updateProfileSchema = z.object({
  phoneNumber: z.string().max(20).optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
  name: z.string().min(2).max(100).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

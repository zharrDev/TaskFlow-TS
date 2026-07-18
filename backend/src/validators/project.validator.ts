import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters').max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(['PLANNING', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
  startDate: z.string().datetime({ offset: true }).optional().or(z.string().optional()),
  endDate: z.string().datetime({ offset: true }).optional().or(z.string().optional()),
});

export const updateProjectSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  status: z.enum(['PLANNING', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

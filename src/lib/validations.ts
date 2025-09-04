import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['patient', 'doctor']),
  genotype: z.string().optional(),
  bio: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const postSchema = z.object({
  content: z
    .string()
    .min(1, 'Post content is required')
    .max(1000, 'Post content must be less than 1000 characters'),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment is required')
    .max(500, 'Comment must be less than 500 characters'),
});

export const profileUpdateSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  genotype: z.string().optional(),
});

export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  type: z.enum(['posts', 'users', 'all']).optional(),
});

export type AuthFormData = z.infer<typeof authSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type PostFormData = z.infer<typeof postSchema>;
export type CommentFormData = z.infer<typeof commentSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
export type SearchFormData = z.infer<typeof searchSchema>;

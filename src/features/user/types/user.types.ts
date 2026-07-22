import { z } from "zod";

export const userProfileSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  email: z.string().email(),
  role: z.string().optional(),
  avatar_url: z.string(),
  address: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  created_at: z.string().optional(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

export interface UserProfileResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: UserProfile;
}

export const updateProfileInputSchema = z.object({
  full_name: z.string().min(3, "Name must be at least 3 characters").max(50).optional(),
  avatar_url: z.string().url("Invalid URL format").optional().or(z.literal("")),
  address: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>;

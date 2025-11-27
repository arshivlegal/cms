import { z } from "zod";

export const blogCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),

  // Manual editor sends JSON string → no strict validation here
  content: z.string().optional(),
description: z.string().optional().default(""),
  category: z.string().optional().default("General"),

  tags: z.array(z.string()).optional().default([]),

  thumbnail: z.string().url("Invalid thumbnail URL").optional().or(z.literal("")),

  thumbnailPublicId: z.string().optional().or(z.literal("")),
});

export const blogUpdateSchema = blogCreateSchema.partial().refine(
  (obj) => Object.keys(obj).length > 0,
  { message: "At least one field must be provided for update" }
);

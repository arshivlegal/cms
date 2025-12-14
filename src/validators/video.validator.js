import { z } from "zod";

export const videoCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  platform: z.enum(["youtube", "instagram", "facebook", "linkedin", "twitter"]),
  redirectUrl: z.string().url(),
  description: z.string().optional(),

  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),

  thumbnail: z.string().optional(),
  thumbnailPublicId: z.string().optional(),
});


// Update schema


export const videoUpdateSchema = videoCreateSchema.partial().refine(
  (obj) => Object.keys(obj).length > 0,
  { message: "At least one field must be provided for update" }
);

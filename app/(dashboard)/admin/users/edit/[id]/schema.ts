import { z } from "zod";

export const editUserSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  role: z.enum(["admin", "teacher", "student"] as const, {
    error: (iss) =>
      iss.input === undefined ? "Please select a role" : undefined,
  }),
});

export type EditUserFormData = z.infer<typeof editUserSchema>;

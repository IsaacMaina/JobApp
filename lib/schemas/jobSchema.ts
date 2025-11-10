import { z } from "zod";

export const jobFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().min(1, "Location is required"),
  type: z.string().min(1, "Job type is required"),
  description: z.string().min(1, "Description is required"),
  salary: z
    .preprocess(
      (val) => {
        if (val === "" || val === undefined || val === null) return null;
        const num = Number(val);
        return isNaN(num) ? null : num;
      },
      z.number().int().nonnegative().nullable()
    )
    .transform((v) => (v === undefined ? null : v)), // 👈 ensures consistent type
});

export type JobFormData = z.infer<typeof jobFormSchema>;

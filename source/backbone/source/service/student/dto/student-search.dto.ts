import z from "zod";
import { StudentGenderSchema } from "../../../schemas/student/student.schema";

export const StudentSearchQueryDtoSchema = z.object({
  search: z.string().optional(),

  course: z.string().optional(),
  year: z.string().optional(),
  gender: StudentGenderSchema.optional(),

  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),

  sortBy: z
    .enum(["name", "admissionNumber", "course", "year"])
    .default("name"),

  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type StudentSearchQueryDto = z.infer<typeof StudentSearchQueryDtoSchema>;

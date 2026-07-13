import type z from "zod/v3";
import { StudentSchema } from "../../../schemas/student/student.schema";

export const StudentCreateDtoSchema = StudentSchema.pick({
  name: true,
  cource: true,
  year: true,
  dob: true,
  email: true,
  phone: true,
  gender: true,
  address: true
})

export type StudentCreateDto = z.infer<typeof StudentCreateDtoSchema>;

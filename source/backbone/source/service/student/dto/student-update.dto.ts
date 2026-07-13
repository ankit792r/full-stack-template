import type z from "zod";
import { StudentSchema } from "../../../schemas/student/student.schema";

export const StudentUpdateDtoSchema = StudentSchema.pick({
  address: true,
  admissionNumber: true,
  cource: true,
  dob: true,
  email: true,
  gender: true,
  name: true,
  phone: true,
  year: true,
})

export type StudentUpdateDto = z.infer<typeof StudentUpdateDtoSchema>

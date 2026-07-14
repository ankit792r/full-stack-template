import type z from "zod";
import { StudentSchema } from "../../../schemas/student/student.schema";

export const StudentFullResponseDtoSchema = StudentSchema.pick({
  _id: true,
  address: true,
  admissionNumber: true,
  course: true,
  dob: true,
  email: true,
  gender: true,
  name: true,
  phone: true,
  profileImageUrl: true,
  year: true,
});

export type StudentFullResponseDto = z.infer<typeof StudentFullResponseDtoSchema>;

export const StudentBasicResponseDtoSchema = StudentSchema.pick({
  _id: true,
  name: true,
  email: true,
  admissionNumber: true,
  profileImageUrl: true,
});

export type StudentBasicResponseDto = z.infer<typeof StudentBasicResponseDtoSchema>;

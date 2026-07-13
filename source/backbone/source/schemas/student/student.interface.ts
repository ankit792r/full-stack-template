import type { Student, StudentId } from "./student.schema";

export interface StudentRepositoryInterface {
  create(student: Student): Promise<void>;

  update(student: Student): Promise<void>;

  updatePartial(studentId: StudentId, student: Partial<Student>): Promise<boolean>;

  delete(studentId: StudentId): Promise<void>;

  list(page: number, limit: number): Promise<Student[]>;

  getStudentById(studentId: StudentId): Promise<Student | null>
}

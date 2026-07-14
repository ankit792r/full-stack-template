import { AppError } from "../../runtime/errors/app-error";
import type { StudentRepositoryInterface } from "../../schemas/student/student.interface";
import {
  createStudentId,
  StudentSchema,
  type Student,
  type StudentId,
} from "../../schemas/student/student.schema";

import type { StudentCreateDto } from "./dto/student-create.dto";
import { StudentBasicResponseDtoSchema, StudentFullResponseDtoSchema, type StudentBasicResponseDto, type StudentFullResponseDto } from "./dto/student-response.dto";
import type { StudentUpdateDto } from "./dto/student-update.dto";
import StudentError from "./student.error";

export class StudentService {
  constructor(
    private readonly studentRepository: StudentRepositoryInterface,
  ) { }

  async createStudent(dto: StudentCreateDto): Promise<Student> {
    // TODO: Generate admission number from your own sequence logic.
    const admissionNumber = Date.now();

    const student = StudentSchema.parse({
      ...dto,
      _id: createStudentId(),
      admissionNumber,
    });

    await this.studentRepository.create(student);

    return student;
  }

  async getStudentById(
    id: StudentId,
  ): Promise<StudentFullResponseDto> {
    const student =
      await this.studentRepository.getStudentById(id);

    if (!student) {
      throw new AppError(StudentError.StudentNotFound);
    }

    return StudentFullResponseDtoSchema.parse(student);
  }

  async getStudentByIdOrThrow(
    id: StudentId,
  ): Promise<Student> {
    const student =
      await this.studentRepository.getStudentById(id);

    if (!student) {
      throw new AppError(StudentError.StudentNotFound);
    }

    return student;
  }

  async updateStudent(
    id: StudentId,
    dto: StudentUpdateDto,
  ): Promise<StudentFullResponseDto> {
    const existing = await this.getStudentByIdOrThrow(id);

    const updatedStudent = StudentSchema.parse({
      ...existing,
      ...dto,
    });

    await this.studentRepository.update(updatedStudent);

    return StudentFullResponseDtoSchema.parse(updatedStudent);
  }

  async updateStudentPartial(
    id: StudentId,
    dto: Partial<StudentUpdateDto>,
  ): Promise<boolean> {
    await this.getStudentByIdOrThrow(id);

    const updated = await this.studentRepository.updatePartial(id, dto);

    return updated;
  }

  async updateStudentProfileImage(
    id: StudentId,
    profileImageUrl: string,
  ): Promise<void> {
    await this.getStudentByIdOrThrow(id);

    await this.studentRepository.updatePartial(id, {
      profileImageUrl,
    });
  }

  async deleteStudent(id: StudentId): Promise<void> {
    await this.getStudentByIdOrThrow(id);

    await this.studentRepository.delete(id);
  }

  async listStudents(
    page: number,
    limit: number,
  ): Promise<StudentBasicResponseDto[]> {
    const students =
      await this.studentRepository.list(page, limit);

    return students.map((student) =>
      StudentBasicResponseDtoSchema.parse(student),
    );
  }
}

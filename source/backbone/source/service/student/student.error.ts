import type { AppErrorParams } from "../../runtime/errors/app-error";

const StudentError = {
  StudentCreationFailed: {
    code: "student_creation_failed",
    message: "Student creation failed",
    statusCode: 500,
  },
  StudentAlreadyExists: {
    code: "student_already_exists",
    message: "Student already exists",
    statusCode: 400,
  },
  StudentNotFound: {
    code: "student_not_found",
    message: "Student not found",
    statusCode: 404,
  },
} as const satisfies Record<string, AppErrorParams>;

export type StudentErrorCodes = (typeof StudentError)[keyof typeof StudentError]["code"];

export default StudentError;

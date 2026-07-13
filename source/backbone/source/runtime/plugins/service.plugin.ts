import { type FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import type { DependencyOverrides } from "../app";
import { UserService } from "../../service/user/user.service";
import { AuthService } from "../../service/auth/auth.service";
import { StudentService } from "../../service/student/student.service";

export default fp(
  async (fastify: FastifyInstance, overrides: DependencyOverrides) => {
    fastify.log.info("plugging: SERVICE in app");

    const userService =
      overrides.userService ?? new UserService(fastify.userRepository);
    const authService = overrides.authService ?? new AuthService(userService);
    const studentService = overrides.studentService ?? new StudentService(fastify.studentRepository);

    fastify.decorate("userService", userService);
    fastify.decorate("authService", authService);
    fastify.decorate("studentService", studentService);
  },
  { name: "service", dependencies: ["repository", "cache", "storage"] },
);

declare module "fastify" {
  interface FastifyInstance {
    userService: UserService;
    authService: AuthService;
    studentService: StudentService
  }
}

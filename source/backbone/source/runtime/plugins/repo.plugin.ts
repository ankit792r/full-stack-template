import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import type { DependencyOverrides } from "../app";
import { UserRepository as MongoUserRepo } from "../../modules/mongodb/user.repository";
import type { UserRepositoryInterface } from "../../schemas/user/user.interface";
import { createCollection } from "../../modules/mongodb/collection";
import { UserCollectionConfig, type User } from "../../schemas/user/user.schema";
import { StudentCollectionConfig, type Student } from "../../schemas/student/student.schema";
import type { StudentRepositoryInterface } from "../../schemas/student/student.interface";
import { MongoStudentRepository } from "../../modules/mongodb/student.repository";



export default fp(
  async (fastify: FastifyInstance, overrides: DependencyOverrides) => {
    fastify.log.info("plugging: REPO into app");


    const userCollection = await createCollection<User>(UserCollectionConfig, fastify.mongoClient!);
    const userRepository: UserRepositoryInterface = overrides.userRepository ?? new MongoUserRepo(userCollection);

    const studentCollection = await createCollection<Student>(StudentCollectionConfig, fastify.mongoClient!);
    const studentRepository: StudentRepositoryInterface = overrides.studentRepository ?? new MongoStudentRepository(studentCollection);


    // const userRepository: UserRepositoryInterface = 
    //   overrides.userRepository ??
    //   (env.DEFAULT_DB === "mongodb"
    //     ? 
    //       new MongoUserRepo(
    //       await createCollection(UserCollectionConfig, fastify.mongoClient!)
    //     )
    //     : new PgUserRepo(
    //       await createTable(UserTableConfig, fastify.postgresClient!)
    //     ));

    fastify.decorate("userRepository", userRepository);
    fastify.decorate("studentRepository", studentRepository);

  },
  { name: "repository", dependencies: ["db"] },
);

declare module "fastify" {
  interface FastifyInstance {
    userRepository: UserRepositoryInterface
    studentRepository: StudentRepositoryInterface
  }
}

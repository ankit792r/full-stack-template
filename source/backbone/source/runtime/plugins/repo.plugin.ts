import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import type { DependencyOverrides } from "../app";
import { env } from "../../configs/env";
import { UserRepository as MongoUserRepo } from "../../modules/mongodb/user.repository";
import { UserRepository as PgUserRepo } from "../../modules/postgres/user.repository";
import type { UserRepositoryInterface } from "../../schemas/user/user.interface";
import { createCollection } from "../../modules/mongodb/collection";
import { createTable } from "../../modules/postgres/table";
import { UserCollectionConfig, UserTableConfig } from "../../schemas/user/user.schema";

export default fp(
  async (fastify: FastifyInstance, overrides: DependencyOverrides) => {
    fastify.log.info("plugging: REPO into app");

    const userRepository: UserRepositoryInterface =
      overrides.userRepository ??
      (env.DEFAULT_DB === "mongodb"
        ? new MongoUserRepo(
          await createCollection(UserCollectionConfig, fastify.mongoClient!)
        )
        : new PgUserRepo(
          await createTable(UserTableConfig, fastify.postgresClient!)
        ));

    fastify.decorate("userRepository", userRepository);
  },
  { name: "repository", dependencies: ["db"] },
);

declare module "fastify" {
  interface FastifyInstance {
    userRepository: UserRepositoryInterface
  }
}

import { type FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import type { DependencyOverrides } from "../app";
import { createMongoClient } from "../../configs/mongo";
import { env } from "../../configs/env";
import { createPostgresClient } from "../../configs/postgres";
import type { MongoClient } from "mongodb";
import type { Client as PgClient } from "pg";

export default fp(async (fastify: FastifyInstance, overrides: DependencyOverrides) => {
  fastify.log.info("plugging: DB into app");

  if (env.DEFAULT_DB === "mongodb") {
    fastify.decorate(
      "mongoClient",
      overrides.mongoClient ?? (await createMongoClient()),
    );
  }

  if (env.DEFAULT_DB === "postgres") {
    fastify.decorate(
      "postgresPool",
      overrides.postgresClient ?? (await createPostgresClient()),
    );
  }
}, { name: "db", });

declare module "fastify" {
  interface FastifyInstance {
    mongoClient?: MongoClient;
    postgresClient?: PgClient;
  }
}

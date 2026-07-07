import { type FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import type { DependencyOverrides } from "../app";
import type { Collection } from "mongodb";
import { createCollection } from "../../modules/mongo/collection";
import { UserCollectionConfig, type User } from "../../schemas/user.schema";

export default fp(
  async (fastify: FastifyInstance, overrides: DependencyOverrides) => {
    fastify.log.info("plugging: REPO into app");

    const userCollection =
      overrides.userCollection ??
      (await createCollection<User>(UserCollectionConfig, fastify.mongoClient));

    fastify.decorate("userCollection", userCollection);
  },
  { name: "collection", dependencies: ["db"] },
);

declare module "fastify" {
  interface FastifyInstance {
    userCollection: Collection<User>;
  }
}

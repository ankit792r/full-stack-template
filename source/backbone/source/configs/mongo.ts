import { MongoClient } from "mongodb";
import { env } from "./env.ts";

export const createMongoClient = async () => {
  const mongoClient = new MongoClient(env.MONGODB_URI, {
    appName: env.APP_NAME,
  });
  await mongoClient.connect();
  return mongoClient;
}

import type { Collection, Document, MongoClient } from "mongodb";
import type { ZodType } from "zod";
import type { Client, QueryResult } from "pg";

export type CollectionConfig<T extends Document> = {
  name: string;
  primaryKey: string & keyof T;
  indices: string[];
  schema: ZodType<T>;
  schemaVersion: number;
};

export type CollectionCreateOption = {
  dbName?: string;
};

export async function createCollection<T extends Document>(
  collectionConfig: CollectionConfig<T>,
  mongoClient: MongoClient,
  option?: CollectionCreateOption,
): Promise<Collection<T>> {
  const database = mongoClient.db();
  const collection = database.collection<T>(collectionConfig.name);
  // TODO: collection.createIndex()
  return collection;
}

export interface TableConfig<T> {
  name: string;
  schema: ZodType<T>;
  primaryKey: keyof T;
}

export interface Table<T> {
  client: Client,
  config: TableConfig<T>;

  query<R extends QueryResult>(
    sql: string,
    params?: unknown[]
  ): Promise<QueryResult<R>>;
}

export async function createTable<T>(
  config: TableConfig<T>,
  client: Client,
): Promise<Table<T>> {
  return {
    client,
    config,

    query(sql, params) {
      return client.query(sql, params);
    },
  };
}

import type { Client, QueryResult } from "pg";
import type { ZodType } from "zod";

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
  // TODO: here we have to create table if not exists in db
  return {
    client,
    config,

    query(sql, params) {
      return client.query(sql, params);
    },
  };
}

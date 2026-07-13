import type { UserRepositoryInterface } from "../../schemas/user/user.interface";
import type { User, UserId } from "../../schemas/user/user.schema";
import { mapRowToUser } from "./helper";
import type { Table } from "../../schemas/collection";

export class UserRepository implements UserRepositoryInterface {
  constructor(
    private readonly userTable: Table<User>
  ) { }

  create(user: User): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findById(id: UserId): Promise<User | null> {
    throw new Error("Method not implemented.");
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.userTable.query(
      `SELECT * FROM users WHERE email = $1`,
      [email],
    );

    return result.rows.length
      ? mapRowToUser(result.rows[0])
      : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const result = await this.userTable.query(
      `SELECT * FROM users WHERE username = $1`,
      [username],
    );

    return result.rows.length
      ? mapRowToUser(result.rows[0])
      : null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const result = await this.userTable.query(
      `SELECT EXISTS(
        SELECT 1 FROM users WHERE email = $1
     )`,
      [email],
    );

    return result.rows[0].exists;
  }

  async existsByUsername(username: string): Promise<boolean> {
    const result = await this.userTable.query(
      `SELECT EXISTS(
        SELECT 1 FROM users WHERE username = $1
     )`,
      [username],
    );

    return result.rows[0].exists;
  }

  async update(user: User): Promise<void> {
    await this.userTable.query(
      `
    UPDATE users SET
      name=$2,
      username=$3,
      email=$4,
      email_verified=$5,
      profile_image=$6,
      bio=$7,
      password=$8,
      created_at=$9,
      updated_at=$10
    WHERE id=$1
    `,
      [
        user._id,
        user.name,
        user.username,
        user.email,
        user.emailVerified,
        user.profileImage,
        user.bio,
        user.password,
        user.createdAt,
        user.updatedAt,
      ],
    );
  }

  async updatePartial(
    id: UserId,
    updates: Partial<User>,
  ): Promise<boolean> {
    const columnMap: Record<keyof Partial<User>, string> = {
      name: "name",
      username: "username",
      email: "email",
      emailVerified: "email_verified",
      profileImage: "profile_image",
      bio: "bio",
      password: "password",
      createdAt: "created_at",
      updatedAt: "updated_at",
      _id: "id",
    };

    const entries = Object.entries(updates).filter(
      ([k, v]) => k !== "_id" && v !== undefined,
    );

    if (!entries.length) return true;

    const values: unknown[] = [];
    const sets = entries.map(([key, value], i) => {
      values.push(value);
      return `${columnMap[key as keyof User]} = $${i + 2}`;
    });

    values.unshift(id);

    const result = await this.userTable.query(
      `
    UPDATE users
    SET ${sets.join(", ")}
    WHERE id = $1
    `,
      values,
    );

    return (result.rowCount ?? 0) > 0;
  }

  async delete(id: UserId): Promise<void> {
    await this.userTable.query(
      `DELETE FROM users WHERE id = $1`,
      [id],
    );
  }
}

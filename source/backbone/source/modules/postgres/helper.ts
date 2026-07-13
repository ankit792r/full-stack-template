import { UserSchema, type User } from "../../schemas/user/user.schema";

export function mapRowToUser(row: any): User {
  return UserSchema.parse({
    _id: row.id,
    name: row.name,
    username: row.username,
    email: row.email,
    emailVerified: row.email_verified,
    profileImage: row.profile_image,
    bio: row.bio,
    password: row.password,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

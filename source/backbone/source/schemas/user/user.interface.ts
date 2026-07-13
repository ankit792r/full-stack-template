import type { User, UserId } from "./user.schema";

export interface UserRepositoryInterface {
  create(user: User): Promise<void>;

  findById(id: UserId): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  findByUsername(username: string): Promise<User | null>;

  existsByEmail(email: string): Promise<boolean>;

  existsByUsername(username: string): Promise<boolean>;

  update(user: User): Promise<void>;

  updatePartial(
    id: UserId,
    updates: Partial<User>,
  ): Promise<boolean>;

  delete(id: UserId): Promise<void>;
}

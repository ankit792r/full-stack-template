import type { Collection } from "mongodb";
import type { UserRepositoryInterface } from "../../schemas/user/user.interface";
import type { User, UserId } from "../../schemas/user/user.schema";

export class UserRepository implements UserRepositoryInterface {
  constructor(
    private readonly collection: Collection<User>,
  ) { }

  async create(user: User) {
    await this.collection.insertOne(user);
  }

  async findById(id: UserId) {
    return this.collection.findOne({ _id: id });
  }

  async findByEmail(email: string) {
    return this.collection.findOne({ email });
  }

  async findByUsername(username: string) {
    return this.collection.findOne({ username });
  }

  async existsByEmail(email: string) {
    return (await this.collection.countDocuments({ email })) > 0;
  }

  async existsByUsername(username: string) {
    return (
      await this.collection.countDocuments({ username })
    ) > 0;
  }

  async update(user: User) {
    await this.collection.replaceOne(
      { _id: user._id },
      user,
    );
  }

  async updatePartial(
    id: UserId,
    updates: Partial<User>,
  ): Promise<boolean> {
    const result = await this.collection.updateOne(
      { _id: id },
      {
        $set: updates,
      },
    );

    return result.matchedCount > 0;
  }

  async delete(id: UserId) {
    await this.collection.deleteOne({ _id: id });
  }
}

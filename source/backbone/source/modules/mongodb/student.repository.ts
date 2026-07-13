import type { Collection } from "mongodb";
import type { StudentRepositoryInterface } from "../../schemas/student/student.interface";
import type { Student, StudentId } from "../../schemas/student/student.schema";

export class MongoStudentRepository implements StudentRepositoryInterface {
  constructor(
    private readonly collection: Collection<Student>,
  ) { }

  async create(student: Student): Promise<void> {
    await this.collection.insertOne(student);
  }

  async update(student: Student): Promise<void> {
    await this.collection.replaceOne(
      { _id: student._id },
      student,
    );
  }

  async updatePartial(
    studentId: StudentId,
    student: Partial<Student>,
  ): Promise<boolean> {
    const res = await this.collection.updateOne(
      { _id: studentId },
      {
        $set: student,
      },
    );

    return res.matchedCount > 0;
  }

  async delete(studentId: StudentId): Promise<void> {
    await this.collection.deleteOne({ _id: studentId });
  }

  // TODO: can be implemented with cursor based pagination
  async list(
    page: number,
    limit: number,
  ): Promise<Student[]> {
    const skip = (page - 1) * limit;

    return this.collection
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();
  }

  async getStudentById(
    studentId: StudentId,
  ): Promise<Student | null> {
    return this.collection.findOne({ _id: studentId });
  }
}

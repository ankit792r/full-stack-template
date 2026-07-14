import type { Collection } from "mongodb";
import type { StudentRepositoryInterface } from "../../schemas/student/student.interface";
import type { Student, StudentId } from "../../schemas/student/student.schema";
import type { StudentSearchQueryDto } from "../../service/student/dto/student-search.dto";
import type { StudentAnalyticsResponseDto } from "../../service/student/dto/student-analytics.dto";

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

  search(dto: StudentSearchQueryDto): Promise<Student[]> {
    const query: any = {};

    if (dto.search) {
      query.$or = [
        { name: { $regex: dto.search, $options: "i" } },
        { email: { $regex: dto.search, $options: "i" } },
        { phone: { $regex: dto.search, $options: "i" } },
        {
          admissionNumber: Number(dto.search) || -1,
        },
      ];
    }

    if (dto.course)
      query.course = dto.course;

    if (dto.year)
      query.year = dto.year;

    if (dto.gender)
      query.gender = dto.gender;

    return this.collection
      .find(query)
      .sort({
        [dto.sortBy]:
          dto.sortOrder === "asc" ? 1 : -1,
      })
      .skip((dto.page - 1) * dto.limit)
      .limit(dto.limit)
      .toArray();
  }
  async analytics(): Promise<StudentAnalyticsResponseDto> {
    const totalStudents =
      await this.collection.countDocuments();

    const genderAgg = await this.collection
      .aggregate([
        {
          $group: {
            _id: "$gender",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const courseAgg = await this.collection
      .aggregate([
        {
          $group: {
            _id: "$course",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const yearAgg = await this.collection
      .aggregate([
        {
          $group: {
            _id: "$year",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    return {
      totalStudents,

      gender: {
        male:
          genderAgg.find(x => x._id === "male")
            ?.count ?? 0,

        female:
          genderAgg.find(x => x._id === "female")
            ?.count ?? 0,
      },

      byCourse: courseAgg.map(x => ({
        course: x._id,
        count: x.count,
      })),

      byYear: yearAgg.map(x => ({
        year: x._id,
        count: x.count,
      })),
    };
  }
}

// dto/student-analytics.dto.ts

import z from "zod";

export const StudentAnalyticsResponseDtoSchema = z.object({
  totalStudents: z.number().optional(),
  gender: z.object({
    male: z.number().default(0),
    female: z.number().default(0)
  }),
  byCourse: z.array(z.object({
    course: z.string(),
    count: z.number().default(0)
  })),
  byYear: z.array(z.object({

    year: z.string(),
    count: z.number().default(0)
  }))
})

export type StudentAnalyticsResponseDto = z.infer<typeof StudentAnalyticsResponseDtoSchema>

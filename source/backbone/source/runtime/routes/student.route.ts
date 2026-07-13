import type { FastifyInstance } from "fastify";
import type { FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi";
import z from "zod";

import { ErrorResponseDtoSchema } from "../errors/error-dto";
import {
  StudentCreateDtoSchema,
} from "../../service/student/dto/student-create.dto";
import {
  StudentUpdateDtoSchema,
} from "../../service/student/dto/student-update.dto";

import {
  ImageExtensionMime,
  parseFormFileToBuffer,
} from "../../service/upload-handler";

import { createProfileImageId } from "../../schemas/blob-id";
import { StudentBasicResponseDtoSchema, StudentFullResponseDtoSchema } from "../../service/student/dto/student-response.dto";

export default async function(fastify: FastifyInstance) {
  const server =
    fastify.withTypeProvider<FastifyZodOpenApiTypeProvider>();

  server.addHook("onRequest", fastify.authenticate);

  server.route({
    method: "POST",
    url: "/students",
    schema: {
      tags: ["Students"],
      summary: "Create student",
      security: [{ bearerAuth: [] }],
      body: StudentCreateDtoSchema,
      response: {
        200: StudentFullResponseDtoSchema,
        default: ErrorResponseDtoSchema,
      },
    },
    handler: async (request, reply) => {
      const student =
        await fastify.studentService.createStudent(request.body);

      return reply.send(student);
    },
  });

  server.route({
    method: "GET",
    url: "/students/:id",
    schema: {
      tags: ["Students"],
      summary: "Get student",
      security: [{ bearerAuth: [] }],
      params: z.object({
        id: z.string(),
      }),
      response: {
        200: StudentFullResponseDtoSchema,
        default: ErrorResponseDtoSchema,
      },
    },
    handler: async (request, reply) => {
      const student =
        await fastify.studentService.getStudentById(
          request.params.id as any,
        );

      return reply.send(student);
    },
  });

  server.route({
    method: "PUT",
    url: "/students/:id",
    schema: {
      tags: ["Students"],
      summary: "Update student",
      security: [{ bearerAuth: [] }],
      params: z.object({
        id: z.string(),
      }),
      body: StudentUpdateDtoSchema,
      response: {
        200: StudentFullResponseDtoSchema,
        default: ErrorResponseDtoSchema,
      },
    },
    handler: async (request, reply) => {
      const student =
        await fastify.studentService.updateStudent(
          request.params.id as any,
          request.body,
        );

      return reply.send(student);
    },
  });

  server.route({
    method: "PATCH",
    url: "/students/:id",
    schema: {
      tags: ["Students"],
      summary: "Partially update student",
      security: [{ bearerAuth: [] }],
      params: z.object({
        id: z.string(),
      }),
      body: StudentUpdateDtoSchema.partial(),
      response: {
        204: z.null(),
        default: ErrorResponseDtoSchema,
      },
    },
    handler: async (request, reply) => {
      await fastify.studentService.updateStudentPartial(
        request.params.id as any,
        request.body,
      );

      return reply.status(204).send(null);
    },
  });

  server.route({
    method: "DELETE",
    url: "/students/:id",
    schema: {
      tags: ["Students"],
      summary: "Delete student",
      security: [{ bearerAuth: [] }],
      params: z.object({
        id: z.string(),
      }),
      response: {
        204: z.null(),
        default: ErrorResponseDtoSchema,
      },
    },
    handler: async (request, reply) => {
      await fastify.studentService.deleteStudent(
        request.params.id as any,
      );

      return reply.status(204).send(null);
    },
  });

  server.route({
    method: "GET",
    url: "/students",
    schema: {
      tags: ["Students"],
      summary: "List students",
      security: [{ bearerAuth: [] }],
      querystring: z.object({
        page: z.coerce.number().default(1),
        limit: z.coerce.number().default(10),
      }),
      response: {
        200: z.array(StudentBasicResponseDtoSchema),
        default: ErrorResponseDtoSchema,
      },
    },
    handler: async (request, reply) => {
      const students =
        await fastify.studentService.listStudents(
          request.query.page,
          request.query.limit,
        );

      return reply.send(students);
    },
  });

  server.route({
    method: "POST",
    url: "/students/:id/update-profile",
    schema: {
      tags: ["Students"],
      summary: "Update student profile image",
      security: [{ bearerAuth: [] }],
      params: z.object({
        id: z.string(),
      }),
      response: {
        200: z.string(),
        default: ErrorResponseDtoSchema,
      },
    },
    handler: async (request, reply) => {
      const uploadedFile = await parseFormFileToBuffer(request, {
        allowedExtensions: [
          ImageExtensionMime.PNG.ext,
          ImageExtensionMime.JPEG.ext,
        ],
        allowedMimeTypes: [
          ImageExtensionMime.PNG.mime,
          ImageExtensionMime.JPEG.mime,
        ],
        maxFileSize: 10 * 1024 * 1024,
        multipleFile: false,
      });

      const profileImageId = createProfileImageId();
      const filePath =
        `${profileImageId}${uploadedFile.fileExtension}`;

      await fastify.profileBlobStorage.upload(
        filePath,
        uploadedFile.buffer,
        uploadedFile.mimetype,
      );

      const publicUrl =
        fastify.profileBlobStorage.getPublicUrl(filePath);

      await fastify.studentService.updateStudentProfileImage(
        request.params.id as any,
        publicUrl,
      );

      return reply.send(publicUrl);
    },
  });
}

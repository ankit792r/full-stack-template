
import { z } from "zod";
import { UserIdSchema } from "../../../schemas/user.schema";

export const UserIdParamDtoSchema = z.object({
    id: UserIdSchema,
});

export type UserIdParamDto = z.infer<typeof UserIdParamDtoSchema>;

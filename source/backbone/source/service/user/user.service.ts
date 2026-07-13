import type { UserCreateDto } from "./dto/user-create.dto";
import UserError from "./user.error";
import { AppError } from "../../runtime/errors/app-error";
import { hashPassword } from "../../utility/pass-hash";
import type { UserUpdateDto } from "./dto/user-update.dto";
import {
  UserBasicResponseDtoSchema,
  type UserBasicResponseDto,
} from "./dto/user-response.dto";
import type { UserRepositoryInterface } from "../../schemas/user/user.interface";
import { createUserId, UserSchema, type User, type UserId } from "../../schemas/user/user.schema";

export class UserService {
  constructor(private readonly userRepository: UserRepositoryInterface) { }

  async createUser(dto: UserCreateDto): Promise<User> {
    if (await this.userRepository.existsByEmail(dto.email)) {
      throw new AppError(UserError.UserAlreadyExists);
    }

    if (await this.userRepository.existsByUsername(dto.username)) {
      throw new AppError(UserError.UsernameTaken);
    }

    const user = UserSchema.parse({
      ...dto,
      _id: createUserId(),
      emailVerified: false,
      password: await hashPassword(dto.password),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.userRepository.create(user);

    return user;
  }

  async updateBasicInfo(
    id: UserId,
    dto: UserUpdateDto,
  ): Promise<UserBasicResponseDto> {
    const updated = await this.userRepository.updatePartial(id, {
      ...dto,
      updatedAt: new Date(),
    });

    if (!updated) {
      throw new AppError(UserError.UserNotFound);
    }

    const user = await this.userRepository.findById(id);

    return UserBasicResponseDtoSchema.parse(user);
  }

  async getUserBasicInfoById(
    id: UserId,
  ): Promise<UserBasicResponseDto> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError(UserError.UserNotFound);
    }

    return UserBasicResponseDtoSchema.parse(user);
  }

  async getUserBasicInfoByUsername(
    username: string,
  ): Promise<UserBasicResponseDto> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new AppError(UserError.UserNotFound);
    }

    return UserBasicResponseDtoSchema.parse(user);
  }


  async checkUsernameAvailability(
    username: string,
  ): Promise<boolean> {
    const exists =
      await this.userRepository.existsByUsername(username);

    if (exists) {
      throw new AppError(UserError.UsernameTaken);
    }

    return true;
  }

  async getUserByEmailOrThrow(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError(UserError.UserNotFound);
    }

    return user;
  }

  async getUserByUsernameOrThrow(
    username: string,
  ): Promise<User> {
    const user =
      await this.userRepository.findByUsername(username);

    if (!user) {
      throw new AppError(UserError.UserNotFound);
    }

    return user;
  }

  async getUserByIdOrThrow(id: UserId): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError(UserError.UserNotFound);
    }

    return user;
  }

  async updateUserProfileImage(
    id: UserId,
    publicPath: string,
  ): Promise<void> {
    const updated = await this.userRepository.updatePartial(id, {
      profileImage: publicPath,
      updatedAt: new Date(),
    });

    if (!updated) {
      throw new AppError(UserError.UserNotFound);
    }
  }
}

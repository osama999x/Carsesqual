import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class RegisterUserProvider {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Creates a new user after validating and hashing the password.
   * @param createUserDto - DTO containing user details.
   * @returns The created user document.
   */
  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    // Check if email already exists
    const existingUser = await this.prisma.users.findFirst({ where: { email, deleted_at: null } });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }
    const user = await this.prisma.users.create({
      data: {
        user_name: createUserDto.userName,
        phone_number: createUserDto.phoneNumber,
        email: createUserDto.email,
        password: createUserDto.password,
      },
    });
    return user;
  }
}

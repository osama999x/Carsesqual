import { Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class FindOneUserByEmailProvider {
  constructor(private readonly prisma: PrismaService) { }

  public async findByEmail(email: string) {
    let user: any | undefined = undefined;
    try {
      user = await this.prisma.users.findFirst({ where: { email, deleted_at: null } });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not fetch the user',
      });
    }
    //throw an exception user not found
    if (!user) {
      throw new UnauthorizedException('User not exist');
    }
    return user;
  }
}

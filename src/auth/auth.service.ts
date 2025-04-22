import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { LoginDto } from './dto';
import { CreateUserDto } from 'prisma/generated/user/dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async register(dto: CreateUserDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: dto.password,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException(
      'Credentials incorrect',
    );


    if (dto.password !== user.password) throw new ForbiddenException(
      'Credentials incorrect',
    )

    return { msg: "Login Successful" };
  }
}

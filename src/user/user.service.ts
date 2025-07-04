import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserStatus } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        dateOfBirth: true,
        status: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return users;
  }

  async updateUserStatus(userId: string, status: UserStatus) {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          status,
        },
      });
    } catch (error) {
      console.error('Error updating user status: ', error);
      throw new Error(error);
    }
  }

  async activateUser(userId: string) {
    await this.updateUserStatus(userId, 'ACTIVE');
  }

  async deactivateUser(userId: string) {
    await this.updateUserStatus(userId, 'INACTIVE');
  }
}

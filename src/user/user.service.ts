import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserStatus } from '@prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';

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
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) throw new NotFoundException('User not found');

      return this.prisma.user.update({
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
    return this.updateUserStatus(userId, 'ACTIVE');
  }

  async deactivateUser(userId: string) {
    return this.updateUserStatus(userId, 'INACTIVE');
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    try {
      // Check if user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { role: true },
      });

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      // Check if email is already taken by another user
      if (updateProfileDto.email !== existingUser.email) {
        const emailExists = await this.prisma.user.findUnique({
          where: { email: updateProfileDto.email },
        });

        if (emailExists) {
          throw new ConflictException('Email already exists');
        }
      }

      // Update user profile
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          firstName: updateProfileDto.firstName,
          lastName: updateProfileDto.lastName,
          email: updateProfileDto.email,
          phoneNumber: updateProfileDto.phoneNumber,
          dateOfBirth: updateProfileDto.dateOfBirth,
        },
        include: {
          role: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      });

      return {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        dateOfBirth: updatedUser.dateOfBirth,
        status: updatedUser.status,
        role: updatedUser.role,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      console.error('Error updating user profile: ', error);
      throw new BadRequestException('Failed to update profile');
    }
  }
}

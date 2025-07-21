import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserStatus } from '@prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly firebase: FirebaseService,
  ) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    return users.map((user) => new UserEntity(user));
  }

  async getAllAdmins() {
    const admins = await this.prisma.user.findMany({
      where: { role: { name: 'admin' } },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    return admins.map((admin) => new UserEntity(admin));
  }

  async updateUserStatus(userId: string, status: UserStatus) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });

      if (!user) throw new NotFoundException('User not found');

      return this.prisma.user.update({
        where: { id: userId },
        data: { status },
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

  async updateProfile(authHeader: string, dto: UpdateProfileDto) {
    const idToken = authHeader.replace('Bearer ', '');
    const decodedToken = await this.firebase.getAuth().verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    // Check if email is already taken by another user
    const emailExists = await this.prisma.user.findFirst({
      where: {
        AND: [{ email: dto.email }, { email: { not: email } }],
      },
    });

    if (emailExists) {
      throw new ConflictException('Email already exists');
    }

    await this.firebase
      .getAuth()
      .updateUser(uid, {
        email: dto.email,
        displayName: `${dto.firstName} ${dto.lastName}`,
        phoneNumber: dto.phoneNumber,
      })
      .catch((error) => {
        throw new BadRequestException(
          'Firebase update failed: ',
          error.message,
        );
      });

    // Update user profile
    const updatedUser = await this.prisma.user
      .update({
        where: { firebaseUid: uid },
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          phoneNumber: dto.phoneNumber,
          dateOfBirth: dto.dateOfBirth,
        },
        include: {
          role: {
            include: {
              permissions: true,
            },
          },
        },
      })
      .catch((error) => {
        throw new BadRequestException(
          'Database update failed: ',
          error.message,
        );
      });

    return new UserEntity(updatedUser);
  }

  async updateRole(userId: string, roleId: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { roleId },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return new UserEntity(user);
  }
}

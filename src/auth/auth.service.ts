import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly firebase: FirebaseService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const defaultRole = await this.prisma.role.findFirst({
        where: { isDefault: true },
      });

      if (!defaultRole) {
        throw new NotFoundException('Default role is not found.');
      }

      const userRecord = await this.firebase.getAuth().createUser({
        displayName: `${dto.firstName} ${dto.lastName}`,
        email: dto.email,
        password: dto.password,
      });

      await this.prisma.user.create({
        data: {
          firebaseUid: userRecord.uid,
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phoneNumber: dto.phoneNumber,
          dateOfBirth: dto.dateOfBirth,
          roleId: defaultRole?.id,
        },
      });

      return { message: 'Register successful', uid: userRecord.uid };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Prisma: Credentials taken');
      }
      if (error instanceof Error) {
        throw new ForbiddenException(error);
      }
      throw error;
    }
  }
}

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UserEntity } from 'src/user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly firebase: FirebaseService,
  ) {}

  private async getDefaultRole() {
    const defaultRole = await this.prisma.role.findFirst({
      where: { isDefault: true },
    });

    if (!defaultRole) {
      throw new NotFoundException('Default role is not found.');
    }

    return defaultRole;
  }

  private async prismaCreateUser(firebaseUid: string, dto: RegisterDto) {
    try {
      const defaultRole = await this.getDefaultRole();

      const user = await this.prisma.user.create({
        data: {
          firebaseUid,
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phoneNumber: dto.phoneNumber,
          dateOfBirth: dto.dateOfBirth,
          roleId: defaultRole?.id,
        },
      });

      return new UserEntity(user);
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

  async register(dto: RegisterDto) {
    try {
      const userRecord = await this.firebase.getAuth().createUser({
        displayName: `${dto.firstName} ${dto.lastName}`,
        email: dto.email,
        password: dto.password,
        emailVerified: true, // temporary: needed for Google sign-in post-registration until email verification is implemented
      });

      await this.prismaCreateUser(userRecord.uid, dto);

      return { message: 'Register successful', uid: userRecord.uid };
    } catch (error) {
      if (error instanceof Error) {
        throw new ForbiddenException(error);
      }
      throw error;
    }
  }

  async googleSignIn(authHeader: string) {
    try {
      const idToken = authHeader.replace('Bearer ', '');
      const decodedToken = await this.firebase.getAuth().verifyIdToken(idToken);
      const { email } = decodedToken;

      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return { hasAccount: false };
      }

      return { hasAccount: true };
    } catch (error) {
      if (error instanceof Error) {
        throw new UnauthorizedException(error);
      }
      throw error;
    }
  }

  async googleRegister(authHeader: string, dto: RegisterDto) {
    try {
      const idToken = authHeader.replace('Bearer ', '');
      const decodedToken = await this.firebase.getAuth().verifyIdToken(idToken);
      const { uid } = decodedToken;

      await this.firebase.getAuth().updateUser(uid, {
        password: dto.password,
      });

      await this.prismaCreateUser(uid, dto);

      return { message: 'Register successful', uid };
    } catch (error) {
      if (error instanceof Error) {
        throw new UnauthorizedException(error);
      }
      throw error;
    }
  }
}

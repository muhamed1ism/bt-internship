import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from 'src/user/entity/user.entity';
import { User } from 'src/user/type/user.type';

@Injectable()
export class FirebaseJwtStrategy extends PassportStrategy(
  Strategy,
  'firebase-jwt',
) {
  constructor(
    private readonly firebase: FirebaseService,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async validate(req: Request): Promise<User | null> {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = await this.firebase.getAuth().verifyIdToken(token);
      const firebaseUid = decodedToken.uid;

      const user = await this.prisma.user.findUnique({
        where: { firebaseUid },
        include: {
          role: {
            include: {
              permissions: true,
            },
          },
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return new UserEntity(user);
    } catch (error) {
      console.error('Token verification failed:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}

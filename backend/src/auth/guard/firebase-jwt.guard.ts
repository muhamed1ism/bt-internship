import { AuthGuard } from '@nestjs/passport';

export class FirebaseJwtGuard extends AuthGuard('firebase-jwt') {
  constructor() {
    super();
  }
}

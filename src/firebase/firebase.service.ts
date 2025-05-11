import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as firebaseAdmin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  constructor(private readonly config: ConfigService) {}
  private firebaseApp: firebaseAdmin.app.App;

  onModuleInit() {
    const projectId = this.config.get('FIREBASE_PROJECT_ID');
    const clientEmail = this.config.get('FIREBASE_CLIENT_EMAIL');
    const privateKey = this.config.get('FIREBASE_PRIVATE_KEY');

    if (firebaseAdmin.apps.length === 0) {
      this.firebaseApp = firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey,
        }),
      });
    }
  }

  getAuth = () => firebaseAdmin.auth(this.firebaseApp);
  getFirestore = () => firebaseAdmin.firestore(this.firebaseApp);
}

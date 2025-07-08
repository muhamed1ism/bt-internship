import { User } from '../../user/entities/user.entity';
import { BucketLevel } from '../../bucket-level/entities/bucket-level.entity';

export class UserBucket {
  userId: string;
  bucketLevelId: string;
  user?: User;
  bucket?: BucketLevel;
}

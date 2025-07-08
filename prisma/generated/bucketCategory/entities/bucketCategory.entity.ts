import { BucketLevel } from '../../bucketLevel/entities/bucketLevel.entity';

export class BucketCategory {
  id: string;
  name: string;
  bucketLevels?: BucketLevel[];
}


import {BucketLevel} from '../../bucket-level/entities/bucket-level.entity'


export class BucketCategory {
  id: string ;
name: string ;
description: string  | null;
bucketLevels?: BucketLevel[] ;
}

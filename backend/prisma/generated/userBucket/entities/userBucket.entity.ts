
import {User} from '../../user/entities/user.entity'
import {BucketLevel} from '../../bucketLevel/entities/bucketLevel.entity'


export class UserBucket {
  userId: string ;
bucketId: string ;
user?: User ;
bucket?: BucketLevel ;
}

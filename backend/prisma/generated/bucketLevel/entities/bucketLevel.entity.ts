
import {BucketCategory} from '../../bucketCategory/entities/bucketCategory.entity'
import {UserBucket} from '../../userBucket/entities/userBucket.entity'


export class BucketLevel {
  id: string ;
level: number ;
expectations: string[] ;
skills: string[] ;
tools: string[] ;
knowledge: string[] ;
toAdvance: string[] ;
categoryId: string ;
category?: BucketCategory ;
userBuckets?: UserBucket[] ;
}

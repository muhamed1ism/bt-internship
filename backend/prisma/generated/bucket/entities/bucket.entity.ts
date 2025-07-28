
import {BucketCategory} from '../../bucket-category/entities/bucket-category.entity'
import {UserBucket} from '../../user-bucket/entities/user-bucket.entity'


export class Bucket {
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

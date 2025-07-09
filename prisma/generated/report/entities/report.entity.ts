
import {User} from '../../user/entities/user.entity'


export class Report {
  id: string ;
createdAt: Date ;
updatedAt: Date ;
content: string ;
userId: string ;
user?: User ;
authorId: string ;
author?: User ;
}

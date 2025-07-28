
import {UserStatus} from '@prisma/client'
import {Role} from '../../role/entities/role.entity'
import {UserBucket} from '../../user-bucket/entities/user-bucket.entity'
import {TeamMember} from '../../team-member/entities/team-member.entity'
import {Report} from '../../report/entities/report.entity'
import {Ticket} from '../../ticket/entities/ticket.entity'
import {Message} from '../../message/entities/message.entity'


export class User {
  id: string ;
firebaseUid: string ;
email: string ;
firstName: string ;
lastName: string ;
phoneNumber: string ;
dateOfBirth: Date ;
status: UserStatus ;
updatedAt: Date ;
createdAt: Date ;
role?: Role ;
roleId: string ;
buckets?: UserBucket[] ;
teams?: TeamMember[] ;
reports?: Report[] ;
authoredReports?: Report[] ;
tickets?: Ticket[] ;
authoredTickets?: Ticket[] ;
Message?: Message[] ;
}


import {TicketStatus} from '@prisma/client'
import {User} from '../../user/entities/user.entity'
import {Message} from '../../message/entities/message.entity'


export class Ticket {
  id: string ;
title: string ;
description: string ;
status: TicketStatus ;
createdAt: Date ;
updatedAt: Date ;
authorId: string ;
author?: User ;
employeeId: string ;
employee?: User ;
messages?: Message[] ;
}

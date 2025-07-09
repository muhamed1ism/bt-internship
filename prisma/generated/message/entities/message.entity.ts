
import {Ticket} from '../../ticket/entities/ticket.entity'
import {User} from '../../user/entities/user.entity'


export class Message {
  id: string ;
content: string ;
sender: string ;
timestamp: Date ;
createdAt: Date ;
updatedAt: Date ;
ticketId: string ;
ticket?: Ticket ;
senderId: string ;
senderUser?: User ;
}

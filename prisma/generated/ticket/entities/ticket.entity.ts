import { User } from '../../user/entities/user.entity';
import { Message } from '../../message/entities/message.entity';

export class Ticket {
  id: string;
  title: string;
  description: string;
  assignedAt: Date;
  assignedBy: string;
  createdAt: Date;
  updatedAt: Date;
  employeeId: string;
  employee?: User;
  messages?: Message[];
}

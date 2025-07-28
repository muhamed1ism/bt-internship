
import {Prisma} from '@prisma/client'
import {Role} from '../../role/entities/role.entity'


export class Permission {
  id: string ;
action: string ;
subject: string ;
conditions: Prisma.JsonValue  | null;
fields: string[] ;
reason: string  | null;
createdAt: Date ;
updatedAt: Date ;
conditionHash: string  | null;
fieldsHash: string  | null;
roles?: Role[] ;
}

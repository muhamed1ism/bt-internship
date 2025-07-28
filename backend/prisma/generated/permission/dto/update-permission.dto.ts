
import {Prisma} from '@prisma/client'




export class UpdatePermissionDto {
  action?: string;
subject?: string;
conditions?: Prisma.InputJsonValue;
fields?: string[];
reason?: string;
conditionHash?: string;
fieldsHash?: string;
}

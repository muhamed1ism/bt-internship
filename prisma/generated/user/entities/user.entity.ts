
import {Role} from '../../role/entities/role.entity'


export class User {
  id: string ;
firebaseUid: string ;
email: string ;
firstName: string ;
lastName: string ;
phoneNumber: string ;
dateOfBirth: Date ;
updatedAt: Date ;
createdAt: Date ;
role?: Role ;
roleId: string ;
}

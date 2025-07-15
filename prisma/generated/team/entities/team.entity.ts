
import {TeamStatus} from '@prisma/client'
import {TeamTechnology} from '../../team-technology/entities/team-technology.entity'
import {TeamMember} from '../../team-member/entities/team-member.entity'


export class Team {
  id: string ;
name: string ;
clientName: string ;
status: TeamStatus ;
startDate: Date ;
endDate: Date  | null;
projectDescription: string ;
documentation: string ;
githubLink: string ;
createdAt: Date ;
updatedAt: Date ;
technologies?: TeamTechnology[] ;
members?: TeamMember[] ;
}

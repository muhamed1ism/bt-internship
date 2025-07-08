import { User } from '../../user/entities/user.entity';
import { Team } from '../../team/entities/team.entity';

export class TeamMember {
  id: string;
  position: string;
  joinedAt: Date;
  userId: string;
  user?: User;
  teamId: string;
  team?: Team;
}

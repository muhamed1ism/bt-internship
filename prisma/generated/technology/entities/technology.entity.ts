import { Team } from '../../team/entities/team.entity';

export class Technology {
  id: string;
  name: string;
  teams?: Team[];
}

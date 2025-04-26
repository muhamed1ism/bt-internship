import { AvatarImage } from '@radix-ui/react-avatar';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { Card, CardFooter } from '../../components/ui/card';
import { UserSkill } from './UserSkill';

const FAKE_USERCARD = {
  id: 1,
  name: 'Jonas Schm',
  avatar: 'https://github.com/shadcn.png',
  skills: [
    { title: 'Bus Analysis', level: 5 },
    { title: 'Cloud Architect', level: 4 },
  ],
  currentGoals: [
    { title: 'Cloud Architect', level: 5 },
    { title: 'Cloud Architect', level: 6 },
  ],
  buttonText: 'See Full',
};

interface Skill {
  title: string;
  level: number;
}

interface Goal {
  title: string;
  level: number;
}

interface UserCardProp {
  name: string;
  avatarUrl: string;
  skills: Skill[];
  currentGoals: Goal[];
}

export const UserCard = ({ userInfo }: { userInfo: UserCardProp }) => {
  const user = userInfo || FAKE_USERCARD;

  return (
    <Card className="flex w-64 flex-col items-center gap-4 rounded-3xl border-2 border-black p-4 pt-8">
      <Avatar className="h-24 w-24 border-2 border-black">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback className="bg-white"></AvatarFallback>
      </Avatar>

      <div className="w-full text-center">
        <h3 className="mb-4 text-xl font-medium">{user.name}</h3>

        <div className="mb-6 flex flex-col gap-2">
          {user.skills.map((skill, i) => (
            <UserSkill
              skill={`${skill.level} ${skill.title}`}
              background={i % 2 === 0 ? 'bg-gray-200' : ''}
            />
          ))}
        </div>

        <div className="mb-4 text-left text-sm">
          <p className="font-medium">Current Goal:</p>
          {user.currentGoals.map((goal) => (
            <p>
              {goal.title} {goal.level}
            </p>
          ))}
        </div>
      </div>

      <CardFooter className="flex w-full flex-col p-0">
        <Button variant="outline" className="w-full rounded-md border-black">
          See Full
        </Button>
      </CardFooter>
    </Card>
  );
};

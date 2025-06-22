import type { UserCardProps } from '@app/types/shared';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { Card, CardFooter } from '../../components/ui/card';
import { UserSkill } from './UserSkill';
import { FAKE_USERCARD } from '@app/__mocks__/users';

export const UserCard = ({ userInfo }: { userInfo: UserCardProps }) => {
  const user = userInfo || FAKE_USERCARD;

  return (
    <Card className="flex w-64 flex-col items-center gap-4 rounded-3xl border-2 border-black p-4 pt-8">
      <Avatar className="h-24 w-24 border-2 border-black">
        <AvatarImage src={user.avatarUrl} />
        <AvatarFallback className="bg-white"></AvatarFallback>
      </Avatar>

      <div className="w-full text-center">
        <h3 className="mb-4 text-xl font-medium">{user.name}</h3>

        <div className="mb-6 flex flex-col gap-2">
          {user.skills.length > 0 ? (
            user.skills.map((skill, index) => (
              <UserSkill
                key={index}
                skill={`${skill.level} ${skill.title}`}
                background={index % 2 === 0 ? 'bg-gray-200' : ''}
              />
            ))
          ) : (
            <p>User doesn't have skills.</p>
          )}
        </div>

        <div className="mb-4 text-left text-sm">
          {user.currentGoals.length > 0 && <p className="font-medium">Current Goal:</p>}
          {user.currentGoals.map((goal, index) => (
            <p key={index}>
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

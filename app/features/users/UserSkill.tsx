import { Badge } from '@app/components/ui/badge';

export const UserSkill = ({
  skill,
  background,
}: {
  skill: string;
  background?: string;
}) => {
  return (
    <Badge
      variant="secondary"
      className={`= w-full justify-center rounded-md px-3 py-1 font-medium text-black ${background ? 'bg-gray-200 hover:bg-gray-200' : 'bg-gray-300 hover:bg-gray-300'}`}
    >
      {skill}
    </Badge>
  );
};

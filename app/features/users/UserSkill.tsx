import { Badge } from '@app/components/ui/badge';
import classNames from 'classnames';

export const UserSkill = ({ skill, background }: { skill: string; background?: string }) => {
  return (
    <Badge
      variant="secondary"
      className={classNames('w-full justify-center rounded-md px-3 py-1 font-medium text-black', {
        'bg-gray-200 hover:bg-gray-200': background,
        'bg-gray-300 hover:bg-gray-300': !background,
      })}
    >
      {skill}
    </Badge>
  );
};

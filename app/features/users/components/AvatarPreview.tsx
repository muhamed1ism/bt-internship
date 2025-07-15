import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';

interface AvatarPreviewProps {
  firstName: string;
  lastName: string;
  email: string;
}

export const AvatarPreview = ({ firstName, lastName, email }: AvatarPreviewProps) => {
  const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <div className="mb-6 flex flex-col items-center">
      <Avatar className="-mt-16 h-24 w-24 border-4 border-white bg-white shadow-lg">
        <AvatarImage
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`}
          alt={fullName}
        />
        <AvatarFallback className="bg-blue-100 text-3xl text-blue-800">{initials}</AvatarFallback>
      </Avatar>
      <h2 className="mt-2 text-xl font-semibold">{fullName}</h2>
      <p className="text-muted-foreground text-sm">{email}</p>
    </div>
  );
};

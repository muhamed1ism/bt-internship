import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { UserType } from '@app/types/types';
import UserDetailModal from './UserDetailModal';

interface PeopleCardProps {
  user: UserType;
  isActive?: boolean;
}

const PeopleCard: React.FC<PeopleCardProps> = ({ user, isActive = true }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  // Generate initials for avatar fallback
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <>
      <div
        className={`group relative flex min-h-50 transform cursor-pointer flex-col justify-between overflow-hidden rounded-xl border p-6 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg ${
          isActive
            ? 'bg-card text-card-foreground hover:bg-card/95'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }`}
        onClick={handleClick}
      >
        {/* Gradient accent for active cards */}
        {isActive && (
          <div className="from-primary via-primary/60 to-primary/40 absolute top-0 left-0 h-1 w-full bg-gradient-to-r" />
        )}

        <div className="flex flex-col gap-6">
          {/* Profile Picture and Name with consistent height */}
          <div className="space-y-4">
            {/* Profile Picture */}
            <div className="flex justify-center">
              <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Name with consistent height */}
            <div className="space-y-1">
              <h1 className="group-hover:text-primary flex h-16 items-center justify-center text-2xl leading-tight font-bold transition-colors duration-200 text-center">
                {fullName}
              </h1>
            </div>
          </div>

          {isActive && (
            <>
              {/* User Info Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <p className="text-muted-foreground text-sm font-medium">Contact Information</p>
                </div>

                {/* Email */}
                <div className="mb-4 flex items-center justify-center gap-2">
                  <div className="bg-accent text-accent-foreground flex h-10 w-10 flex-col items-center justify-center rounded-lg border-1 shadow-md shadow-black/10">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="text-md font-medium">Email</p>
                    <p className="text-muted-foreground text-sm break-all">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Status and Role Section */}
              <div className="space-y-3">
                <p className="text-muted-foreground text-center text-sm font-medium">
                  User Details
                </p>
                <div className="flex w-full flex-row items-center justify-center gap-3 flex-wrap">
                  {/* Status Badge */}
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(user.status)} px-3 py-1 text-xs font-medium`}
                  >
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>

                  {/* Role Badge */}
                  <Badge 
                    variant="secondary" 
                    className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-xs font-medium"
                  >
                    {user.role.name}
                  </Badge>
                </div>
                
                {/* Phone Number if available */}
                {user.phoneNumber && (
                  <div className="flex justify-center">
                    <span className="text-muted-foreground bg-muted/50 rounded-full px-2 py-1 text-xs">
                      📞 {user.phoneNumber}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      <UserDetailModal
        user={user}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default PeopleCard; 
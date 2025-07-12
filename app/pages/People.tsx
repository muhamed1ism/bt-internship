import PeopleCard from '../components/layout/peopleCard/PeopleCard';
import { Input } from '../components/ui/input';
import { useGetAllUsers } from '@app/hooks/user/useGetAllUsers';
import { useState } from 'react';

export const People = () => {
  const { users, isLoading, error } = useGetAllUsers();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort users - active users first, then inactive/pending
  const filteredUsers = users?.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const email = user.email.toLowerCase();
    const role = user.role.name.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return fullName.includes(query) || 
           email.includes(query) || 
           role.includes(query);
  }).sort((a, b) => {
    // Sort by status: active first, then inactive, then pending
    const statusOrder = { active: 0, inactive: 1, pending: 2 };
    const aOrder = statusOrder[a.status.toLowerCase() as keyof typeof statusOrder] ?? 3;
    const bOrder = statusOrder[b.status.toLowerCase() as keyof typeof statusOrder] ?? 3;
    
    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }
    
    // If same status, sort alphabetically by name
    const aName = `${a.firstName} ${a.lastName}`.toLowerCase();
    const bName = `${b.firstName} ${b.lastName}`.toLowerCase();
    return aName.localeCompare(bName);
  }) || [];

  if (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100">
        <h1 className="mb-4 text-4xl font-bold text-red-600">Error Loading Users</h1>
        <p className="text-lg text-muted-foreground">Failed to load user data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center bg-gray-100 px-24 pt-12">
      <div className="mb-8 w-full">
        <h1 className="mb-2 text-3xl font-bold text-foreground">People</h1>
        <p className="text-muted-foreground">Discover and connect with team members</p>
      </div>
      
      <Input 
        className="bg-primary-foreground h-9 w-full mb-8" 
        placeholder="Search people by name, email, or role..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      <div className="flex w-full justify-center">
        <div className="mx-2 grid w-full grid-cols-4 gap-x-8 gap-y-10 pt-6">
          {isLoading && (
            <div className="col-span-4 flex justify-center">
              <p className="text-lg text-muted-foreground">Loading users...</p>
            </div>
          )}
          
          {!isLoading && filteredUsers.length === 0 && searchQuery && (
            <div className="col-span-4 flex justify-center">
              <p className="text-lg text-muted-foreground">No users found matching "{searchQuery}"</p>
            </div>
          )}
          
          {!isLoading && filteredUsers.length === 0 && !searchQuery && (
            <div className="col-span-4 flex justify-center">
              <p className="text-lg text-muted-foreground">No users found</p>
            </div>
          )}
          
          {filteredUsers.map((user) => (
            <PeopleCard
              key={user.id}
              user={user}
              isActive={user.status.toLowerCase() === 'active'}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

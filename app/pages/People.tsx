import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { PeopleCard } from '@app/features/people/components/PeopleCard';
import { useFilteredPeople } from '@app/features/people/hooks/useFilteredPeople';
import { useGetAllUsers } from '@app/hooks/user/useGetAllUsers';
import { LayoutGrid, List, Search } from 'lucide-react';
import { useState } from 'react';

export const People = () => {
  const { users, isLoading, error } = useGetAllUsers();

  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleButtonActive = 'text-secondary bg-primary';
  const toggleButtonInactive = 'text-primary bg-card hover:bg-primary/10';

  // Filter and sort users - active users first, then inactive/pending
  const { filteredPeople } = useFilteredPeople(users || undefined, searchQuery);

  const handleSetGridMode = () => {
    setViewMode('grid');
  };

  const handleSetListMode = () => {
    setViewMode('list');
  };

  if (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100">
        <h1 className="mb-4 text-4xl font-bold text-red-600">Error Loading Users</h1>
        <p className="text-muted-foreground text-lg">
          Failed to load user data. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center bg-gray-100 px-24 pt-12">
      <div className="mb-8 w-full">
        <h1 className="text-foreground mb-2 text-3xl font-bold">People</h1>
        <p className="text-muted-foreground">Discover people</p>
      </div>

      <div className="mb-8 flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search Bar */}
        <div className="relative w-full flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search People..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-card h-9 pl-10"
          />
        </div>

        <div className="ml-auto flex items-center justify-end gap-2">
          <div className="flex rounded-lg border-1">
            <Button
              size="icon"
              onClick={handleSetListMode}
              className={`rounded-r-none ${viewMode === 'list' ? toggleButtonActive : toggleButtonInactive}`}
            >
              <List className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              onClick={handleSetGridMode}
              className={`rounded-l-none ${viewMode === 'grid' ? toggleButtonActive : toggleButtonInactive}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 w-full">
        {isLoading && (
          <div className="col-span-4 flex justify-center">
            <p className="text-muted-foreground text-lg">Loading users...</p>
          </div>
        )}

        {!isLoading && filteredPeople.length === 0 && searchQuery && (
          <div className="col-span-4 flex justify-center">
            <p className="text-muted-foreground text-lg">No users found matching "{searchQuery}"</p>
          </div>
        )}

        {!isLoading && filteredPeople.length === 0 && !searchQuery && (
          <div className="col-span-4 flex justify-center">
            <p className="text-muted-foreground text-lg">No users found</p>
          </div>
        )}

        {viewMode === 'list' ? (
          <div className="w-full space-y-3">
            {filteredPeople.map((user) => (
              <PeopleCard
                key={user.id}
                user={user}
                isActive={user.status.toLowerCase() === 'active'}
                viewMode="list"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredPeople.map((user) => (
              <PeopleCard
                key={user.id}
                user={user}
                isActive={user.status.toLowerCase() === 'active'}
                viewMode="grid"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

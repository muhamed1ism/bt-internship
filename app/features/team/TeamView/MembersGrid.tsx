import { useState } from 'react';
import { Input } from '@app/components/ui/input';
import { Search, Grid3x3, List } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { MemberCard } from '../MemberCard/MemberCard';
import { TeamMember } from '@app/types/team-member';

interface MembersGridProps {
  members: TeamMember[];
  onSubmitReport: (memberId: string) => void;
  onChangePosition: (memberId: string) => void;
}

export const MembersGrid = ({ members, onSubmitReport, onChangePosition }: MembersGridProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter members based on search query
  const filteredMembers = members.filter((member) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.position.title.toLowerCase().includes(query) ||
      member.position.department.toLowerCase().includes(query) ||
      member.skills.some((skill) => skill.toLowerCase().includes(query))
    );
  });

  return (
    <div>
      {/* Search and Controls */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search Bar */}
        <div className="relative max-w-md flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3x3 className="h-4 w-4" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
            List
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-muted-foreground text-sm">
          Showing {filteredMembers.length} of {members.length} member
          {members.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Members Grid */}
      <div
        className={` ${
          viewMode === 'grid'
            ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'
            : 'flex flex-col gap-4'
        } `}
      >
        {filteredMembers.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            onSubmitReport={onSubmitReport}
            onChangePosition={onChangePosition}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <Search className="text-muted-foreground/50 mx-auto h-12 w-12" />
            <h3 className="text-foreground mt-4 text-lg font-medium">No members found</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Try adjusting your search criteria.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

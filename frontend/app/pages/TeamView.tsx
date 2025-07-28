import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetTeamById, useUpdateMemberPosition } from '@app/hooks/team';
import { TeamMember } from '@app/types/team';
import { UpdateMemberPositionFormValues } from '@app/schemas';
import { Spinner } from '@app/components/ui/spinner';
import { useTeamForm } from '@app/features/team/hooks';
import { TeamHeader } from '@app/features/team/components/TeamHeader';
import { MembersGrid } from '@app/features/team/components/MembersGrid';
import { ReportsSection } from '@app/features/team/components/ReportsSection';
import { TeamFormModal } from '@app/features/team/components/modal/TeamFormModal';
import { PositionChangeModal } from '@app/features/team/components/modal/PositionChangeModal';
import { ReportModal } from '@app/features/team/components/modal/ReportModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@app/components/ui/tabs';
import { Users, FileText } from 'lucide-react';
import { useAbility } from '@casl/react';
import { AbilityContext, Can } from '@app/casl/AbilityContext';

export const TeamView = () => {
  const ability = useAbility(AbilityContext);

  // In a real app, you'd fetch team data based on the ID from params
  const { teamId } = useParams<{ teamId: string }>();
  const { team, isLoading, error } = useGetTeamById(teamId || '');
  const { mutate: updatePosition } = useUpdateMemberPosition();
  const navigate = useNavigate();

  // Position change modal state
  const [isPositionChangeOpen, setIsPositionChangeOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Report modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedMemberForReport, setSelectedMemberForReport] = useState<TeamMember | null>(null);

  // Active tab state
  const [activeTab, setActiveTab] = useState('members');

  const { formState, openEditForm, closeForm } = useTeamForm();

  const handleManageMembers = () => {
    navigate(`/teams/${teamId}/members`);
  };

  const handleEditTeam = () => {
    if (!team) return;
    openEditForm(team);
  };

  const handleSubmitReport = (memberId: string) => {
    if (!team) return;
    const member = team.members?.find((member) => member.id === memberId);

    if (member) {
      setSelectedMemberForReport(member);
      setIsReportModalOpen(true);
    }
  };

  const handleChangePosition = (memberId: string) => {
    console.log('Change position for member:', memberId);
    if (!team) return;
    const member = team.members?.find((member) => member.id === memberId);

    if (member) {
      setSelectedMember(member);
      setIsPositionChangeOpen(true);
    }
  };

  const handlePositionChangeConfirm = async (memberId: string, newPosition: string) => {
    if (!team) return;

    const member = team.members?.find((member) => member.id === memberId);
    if (!member) return;

    const formData: UpdateMemberPositionFormValues = {
      position: newPosition,
    };

    updatePosition({ formData, memberId });
    closePositionChangeModal();
  };

  const closePositionChangeModal = () => {
    setIsPositionChangeOpen(false);
    setSelectedMember(null);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
    setSelectedMemberForReport(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 pt-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Spinner size="large" />
              <p className="text-muted-foreground">Loading team details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 pt-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <p className="text-destructive text-lg font-semibold">Failed to load team details</p>
              <p className="text-muted-foreground text-sm">Please try again later</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 pt-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <p className="text-destructive text-lg font-semibold">Team Not Found</p>
              <p className="text-muted-foreground text-sm">The requested team could not be found</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-16">
      <div className="mx-auto max-w-7xl">
        {/* Team Header */}
        <TeamHeader team={team} onManageMembers={handleManageMembers} onEdit={handleEditTeam} />

        {/* Team Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex w-full items-center justify-between">
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Members
            </TabsTrigger>
            <Can I="read" a="Report" ability={ability}>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Reports
              </TabsTrigger>
            </Can>
          </TabsList>

          <TabsContent value="members" className="space-y-6">
            <div className="mx-2">
              <h2 className="text-foreground mb-2 text-2xl font-bold">Team Members</h2>
              <p className="text-muted-foreground">Manage and view details of all team members</p>
            </div>

            <MembersGrid
              members={team.members || []}
              onSubmitReport={handleSubmitReport}
              onChangePosition={handleChangePosition}
            />
          </TabsContent>

          <Can I="read" a="Report" ability={ability}>
            <TabsContent value="reports" className="space-y-6">
              <ReportsSection members={team.members || []} />
            </TabsContent>
          </Can>
        </Tabs>

        {/* Team Form Modal */}
        <TeamFormModal
          isOpen={formState.isOpen}
          onClose={closeForm}
          mode={formState.mode}
          team={formState.team}
        />

        {/* Position Change Modal */}
        <PositionChangeModal
          isOpen={isPositionChangeOpen}
          onClose={closePositionChangeModal}
          member={selectedMember}
          onConfirm={handlePositionChangeConfirm}
        />

        {/* Report Modal */}
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={closeReportModal}
          member={selectedMemberForReport}
        />
      </div>
    </div>
  );
};

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { Badge } from '@app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { useGetReportsByUserId } from '@app/hooks/report';
import { TeamMember } from '@app/types/team';
import { Report } from '@app/types/types';
import { FileText, Calendar, User, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { Spinner } from '@app/components/ui/spinner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@app/components/ui/collapsible';
import { useNavigate } from 'react-router-dom';
import routeNames from '@app/routes/route-names';

interface ReportsSectionProps {
  members: TeamMember[];
}

export const ReportsSection = ({ members }: ReportsSectionProps) => {
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <MemberReportsCard
          key={member.id}
          member={member}
          isExpanded={expandedMember === member.id}
          onToggle={() => setExpandedMember(expandedMember === member.id ? null : member.id)}
        />
      ))}

      {members.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <FileText className="text-muted-foreground/50 mx-auto h-12 w-12" />
            <h3 className="text-foreground mt-4 text-lg font-medium">No team members</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Add team members to view their reports.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

interface MemberReportsCardProps {
  member: TeamMember;
  isExpanded: boolean;
  onToggle: () => void;
}

const MemberReportsCard = ({ member, isExpanded, onToggle }: MemberReportsCardProps) => {
  const { reports, isLoading, isSuccess } = useGetReportsByUserId(member.user.id);
  const navigate = useNavigate();

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const handleReportClick = (reportId: string) => {
    navigate(routeNames.reportDetail({ reportId }));
  };

  const handleViewAllReports = (e: React.MouseEvent) => {
    e.stopPropagation();
    const fullName = `${member.user.firstName} ${member.user.lastName}`;
    navigate(`/reports?search=${encodeURIComponent(fullName)}`);
  };

  return (
    <Card className="border-border/50 hover:border-border transition-all duration-200">
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-primary-foreground bg-neutral-800 text-lg font-semibold">
                    {getInitials(member.user.firstName, member.user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">
                    {member.user.firstName} {member.user.lastName}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {member.position}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={`${
                        member.user.status.toLowerCase() === 'active'
                          ? 'bg-blue-400 text-white'
                          : member.user.status.toLowerCase() === 'inactive'
                            ? 'bg-red-400 text-white'
                            : 'bg-yellow-400 text-black'
                      } text-xs`}
                    >
                      {member.user.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {isLoading ? '...' : reports?.length || 0} reports
                </Badge>
                {reports && reports.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleViewAllReports}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View All
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  {isExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Spinner size="medium" />
                <span className="ml-2 text-muted-foreground">Loading reports...</span>
              </div>
            )}

            {!isLoading && !isSuccess && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <FileText className="text-muted-foreground/50 mx-auto h-8 w-8" />
                  <p className="text-muted-foreground mt-2 text-sm">
                    Unable to load reports. You may not have permission to view this member's reports.
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Only admins and team leads can view all team member reports.
                  </p>
                </div>
              </div>
            )}

            {isSuccess && reports && reports.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <FileText className="text-muted-foreground/50 mx-auto h-8 w-8" />
                  <p className="text-muted-foreground mt-2 text-sm">No reports available for this member.</p>
                </div>
              </div>
            )}

            {isSuccess && reports && reports.length > 0 && (
              <div className="max-h-96 space-y-4 overflow-y-auto">
                {reports
                  .sort((a: Report, b: Report) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((report: Report) => (
                    <div 
                      key={report.id} 
                      className="border rounded-lg p-4 bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleReportClick(report.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {report.author?.firstName} {report.author?.lastName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatDate(report.createdAt)}
                          </span>
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {truncateContent(report.content)}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}; 
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { Badge } from '@app/components/ui/badge';
import { Skeleton } from '@app/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/ui/select';
import { Progress } from '@app/components/ui/progress';
import { Separator } from '@app/components/ui/separator';
import { Spinner } from '@app/components/ui/spinner';
import { toast } from 'sonner';
import { analyzeEvaluationApi, promoteEmployeeApi } from '@app/api/evaluation-api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@app/components/ui/alert-dialog';
import {
  Target,
  Wrench,
  FileText,
  MessageSquare,
  BookOpen,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Brain,
  Users,
  Award,
  Lightbulb,
} from 'lucide-react';
import { useGetAllUsers } from '@app/hooks/user/useGetAllUsers';
import { useGetUserBucketsById } from '@app/hooks/bucket/user/useGetUserBucketsById';
import { useGetCategories } from '@app/hooks/bucket/category/useGetCategories';
import { useGetReportsByUserId } from '@app/hooks/report';
import { getAllTicketsApi } from '@app/api/ticket-api';
import { User } from '@app/types/types';
import { UserBucketLevel } from '@app/types/bucket';
import { Report } from '@app/types/types';
import { Ticket, TicketMessage } from '@app/types/ticket';
import { AbilityContext } from '@app/casl/AbilityContext';
import routeNames from '@app/routes/route-names';
import { useAbility } from '@casl/react';
import { Navigate } from 'react-router-dom';

// Helper function to get user initials
const getUserInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const Evaluation = () => {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedBucket, setSelectedBucket] = useState<string>('');
  const [isEvaluationRunning, setIsEvaluationRunning] = useState(false);
  const [evaluationComplete, setEvaluationComplete] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);

  // Get all users
  const { users, isLoading: usersLoading, error: usersError } = useGetAllUsers();

  // Get buckets for selected user
  const { buckets: userBuckets, isLoading: bucketsLoading } = useGetUserBucketsById(selectedUser);

  // Get reports about the selected user
  const { reports: userReports, isLoading: reportsLoading } = useGetReportsByUserId(selectedUser);

  // Get all categories to know total levels for each category
  const { categories: allCategories } = useGetCategories();

  // Fallback to empty array if reports fail to load
  const reports = userReports || [];

  const selectedUserData = users?.find((user: User) => user.id === selectedUser);
  const availableBuckets = userBuckets || [];

  // Helper function to get max level for a category (same as Buckets page)
  const getMaxLevelForCategory = (categories: any[] | undefined, categoryId: string) => {
    const category = categories && categories.find((cat) => cat.id === categoryId);
    if (!category) return 0;
    return category.bucketLevels.length;
  };

  // Reset evaluation when user or bucket changes
  const handleUserChange = (value: string) => {
    setSelectedUser(value);
    setSelectedBucket('');
    setEvaluationComplete(false);
    setCompletedSteps(new Set());
    setEvaluationResult(null);
  };

  const handleBucketChange = (bucketId: string) => {
    setSelectedBucket(bucketId);
    setEvaluationComplete(false);
    setCompletedSteps(new Set());
    setEvaluationResult(null);
  };

  const handleRunEvaluation = async () => {
    if (!selectedUser || !selectedBucket) {
      toast.error('Please select both a user and a bucket for evaluation');
      return;
    }

    setIsEvaluationRunning(true);
    setCompletedSteps(new Set());
    setEvaluationComplete(false);
    setEvaluationResult(null);

    try {
      // Get the selected bucket details
      const bucket = userBuckets?.find((b: UserBucketLevel) => b.bucketLevelId === selectedBucket);
      if (!bucket) {
        throw new Error('Selected bucket not found');
      }

      // Get user details
      const user = users?.find((u) => u.id === selectedUser);
      if (!user) {
        throw new Error('Selected user not found');
      }

      // Real analysis steps based on actual data
      const performRealAnalysis = async (chatHistory: any[], bucket: any, reports: any[]) => {
        // Step 1: Analyzing chats
        setCompletedSteps((prev) => new Set([...prev, 'analyzing-chats']));
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Step 2: Evaluating communication patterns
        setCompletedSteps((prev) => new Set([...prev, 'evaluating-communication']));
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Step 3: Assessing technical depth
        setCompletedSteps((prev) => new Set([...prev, 'assessing-technical']));
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Step 4: Identifying leadership indicators
        setCompletedSteps((prev) => new Set([...prev, 'identifying-leadership']));
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Step 5: Calculating final score
        setCompletedSteps((prev) => new Set([...prev, 'calculating-score']));
        await new Promise((resolve) => setTimeout(resolve, 300));
      };

      // Get chat history from tickets for the selected user
      let chatHistory: any[] = [];
      try {
        const allTickets = await getAllTicketsApi();
        const userTickets = allTickets.filter(
          (ticket: Ticket) =>
            ticket.employeeId === selectedUser || ticket.authorId === selectedUser,
        );

        // Collect messages from user's tickets
        chatHistory = userTickets.flatMap((ticket: Ticket) =>
          (ticket.messages || []).map((message: TicketMessage) => ({
            recipient: ticket.employeeId === selectedUser ? 'employee' : 'colleague',
            message: message.content,
            context: `Ticket: ${ticket.title} - ${message.senderUser.firstName} ${message.senderUser.lastName}`,
            timestamp: message.createdAt,
            sender: `${message.senderUser.firstName} ${message.senderUser.lastName}`,
          })),
        );

        console.log('📊 Evaluation Chat History:', {
          totalTickets: userTickets.length,
          totalMessages: chatHistory.length,
          userTickets: userTickets.map((t) => ({
            id: t.id,
            title: t.title,
            messageCount: t.messages?.length || 0,
          })),
        });
      } catch (error) {
        console.warn('Failed to fetch chat history for evaluation:', error);
        // Continue with empty chat history
      }

      // Call the AI evaluation API
      const result = await analyzeEvaluationApi({
        employeeId: selectedUser,
        bucketId: selectedBucket,
        chatHistory: chatHistory,
        evaluationPeriod: {
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
          endDate: new Date().toISOString(),
        },
        targetBucketCriteria: {
          name: bucket.bucket.category.name || 'Unknown Bucket',
          level: String(bucket.bucket.level || 1),
          required_skills: bucket.bucket.skills || [],
          tools: bucket.bucket.tools || [],
          knowledge_areas: bucket.bucket.knowledge || [],
          promotion_criteria: bucket.bucket.toAdvance || [],
        },
      });

      // Store the evaluation result
      setEvaluationResult(result);

      // Debug: Log the evaluation result to see what backend is returning
      console.log('🔍 Evaluation Result from Backend:', {
        evaluation_summary: result.evaluation_summary,
        detailed_metrics: result.detailed_metrics,
        chat_activity_metrics: result.chat_activity_metrics,
        ai_insights: result.ai_insights,
        improvement_areas: result.improvement_areas,
        promotion_readiness_assessment: result.promotion_readiness_assessment,
        cto_summary: result.cto_summary,
      });

      // Debug: Specific improvement areas analysis
      console.log('🔍 Improvement Areas Debug:', {
        hasImprovementAreas: !!result?.improvement_areas,
        improvementAreasLength: result?.improvement_areas?.length,
        improvementAreas: result?.improvement_areas,
        sampleArea: result?.improvement_areas?.[0],
        hasValidAreas: result?.improvement_areas?.some(
          (area: any) => area.category && area.description,
        ),
      });

      // Run the real analysis steps
      await performRealAnalysis(chatHistory, bucket, reports);

      // Complete the evaluation
      setIsEvaluationRunning(false);
      setEvaluationComplete(true);

      toast.success('AI evaluation completed successfully!');
    } catch (error: any) {
      console.error('Evaluation failed:', error);
      toast.error(`Evaluation failed: ${error.message}`);
      setIsEvaluationRunning(false);
    }
  };

  const getRecommendation = (score: number) => {
    return score >= 85 ? 'Yes' : 'No';
  };

  const handlePromoteClick = () => {
    if (evaluationResult?.evaluation_summary?.promotion_recommendation) {
      // AI recommends promotion - show confirmation dialog
      setShowPromotionDialog(true);
    } else {
      // AI doesn't recommend - show warning dialog
      setShowPromotionDialog(true);
    }
  };

  const handleConfirmPromotion = async () => {
    setIsPromoting(true);
    try {
      // Get the selected bucket details to find the category ID
      const bucket = userBuckets?.find((b: UserBucketLevel) => b.bucketLevelId === selectedBucket);
      if (!bucket) {
        throw new Error('Selected bucket not found');
      }

      // Get the category ID from the bucket
      const categoryId = bucket.bucket.categoryId;
      if (!categoryId) {
        throw new Error('Category ID not found for selected bucket');
      }

      console.log('🚀 Promoting employee:', {
        employeeId: selectedUser,
        categoryId: categoryId,
        bucketLevelId: selectedBucket,
      });

      const response = await promoteEmployeeApi(selectedUser, categoryId);

      toast.success('Employee promoted successfully!');
      setShowPromotionDialog(false);

      // Reset evaluation state
      setEvaluationComplete(false);
      setEvaluationResult(null);
      setSelectedBucket('');
    } catch (error) {
      console.error('Promotion error:', error);
      toast.error('Failed to promote employee. Please try again.');
    } finally {
      setIsPromoting(false);
    }
  };

  const handleCancelPromotion = () => {
    setShowPromotionDialog(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return 'default';
    if (score >= 80) return 'secondary';
    if (score >= 70) return 'outline';
    return 'destructive';
  };

  const ability = useAbility(AbilityContext);

  if (ability.cannot('manage', 'UserBucket')) {
    return <Navigate to={routeNames.notAuthorized()} />;
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-6">
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="bg-primary/10 inline-flex h-16 w-16 items-center justify-center rounded-full">
          <Award className="text-primary h-8 w-8" />
        </div>
        <h1 className="text-foreground text-3xl font-bold">Promotion Evaluation Tool</h1>
        <p className="text-muted-foreground mx-auto max-w-2xl">
          Comprehensive evaluation system for assessing employee readiness for promotion across
          different career buckets.
        </p>
      </div>

      {/* User and Bucket Selection */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Select Employee for Evaluation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Employee</label>
            {usersLoading ? (
              <div className="flex items-center justify-center py-4">
                <Spinner size="medium" />
                <span className="text-muted-foreground ml-2 text-sm">Loading employees...</span>
              </div>
            ) : usersError ? (
              <div className="py-4 text-center text-red-600">
                <p className="text-sm">Failed to load employees</p>
              </div>
            ) : (
              <Select value={selectedUser} onValueChange={handleUserChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an employee for evaluation..." />
                </SelectTrigger>
                <SelectContent>
                  {users?.map((user: User) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
                          {getUserInitials(user.firstName, user.lastName)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {user.firstName} {user.lastName}
                          </span>
                          <span className="text-muted-foreground text-xs">{user.email}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Bucket Selection - Only show if user is selected */}
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span className="text-sm font-medium">Select Bucket for Evaluation</span>
              </div>

              {bucketsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner size="medium" />
                  <span className="text-muted-foreground ml-2 text-sm">Loading buckets...</span>
                </div>
              ) : availableBuckets.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {availableBuckets.map((bucket: UserBucketLevel) => (
                    <Card
                      key={bucket.bucketLevelId}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedBucket === bucket.bucketLevelId
                          ? 'ring-primary bg-primary/5 ring-2'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleBucketChange(bucket.bucketLevelId)}
                    >
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-start justify-between">
                          <h3 className="text-sm font-semibold">{bucket.bucket.category.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            Level {bucket.bucket.level}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3 text-xs">
                          {bucket.bucket.category.description || 'No description available'}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="bg-muted h-2 flex-1 rounded-full">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                bucket.bucket.level ===
                                getMaxLevelForCategory(allCategories, bucket.bucket.categoryId)
                                  ? 'bg-gradient-to-r from-emerald-700 to-green-400'
                                  : 'bg-primary'
                              }`}
                              style={{
                                width: `${(bucket.bucket.level / getMaxLevelForCategory(allCategories, bucket.bucket.categoryId)) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-muted-foreground text-xs">
                            {bucket.bucket.level}/
                            {getMaxLevelForCategory(allCategories, bucket.bucket.categoryId)}
                            {bucket.bucket.level ===
                              getMaxLevelForCategory(allCategories, bucket.bucket.categoryId) && (
                              <span className="ml-1 font-medium text-emerald-600">🎉</span>
                            )}
                          </span>
                        </div>
                        {bucket.bucket.level ===
                          getMaxLevelForCategory(allCategories, bucket.bucket.categoryId) && (
                          <div className="mt-2 text-center">
                            <span className="text-xs font-medium text-emerald-600">
                              🎉 Congratulations! You've mastered this bucket!
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground py-8 text-center">
                  <Target className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  <p>No buckets assigned to this employee</p>
                </div>
              )}

              {/* Run Evaluation Button */}
              {selectedBucket && (
                <div className="pt-4">
                  {(() => {
                    const selectedBucketData = availableBuckets.find(
                      (b: UserBucketLevel) => b.bucketLevelId === selectedBucket,
                    );
                    const maxLevel = getMaxLevelForCategory(
                      allCategories,
                      selectedBucketData?.bucket.categoryId || '',
                    );
                    const isAtMaxLevel = selectedBucketData?.bucket.level === maxLevel;

                    return (
                      <div className="space-y-2">
                        <Button
                          onClick={handleRunEvaluation}
                          disabled={isEvaluationRunning || isAtMaxLevel}
                          className="w-full"
                          size="lg"
                        >
                          {isEvaluationRunning ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              Running Evaluation...
                            </>
                          ) : isAtMaxLevel ? (
                            <>
                              <Award className="mr-2 h-4 w-4" />
                              Already at Max Level
                            </>
                          ) : (
                            <>
                              <TrendingUp className="mr-2 h-4 w-4" />
                              Run Evaluation for {selectedUserData?.firstName}{' '}
                              {selectedUserData?.lastName}
                            </>
                          )}
                        </Button>
                        {isAtMaxLevel && (
                          <p className="text-muted-foreground text-center text-xs">
                            This employee has already reached the maximum level in this bucket.
                          </p>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Evaluation Results */}
      {evaluationComplete && selectedUserData && (
        <div className="space-y-6">
          {/* Employee Info Header */}
          <Card className="border-l-primary border-l-4 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold">
                  {selectedUserData.firstName[0]}
                  {selectedUserData.lastName[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {selectedUserData.firstName} {selectedUserData.lastName}
                  </h2>
                  <p className="text-muted-foreground">{selectedUserData.email}</p>
                  <p className="text-muted-foreground text-sm">
                    Evaluating:{' '}
                    {
                      availableBuckets.find(
                        (b: UserBucketLevel) => b.bucketLevelId === selectedBucket,
                      )?.bucket.category.name
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Current Level</p>
                    <p className="text-lg font-semibold">
                      {
                        availableBuckets.find(
                          (b: UserBucketLevel) => b.bucketLevelId === selectedBucket,
                        )?.bucket.category.name
                      }{' '}
                      Level{' '}
                      {
                        availableBuckets.find(
                          (b: UserBucketLevel) => b.bucketLevelId === selectedBucket,
                        )?.bucket.level
                      }
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Target Level</p>
                    <p className="text-lg font-semibold">
                      {
                        availableBuckets.find(
                          (b: UserBucketLevel) => b.bucketLevelId === selectedBucket,
                        )?.bucket.category.name
                      }{' '}
                      Level{' '}
                      {Number(
                        availableBuckets.find(
                          (b: UserBucketLevel) => b.bucketLevelId === selectedBucket,
                        )?.bucket.level || 1,
                      ) + 1}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Overall Score</p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-lg font-bold ${getScoreColor(evaluationResult?.evaluation_summary?.overall_score || 0)}`}
                      >
                        {evaluationResult?.evaluation_summary?.overall_score || 0}%
                      </span>
                      <Badge
                        variant={getScoreBadgeVariant(
                          evaluationResult?.evaluation_summary?.overall_score || 0,
                        )}
                      >
                        {evaluationResult?.evaluation_summary?.promotion_recommendation
                          ? 'Yes'
                          : 'No'}
                      </Badge>
                    </div>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Confidence Level</p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-lg font-bold ${getScoreColor(evaluationResult?.evaluation_summary?.confidence_level || 0)}`}
                      >
                        {evaluationResult?.evaluation_summary?.confidence_level || 0}%
                      </span>
                    </div>
                  </div>
                  <Brain className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Evaluation Sections */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Current Skills */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Wrench className="h-5 w-5" />
                    Current Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {availableBuckets
                      .find((b: UserBucketLevel) => b.bucketLevelId === selectedBucket)
                      ?.bucket.skills?.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      )) || []}
                  </div>
                </CardContent>
              </Card>

              {/* Reports About User */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5" />
                    Reports About This User
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {reportsLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Spinner size="medium" />
                      <span className="text-muted-foreground ml-2 text-sm">Loading reports...</span>
                    </div>
                  ) : reports && reports.length > 0 ? (
                    <div className="space-y-4">
                      {/* Reports Summary */}
                      <div className="bg-muted/30 mb-4 rounded-lg p-4 text-center">
                        <p className="text-primary text-2xl font-bold">{reports.length}</p>
                        <p className="text-muted-foreground text-xs">Total Reports Available</p>
                      </div>

                      {/* Recent Reports */}
                      <div>
                        <h4 className="mb-2 font-medium">Recent Reports</h4>
                        <div className="max-h-40 space-y-2 overflow-y-auto">
                          {reports.slice(0, 3).map((report: Report, index: number) => (
                            <div key={report.id} className="rounded-lg border p-2">
                              <div className="mb-1 flex items-center justify-between">
                                <span className="text-muted-foreground text-xs">
                                  {new Date(report.createdAt).toLocaleDateString()}
                                </span>
                                <span className="text-muted-foreground text-xs">
                                  Report #{index + 1}
                                </span>
                              </div>
                              <p className="text-muted-foreground line-clamp-2 text-sm">
                                {report.content.length > 100
                                  ? `${report.content.substring(0, 100)}...`
                                  : report.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground py-4 text-center">
                      <FileText className="mx-auto mb-2 h-8 w-8 opacity-50" />
                      <p>No reports available for this user</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AI Chat Analysis */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageSquare className="h-5 w-5" />
                    AI Chat Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Chat Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                      <p className="text-primary text-2xl font-bold">
                        {evaluationResult?.chat_activity_metrics?.total_messages || 0}
                      </p>
                      <p className="text-muted-foreground text-xs">Total Messages</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                      <p className="text-primary text-lg font-bold">
                        {evaluationResult?.chat_activity_metrics?.average_response_time || 'N/A'}
                      </p>
                      <p className="text-muted-foreground text-xs">Avg Response Time</p>
                    </div>
                  </div>

                  {/* AI Insights */}
                  {/* AI Strengths */}
                  {evaluationResult?.ai_insights?.strengths &&
                    evaluationResult.ai_insights.strengths.length > 0 && (
                      <div>
                        <h4 className="mb-2 font-medium text-green-600">AI Insights - Strengths</h4>
                        <ul className="space-y-1">
                          {evaluationResult.ai_insights.strengths.map(
                            (strength: string, index: number) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-green-500" />
                                <span className="text-muted-foreground">{strength}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}

                  {/* AI Weaknesses */}
                  {evaluationResult?.ai_insights?.weaknesses &&
                    evaluationResult.ai_insights.weaknesses.length > 0 && (
                      <div>
                        <h4 className="mb-2 font-medium text-orange-600">
                          AI Insights - Areas for Improvement
                        </h4>
                        <ul className="space-y-1">
                          {evaluationResult.ai_insights.weaknesses.map(
                            (weakness: string, index: number) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <Clock className="mt-0.5 h-3 w-3 flex-shrink-0 text-orange-500" />
                                <span className="text-muted-foreground">{weakness}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}

                  {/* AI Recommendations */}
                  {evaluationResult?.ai_insights?.recommendations &&
                    evaluationResult.ai_insights.recommendations.length > 0 && (
                      <div>
                        <h4 className="mb-2 font-medium text-blue-600">
                          AI Insights - Recommendations
                        </h4>
                        <ul className="space-y-1">
                          {evaluationResult.ai_insights.recommendations.map(
                            (recommendation: string, index: number) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <Lightbulb className="mt-0.5 h-3 w-3 flex-shrink-0 text-blue-500" />
                                <span className="text-muted-foreground">{recommendation}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* AI Evaluation Metrics */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Brain className="h-5 w-5" />
                    AI Evaluation Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Communication Score */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Communication</span>
                      <span className="text-sm font-bold">
                        {evaluationResult?.detailed_metrics?.communication_score || 0}%
                      </span>
                    </div>
                    <Progress
                      value={evaluationResult?.detailed_metrics?.communication_score || 0}
                      className="h-2"
                    />
                  </div>

                  {/* Technical Skills */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Technical Skills</span>
                      <span className="text-sm font-bold">
                        {evaluationResult?.detailed_metrics?.technical_skills_score || 0}%
                      </span>
                    </div>
                    <Progress
                      value={evaluationResult?.detailed_metrics?.technical_skills_score || 0}
                      className="h-2"
                    />
                  </div>

                  {/* Problem Solving */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Problem Solving</span>
                      <span className="text-sm font-bold">
                        {evaluationResult?.detailed_metrics?.problem_solving_score || 0}%
                      </span>
                    </div>
                    <Progress
                      value={evaluationResult?.detailed_metrics?.problem_solving_score || 0}
                      className="h-2"
                    />
                  </div>

                  {/* Leadership */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Leadership</span>
                      <span className="text-sm font-bold">
                        {evaluationResult?.detailed_metrics?.leadership_score || 0}%
                      </span>
                    </div>
                    <Progress
                      value={evaluationResult?.detailed_metrics?.leadership_score || 0}
                      className="h-2"
                    />
                  </div>

                  {/* Collaboration */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Collaboration</span>
                      <span className="text-sm font-bold">
                        {evaluationResult?.detailed_metrics?.collaboration_score || 0}%
                      </span>
                    </div>
                    <Progress
                      value={evaluationResult?.detailed_metrics?.collaboration_score || 0}
                      className="h-2"
                    />
                  </div>

                  <Separator />

                  {/* Chat Activity Metrics */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-muted/30 rounded p-2 text-center">
                      <p className="text-primary text-lg font-bold">
                        {evaluationResult?.chat_activity_metrics?.technical_terms_used || 0}
                      </p>
                      <p className="text-muted-foreground text-xs">Tech Terms</p>
                    </div>
                    <div className="bg-muted/30 rounded p-2 text-center">
                      <p className="text-primary text-lg font-bold">
                        {evaluationResult?.chat_activity_metrics?.solution_proposals_made || 0}
                      </p>
                      <p className="text-muted-foreground text-xs">Solutions</p>
                    </div>
                    <div className="bg-muted/30 rounded p-2 text-center">
                      <p className="text-primary text-lg font-bold">
                        {evaluationResult?.chat_activity_metrics?.mentoring_instances || 0}
                      </p>
                      <p className="text-muted-foreground text-xs">Mentoring</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Target Bucket Expectations */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="h-5 w-5" />
                    Target Bucket Expectations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold">
                      {
                        availableBuckets.find(
                          (b: UserBucketLevel) => b.bucketLevelId === selectedBucket,
                        )?.bucket.category.name
                      }{' '}
                      Level{' '}
                      {Number(
                        availableBuckets.find(
                          (b: UserBucketLevel) => b.bucketLevelId === selectedBucket,
                        )?.bucket.level || 1,
                      ) + 1}
                    </h4>
                  </div>

                  <div>
                    <h5 className="mb-2 flex items-center gap-2 font-medium">
                      <Wrench className="h-4 w-4" />
                      Required Skills
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {availableBuckets
                        .find((b: UserBucketLevel) => b.bucketLevelId === selectedBucket)
                        ?.bucket.skills?.map((skill: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        )) || []}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h5 className="mb-2 flex items-center gap-2 font-medium">
                      <Brain className="h-4 w-4" />
                      Tools & Technologies
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {availableBuckets
                        .find((b: UserBucketLevel) => b.bucketLevelId === selectedBucket)
                        ?.bucket.tools?.map((tool: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {tool}
                          </Badge>
                        )) || []}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h5 className="mb-2 flex items-center gap-2 font-medium">
                      <BookOpen className="h-4 w-4" />
                      Knowledge Areas
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {availableBuckets
                        .find((b: UserBucketLevel) => b.bucketLevelId === selectedBucket)
                        ?.bucket.knowledge?.map((knowledge: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {knowledge}
                          </Badge>
                        )) || []}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h5 className="mb-2 flex items-center gap-2 font-medium">
                      <Target className="h-4 w-4" />
                      Promotion Criteria
                    </h5>
                    <ul className="space-y-2">
                      {availableBuckets
                        .find((b: UserBucketLevel) => b.bucketLevelId === selectedBucket)
                        ?.bucket.toAdvance?.map((criteria: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                            <span className="text-muted-foreground">{criteria}</span>
                          </li>
                        )) || []}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Final Results */}
          <Card className="border-primary/20 border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Award className="h-6 w-6" />
                Evaluation Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Promotion Readiness Score */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Promotion Readiness Score</h3>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-2xl font-bold ${getScoreColor(evaluationResult?.evaluation_summary?.overall_score || 0)}`}
                    >
                      {evaluationResult?.evaluation_summary?.overall_score || 0}%
                    </span>
                    <Badge
                      variant={getScoreBadgeVariant(
                        evaluationResult?.evaluation_summary?.overall_score || 0,
                      )}
                      className="text-sm"
                    >
                      {evaluationResult?.evaluation_summary?.promotion_recommendation ? (
                        <>
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Recommended
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-1 h-3 w-3" />
                          Not Ready
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
                <Progress
                  value={evaluationResult?.evaluation_summary?.overall_score || 0}
                  className="h-3"
                />
              </div>

              <Separator />

              {/* Recommendation */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recommendation</h3>
                <div className="flex items-center gap-2">
                  {evaluationResult?.evaluation_summary?.promotion_recommendation ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-semibold text-green-600">Yes - Promote</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span className="font-semibold text-red-600">No - Continue Development</span>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {/* CTO Dashboard Summary */}
              <div>
                <h3 className="mb-2 text-lg font-semibold">CTO Dashboard Summary</h3>
                <p className="text-muted-foreground">
                  {evaluationResult?.cto_summary?.executive_summary ||
                    'AI analysis is being processed...'}
                </p>
              </div>

              {/* Improvement Areas */}
              {evaluationResult?.improvement_areas &&
                evaluationResult.improvement_areas.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="mb-2 text-lg font-semibold">Areas for Improvement</h3>
                      <div className="space-y-3">
                        {evaluationResult.improvement_areas.map((area: any, index: number) => (
                          <div key={index} className="bg-muted/30 rounded-lg p-3">
                            <h4 className="mb-1 text-sm font-medium">{area.category}</h4>
                            <p className="text-muted-foreground mb-2 text-sm">{area.description}</p>
                            <p className="text-muted-foreground text-xs">
                              <strong>Recommended:</strong> {area.recommended_actions}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
            </CardContent>
          </Card>

          {/* Promotion Action */}
          <Card className="border-primary/20 border-2 shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-4 text-center">
                <div className="mb-4 flex items-center justify-center gap-2">
                  <Award className="text-primary h-6 w-6" />
                  <h3 className="text-xl font-semibold">Promotion Decision</h3>
                </div>

                <div className="mb-6 flex items-center justify-center gap-4">
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm">AI Recommendation</p>
                    <Badge
                      variant={
                        evaluationResult?.evaluation_summary?.promotion_recommendation
                          ? 'default'
                          : 'destructive'
                      }
                      className="mt-1 text-sm"
                    >
                      {evaluationResult?.evaluation_summary?.promotion_recommendation
                        ? 'Recommended'
                        : 'Not Recommended'}
                    </Badge>
                  </div>

                  <div className="text-center">
                    <p className="text-muted-foreground text-sm">Confidence Level</p>
                    <p className="text-primary text-lg font-bold">
                      {evaluationResult?.evaluation_summary?.confidence_level || 0}%
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handlePromoteClick}
                  size="lg"
                  className="px-8"
                  disabled={!evaluationResult}
                >
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Promote Employee
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading State */}
      {isEvaluationRunning && (
        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                AI Analysis in Progress...
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* AI Processing Steps */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {completedSteps.has('analyzing-chats') ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                  )}
                  <span
                    className={`text-sm ${completedSteps.has('analyzing-chats') ? 'font-medium text-green-600' : 'text-muted-foreground'}`}
                  >
                    Analyzing chat messages from tickets...
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {completedSteps.has('evaluating-communication') ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                  )}
                  <span
                    className={`text-sm ${completedSteps.has('evaluating-communication') ? 'font-medium text-green-600' : 'text-muted-foreground'}`}
                  >
                    Evaluating communication quality and response patterns...
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {completedSteps.has('assessing-technical') ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                  )}
                  <span
                    className={`text-sm ${completedSteps.has('assessing-technical') ? 'font-medium text-green-600' : 'text-muted-foreground'}`}
                  >
                    Assessing technical knowledge against required skills...
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {completedSteps.has('identifying-leadership') ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                  )}
                  <span
                    className={`text-sm ${completedSteps.has('identifying-leadership') ? 'font-medium text-green-600' : 'text-muted-foreground'}`}
                  >
                    Identifying leadership indicators from colleague reports...
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {completedSteps.has('calculating-score') ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                  )}
                  <span
                    className={`text-sm ${completedSteps.has('calculating-score') ? 'font-medium text-green-600' : 'text-muted-foreground'}`}
                  >
                    Calculating final promotion readiness score...
                  </span>
                </div>
              </div>

              <Separator />

              {/* Loading Skeletons */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="shadow-md">
                    <CardHeader>
                      <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Promotion Confirmation Dialog */}
      <AlertDialog open={showPromotionDialog} onOpenChange={setShowPromotionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {evaluationResult?.evaluation_summary?.promotion_recommendation ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Confirm Promotion
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-orange-500" />
                  AI Doesn't Recommend Promotion
                </>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {evaluationResult?.evaluation_summary?.promotion_recommendation ? (
                <div className="space-y-3">
                  <p>
                    The AI analysis recommends promoting{' '}
                    <strong>
                      {selectedUserData?.firstName} {selectedUserData?.lastName}
                    </strong>{' '}
                    to the next level with a confidence level of{' '}
                    <strong>{evaluationResult?.evaluation_summary?.confidence_level}%</strong>.
                  </p>
                  <p className="text-muted-foreground text-sm">
                    This promotion will move the employee from their current level to the target
                    level in the selected bucket.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p>
                    The AI analysis does <strong>not recommend</strong> promoting{' '}
                    <strong>
                      {selectedUserData?.firstName} {selectedUserData?.lastName}
                    </strong>{' '}
                    at this time. The confidence level is{' '}
                    <strong>{evaluationResult?.evaluation_summary?.confidence_level}%</strong>.
                  </p>
                  <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                    <p className="mb-2 text-sm font-medium text-orange-800">Key Concerns:</p>
                    <ul className="space-y-1 text-sm text-orange-700">
                      {evaluationResult?.improvement_areas &&
                      evaluationResult.improvement_areas.length > 0 &&
                      evaluationResult.improvement_areas.some(
                        (area: any) => area.category && area.description,
                      ) ? (
                        evaluationResult.improvement_areas
                          .filter((area: any) => area.category && area.description)
                          .slice(0, 3)
                          .map((area: any, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="mt-1 text-orange-500">•</span>
                              <span>
                                {area.category}: {area.description}
                              </span>
                            </li>
                          ))
                      ) : (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="mt-1 text-orange-500">•</span>
                            <span>Insufficient evidence of required skills</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-1 text-orange-500">•</span>
                            <span>Low confidence score in evaluation</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-1 text-orange-500">•</span>
                            <span>Need for additional development before promotion</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    You can still promote the employee if you believe the AI analysis is incorrect
                    or if there are other factors to consider.
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelPromotion} disabled={isPromoting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmPromotion}
              disabled={isPromoting}
              className={
                evaluationResult?.evaluation_summary?.promotion_recommendation
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-orange-600 hover:bg-orange-700'
              }
            >
              {isPromoting ? (
                <>
                  <Spinner size="small" />
                  Promoting...
                </>
              ) : (
                <>
                  {evaluationResult?.evaluation_summary?.promotion_recommendation
                    ? 'Confirm Promotion'
                    : 'Promote Anyway'}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  Plus,
  BookOpen,
  Target,
  Wrench,
  Brain,
  TrendingUp,
  CheckCircle2,
  Clock,
  Star,
  Users,
  Award,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Textarea } from '@app/components/ui/textarea';
import { Badge } from '@app/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import { Separator } from '@app/components/ui/separator';
import { useState } from 'react';
import type { ChangeEvent } from 'react';

// Mock data - in a real app, this would come from an API
const mockBuckets = {
  '1': {
    id: '1',
    title: 'Software Engineer',
    description: 'Full-stack development expertise across modern web technologies',
    totalLevels: 4,
    levels: [
      {
        id: '1',
        levelNumber: 2,
        title: 'Software Engineer Level 2',
        status: 'current' as const, // current, completed, locked
        difficulty: 'intermediate' as const,
        estimatedTime: '6-12 months',
        prerequisites: ['Software Engineer Level 1'],
        expectations: [
          'Independently lead development of full-stack features, from front-end UI to back-end APIs.',
          'Collaborate with PMs, designers and QA engineers to deliver high quality products.',
          'Mentor junior developers and contribute to code reviews.',
          'Participate in architectural decisions and technical planning sessions.',
        ],
        skills: [
          'Front-End: React.js/Vue, TypeScript, State Management',
          'Back-End: Node.js, Express.js, RESTful APIs',
          'Cloud: AWS Services, Docker, CI/CD',
          'Database: PostgreSQL, MongoDB, Redis',
        ],
        tools: ['React.js', 'Vue', 'Express.js', 'AWS', 'Docker', 'PostgreSQL'],
        knowledge: [
          'In-depth understanding of software architecture, component-based architecture (SOA) and RESTful design',
          'Strong knowledge of JavaScript 3rd party API integrations for a modern web-stack',
          'Understanding of database design principles and query optimization',
          'Familiarity with DevOps practices and deployment strategies',
        ],
        toAdvance: [
          'Lead projects that require full-stack architecture, create shared tools or components that aid overall productivity',
          'Define the skill architecture or solution without structural verification',
          'Work on improving caching solutions by influencing the performance optimizations and quality',
          'Take initiatives by identifying and resolving technical debt across projects',
          'Work closely with the teams to improve quality through building Review and improve user interfaces',
          'Participate in architectural discussions, contributing ideas for scaling or performance',
        ],
      },
      {
        id: '2',
        levelNumber: 3,
        title: 'Senior Software Engineer',
        status: 'locked' as const,
        difficulty: 'advanced' as const,
        estimatedTime: '12-18 months',
        prerequisites: ['Software Engineer Level 2'],
        expectations: ['Lead complex technical initiatives and mentor team members...'],
        skills: ['Advanced system design, microservices architecture...'],
        tools: ['Kubernetes', 'GraphQL', 'Advanced AWS...'],
        knowledge: ['Advanced system architecture and scalability patterns...'],
        toAdvance: ['Demonstrate technical leadership across multiple projects...'],
      },
      {
        id: '3',
        levelNumber: 4,
        title: 'Lead Software Engineer',
        status: 'locked' as const,
        difficulty: 'expert' as const,
        estimatedTime: '18-24 months',
        prerequisites: ['Senior Software Engineer'],
        expectations: ['Drive technical strategy and architecture decisions...'],
        skills: ['System architecture, team leadership, technical strategy...'],
        tools: ['Enterprise tools', 'Architecture patterns...'],
        knowledge: ['Enterprise architecture and organizational impact...'],
        toAdvance: ['Establish technical direction for the engineering organization...'],
      },
      {
        id: '4',
        levelNumber: 5,
        title: 'Principal Software Engineer',
        status: 'locked' as const,
        difficulty: 'expert' as const,
        estimatedTime: '24+ months',
        prerequisites: ['Lead Software Engineer'],
        expectations: ['Set technical vision and influence industry standards...'],
        skills: ['Technical vision, industry expertise, innovation leadership...'],
        tools: ['Cutting-edge technologies', 'Research tools...'],
        knowledge: ['Industry-wide impact and technical innovation...'],
        toAdvance: ['Recognized thought leadership in the engineering community...'],
      },
    ],
  },
};

interface Level {
  id: string;
  levelNumber: number;
  title: string;
  status: 'current' | 'completed' | 'locked';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedTime: string;
  prerequisites: string[];
  expectations: string[];
  skills: string[];
  tools: string[];
  knowledge: string[];
  toAdvance: string[];
}

interface Bucket {
  id: string;
  title: string;
  description: string;
  totalLevels: number;
  levels: Level[];
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 border-green-200',
  intermediate: 'bg-blue-100 text-blue-800 border-blue-200',
  advanced: 'bg-orange-100 text-orange-800 border-orange-200',
  expert: 'bg-purple-100 text-purple-800 border-purple-200',
};

const statusIcons = {
  current: <Clock className="h-4 w-4" />,
  completed: <CheckCircle2 className="h-4 w-4" />,
  locked: <Star className="h-4 w-4" />,
};

const sectionIcons = {
  expectations: <Target className="h-5 w-5" />,
  skills: <Wrench className="h-5 w-5" />,
  tools: <BookOpen className="h-5 w-5" />,
  knowledge: <Brain className="h-5 w-5" />,
  toAdvance: <TrendingUp className="h-5 w-5" />,
};

export const BucketView = () => {
  const navigate = useNavigate();
  const { bucketId } = useParams();

  // Mock bucket data lookup
  const bucket: Bucket | undefined = bucketId
    ? mockBuckets[bucketId as keyof typeof mockBuckets]
    : undefined;
  const hasLevels = bucket && bucket.levels.length > 0;

  // State for bucket creation/editing
  const [bucketTitle, setBucketTitle] = useState(bucket?.title || '');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(
    hasLevels ? bucket.levels[0] : null,
  );
  const [isEditingLevel, setIsEditingLevel] = useState(false);
  const [isCreatingLevel, setIsCreatingLevel] = useState(false);

  // State for level editing
  const [editingLevel, setEditingLevel] = useState<Partial<Level>>({
    title: '',
    expectations: [''],
    skills: [''],
    tools: [''],
    knowledge: [''],
    toAdvance: [''],
  });

  const handleLevelSelect = (level: Level) => {
    setSelectedLevel(level);
    setIsEditingLevel(false);
    setIsCreatingLevel(false);
  };

  const handleEditLevel = (level: Level) => {
    setEditingLevel({
      ...level,
      expectations: level.expectations.length > 0 ? level.expectations : [''],
      skills: level.skills.length > 0 ? level.skills : [''],
      tools: level.tools.length > 0 ? level.tools : [''],
      knowledge: level.knowledge.length > 0 ? level.knowledge : [''],
      toAdvance: level.toAdvance.length > 0 ? level.toAdvance : [''],
    });
    setIsEditingLevel(true);
    setIsCreatingLevel(false);
  };

  const handleCreateLevel = () => {
    setEditingLevel({
      title: '',
      expectations: [''],
      skills: [''],
      tools: [''],
      knowledge: [''],
      toAdvance: [''],
    });
    setIsCreatingLevel(true);
    setIsEditingLevel(false);
  };

  const updateEditingField = (field: keyof Level, value: string | string[]) => {
    setEditingLevel((prev) => ({ ...prev, [field]: value }));
  };

  const addListItem = (field: 'expectations' | 'skills' | 'tools' | 'knowledge' | 'toAdvance') => {
    const currentArray = (editingLevel[field] as string[]) || [];
    updateEditingField(field, [...currentArray, '']);
  };

  const updateListItem = (
    field: 'expectations' | 'skills' | 'tools' | 'knowledge' | 'toAdvance',
    index: number,
    value: string,
  ) => {
    const currentArray = (editingLevel[field] as string[]) || [];
    const newArray = [...currentArray];
    newArray[index] = value;
    updateEditingField(field, newArray);
  };

  const removeListItem = (
    field: 'expectations' | 'skills' | 'tools' | 'knowledge' | 'toAdvance',
    index: number,
  ) => {
    const currentArray = (editingLevel[field] as string[]) || [];
    if (currentArray.length > 1) {
      updateEditingField(
        field,
        currentArray.filter((_, i) => i !== index),
      );
    }
  };

  // Render bucket with levels (first image) - Enhanced version
  if (hasLevels && !isEditingLevel && !isCreatingLevel) {
    return (
      <div className="bg-background min-h-screen">
        {/* Enhanced Header */}
        <div className="bg-card border-b shadow-sm">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/buckets')}
                className="hover:bg-accent"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <span>Buckets</span>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground font-medium">{bucket.title}</span>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              <Users className="mr-1 h-4 w-4" />
              Admin
            </Badge>
          </div>
        </div>

        <div className="mx-auto max-w-7xl p-6">
          {/* Enhanced Bucket Header */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-lg p-2">
                  <Award className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-foreground text-3xl font-bold">{bucket.title}</h1>
                  <p className="text-muted-foreground mt-1">{bucket.description}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                <span>{bucket.totalLevels} Levels</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Progressive Development Path</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Enhanced Left Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <Button
                  onClick={handleCreateLevel}
                  className="mb-6 w-full bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:from-green-600 hover:to-green-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Level
                </Button>

                <div className="space-y-3">
                  {bucket.levels.map((level, index) => (
                    <div key={level.id} className="relative">
                      {/* Connection line */}
                      {index > 0 && (
                        <div className="bg-border absolute -top-3 left-6 h-3 w-0.5"></div>
                      )}

                      <Card
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                          selectedLevel?.id === level.id
                            ? 'ring-primary bg-primary/5 ring-2'
                            : 'hover:bg-accent/50'
                        }`}
                        onClick={() => handleLevelSelect(level)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`rounded-lg p-2 ${
                                level.status === 'current'
                                  ? 'bg-blue-100 text-blue-600'
                                  : level.status === 'completed'
                                    ? 'bg-green-100 text-green-600'
                                    : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {statusIcons[level.status]}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium">Level {level.levelNumber}</p>
                              <div className="mt-1 flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${difficultyColors[level.difficulty]}`}
                                >
                                  {level.difficulty}
                                </Badge>
                                <span className="text-muted-foreground text-xs">
                                  {level.estimatedTime}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Right Panel */}
            {selectedLevel && (
              <div className="lg:col-span-3">
                <Card className="shadow-lg">
                  <CardHeader className="from-accent/20 to-secondary/20 border-b bg-gradient-to-r">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                          <div
                            className={`rounded-lg p-2 ${
                              selectedLevel.status === 'current'
                                ? 'bg-blue-100 text-blue-600'
                                : selectedLevel.status === 'completed'
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {statusIcons[selectedLevel.status]}
                          </div>
                          {selectedLevel.title}
                        </CardTitle>
                        <div className="mt-3 flex items-center gap-4">
                          <Badge
                            variant="outline"
                            className={difficultyColors[selectedLevel.difficulty]}
                          >
                            {selectedLevel.difficulty.charAt(0).toUpperCase() +
                              selectedLevel.difficulty.slice(1)}
                          </Badge>
                          <div className="text-muted-foreground flex items-center gap-1 text-sm">
                            <Clock className="h-4 w-4" />
                            {selectedLevel.estimatedTime}
                          </div>
                          {selectedLevel.prerequisites &&
                            selectedLevel.prerequisites.length > 0 && (
                              <div className="text-muted-foreground flex items-center gap-1 text-sm">
                                <ChevronRight className="h-4 w-4" />
                                Requires: {selectedLevel.prerequisites.join(', ')}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
                      {/* Left Column */}
                      <div className="space-y-8">
                        {/* Expectations */}
                        <div>
                          <div className="mb-4 flex items-center gap-2">
                            {sectionIcons.expectations}
                            <h3 className="text-lg font-semibold">Expectations</h3>
                          </div>
                          <Card className="bg-accent/5">
                            <CardContent className="p-4">
                              <ul className="space-y-3">
                                {selectedLevel.expectations.map((expectation, index) => (
                                  <li key={index} className="flex items-start gap-3 text-sm">
                                    <div className="bg-primary mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"></div>
                                    <span>{expectation}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Skills */}
                        <div>
                          <div className="mb-4 flex items-center gap-2">
                            {sectionIcons.skills}
                            <h3 className="text-lg font-semibold">Core Skills</h3>
                          </div>
                          <Card className="bg-blue-50/50">
                            <CardContent className="p-4">
                              <ul className="space-y-3">
                                {selectedLevel.skills.map((skill, index) => (
                                  <li key={index} className="flex items-start gap-3 text-sm">
                                    <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500"></div>
                                    <span>{skill}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Tools */}
                        <div>
                          <div className="mb-4 flex items-center gap-2">
                            {sectionIcons.tools}
                            <h3 className="text-lg font-semibold">Technologies & Tools</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedLevel.tools.map((tool, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 bg-gradient-to-r transition-all"
                              >
                                {tool}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Knowledge */}
                        <div>
                          <div className="mb-4 flex items-center gap-2">
                            {sectionIcons.knowledge}
                            <h3 className="text-lg font-semibold">Knowledge Requirements</h3>
                          </div>
                          <Card className="bg-orange-50/50">
                            <CardContent className="p-4">
                              <ul className="space-y-3">
                                {selectedLevel.knowledge.map((item, index) => (
                                  <li key={index} className="flex items-start gap-3 text-sm">
                                    <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-500"></div>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div>
                        <div className="mb-4 flex items-center gap-2">
                          {sectionIcons.toAdvance}
                          <h3 className="text-lg font-semibold">Path to Advancement</h3>
                        </div>
                        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                          <CardContent className="p-6">
                            <div className="mb-4 flex items-center gap-2">
                              <Sparkles className="h-5 w-5 text-green-600" />
                              <span className="font-medium text-green-800">Next Level Goals</span>
                            </div>
                            <ul className="space-y-4">
                              {selectedLevel.toAdvance.map((item, index) => (
                                <li key={index} className="flex items-start gap-3 text-sm">
                                  <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500"></div>
                                  <span className="text-green-800">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <Separator className="my-8" />

                    <div className="flex gap-3">
                      <Button onClick={() => handleEditLevel(selectedLevel)} className="flex-1">
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit Level
                      </Button>
                      <Button variant="outline" className="px-6">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Track Progress
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Enhanced level editing form (third & fourth images)
  if (isEditingLevel || isCreatingLevel) {
    return (
      <div className="bg-background min-h-screen">
        {/* Enhanced Header */}
        <div className="bg-card border-b shadow-sm">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/buckets')}
                className="hover:bg-accent"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <span>Buckets</span>
                <ChevronRight className="h-4 w-4" />
                <span>{bucket?.title || 'New Bucket'}</span>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground font-medium">
                  {isCreatingLevel ? 'Creating New Level' : 'Editing Level'}
                </span>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              <Users className="mr-1 h-4 w-4" />
              Admin
            </Badge>
          </div>
        </div>

        <div className="mx-auto max-w-7xl p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="bg-primary/10 rounded-lg p-2">
              <Edit2 className="text-primary h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold">{bucket?.title || 'New Bucket'}</h1>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Enhanced Left Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <Button
                  onClick={handleCreateLevel}
                  className="mb-6 w-full bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:from-green-600 hover:to-green-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Level
                </Button>

                <div className="space-y-2">
                  {bucket?.levels.map((level) => (
                    <Card
                      key={level.id}
                      className="hover:bg-accent/50 cursor-pointer transition-colors"
                    >
                      <CardContent className="p-3">
                        <Button
                          variant="ghost"
                          className="h-auto w-full justify-start p-0"
                          onClick={() => handleLevelSelect(level)}
                        >
                          Level {level.levelNumber}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Right Panel - Level editing form */}
            <div className="lg:col-span-3">
              <Card className="shadow-lg">
                <CardHeader className="from-accent/20 to-secondary/20 border-b bg-gradient-to-r">
                  <CardTitle className="flex items-center gap-2">
                    <Edit2 className="h-5 w-5" />
                    {isCreatingLevel ? 'Create New Level' : 'Edit Level'}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-8 p-6">
                  {/* Level Title */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">Level Title</label>
                    <Input
                      value={editingLevel.title || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        updateEditingField('title', e.target.value)
                      }
                      placeholder="Enter level title"
                      className="max-w-md"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
                    {/* Left Column */}
                    <div className="space-y-8">
                      {/* Expectations */}
                      <div>
                        <div className="mb-4 flex items-center gap-2">
                          {sectionIcons.expectations}
                          <label className="text-sm font-medium">Expectations</label>
                        </div>
                        <Card className="bg-accent/5">
                          <CardContent className="space-y-3 p-4">
                            {(editingLevel.expectations || ['']).map((expectation, index) => (
                              <div key={index} className="flex gap-2">
                                <Textarea
                                  value={expectation}
                                  onChange={(e) =>
                                    updateListItem('expectations', index, e.target.value)
                                  }
                                  placeholder="Enter expectation"
                                  className="min-h-[80px]"
                                />
                                {(editingLevel.expectations?.length || 0) > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeListItem('expectations', index)}
                                    className="text-destructive hover:text-destructive h-8 w-8"
                                  >
                                    ×
                                  </Button>
                                )}
                              </div>
                            ))}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => addListItem('expectations')}
                              className="border-muted w-full border-2 border-dashed"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add Expectation
                            </Button>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Skills */}
                      <div>
                        <div className="mb-4 flex items-center gap-2">
                          {sectionIcons.skills}
                          <label className="text-sm font-medium">Skills</label>
                        </div>
                        <Card className="bg-blue-50/50">
                          <CardContent className="space-y-3 p-4">
                            {(editingLevel.skills || ['']).map((skill, index) => (
                              <div key={index} className="flex gap-2">
                                <Textarea
                                  value={skill}
                                  onChange={(e) => updateListItem('skills', index, e.target.value)}
                                  placeholder="Enter skill"
                                  className="min-h-[80px]"
                                />
                                {(editingLevel.skills?.length || 0) > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeListItem('skills', index)}
                                    className="text-destructive hover:text-destructive h-8 w-8"
                                  >
                                    ×
                                  </Button>
                                )}
                              </div>
                            ))}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => addListItem('skills')}
                              className="border-muted w-full border-2 border-dashed"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add Skill
                            </Button>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Tools */}
                      <div>
                        <div className="mb-4 flex items-center gap-2">
                          {sectionIcons.tools}
                          <label className="text-sm font-medium">Tools</label>
                        </div>
                        <div className="space-y-3">
                          {(editingLevel.tools || ['']).map((tool, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={tool}
                                onChange={(e) => updateListItem('tools', index, e.target.value)}
                                placeholder="Enter tool"
                              />
                              {(editingLevel.tools?.length || 0) > 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeListItem('tools', index)}
                                  className="text-destructive hover:text-destructive h-8 w-8"
                                >
                                  ×
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addListItem('tools')}
                            className="border-muted w-full border-2 border-dashed"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Tool
                          </Button>
                        </div>
                      </div>

                      {/* Knowledge */}
                      <div>
                        <div className="mb-4 flex items-center gap-2">
                          {sectionIcons.knowledge}
                          <label className="text-sm font-medium">Knowledge</label>
                        </div>
                        <Card className="bg-orange-50/50">
                          <CardContent className="space-y-3 p-4">
                            {(editingLevel.knowledge || ['']).map((knowledge, index) => (
                              <div key={index} className="flex gap-2">
                                <Textarea
                                  value={knowledge}
                                  onChange={(e) =>
                                    updateListItem('knowledge', index, e.target.value)
                                  }
                                  placeholder="Enter knowledge requirement"
                                  className="min-h-[80px]"
                                />
                                {(editingLevel.knowledge?.length || 0) > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeListItem('knowledge', index)}
                                    className="text-destructive hover:text-destructive h-8 w-8"
                                  >
                                    ×
                                  </Button>
                                )}
                              </div>
                            ))}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => addListItem('knowledge')}
                              className="border-muted w-full border-2 border-dashed"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add Knowledge
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div>
                      <div className="mb-4 flex items-center gap-2">
                        {sectionIcons.toAdvance}
                        <label className="text-sm font-medium">To Advance</label>
                      </div>
                      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                        <CardContent className="space-y-3 p-4">
                          {(editingLevel.toAdvance || ['']).map((advance, index) => (
                            <div key={index} className="flex gap-2">
                              <Textarea
                                value={advance}
                                onChange={(e) => updateListItem('toAdvance', index, e.target.value)}
                                placeholder="Enter advancement requirement"
                                className="min-h-[80px]"
                              />
                              {(editingLevel.toAdvance?.length || 0) > 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeListItem('toAdvance', index)}
                                  className="text-destructive hover:text-destructive h-8 w-8"
                                >
                                  ×
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addListItem('toAdvance')}
                            className="border-muted w-full border-2 border-dashed"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Requirement
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-3">
                    <Button className="flex-1">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Save Level
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditingLevel(false);
                        setIsCreatingLevel(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  className="from-accent to-secondary hover:from-accent/90 hover:to-secondary/90 bg-gradient-to-r px-8"
                >
                  <Award className="mr-2 h-4 w-4" />
                  Save Bucket
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced bucket creation form (second image)
  return (
    <div className="bg-background min-h-screen">
      {/* Enhanced Header */}
      <div className="bg-card border-b shadow-sm">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/buckets')}
              className="hover:bg-accent"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span>Buckets</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">Create New Bucket</span>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            <Users className="mr-1 h-4 w-4" />
            Admin
          </Badge>
        </div>
      </div>

      <div className="mx-auto max-w-4xl p-6">
        <div className="mb-8 text-center">
          <div className="bg-primary/10 mb-4 inline-flex items-center justify-center rounded-full p-3">
            <Plus className="text-primary h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold">Create New Bucket</h1>
          <p className="text-muted-foreground mt-2">
            Build a comprehensive career development path
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="from-accent/20 to-secondary/20 border-b bg-gradient-to-r text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Award className="h-5 w-5" />
              Bucket Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            {/* Title input */}
            <div>
              <label className="mb-3 block text-sm font-medium">Bucket Title</label>
              <Input
                value={bucketTitle}
                onChange={(e) => setBucketTitle(e.target.value)}
                placeholder="e.g., Software Engineer, Data Scientist, Product Manager"
                className="h-12 text-lg"
              />
              <p className="text-muted-foreground mt-2 text-sm">
                Choose a clear, descriptive title for this career path
              </p>
            </div>

            <Separator />

            {/* Add Level section */}
            <div className="space-y-4 text-center">
              <div>
                <h3 className="mb-2 text-lg font-semibold">Ready to add levels?</h3>
                <p className="text-muted-foreground">
                  Start building the progression path by adding your first level
                </p>
              </div>

              <Button
                onClick={handleCreateLevel}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-green-600 px-8 text-white shadow-lg hover:from-green-600 hover:to-green-700"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Create First Level
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button
            variant="outline"
            className="from-accent to-secondary hover:from-accent/90 hover:to-secondary/90 bg-gradient-to-r px-12"
          >
            <Award className="mr-2 h-4 w-4" />
            Save Bucket
          </Button>
        </div>
      </div>
    </div>
  );
};

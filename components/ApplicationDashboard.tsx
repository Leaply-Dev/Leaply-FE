'use client';

import { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Target, 
  TrendingUp, 
  AlertCircle,
  Globe,
  DollarSign,
  Award,
  BookOpen,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  Info,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { EnhancedApplication } from '@/lib/data/enhancedApplications';
import { useRouter } from 'next/navigation';

interface ApplicationDashboardProps {
  application: EnhancedApplication | null;
}

const statusConfig = {
  draft: { label: 'Draft', variant: 'secondary' as const, icon: FileText },
  submitted: { label: 'Submitted', variant: 'info' as const, icon: CheckCircle2 },
  under_review: { label: 'Under Review', variant: 'warning' as const, icon: Clock },
  accepted: { label: 'Accepted', variant: 'success' as const, icon: CheckCircle2 },
  waitlisted: { label: 'Waitlisted', variant: 'warning' as const, icon: Clock },
  rejected: { label: 'Rejected', variant: 'destructive' as const, icon: AlertCircle },
};

const deadlineTypeIcons = {
  essay: FileText,
  document: FileText,
  payment: DollarSign,
  interview: MessageSquare,
  test: BookOpen,
};

export function ApplicationDashboard({ application }: ApplicationDashboardProps) {
  const router = useRouter();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  if (!application) {
    return (
      <div className="flex items-center justify-center h-full bg-light-grey/30">
        <div className="text-center">
          <FileText className="w-16 h-16 text-mid-grey mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-dark-grey mb-2">
            No Application Selected
          </h3>
          <p className="text-mid-grey">
            Select an application from the sidebar to view details
          </p>
        </div>
      </div>
    );
  }

  const config = statusConfig[application.status];
  const StatusIcon = config.icon;

  // Calculate days until next deadline
  const getNextDeadline = () => {
    if (application.upcomingDeadlines.length === 0) return null;
    const nextDeadline = application.upcomingDeadlines[0];
    const daysUntil = Math.ceil((new Date(nextDeadline.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return { ...nextDeadline, daysUntil };
  };

  const nextDeadline = getNextDeadline();

  return (
    <div className="flex-1 overflow-y-auto bg-light-grey/30">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark-grey mb-2">
              {application.universityName}
            </h1>
            <p className="text-lg text-mid-grey">{application.program}</p>
          </div>
          <Badge variant={config.variant} className="text-sm">
            <StatusIcon className="w-4 h-4 mr-1" />
            {config.label}
          </Badge>
        </div>

        {/* Dashboard Grid - 2 columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Application Status Card - Top Priority */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-leaf-green" />
                Application Status
              </CardTitle>
              <CardDescription>Track your application progress and key metrics</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Key Metrics Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-leaf-green/10 to-light-green/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-leaf-green" />
                    <span className="text-xs font-medium text-mid-grey">Completion</span>
                  </div>
                  <p className="text-2xl font-bold text-leaf-green">{application.completionPercentage}%</p>
                </div>

                <div className="bg-sky-blue/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-sky-blue" />
                    <span className="text-xs font-medium text-mid-grey">Documents</span>
                  </div>
                  <p className="text-2xl font-bold text-sky-blue">{application.documents.length}</p>
                  <p className="text-xs text-mid-grey">uploaded</p>
                </div>

                <div className="bg-warning-orange/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-warning-orange" />
                    <span className="text-xs font-medium text-mid-grey">Tasks</span>
                  </div>
                  <p className="text-2xl font-bold text-warning-orange">
                    {application.tasks.filter(t => t.completed).length}/{application.tasks.length}
                  </p>
                  <p className="text-xs text-mid-grey">completed</p>
                </div>

                <div className="bg-purple-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-medium text-mid-grey">Deadlines</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{application.upcomingDeadlines.length}</p>
                  <p className="text-xs text-mid-grey">upcoming</p>
                </div>
              </div>

              {/* Status Details Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Completion Progress */}
                <div className="space-y-3">
                  <span className="text-sm font-semibold text-dark-grey">Progress</span>
                  <Progress value={application.completionPercentage} className="h-3" />
                  <p className="text-xs text-mid-grey">
                    {application.completionPercentage === 100 
                      ? '✓ Application complete!' 
                      : `${100 - application.completionPercentage}% remaining to complete`}
                  </p>
                </div>

                {/* Status */}
                <div className="space-y-3">
                  <span className="text-sm font-semibold text-dark-grey">Current Status</span>
                  <div className="flex items-center gap-3">
                    <StatusIcon className={cn(
                      'w-10 h-10 p-2 rounded-lg',
                      config.variant === 'success' && 'text-green-600 bg-green-50',
                      config.variant === 'warning' && 'text-warning-orange bg-orange-50',
                      config.variant === 'info' && 'text-sky-blue bg-sky-50',
                      config.variant === 'destructive' && 'text-red-600 bg-red-50',
                      config.variant === 'secondary' && 'text-mid-grey bg-light-grey',
                    )} />
                    <div>
                      <p className="font-semibold text-dark-grey">{config.label}</p>
                      <p className="text-xs text-mid-grey">
                        {application.submissionDate 
                          ? `${new Date(application.submissionDate).toLocaleDateString()}`
                          : 'Not yet submitted'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Next Deadline */}
                <div className="space-y-3">
                  <span className="text-sm font-semibold text-dark-grey">Next Deadline</span>
                  {nextDeadline ? (
                    <div className={cn(
                      'p-3 rounded-lg border-l-4',
                      nextDeadline.daysUntil <= 7 
                        ? 'bg-red-50 border-red-500' 
                        : 'bg-light-grey border-leaf-green'
                    )}>
                      <p className="font-semibold text-dark-grey text-sm mb-1">
                        {nextDeadline.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-mid-grey mb-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(nextDeadline.date).toLocaleDateString()}
                      </div>
                      <p className={cn(
                        'text-xs font-bold',
                        nextDeadline.daysUntil <= 7 ? 'text-red-600' : 'text-leaf-green'
                      )}>
                        {nextDeadline.daysUntil} days remaining
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-green-50 border-l-4 border-green-500">
                      <p className="text-sm text-green-700 font-medium">✓ No pending deadlines</p>
                    </div>
                  )}
                </div>
              </div>

              {application.decisionDeadline && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm bg-sky-blue/10 p-3 rounded-lg">
                    <Info className="w-4 h-4 text-sky-blue flex-shrink-0" />
                    <span className="text-mid-grey">
                      Decision expected by:{' '}
                      <span className="font-semibold text-dark-grey">
                        {new Date(application.decisionDeadline).toLocaleDateString()}
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Evaluation Card */}
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-leaf-green" />
                Profile Evaluation
              </CardTitle>
              <CardDescription>Your fit for this program</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Fit Score */}
              <div className="text-center mb-4 p-4 bg-gradient-to-br from-leaf-green/10 to-light-green/10 rounded-lg">
                <div className="text-4xl font-bold text-leaf-green mb-1">
                  {application.fitScore}%
                </div>
                <p className="text-sm text-mid-grey">Overall Fit Score</p>
              </div>

              {/* Strengths */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-dark-grey mb-2 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Strengths
                </h4>
                <ul className="space-y-2">
                  {application.strengths.slice(0, 2).map((strength, idx) => (
                    <li key={idx} className="text-sm text-mid-grey flex gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="mb-4 flex-1">
                <h4 className="text-sm font-semibold text-dark-grey mb-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 text-warning-orange" />
                  Areas to Consider
                </h4>
                <ul className="space-y-2">
                  {application.weaknesses.slice(0, 2).map((weakness, idx) => (
                    <li key={idx} className="text-sm text-mid-grey flex gap-2">
                      <span className="text-warning-orange font-bold">•</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expand Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full h-10">
                    View Detailed Analysis
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Profile Evaluation Details</DialogTitle>
                    <DialogDescription>
                      Comprehensive analysis of your fit for {application.universityName}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-gradient-to-br from-leaf-green/10 to-light-green/10 rounded-lg">
                      <div className="text-5xl font-bold text-leaf-green mb-2">
                        {application.fitScore}%
                      </div>
                      <p className="text-mid-grey">Overall Fit Score</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-dark-grey mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        Your Strengths
                      </h4>
                      <ul className="space-y-2">
                        {application.strengths.map((strength, idx) => (
                          <li key={idx} className="text-sm text-mid-grey flex gap-2">
                            <span className="text-green-600 font-bold">{idx + 1}.</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-dark-grey mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-warning-orange" />
                        Areas to Consider
                      </h4>
                      <ul className="space-y-2">
                        {application.weaknesses.map((weakness, idx) => (
                          <li key={idx} className="text-sm text-mid-grey flex gap-2">
                            <span className="text-warning-orange font-bold">{idx + 1}.</span>
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* School Info Card */}
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-leaf-green" />
                School Information
              </CardTitle>
              <CardDescription>Key details about this university</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 flex-1 flex flex-col">
              <div className="grid grid-cols-2 gap-4 flex-1">
                <div>
                  <p className="text-xs text-mid-grey mb-1">Location</p>
                  <p className="text-sm font-semibold text-dark-grey">
                    {application.universityCountry}
                  </p>
                  <p className="text-xs text-mid-grey">{application.universityRegion}</p>
                </div>
                
                {application.universityRanking && (
                  <div>
                    <p className="text-xs text-mid-grey mb-1">World Ranking</p>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-warning-orange" />
                      <p className="text-sm font-semibold text-dark-grey">
                        #{application.universityRanking}
                      </p>
                    </div>
                  </div>
                )}

                {application.tuitionRange && (
                  <div className="col-span-2">
                    <p className="text-xs text-mid-grey mb-1">Tuition Range</p>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-leaf-green" />
                      <p className="text-sm font-semibold text-dark-grey">
                        {application.tuitionRange}
                      </p>
                    </div>
                  </div>
                )}

                <div className="col-span-2">
                  <p className="text-xs text-mid-grey mb-1">Program</p>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4 text-sky-blue" />
                    <p className="text-sm font-semibold text-dark-grey">
                      {application.program}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 mt-auto">
                <Button 
                  variant="outline" 
                  className="w-full h-10"
                  onClick={() => router.push(`/universities/${application.universityId}`)}
                >
                  View University Details
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Next Actions Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-leaf-green" />
                Next Actions
              </CardTitle>
              <CardDescription>Tasks to complete for this application</CardDescription>
            </CardHeader>
            <CardContent>
              {application.tasks.length === 0 ? (
                <p className="text-sm text-mid-grey">No tasks to complete</p>
              ) : (
                <div className="space-y-3">
                  {application.tasks
                    .filter(task => !task.completed)
                    .slice(0, 4)
                    .map((task) => {
                      const daysUntil = Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                      const isUrgent = daysUntil <= 7;

                      return (
                        <div 
                          key={task.id}
                          className={cn(
                            'flex items-start gap-3 p-3 rounded-lg border',
                            isUrgent ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
                          )}
                        >
                          <Checkbox 
                            id={task.id}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <label 
                              htmlFor={task.id}
                              className="font-medium text-sm text-dark-grey cursor-pointer"
                            >
                              {task.title}
                            </label>
                            <p className="text-xs text-mid-grey mt-1">
                              {task.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Calendar className="w-3 h-3 text-mid-grey" />
                              <span className="text-xs text-mid-grey">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                              {isUrgent && (
                                <Badge variant="destructive" className="text-xs">
                                  Urgent
                                </Badge>
                              )}
                              {task.priority && (
                                <Badge 
                                  variant={task.priority === 'high' ? 'warning' : 'secondary'}
                                  className="text-xs"
                                >
                                  {task.priority}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  
                  {application.tasks.filter(task => task.completed).length > 0 && (
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-mid-grey mb-2">
                        ✓ {application.tasks.filter(task => task.completed).length} task(s) completed
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resources Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-leaf-green" />
                Helpful Resources
              </CardTitle>
              <CardDescription>Guides and tools to strengthen your application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="justify-start h-[4.5rem]"
                        onClick={() => router.push('/dashboard/resources')}
                      >
                        <FileText className="w-5 h-5 mr-3 text-sky-blue flex-shrink-0" />
                        <div className="text-left">
                          <p className="font-medium text-sm">Essay Writing Guide</p>
                          <p className="text-xs text-mid-grey">Tips for compelling statements</p>
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Learn how to write effective personal statements</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="justify-start h-[4.5rem]"
                        onClick={() => router.push('/dashboard/resources')}
                      >
                        <MessageSquare className="w-5 h-5 mr-3 text-warning-orange flex-shrink-0" />
                        <div className="text-left">
                          <p className="font-medium text-sm">Interview Preparation</p>
                          <p className="text-xs text-mid-grey">Common questions & answers</p>
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Prepare for university interviews</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="justify-start h-[4.5rem]"
                        onClick={() => router.push('/dashboard/resources')}
                      >
                        <DollarSign className="w-5 h-5 mr-3 text-green-600 flex-shrink-0" />
                        <div className="text-left">
                          <p className="font-medium text-sm">Scholarship Finder</p>
                          <p className="text-xs text-mid-grey">Find funding opportunities</p>
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Discover available scholarships</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="justify-start h-[4.5rem]"
                        onClick={() => router.push(`/chatbot?question=${encodeURIComponent(`Help me with my ${application.universityName} application`)}`)}
                      >
                        <Sparkles className="w-5 h-5 mr-3 text-leaf-green flex-shrink-0" />
                        <div className="text-left">
                          <p className="font-medium text-sm">Ask AI Assistant</p>
                          <p className="text-xs text-mid-grey">Get personalized advice</p>
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Chat with AI about this application</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


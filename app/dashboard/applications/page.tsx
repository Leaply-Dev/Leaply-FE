'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { ApplicationCard } from '@/components/ApplicationCard';
import { PageContainer } from '@/components/Layout';
import { useApplicationsStore } from '@/lib/store/applicationsStore';
import { mockApplications } from '@/lib/data/applications';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/PageTransition';

export default function ApplicationsPage() {
  const { applications, setApplications } = useApplicationsStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (applications.length === 0) {
      setApplications(mockApplications);
    }
  }, [applications.length, setApplications]);

  const filteredApplications = applications.filter(app => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  return (
    <PageTransition>
      <PageContainer>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-dark-grey mb-2">
              My Applications
            </h1>
            <p className="text-lg text-mid-grey">
              Track and manage your university applications
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Application
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-sm text-mid-grey">Filter by status:</span>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-48"
          >
            <option value="all">All Applications</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="accepted">Accepted</option>
            <option value="waitlisted">Waitlisted</option>
            <option value="rejected">Rejected</option>
          </Select>
          <span className="text-sm text-mid-grey ml-auto">
            {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Applications Grid */}
        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApplications.map((app) => (
              <StaggerItem key={app.id}>
                <ApplicationCard
                  id={app.id}
                  universityName={app.universityName}
                  program={app.program}
                  status={app.status}
                  submissionDate={app.submissionDate}
                  decisionDeadline={app.decisionDeadline}
                />
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        {filteredApplications.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-dark-grey mb-2">
              No applications found
            </h3>
            <p className="text-mid-grey mb-6">
              {statusFilter === 'all' 
                ? 'Start by exploring universities and creating your first application.'
                : 'No applications match this status filter.'}
            </p>
            {statusFilter === 'all' && (
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Application
              </Button>
            )}
          </div>
        )}
      </PageContainer>
    </PageTransition>
  );
}

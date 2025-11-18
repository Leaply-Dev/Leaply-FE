import { Application, Task } from '../store/applicationsStore';

export const mockApplications: Application[] = [
  {
    id: 'app-001',
    universityId: 'uni-001',
    universityName: 'University of Oxford',
    program: 'Computer Science BSc',
    status: 'submitted',
    submissionDate: '2024-11-01',
    decisionDeadline: '2025-03-15',
    documents: [
      { id: 'doc-001', name: 'Transcript.pdf', type: 'transcript', uploadDate: '2024-10-15' },
      { id: 'doc-002', name: 'Personal_Statement.pdf', type: 'essay', uploadDate: '2024-10-20' },
      { id: 'doc-003', name: 'Reference_Letter_1.pdf', type: 'reference', uploadDate: '2024-10-25' },
    ],
    tasks: [
      { id: 'task-001', applicationId: 'app-001', title: 'Write personal statement', description: 'Craft a compelling personal statement', dueDate: '2024-10-20', completed: true },
      { id: 'task-002', applicationId: 'app-001', title: 'Request reference letters', description: 'Contact two professors', dueDate: '2024-10-25', completed: true },
      { id: 'task-003', applicationId: 'app-001', title: 'Submit application', description: 'Final submission through UCAS', dueDate: '2024-11-01', completed: true },
    ],
    timeline: [
      { id: 'tl-001', date: '2024-10-15', event: 'Application Started', description: 'Created application draft' },
      { id: 'tl-002', date: '2024-11-01', event: 'Application Submitted', description: 'Successfully submitted application' },
    ],
  },
  {
    id: 'app-002',
    universityId: 'uni-002',
    universityName: 'Stanford University',
    program: 'Computer Science BS',
    status: 'under_review',
    submissionDate: '2024-11-10',
    decisionDeadline: '2025-04-01',
    documents: [
      { id: 'doc-004', name: 'Transcript.pdf', type: 'transcript', uploadDate: '2024-10-18' },
      { id: 'doc-005', name: 'SAT_Scores.pdf', type: 'test_scores', uploadDate: '2024-10-22' },
    ],
    tasks: [
      { id: 'task-004', applicationId: 'app-002', title: 'Submit SAT scores', description: 'Send official SAT scores', dueDate: '2024-10-30', completed: true },
      { id: 'task-005', applicationId: 'app-002', title: 'Complete supplemental essays', description: 'Write Stanford-specific essays', dueDate: '2024-11-05', completed: true },
    ],
    timeline: [
      { id: 'tl-003', date: '2024-10-18', event: 'Application Started', description: 'Created application draft' },
      { id: 'tl-004', date: '2024-11-10', event: 'Application Submitted', description: 'Successfully submitted application' },
      { id: 'tl-005', date: '2024-11-15', event: 'Under Review', description: 'Application is being reviewed by admissions committee' },
    ],
  },
  {
    id: 'app-003',
    universityId: 'uni-006',
    universityName: 'University of Toronto',
    program: 'Engineering Science',
    status: 'draft',
    documents: [
      { id: 'doc-006', name: 'Transcript.pdf', type: 'transcript', uploadDate: '2024-11-05' },
    ],
    tasks: [
      { id: 'task-006', applicationId: 'app-003', title: 'Complete application form', description: 'Fill out basic information', dueDate: '2024-12-01', completed: false, priority: 'high' },
      { id: 'task-007', applicationId: 'app-003', title: 'Write statement of intent', description: 'Explain academic interests', dueDate: '2024-12-10', completed: false, priority: 'high' },
    ],
    timeline: [
      { id: 'tl-006', date: '2024-11-05', event: 'Application Started', description: 'Created application draft' },
    ],
  },
];

export const mockTasks: Task[] = [
  { id: 'task-008', title: 'Research scholarships', description: 'Find and apply for merit-based scholarships', dueDate: '2024-12-15', completed: false, priority: 'medium' },
  { id: 'task-009', title: 'Prepare for IELTS exam', description: 'Study for upcoming IELTS test', dueDate: '2024-12-20', completed: false, priority: 'high' },
  { id: 'task-010', title: 'Update CV', description: 'Add recent achievements and experiences', dueDate: '2024-11-25', completed: false, priority: 'medium' },
  { id: 'task-011', title: 'Request transcript', description: 'Order official transcript from university', dueDate: '2024-11-30', completed: false, priority: 'high' },
];


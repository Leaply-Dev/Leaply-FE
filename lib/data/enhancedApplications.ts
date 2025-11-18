import { Application } from '../store/applicationsStore';

export interface EnhancedApplication extends Application {
  fitScore: number; // 0-100
  completionPercentage: number; // 0-100
  reminders: string[]; // Max 2 tags shown
  universityLogo: string;
  universityRanking?: number;
  universityCountry: string;
  universityRegion: string;
  tuitionRange?: string;
  strengths: string[];
  weaknesses: string[];
  upcomingDeadlines: {
    title: string;
    date: string;
    type: 'essay' | 'document' | 'payment' | 'interview' | 'test';
  }[];
}

export const mockEnhancedApplications: EnhancedApplication[] = [
  {
    id: 'app-001',
    universityId: 'uni-001',
    universityName: 'University of Oxford',
    universityLogo: 'https://logo.clearbit.com/ox.ac.uk',
    universityCountry: 'United Kingdom',
    universityRegion: 'Europe',
    universityRanking: 1,
    program: 'Computer Science BSc',
    status: 'submitted',
    submissionDate: '2024-11-01',
    decisionDeadline: '2025-03-15',
    fitScore: 92,
    completionPercentage: 100,
    reminders: [],
    tuitionRange: '£28,000 - £32,000',
    strengths: [
      'Strong academic profile matches Oxford\'s high standards',
      'Your research interests align with their CS department',
      'Extracurriculars demonstrate leadership potential',
    ],
    weaknesses: [
      'Interview preparation could strengthen your candidacy',
      'Consider highlighting more independent projects',
    ],
    upcomingDeadlines: [
      {
        title: 'Decision notification',
        date: '2025-03-15',
        type: 'document',
      },
    ],
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
    universityLogo: 'https://logo.clearbit.com/stanford.edu',
    universityCountry: 'United States',
    universityRegion: 'North America',
    universityRanking: 2,
    program: 'Computer Science BS',
    status: 'under_review',
    submissionDate: '2024-11-10',
    decisionDeadline: '2025-04-01',
    fitScore: 88,
    completionPercentage: 100,
    reminders: ['Interview soon'],
    tuitionRange: '$56,000 - $58,000',
    strengths: [
      'Excellent academic credentials meet Stanford standards',
      'Silicon Valley proximity aligns with your tech career goals',
      'Strong SAT scores make you competitive',
    ],
    weaknesses: [
      'Very competitive acceptance rate (3.9%)',
      'Consider developing more entrepreneurial projects',
    ],
    upcomingDeadlines: [
      {
        title: 'Alumni interview',
        date: '2024-12-05',
        type: 'interview',
      },
      {
        title: 'Decision notification',
        date: '2025-04-01',
        type: 'document',
      },
    ],
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
    universityLogo: 'https://logo.clearbit.com/utoronto.ca',
    universityCountry: 'Canada',
    universityRegion: 'North America',
    universityRanking: 18,
    program: 'Engineering Science',
    status: 'draft',
    fitScore: 85,
    completionPercentage: 45,
    reminders: ['Need Essay', 'Payment due'],
    tuitionRange: 'CAD $58,000 - $61,000',
    strengths: [
      'Strong engineering program matches your interests',
      'Affordable tuition compared to US universities',
      'Diverse campus environment',
    ],
    weaknesses: [
      'Application incomplete - essay still needed',
      'Strong competition in Engineering Science program',
    ],
    upcomingDeadlines: [
      {
        title: 'Statement of Intent',
        date: '2024-12-10',
        type: 'essay',
      },
      {
        title: 'Application fee payment',
        date: '2024-12-15',
        type: 'payment',
      },
      {
        title: 'Application deadline',
        date: '2025-01-15',
        type: 'document',
      },
    ],
    documents: [
      { id: 'doc-006', name: 'Transcript.pdf', type: 'transcript', uploadDate: '2024-11-05' },
    ],
    tasks: [
      { id: 'task-006', applicationId: 'app-003', title: 'Complete application form', description: 'Fill out basic information', dueDate: '2024-12-01', completed: false, priority: 'high' },
      { id: 'task-007', applicationId: 'app-003', title: 'Write statement of intent', description: 'Explain academic interests', dueDate: '2024-12-10', completed: false, priority: 'high' },
      { id: 'task-008', applicationId: 'app-003', title: 'Pay application fee', description: 'Submit CAD $150 application fee', dueDate: '2024-12-15', completed: false, priority: 'high' },
    ],
    timeline: [
      { id: 'tl-006', date: '2024-11-05', event: 'Application Started', description: 'Created application draft' },
    ],
  },
  {
    id: 'app-004',
    universityId: 'uni-003',
    universityName: 'ETH Zurich',
    universityLogo: 'https://logo.clearbit.com/ethz.ch',
    universityCountry: 'Switzerland',
    universityRegion: 'Europe',
    universityRanking: 7,
    program: 'Computer Science MSc',
    status: 'draft',
    fitScore: 90,
    completionPercentage: 30,
    reminders: ['Scholarship', 'Transcript'],
    tuitionRange: 'CHF 1,200/year',
    strengths: [
      'Excellent value with low tuition fees',
      'World-class research opportunities',
      'Your academic background is competitive',
    ],
    weaknesses: [
      'Language requirement - German proficiency needed',
      'Highly selective for international students',
    ],
    upcomingDeadlines: [
      {
        title: 'Submit official transcripts',
        date: '2024-12-01',
        type: 'document',
      },
      {
        title: 'Scholarship application',
        date: '2024-12-20',
        type: 'document',
      },
      {
        title: 'Application deadline',
        date: '2025-01-31',
        type: 'document',
      },
    ],
    documents: [],
    tasks: [
      { id: 'task-009', applicationId: 'app-004', title: 'Order official transcripts', description: 'Request from university registrar', dueDate: '2024-12-01', completed: false, priority: 'high' },
      { id: 'task-010', applicationId: 'app-004', title: 'Research scholarship opportunities', description: 'Apply for ETH Excellence Scholarship', dueDate: '2024-12-20', completed: false, priority: 'medium' },
      { id: 'task-011', applicationId: 'app-004', title: 'Prepare motivation letter', description: 'Write compelling motivation letter', dueDate: '2025-01-15', completed: false, priority: 'high' },
    ],
    timeline: [
      { id: 'tl-007', date: '2024-11-12', event: 'Application Started', description: 'Created application draft' },
    ],
  },
  {
    id: 'app-005',
    universityId: 'uni-010',
    universityName: 'National University of Singapore',
    universityLogo: 'https://logo.clearbit.com/nus.edu.sg',
    universityCountry: 'Singapore',
    universityRegion: 'Asia',
    universityRanking: 8,
    program: 'Information Systems',
    status: 'submitted',
    submissionDate: '2024-11-15',
    decisionDeadline: '2025-03-30',
    fitScore: 87,
    completionPercentage: 100,
    reminders: [],
    tuitionRange: 'SGD $30,000 - $40,000',
    strengths: [
      'Strong program ranking in Asia',
      'Vibrant tech ecosystem in Singapore',
      'Good scholarship opportunities available',
    ],
    weaknesses: [
      'Distance from home may be challenging',
      'Climate adjustment required',
    ],
    upcomingDeadlines: [
      {
        title: 'Decision notification',
        date: '2025-03-30',
        type: 'document',
      },
    ],
    documents: [
      { id: 'doc-007', name: 'Transcript.pdf', type: 'transcript', uploadDate: '2024-10-28' },
      { id: 'doc-008', name: 'Personal_Statement.pdf', type: 'essay', uploadDate: '2024-11-08' },
      { id: 'doc-009', name: 'IELTS_Scores.pdf', type: 'test_scores', uploadDate: '2024-11-10' },
    ],
    tasks: [
      { id: 'task-012', applicationId: 'app-005', title: 'Submit IELTS scores', description: 'Upload official test results', dueDate: '2024-11-10', completed: true },
      { id: 'task-013', applicationId: 'app-005', title: 'Complete online application', description: 'Fill out NUS application portal', dueDate: '2024-11-15', completed: true },
    ],
    timeline: [
      { id: 'tl-008', date: '2024-10-28', event: 'Application Started', description: 'Created application draft' },
      { id: 'tl-009', date: '2024-11-15', event: 'Application Submitted', description: 'Successfully submitted application' },
    ],
  },
];


# Admin Frontend Specification

## Overview

This document provides the API specification and implementation guidelines for the Leaply Admin Dashboard frontend.

## Authentication & Authorization

### Role System
| Role | Value | Permissions |
|------|-------|-------------|
| Regular User | `user` | No admin access |
| Data Admin | `data_admin` | Full CRUD on universities, programs, intakes; View users; CSV import |
| Super Admin | `super_admin` | All data_admin permissions + Delete users + Change user roles |

### Auth Response
The login/register response includes the user's role at the root level of the data object:

```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "admin@leaply.ai",
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "role": "super_admin",
    "onboardingCompleted": true
  }
}
```

> **Note:** The role is at `data.role`, not nested in a user object.

### Access Control
- Store role in auth state after login
- Route guard: Only allow access to `/admin/*` if role is `data_admin` or `super_admin`
- Conditionally render delete/role buttons based on `super_admin` role

---

## API Endpoints

Base URL: `/v1/admin`

All endpoints require `Authorization: Bearer <token>` header with a valid JWT from a user with `data_admin` or `super_admin` role.

### Common Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page (0-indexed)
}
```

### Date/Time Format Standards
| Type | Format | Example |
|------|--------|---------|
| Date | `YYYY-MM-DD` | `2025-09-01` |
| Datetime | ISO 8601 | `2025-01-15T10:30:00Z` |

- **Dates** (e.g., deadlines, start dates): Use `YYYY-MM-DD` format
- **Timestamps** (e.g., createdAt, lastActiveAt): Use full ISO 8601 format

---

## 1. Dashboard Stats

### GET `/v1/admin/stats`
Returns aggregated statistics for the admin dashboard.

**Response:**
```typescript
interface DashboardStatsResponse {
  totalUsers: number;
  activeUsers: number;        // Active in last 30 days
  newUsersThisMonth: number;  // Registered this month
  onboardedUsers: number;     // Completed onboarding

  totalUniversities: number;
  totalPrograms: number;

  applicationsByStatus: {
    planning: number;
    writing: number;
    submitted: number;
    accepted: number;
    rejected: number;
  };

  upcomingDeadlines: number;  // Intakes with deadlines in next 30 days
}
```

**Frontend Usage:**
- Display in dashboard cards/widgets
- Refresh on page load or manual refresh button

---

## 2. User Management

### GET `/v1/admin/users`
List all users with pagination and filtering.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| page | number | Page number (0-indexed, default: 0) |
| size | number | Page size (default: 20, max: 100) |
| search | string | Search by name or email |
| role | string | Filter by role: `user`, `data_admin`, `super_admin` |

**Response:**
```typescript
interface UserAdminResponse {
  id: string;
  email: string;
  fullName: string | null;    // From user_profiles table
  role: string;               // 'user' | 'data_admin' | 'super_admin'
  onboardingCompleted: boolean;
  profileCompletion: number;  // 0-100 percentage
  lastActiveAt: string | null; // ISO 8601 datetime
  createdAt: string;          // ISO 8601 datetime
}
```

### DELETE `/v1/admin/users/{id}`
**Super Admin Only** - Delete a user account.

**Response:** `204 No Content`

**Frontend Notes:**
- Show confirmation modal before delete
- Display warning: "This will permanently delete the user and all their data"

### PATCH `/v1/admin/users/{id}/role`
**Super Admin Only** - Update user's role.

**Request:**
```typescript
interface UserRoleUpdateRequest {
  role: 'user' | 'data_admin' | 'super_admin';
}
```

**Response:** Returns updated `UserAdminResponse`

**Frontend Notes:**
- Use dropdown/select for role selection
- Prevent changing own role (disable for current user)

---

## 3. University Management

### GET `/v1/admin/universities`
List universities with pagination and filtering.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| page | number | Page number (0-indexed) |
| size | number | Page size (default: 20) |
| search | string | Search by university name |
| country | string | Filter by country |

**Response:**
```typescript
interface UniversityAdminResponse {
  id: string;
  name: string;
  nameLocal: string | null;
  country: string;
  city: string | null;
  region: string | null;
  type: string | null;        // 'public' | 'private' | etc.
  rankingQs: number | null;
  rankingTimes: number | null;
  rankingNational: number | null;
  primaryLanguage: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  description: string | null;
  programCount: number;       // Number of active programs
  createdAt: string;          // ISO 8601 datetime
  updatedAt: string;          // ISO 8601 datetime
  createdBy: string | null;   // UUID of admin who created
  updatedBy: string | null;   // UUID of admin who last updated
}
```

### GET `/v1/admin/universities/{id}`
Get single university details.

### POST `/v1/admin/universities`
Create a new university.

**Request:**
```typescript
interface UniversityCreateRequest {
  name: string;               // Required
  nameLocal?: string;
  country: string;            // Required
  city?: string;
  region?: string;
  type?: string;
  rankingQs?: number;
  rankingTimes?: number;
  rankingNational?: number;
  primaryLanguage?: string;   // Default: 'english'
  logoUrl?: string;
  websiteUrl?: string;
  description?: string;
}
```

### PUT `/v1/admin/universities/{id}`
Update an existing university.

**Request:** Same as create, all fields optional.

### DELETE `/v1/admin/universities/{id}`
Soft delete a university (sets `deleted_at` timestamp).

**Response:** `204 No Content`

---

## 4. Program Management

### GET `/v1/admin/programs`
List programs with pagination and filtering.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| page | number | Page number (0-indexed) |
| size | number | Page size (default: 20) |
| universityId | string | Filter by university UUID |
| country | string | Filter by university's country |
| search | string | Search by program name |

**Response:**
```typescript
interface ProgramAdminResponse {
  id: string;
  universityId: string;
  universityName: string;
  name: string;
  degreeType: string;         // 'bachelor' | 'master' | 'phd' | etc.
  degreeName: string | null;
  majorCategories: string[] | null;
  majorSubcategory: string | null;
  durationMonths: number | null;
  deliveryMode: string | null; // 'on-campus' | 'online' | 'hybrid'
  language: string;
  tuition: {
    annualUsd?: number;
    totalUsd?: number;
    currency?: string;
    amount?: number;
  } | null;
  applicationFeeUsd: number | null;
  scholarshipAvailable: boolean;
  scholarshipNotes: string | null;
  description: string | null;
  requirements: {
    gpaMinimum?: number;
    ieltsMinimum?: number;
    toeflMinimum?: number;
    greRequired?: boolean;
    gmatRequired?: boolean;
    workExperienceYears?: number;
  } | null;
  programUrl: string | null;
  admissionsUrl: string | null;
  intakeCount: number;        // Number of intakes
  createdAt: string;          // ISO 8601 datetime
  updatedAt: string;          // ISO 8601 datetime
  createdBy: string | null;
  updatedBy: string | null;
}
```

### GET `/v1/admin/programs/{id}`
Get single program details.

### POST `/v1/admin/programs`
Create a new program.

**Request:**
```typescript
interface ProgramCreateRequest {
  universityId: string;       // Required
  name: string;               // Required
  degreeType: string;         // Required
  degreeName?: string;
  majorCategories?: string[];
  majorSubcategory?: string;
  durationMonths?: number;
  deliveryMode?: string;
  language?: string;          // Default: 'english'
  tuition?: object;
  applicationFeeUsd?: number;
  scholarshipAvailable?: boolean;
  scholarshipNotes?: string;
  description?: string;
  requirements?: object;
  programUrl?: string;
  admissionsUrl?: string;
}
```

### PUT `/v1/admin/programs/{id}`
Update an existing program.

### DELETE `/v1/admin/programs/{id}`
Soft delete a program.

---

## 5. Intake Management

Intakes are specific admission periods for programs.

> **Cross-reference:** Intakes are always accessed in the context of a program. Use `GET /v1/admin/programs/{id}` to get program details first, then list its intakes.

### GET `/v1/admin/programs/{programId}/intakes`
List intakes for a specific program. This is the primary endpoint for viewing intakes.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| page | number | Page number (0-indexed) |
| size | number | Page size (default: 20) |

**Response:**
```typescript
interface IntakeAdminResponse {
  id: string;
  programId: string;
  programName: string;
  universityName: string;
  intakeSeason: string;       // e.g., 'Fall 2025', 'Spring 2026'
  intakeNotes: string | null;
  applicationStartDate: string | null; // YYYY-MM-DD
  applicationDeadline: string | null;  // YYYY-MM-DD
  earlyDeadline: string | null;        // YYYY-MM-DD
  decisionDate: string | null;         // YYYY-MM-DD
  startDate: string | null;            // YYYY-MM-DD
  tuitionForIntake: number | null;     // Integer, tuition amount for this intake
  isActive: boolean;
  createdAt: string;          // ISO 8601 datetime
  createdBy: string | null;
  updatedBy: string | null;
}
```

### GET `/v1/admin/intakes/{id}`
Get single intake details.

### POST `/v1/admin/programs/{programId}/intakes`
Create a new intake for a program.

**Request:**
```typescript
interface IntakeCreateRequest {
  intakeSeason: string;       // Required, e.g., 'Fall 2025'
  intakeNotes?: string;
  applicationStartDate?: string;  // YYYY-MM-DD
  applicationDeadline?: string;   // YYYY-MM-DD
  earlyDeadline?: string;         // YYYY-MM-DD
  decisionDate?: string;          // YYYY-MM-DD
  startDate?: string;             // YYYY-MM-DD
  tuitionForIntake?: number;      // Integer amount
  isActive?: boolean;             // Default: true
}
```

### PUT `/v1/admin/intakes/{id}`
Update an existing intake.

### DELETE `/v1/admin/intakes/{id}`
Hard delete an intake.

---

## 6. CSV Import

> **Note:** All date fields in CSV imports should use `YYYY-MM-DD` format.

### GET `/v1/admin/import/templates/{type}`
Download a CSV template file for the specified entity type.

**Path Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| type | string | Entity type: `universities`, `programs`, or `intakes` |

**Response:** CSV file download with headers and example row.

> **Status:** Suggested endpoint - not yet implemented.

---

### POST `/v1/admin/import/universities`
Bulk import universities from CSV file.

**Request:** `multipart/form-data`
- `file`: CSV file

**CSV Columns:**
| Column | Required | Description |
|--------|----------|-------------|
| name | Yes | University name |
| country | Yes | Country code or name |
| name_local | No | Local language name |
| city | No | City |
| region | No | Region/state |
| type | No | public/private |
| ranking_qs | No | QS World ranking |
| ranking_times | No | Times Higher Ed ranking |
| ranking_national | No | National ranking |
| primary_language | No | Default: english |
| logo_url | No | Logo image URL |
| website_url | No | Official website |
| description | No | Description text |

**Response:**
```typescript
interface ImportResultResponse {
  total: number;      // Total rows processed
  created: number;    // New records created
  updated: number;    // Existing records updated
  skipped: number;    // Rows skipped due to errors
  errors: Array<{
    row: number;      // 1-indexed row number
    message: string;  // Error description
  }>;
}
```

### POST `/v1/admin/import/programs`
Bulk import programs from CSV file.

**CSV Columns:**
| Column | Required | Description |
|--------|----------|-------------|
| university_name | Yes | Must match existing university |
| name | Yes | Program name |
| degree_type | Yes | bachelor/master/phd/etc. |
| degree_name | No | e.g., "Bachelor of Science" |
| major_category | No | Comma-separated categories |
| major_subcategory | No | Subcategory |
| duration_months | No | Program duration |
| delivery_mode | No | on-campus/online/hybrid |
| language | No | Default: english |
| tuition_annual_usd | No | Annual tuition in USD |
| tuition_total_usd | No | Total tuition in USD |
| gpa_minimum | No | Minimum GPA requirement |
| ielts_minimum | No | Minimum IELTS score |
| toefl_minimum | No | Minimum TOEFL score |
| gre_required | No | true/false/yes/no/1/0 |
| gmat_required | No | true/false/yes/no/1/0 |
| work_experience_years | No | Years of work experience |
| scholarship_available | No | true/false |
| description | No | Program description |
| program_url | No | Program page URL |
| admissions_url | No | Admissions page URL |

### POST `/v1/admin/import/intakes`
Bulk import program intakes from CSV file.

**CSV Columns:**
| Column | Required | Description |
|--------|----------|-------------|
| university_name | Yes | Must match existing university |
| program_name | Yes | Must match existing program |
| intake_season | Yes | e.g., "Fall 2025", "Spring 2026" |
| intake_notes | No | Additional notes |
| application_start_date | No | YYYY-MM-DD |
| application_deadline | No | YYYY-MM-DD |
| early_deadline | No | YYYY-MM-DD |
| decision_date | No | YYYY-MM-DD |
| start_date | No | YYYY-MM-DD |
| is_active | No | true/false (default: true) |

---

## Frontend Implementation Notes

### Recommended Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **UI Library:** shadcn/ui + Tailwind CSS
- **State Management:** TanStack Query (React Query) for server state
- **Forms:** React Hook Form + Zod validation
- **Tables:** TanStack Table

### Page Structure
```
/admin
├── /dashboard          # Stats overview
├── /users              # User management
├── /universities       # University CRUD
│   └── /[id]           # University detail/edit
├── /programs           # Program CRUD
│   └── /[id]           # Program detail/edit
│       └── /intakes    # Intake management
└── /import             # CSV import page
```

### Component Suggestions

#### Dashboard
- Stats cards with icons
- Quick links to main sections
- Recent activity feed (optional)

#### Data Tables
```typescript
// Reusable table with:
- Server-side pagination
- Search input (debounced)
- Filter dropdowns
- Sort by columns
- Row actions (Edit, Delete)
- Bulk selection (optional)
```

#### Forms
```typescript
// University/Program forms:
- Use multi-step or tabbed layout for complex forms
- Validation with clear error messages
- Auto-save drafts (optional)
- Preview before submit (optional)
```

#### Import Page
```typescript
// CSV Import workflow:
1. Upload area with drag-and-drop
2. Preview first few rows
3. Column mapping verification
4. Import progress indicator
5. Results summary with error details
```

### Error Handling

```typescript
// Common error responses:
401 Unauthorized - Redirect to login
403 Forbidden - Show "Access Denied" message
404 Not Found - Show "Resource not found"
400 Bad Request - Display validation errors
500 Server Error - Show generic error with retry option
```

### State Management Pattern

```typescript
// Using TanStack Query
const { data, isLoading, error } = useQuery({
  queryKey: ['admin', 'universities', { page, search, country }],
  queryFn: () => adminApi.getUniversities({ page, search, country }),
});

// Mutations with cache invalidation
const createMutation = useMutation({
  mutationFn: adminApi.createUniversity,
  onSuccess: () => {
    queryClient.invalidateQueries(['admin', 'universities']);
  },
});
```

### Security Considerations

1. **Token Storage:** Store JWT in httpOnly cookie or secure storage
2. **Role Checks:** Double-check role on both client and server
3. **CSRF:** Use CSRF tokens for state-changing operations
4. **Input Sanitization:** Sanitize all user inputs
5. **Rate Limiting:** Implement client-side throttling for API calls

---

## Sample API Client

```typescript
// api/admin.ts
import axios from 'axios';

const adminApi = axios.create({
  baseURL: '/v1/admin',
  headers: {
    'Content-Type': 'application/json',
  },
});

adminApi.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const admin = {
  // Stats
  getStats: () => adminApi.get('/stats'),

  // Users
  getUsers: (params: UserListParams) =>
    adminApi.get('/users', { params }),
  deleteUser: (id: string) =>
    adminApi.delete(`/users/${id}`),
  updateUserRole: (id: string, role: string) =>
    adminApi.patch(`/users/${id}/role`, { role }),

  // Universities
  getUniversities: (params: UniversityListParams) =>
    adminApi.get('/universities', { params }),
  getUniversity: (id: string) =>
    adminApi.get(`/universities/${id}`),
  createUniversity: (data: UniversityCreateRequest) =>
    adminApi.post('/universities', data),
  updateUniversity: (id: string, data: UniversityUpdateRequest) =>
    adminApi.put(`/universities/${id}`, data),
  deleteUniversity: (id: string) =>
    adminApi.delete(`/universities/${id}`),

  // Programs
  getPrograms: (params: ProgramListParams) =>
    adminApi.get('/programs', { params }),
  getProgram: (id: string) =>
    adminApi.get(`/programs/${id}`),
  createProgram: (data: ProgramCreateRequest) =>
    adminApi.post('/programs', data),
  updateProgram: (id: string, data: ProgramUpdateRequest) =>
    adminApi.put(`/programs/${id}`, data),
  deleteProgram: (id: string) =>
    adminApi.delete(`/programs/${id}`),

  // Intakes
  getIntakes: (programId: string, params: PageParams) =>
    adminApi.get(`/programs/${programId}/intakes`, { params }),
  getIntake: (id: string) =>
    adminApi.get(`/intakes/${id}`),
  createIntake: (programId: string, data: IntakeCreateRequest) =>
    adminApi.post(`/programs/${programId}/intakes`, data),
  updateIntake: (id: string, data: IntakeUpdateRequest) =>
    adminApi.put(`/intakes/${id}`, data),
  deleteIntake: (id: string) =>
    adminApi.delete(`/intakes/${id}`),

  // Import
  downloadTemplate: (type: 'universities' | 'programs' | 'intakes') =>
    adminApi.get(`/import/templates/${type}`, { responseType: 'blob' }),
  importUniversities: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return adminApi.post('/import/universities', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  importPrograms: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return adminApi.post('/import/programs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  importIntakes: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return adminApi.post('/import/intakes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2025-01-XX | Fixed auth response structure, aligned application status enum with backend, standardized date formats, updated UserAdminResponse/IntakeAdminResponse to match backend, added template endpoint suggestion |
| 1.0.0 | 2025-01-XX | Initial admin API specification |

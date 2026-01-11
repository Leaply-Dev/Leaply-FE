# Mock Data Generators

This directory contains mock data generators using [Faker.js](https://fakerjs.dev/) based on the API schema defined in `lib/api/types.ts`.

## Installation

The `@faker-js/faker` package is already installed as a dev dependency.

## Usage

### Basic Usage

```typescript
import { 
  generateProgramListItemResponse, 
  generateUserMeResponse,
  generateApplicationResponse 
} from '@/lib/mock';

// Generate a single instance
const program = generateProgramListItemResponse();
const user = generateUserMeResponse();
const application = generateApplicationResponse();
```

### Generating Multiple Instances

```typescript
import { generateMany, generateRandom } from '@/lib/mock';
import { generateProgramListItemResponse } from '@/lib/mock';

// Generate exactly 10 programs
const programs = generateMany(generateProgramListItemResponse, 10);

// Generate a random number between 5 and 15
const randomPrograms = generateRandom(generateProgramListItemResponse, 5, 15);
```

### Complete Examples

#### Generate Program List Response

```typescript
import { generateProgramListResponse } from '@/lib/mock';

// Generate a paginated program list
const programList = generateProgramListResponse(20, 1, 20);
// Returns: { data: ProgramListItemResponse[], pagination: PaginationResponse }
```

#### Generate AI Match Response

```typescript
import { generateAiMatchResponse } from '@/lib/mock';

// Generate AI-matched programs categorized by fit
const aiMatch = generateAiMatchResponse();
// Returns: { reach: [], target: [], safety: [], ... }
```

#### Generate Home Dashboard Data

```typescript
import { generateHomeResponse } from '@/lib/mock';

// Generate complete home dashboard data
const homeData = generateHomeResponse();
// Returns: { firstName, profileCompletion, discovery, applications, ... }
```

#### Generate Persona State

```typescript
import { generatePersonaStateResponse } from '@/lib/mock';

// Generate complete persona lab state
const personaState = generatePersonaStateResponse();
// Returns: { tracks, nodes, archetype, conversationHistory, ... }
```

## Available Generators

### Authentication
- `generateRegisterRequest()` - Register request data
- `generateLoginRequest()` - Login request data
- `generateAuthResponse()` - Authentication response with tokens

### User & Profile
- `generateUserInfo()` - Basic user information
- `generateProfileInfo()` - User profile data
- `generatePreferencesInfo()` - User preferences
- `generateUserContextResponse()` - Complete user context
- `generateProfileResponse()` - Profile response
- `generateUserMeResponse()` - Complete user/me response

### Onboarding
- `generateOnboardingDataResponse()` - Onboarding progress data
- `generateOnboardingStatusResponse()` - Current onboarding status
- `generateOnboardingResponse()` - Onboarding step response

### Explore
- `generateProgramListItemResponse()` - Single program list item
- `generateProgramDetailResponse()` - Complete program details
- `generateProgramListResponse(count, page, size)` - Paginated program list
- `generateProgramIntakeResponse()` - Program intake information
- `generateTuitionResponse()` - Tuition information
- `generateRequirementsResponse()` - Admission requirements
- `generateFilterOptionsResponse()` - Available filter options
- `generateAiMatchResponse()` - AI-matched programs by category
- `generatePaginationResponse(page, size, total)` - Pagination metadata

### Applications
- `generateApplicationResponse()` - Single application
- `generateApplicationListResponse()` - List of applications with summary
- `generateApplicationSummaryDto()` - Application statistics
- `generateUpcomingDeadlineDto()` - Upcoming deadline information
- `generateProgramSummaryDto()` - Program summary for applications
- `generateGapDto()` - Application gap information
- `generateApplicationSopResponse()` - Statement of Purpose data
- `generateSopFeedbackDto()` - SOP feedback
- `generateEvaluationResponse()` - Application evaluation with gaps

### Persona Lab
- `generatePersonaStateResponse()` - Complete persona state
- `generateTrackDto()` - Track information
- `generateArchetypeDto()` - Archetype data
- `generateCanvasNodeDto()` - Canvas node
- `generateChatMessageDto()` - Chat message
- `generateTrackSelectResponse()` - Track selection response
- `generateMessageResponse()` - Message response with state

### Home Dashboard
- `generateHomeResponse()` - Complete home dashboard data
- `generateDiscoveryProgressDto()` - Discovery progress
- `generateSuggestedActionDto()` - Suggested action
- `generateRecentApplicationDto()` - Recent application summary

## Helper Functions

- `generateMany<T>(generator, count)` - Generate exactly N instances
- `generateRandom<T>(generator, min, max)` - Generate random number of instances

## Notes

- All generators use realistic data ranges based on the API schema
- Dates are generated as ISO strings
- IDs are generated as UUIDs
- Optional fields use `faker.helpers.maybe()` with appropriate probabilities
- Arrays use `faker.helpers.arrayElements()` with min/max counts
- Fit scores and categories are correlated (reach = 50-70, target = 71-85, safety = 86-100)

## Type Safety

All generators return properly typed objects matching the API schema types from `lib/api/types.ts`. TypeScript will provide full type checking and autocomplete.


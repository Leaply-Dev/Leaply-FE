# Data Requirements per Screen

This document outlines the types of data needed to display each screen in the Leaply application.  It serves as a reference when designing the database schema, API endpoints and GraphQL queries.

**Demo note:** For the prototype, this data will be provided as static JSON or Zustand store initial state. The UI should not depend on any external API calls during the demo.

## Landing Page

The landing page is largely static and does not require dynamic data beyond configurable marketing copy and testimonials.  Consider storing these in a CMS (e.g. Markdown or a headless CMS) to allow content updates without deploying code.

## Onboarding

- **Sign‑up / Login**: Requires only basic form data (email, password) and optional OAuth tokens. Ensure secure handling of credentials.
- **Profile information**: Store user attributes such as:
  - Full name
  - Date of birth
  - Nationality / citizenship
  - Current education level (e.g., high school, undergraduate)
  - GPA or average grade
  - Standardised test scores (e.g., IELTS/TOEFL, SAT/ACT)
  - Intended start year / term
  - Optional profile picture
- **Preference quiz**: Capture responses to preference questions:
  - Desired major or field of study
  - Preferred study region(s)
  - Annual budget range (tuition + living costs)
  - Campus setting preference (urban, suburban, rural)
  - Languages of instruction
  - Interest in extracurriculars or research opportunities
  - Any special needs (accommodation, accessibility, etc.)
- **Summary**: Generate recommendation data based on the above. This may require calls to an AI service or matching algorithm. The summary should return a ranked list of university IDs and a short explanation.

## University Discovery

- **Search page**:
  - List of universities with the following fields: `id`, `name`, `country`, `region`, `ranking`, `logo/url`, `average tuition`, `overview summary`.
  - Filter data: lists of countries, majors, ranking ranges, tuition ranges.
- **University detail page**:
  - Core details: name, location, founding year, public/private status, website URL.
  - Academic information: list of degree programs (name, level, duration, requirements), acceptance rate, average entry GPA/test scores.
  - Financial information: tuition fees per program, available scholarships and grants, cost of living estimate.
  - Facilities & student life: housing options, clubs, sports, research facilities, ranking metrics.
  - Application requirements: required documents, deadlines, application fee, test scores, essays.
  - Reviews or testimonials (optional): rating, comments from current/former students.

## Dashboard

- **Overview**:
  - Number of saved universities (IDs with minimal details: name, country).
  - Number of active applications and statuses.
  - Next upcoming task deadlines.
- **Applications list**:
  - For each application: `applicationId`, `universityId`, `program`, `status`, `submissionDate`, `decisionDeadline`.
- **Application details**:
  - Extended application data: personal statement, uploaded documents (transcripts, certificates), recommendation letters, payment receipts.
  - Checklist of tasks (see below).
  - Timeline of status updates (submitted, under review, accepted, waitlisted, rejected).
- **Tasks**:
  - Each task has: `taskId`, `applicationId` (optional if generic), `title`, `description`, `dueDate`, `completed` (boolean).
- **Resources**:
  - List of articles or guides: `resourceId`, `title`, `summary`, `url`, `type` (article/video), `tags` (e.g., essays, scholarships).
- **Profile**:
  - All user profile fields collected during onboarding plus any subsequent edits (address, phone number, updated scores).

## Chatbot

The chatbot needs conversational context and the ability to fetch data relevant to the user.

- **Messages**: Each chat message should store `messageId`, `userId`, `timestamp`, `role` (user/assistant), `content`. Optionally include meta fields like detected intent.
- **Context**: For personalised suggestions, the bot may query the user’s profile, saved universities, tasks and applications.
- **Knowledge base**: FAQs and general information about universities and application processes can be stored in a knowledge base or retrieved via API.

## Additional Data Considerations

- **Internationalisation**: If the app will support multiple languages, include locale codes and translations for university data and resources.
- **Caching**: Frequently accessed data such as university lists should be cached on the server or CDN. Use revalidation strategies supported by Next.js to keep data fresh without overloading the backend.
- **Privacy**: Sensitive user data (scores, essays, personal information) must be protected according to privacy laws. Use HTTPS for all requests and store data securely.
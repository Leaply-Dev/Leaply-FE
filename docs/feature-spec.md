# Feature Specification

This document describes the core features, screens and user flows of the Leaply application. Use it as a reference when implementing and reviewing functionality.

**Note:** For the demo prototype, all data is pre‑populated and no real network requests are made. The flows should therefore rely on local or mocked data stored via Zustand. Animations (page transitions, hover effects) should be implemented with Framer Motion to create a polished experience. Use shadcn/ui components as the basis for all UI elements.

## Landing Page

The landing page introduces Leaply and guides new visitors to sign up or explore universities. Content includes:

- **Hero section**: tagline summarising Leaply’s value proposition.
- **Call‑to‑action (CTA)** buttons for creating an account and exploring universities.
- Brief explanations or testimonials about how Leaply helps applicants.

## Onboarding

The onboarding flow creates the user’s profile and collects preferences. It consists of multiple steps:

1. **Sign‑up / Login**: Users create an account via email/password or OAuth. Display privacy policy and terms.
2. **Profile information**: Collect basic details (name, nationality, educational background, exam scores). Provide form validation and progress indicators.
3. **Preference quiz**: Ask about desired major, preferred regions, budget, extracurricular interests, etc. Use multiple choice or slider controls. At the end, summarise the initial match suggestions.
4. **Summary**: Present a personalised recommendation based on preferences and link to the university search.

## University Discovery

Allows users to browse and search institutions that match their preferences.

- **Search & filter page**: Display a list of universities with basic info (name, country, ranking) and controls for filtering by country/region, major, tuition range, ranking, etc. Provide sorting options (e.g., ranking, cost).
- **University detail page**: Show comprehensive details: overview, programs offered, admission requirements, tuition fees, scholarships, location (maps), and reviews. Include actions to *save* the university to the dashboard or start an application.

## Dashboard

The dashboard centralises everything related to the student’s applications.

- **Overview**: Quick summary cards for saved universities, active applications, tasks and available resources.
- **Applications list**: List of all applications with status (draft, submitted, accepted). Each entry links to a detailed view.
- **Application details**: Show tasks, deadlines, uploaded documents and current status for a specific application. Allow editing personal info or uploading files.
- **Tasks**: A to‑do list of required actions (write essay, request recommendation letters, upload transcripts, pay application fee). Each task has a due date and status (pending or completed).
- **Resources**: Curated guides, articles and tools to help applicants (e.g., writing personal statements, preparing interviews, financial aid).
- **Profile**: Manage personal information and uploaded documents. Users can update their bio, test scores and contact details.

## Chatbot

The Leaply chatbot assists users throughout their journey. Features include:

- **Real‑time Q&A**: Answer questions about application processes, university requirements and timelines.
- **Ideation support**: Help users explore interests and suggest majors or extracurricular activities based on conversation context.
- **Profile feedback**: Analyse a user’s profile and recommend improvements (e.g., take language tests, gain volunteer experience).
- **History**: View past conversations and revisit recommendations.

## Additional pages

Optional supplemental pages may include:

- **FAQ**: Frequently asked questions about Leaply and the application process.
- **Support / Contact**: Contact form or chat for additional help.
- **Blog**: Articles on studying abroad, scholarship opportunities, etc.
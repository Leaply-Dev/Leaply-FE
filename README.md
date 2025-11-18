# Leaply - AI-Powered Study Abroad Platform

A modern, full-featured web application designed to help students discover universities, manage applications, and receive AI-powered guidance for studying abroad.

## 🎯 Features

### Core Features
- **Landing Page**: Beautiful hero section with features, testimonials, and call-to-action
- **User Authentication**: Login and signup pages with OAuth placeholder integration
- **Onboarding Flow**: Multi-step profile creation and preference collection
- **University Discovery**: Browse, search, and filter 20+ universities worldwide with **AI-powered fit scores**
- **Application Management**: Track applications, tasks, and deadlines
- **Persona Lab**: AI-powered essay coach for self-discovery and essay ideation (unique feature!)
- **AI Chatbot**: Interactive assistant for application guidance and Q&A
- **Resource Library**: Curated guides and articles for applicants
- **User Profile**: Manage personal information and test scores

### Unique Features Inspired by Original Prototype
- **Fit Score Matching**: Each university shows a personalized match percentage (0-100%) based on your profile
- **Persona Lab / MyLeap**: AI essay coach with proven blueprints and self-discovery questions
- **Enhanced University Cards**: Beautiful cards with hover effects, bookmark stars, and gradient backgrounds
- **Smart Recommendations**: Universities ranked by how well they match your preferences and profile

### Technical Highlights
- **Next.js 14** with App Router and React Server Components
- **TypeScript** for type safety
- **Tailwind CSS** with custom Leaply color palette
- **Framer Motion** for smooth animations and transitions
- **Zustand** for lightweight state management
- **shadcn/ui** components for consistent UI
- Fully responsive design (mobile, tablet, desktop)
- Accessibility-focused (WCAG 2.1 AA compliant)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
leaply-app/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout with Navbar/Footer
│   ├── login/                    # Login page
│   ├── signup/                   # Signup page
│   ├── onboarding/              # Onboarding flow
│   │   ├── page.tsx             # Profile information
│   │   ├── quiz/                # Preference quiz
│   │   └── summary/             # Recommendations summary
│   ├── universities/            # University discovery
│   │   ├── page.tsx             # List/search page
│   │   └── [id]/                # University detail page
│   ├── dashboard/               # Dashboard pages
│   │   ├── page.tsx             # Overview
│   │   ├── applications/        # Applications management
│   │   ├── tasks/               # Task list
│   │   ├── resources/           # Resource library
│   │   └── profile/             # User profile
│   └── chatbot/                 # AI chatbot
│       ├── page.tsx             # Chat interface
│       └── history/             # Conversation history
├── components/                   # Reusable components
│   ├── ui/                      # shadcn/ui base components
│   ├── UniversityCard.tsx       # University display card
│   ├── ApplicationCard.tsx      # Application status card
│   ├── TaskItem.tsx             # Task item with checkbox
│   ├── ChatMessage.tsx          # Chat bubble component
│   ├── PageTransition.tsx       # Animation wrappers
│   ├── Navbar.tsx               # Navigation bar
│   └── Footer.tsx               # Footer
├── lib/                         # Utilities and state
│   ├── utils.ts                 # Utility functions
│   ├── store/                   # Zustand stores
│   │   ├── userStore.ts         # User state
│   │   ├── universitiesStore.ts # Universities & filters
│   │   ├── applicationsStore.ts # Applications & tasks
│   │   └── chatStore.ts         # Chat conversations
│   └── data/                    # Mock data
│       ├── universities.ts      # 20 university profiles
│       ├── applications.ts      # Sample applications
│       ├── resources.ts         # Guide articles
│       └── chat.ts              # Conversation examples
├── public/                      # Static assets
│   ├── Logo.png                 # Leaply logo
│   └── icons/                   # University icons
└── docs/                        # Documentation
    ├── technical-guidelines.md  # Coding standards
    ├── feature-spec.md          # Feature specifications
    ├── data-requirements.md     # Data structure docs
    └── colors.md                # Color palette guide
```

## 🎨 Design System

### Color Palette
- **Primary Green**: `#95CA55` - Primary buttons, active states
- **Dark Grey**: `#3F3C3B` - Headings, primary text
- **Light Grey**: `#F5F5F5` - Backgrounds
- **Mid Grey**: `#6D6866` - Secondary text, borders
- **Light Green**: `#B9DA7A` - Hover states
- **Sky Blue**: `#4CA8D3` - Informational badges
- **Warning Orange**: `#E8A634` - Alerts, warnings

### Typography
- **Font**: Inter (system fallback: system-ui, sans-serif)
- **Headings**: Bold, dark-grey
- **Body**: Regular, dark-grey
- **Captions**: Regular, mid-grey

### Animations
- **Page Transitions**: 300-400ms with easeOut
- **Hover Effects**: 200ms
- **Stagger Animations**: 100ms delay between items

## 🗂️ State Management

The app uses Zustand for global state management with four main stores:

1. **User Store** (`userStore.ts`)
   - User profile and authentication
   - Preferences and onboarding status

2. **Universities Store** (`universitiesStore.ts`)
   - University data and search filters
   - Saved universities list

3. **Applications Store** (`applicationsStore.ts`)
   - Applications and their statuses
   - Tasks and deadlines
   - Resource articles

4. **Chat Store** (`chatStore.ts`)
   - Conversation history
   - Messages and typing state

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

All components adapt to screen sizes using Tailwind's responsive utilities.

## 🎭 Demo Mode

This is a demo application with the following characteristics:
- **No real API calls**: All data is mocked and pre-populated
- **No form validation**: Forms accept any input for smooth demo flow
- **Simulated AI responses**: Chatbot uses keyword matching, not real AI
- **Local state only**: No data persistence (refreshing resets state)

## 🔧 Development Guidelines

### Code Style
- Use TypeScript for all files
- Prefer functional components and hooks
- Use Server Components by default, add `'use client'` only when needed
- Follow naming conventions: PascalCase for components, camelCase for functions

### Component Patterns
- Extract reusable UI into `components/`
- Keep business logic in `lib/`
- Use absolute imports (`@/components/*`)
- Compose with Tailwind utilities, avoid custom CSS

### Performance
- Use Next.js `Image` component for all images
- Lazy load below-the-fold content
- Animate only `transform` and `opacity` for GPU acceleration

## 📄 License

This is a demo project created for educational purposes.

## 🙏 Acknowledgments

- Next.js for the amazing framework
- shadcn/ui for the beautiful component library
- Tailwind CSS for the utility-first CSS framework
- Framer Motion for smooth animations
- Zustand for lightweight state management


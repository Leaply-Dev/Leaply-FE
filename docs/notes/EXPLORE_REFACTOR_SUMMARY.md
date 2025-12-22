# Explore Page Refactor Summary

This document summarizes the comprehensive refactor of the Explore (Universities) page, implementing a dual-mode interface with AI-powered recommendations and enhanced filtering.

## Overview

The Universities page (`/app/universities/page.tsx`) has been completely refactored to provide two distinct browsing experiences:

1. **AI Match Mode** - Personalized recommendations based on user profile
2. **Explore All Mode** - Full catalog browsing with advanced filters

## New Components Created

### 1. UI Components (shadcn/ui)

#### `/components/ui/tabs.tsx`
- Radix UI Tabs implementation
- Used for the dual-mode switcher (AI Match vs Explore All)
- Fully accessible with keyboard navigation
- Styled with Tailwind classes matching the Leaply color palette

#### `/components/ui/dialog.tsx`
- Radix UI Dialog/Modal implementation
- Used for displaying detailed match explanations
- Includes overlay, close button, and responsive layout
- Smooth animations on open/close

#### `/components/ui/tooltip.tsx`
- Radix UI Tooltip implementation
- Provides accessible hover information
- Used throughout for contextual help

### 2. Feature Components

#### `/components/AIMatchCard.tsx`
A specialized card component for AI-recommended universities featuring:

**Visual Design:**
- Gradient border (leaf-green/light-green) to distinguish from regular cards
- "AI Match" badge with sparkles icon (top-left)
- Ranking badge with star icon (top-right)
- Fit score percentage badge (bottom-left)
- Clean, modern layout with hover effects

**Match Information:**
- Encouraging copy: "We think you'll love this!", "May be a great fit", etc.
- 1-2 short match reasons displayed directly on card
- "Why?" button that opens detailed explanation modal

**Match Explanation Modal:**
- Shows fit score percentage with visual badge
- Lists all match reasons in numbered format
- Categorizes reasons (budget, location, academic, program)
- Provides "View Details" and "Ask AI" action buttons

**Call-to-Actions:**
- "Add to Dream List" / "Saved" button with aspirational language
- "Ask AI about this school" button (opens chatbot with pre-filled question)
- "Learn More" button (navigates to university detail page)

#### `/components/ExploreCard.tsx`
A clean card design for the full catalog mode featuring:

**Visual Design:**
- Simplified layout focusing on key attributes
- Ranking badge (top-right)
- University type badge (Public/Private, top-left)
- Hover effects and smooth transitions

**Key Attributes Displayed:**
- School name
- Location (city, country, region)
- Ranking
- Tuition range
- Acceptance rate (if available)

**Call-to-Actions:**
- "View Details" button with external link icon
- "Strive for it!" button (aspirational save action)
- "Ask AI about this school" button

#### `/components/FilterQuestionnaire.tsx`
A questionnaire-style filter panel that replaces the traditional sidebar:

**Design Philosophy:**
- Presents filters as conversational questions rather than checkboxes
- Collapsible sections to avoid overwhelming users
- One question at a time focus with smooth animations
- Mobile-responsive (collapsible on small screens)

**Filter Questions:**
1. **"Where would you like to study?"**
   - Region selection with count indicators
   - Interactive pill buttons
   - Shows selected count

2. **"What's your annual budget?"**
   - Pre-defined tuition ranges (Under $10k, $10k-$30k, etc.)
   - Grid layout with clear selection states
   - Visual feedback on selection

3. **"What do you want to study?"**
   - Major/field selection
   - Limited to most common options (8 shown)
   - Multi-select capability

**Features:**
- Active filters summary at bottom
- Quick remove (X) buttons on each active filter
- "Reset" button to clear all filters
- Real-time results update
- Shows filter count badge in header

### 3. Utility Functions

#### `/lib/utils/matchReasons.ts`
Generates rule-based match explanations:

**Core Functions:**

1. **`generateMatchReasons()`**
   - Analyzes university vs. user profile/preferences
   - Returns short reasons (1-2 for card) and detailed reasons (all for modal)
   - Categories: budget, location, program, academic, other
   - Strength levels: strong, moderate, weak
   
   **Example Reasons Generated:**
   - Budget: "Tuition of $28,000/year fits your budget perfectly"
   - Location: "Located in Europe, one of your preferred regions"
   - Academic: "Your strong academic record (3.8 GPA) aligns with this top 10 ranked institution"
   - Program: "Offers programs in Computer Science"
   - Scholarships: "3 scholarship opportunities available"

2. **`getEncouragingCopy()`**
   - Returns encouraging text based on fit score
   - Examples: "We think you'll love this!", "May be a great fit for you"

3. **`getMatchBadgeText()`**
   - Returns match level text: "Excellent Match", "Good Match", etc.

**Rule-Based Logic:**
- Budget matching: Perfect fit, close fit, or manageable with scholarships
- Region matching: Checks if university region is in user's preferred regions
- Academic fit: Compares GPA with acceptance rate and ranking
- Program matching: Keyword matching against desired major (simplified)
- Scholarship availability: Notes number of opportunities
- University type: Public institutions with affordable tuition

## Refactored Page

### `/app/explore/page.tsx`

**New Structure:**

1. **Hero Section**
   - Updated tagline: "Personalized recommendations or explore 1000+ universities worldwide"
   - Unified search bar (applies to both modes)
   - Removed quick filter pills (now in questionnaire)

2. **Dual Mode Tabs**
   - Centered tab switcher with icons
   - "AI Match" tab with Sparkles icon
   - "Explore All" tab with Globe icon
   - Smooth transitions between modes

3. **AI Match Mode Tab Content**
   - Description based on profile status
   - Shows count of matched universities
   - Grid of AIMatchCard components
   - Sorted by fit score (highest first)
   - Only shows universities with fit score ≥ 40
   - Limited to top 12 matches
   - Empty state with "Complete Profile" CTA if no profile

4. **Explore All Mode Tab Content**
   - FilterQuestionnaire component
   - Results header with count
   - Grid of ExploreCard components
   - Sorted by ranking (best first)
   - Shows all filtered universities
   - Empty state with filter adjustment suggestion

**State Management:**
- `activeMode`: Tracks current tab (ai-match | explore-all)
- `searchInput`: Universal search across both modes
- `filterState`: Object containing regions, majors, tuitionRange
- Uses zustand stores for universities and user data

**Data Flow:**
- `filteredUniversities`: Applies search and filters to all universities
- `aiMatchedUniversities`: Calculates fit scores, filters ≥40, sorts by score
- `exploreAllUniversities`: Sorts filtered universities by ranking

**AI Integration:**
- "Ask AI" button on cards opens chatbot with pre-filled question
- Navigates to `/chatbot?question=Tell me more about [University Name]`

## Dependencies Added

```json
{
  "@radix-ui/react-tabs": "^1.1.1",
  "@radix-ui/react-dialog": "^1.1.2",
  "@radix-ui/react-tooltip": "^1.1.4"
}
```

## Design Principles Applied

### 1. Non-Absolute Language
- "We think you'll love this" vs "This is perfect for you"
- "May be a great fit" vs "This is the best match"
- "Worth exploring" vs "You should apply here"

### 2. Trust Building
- Transparent explanations via "Why?" modal
- Shows all reasoning factors
- Clear fit score percentages
- No hidden recommendations

### 3. Aspirational CTAs
- "Add to Dream List" vs "Save"
- "Strive for it!" vs "Bookmark"
- "Learn More" vs "View"

### 4. Progressive Disclosure
- Filter questions expand one at a time
- Match reasons: 1-2 on card, all in modal
- Reduces cognitive load

### 5. Accessibility
- All Radix UI components are ARIA-compliant
- Keyboard navigation throughout
- Focus management in modals
- Semantic HTML structure
- Sufficient color contrast ratios

### 6. Responsive Design
- Mobile-first approach
- Collapsible filter panel on small screens
- Grid adapts: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
- Touch-friendly button sizes

## Color Palette Usage

All components use the Leaply color palette defined in `/docs/colors.md`:

- **Primary (Leaf Green #95CA55)**: AI Match badges, active states, CTAs
- **Secondary (Light Green #B9DA7A)**: Gradients, hover states
- **Dark Grey (#3F3C3B)**: Headings, primary text
- **Mid Grey (#6D6866)**: Secondary text, descriptions
- **Light Grey (#F5F5F5)**: Backgrounds, inactive states
- **Sky Blue (#4CA8D3)**: "Ask AI" buttons, information links
- **Warning Orange (#E8A634)**: Saved state indicators

## Mock Data Approach

- All data comes from `/lib/data/universities.ts`
- No external API calls
- User profile/preferences from zustand store (`useUserStore`)
- Fit score calculated locally via `/lib/utils/fitScore.ts`
- Match reasons generated locally via `/lib/utils/matchReasons.ts`

## Key Features Implemented

✅ **Dual Mode Switch**
- Clear visual toggle between AI Match and Explore All
- Shared styling and responsive design
- Smooth transitions

✅ **AI Match Cards**
- Visual distinction with badges and borders
- 1-2 short match reasons on card
- Detailed "Why?" explanation modal
- Encouraging, non-absolute language

✅ **Explore All Cards**
- Clean display of key attributes
- Detail view links
- Save to shortlist functionality

✅ **Aspirational CTAs**
- "Add to Dream List"
- "Strive for it!"
- "Ask AI" integration

✅ **Questionnaire-Style Filters**
- Progressive disclosure
- Important criteria only (location, major, tuition)
- Instant results update
- Easy reset functionality

✅ **Technical Requirements**
- Functional components with hooks
- shadcn/ui + Tailwind utilities
- Mock data only (no real APIs)
- Accessible and responsive

## Testing Recommendations

1. **Profile States:**
   - Test with no profile (should show "Complete Profile" CTA)
   - Test with partial profile (should show some matches)
   - Test with complete profile (should show all matches)

2. **Filter Combinations:**
   - Single filter active
   - Multiple filters combined
   - No results scenario
   - Reset functionality

3. **Responsive Breakpoints:**
   - Mobile (<768px): 1 column grid, collapsed filters
   - Tablet (768px-1024px): 2 column grid
   - Desktop (>1024px): 3 column grid

4. **Interactions:**
   - Tab switching
   - "Why?" modal opening/closing
   - Filter expansion/collapse
   - Search input
   - Card CTAs (Save, Ask AI, View Details)

5. **Performance:**
   - Verify useMemo optimizations work
   - Check re-render frequency
   - Test with full dataset (20 universities)

## Future Enhancements

While not implemented in this refactor (to keep mock data simple), these could be added:

1. **Enhanced Program Matching:**
   - More sophisticated major/program matching
   - Keyword extraction from program names
   - Program level filtering

2. **Additional Filter Criteria:**
   - Campus setting (urban/suburban/rural)
   - Language of instruction
   - Student population size
   - Climate/weather preferences

3. **Sort Options:**
   - User-controlled sorting in Explore All mode
   - By ranking, tuition, acceptance rate, etc.

4. **Saved Filters:**
   - Save filter combinations as presets
   - Quick filter templates

5. **Comparison Feature:**
   - Select multiple cards to compare
   - Side-by-side comparison view

6. **Real AI Integration:**
   - LLM-generated match reasons
   - Natural language explanations
   - Personalized insights

## Files Modified

- `/app/explore/page.tsx` - Complete refactor

## Files Created

### Components
- `/components/AIMatchCard.tsx`
- `/components/ExploreCard.tsx`
- `/components/FilterQuestionnaire.tsx`
- `/components/ui/tabs.tsx`
- `/components/ui/dialog.tsx`
- `/components/ui/tooltip.tsx`

### Utilities
- `/lib/utils/matchReasons.ts`

### Documentation
- `/EXPLORE_REFACTOR_SUMMARY.md` (this file)

## Build Status

✅ Build completed successfully with no errors
✅ No linter errors
✅ All TypeScript types validated
✅ Dependencies installed correctly

---

**Implementation Date:** November 18, 2025  
**Framework:** Next.js 14.0.0  
**UI Library:** shadcn/ui + Radix UI  
**State Management:** Zustand  
**Styling:** Tailwind CSS


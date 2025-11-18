import { University } from '../store/universitiesStore';
import { UserProfile, UserPreferences } from '../store/userStore';

export interface MatchReason {
  id: string;
  text: string;
  category: 'budget' | 'location' | 'program' | 'academic' | 'other';
  strength: 'strong' | 'moderate' | 'weak';
}

/**
 * Generate match reasons explaining why a university is recommended
 * Returns 1-2 short reasons for display on the card, and more detailed reasons for the modal
 */
export function generateMatchReasons(
  university: University,
  profile: UserProfile | null,
  preferences: UserPreferences
): { shortReasons: MatchReason[]; detailedReasons: MatchReason[] } {
  if (!profile) {
    return { shortReasons: [], detailedReasons: [] };
  }

  const reasons: MatchReason[] = [];

  // Budget matching
  if (preferences.budgetRange) {
    const { min, max } = preferences.budgetRange;
    const tuition = university.averageTuition;
    
    if (tuition >= min && tuition <= max) {
      reasons.push({
        id: 'budget-perfect',
        text: `Tuition of $${tuition.toLocaleString()}/year fits your budget perfectly`,
        category: 'budget',
        strength: 'strong',
      });
    } else if (tuition <= max * 1.2) {
      reasons.push({
        id: 'budget-close',
        text: `Tuition is slightly above budget but potentially manageable with scholarships`,
        category: 'budget',
        strength: 'moderate',
      });
    }
  }

  // Region/Location matching
  if (preferences.preferredRegions && preferences.preferredRegions.length > 0) {
    if (preferences.preferredRegions.includes(university.region)) {
      reasons.push({
        id: 'region-match',
        text: `Located in ${university.region}, one of your preferred regions`,
        category: 'location',
        strength: 'strong',
      });
    }
  }

  // Academic fit based on ranking and acceptance rate
  if (profile.gpa && university.acceptanceRate) {
    const gpa = profile.gpa;
    const acceptanceRate = university.acceptanceRate;
    
    if (gpa >= 3.7 && university.ranking <= 20) {
      reasons.push({
        id: 'academic-reach',
        text: `Your strong academic record (${gpa} GPA) aligns with this top ${university.ranking} ranked institution`,
        category: 'academic',
        strength: 'strong',
      });
    } else if (gpa >= 3.3 && acceptanceRate > 20) {
      reasons.push({
        id: 'academic-match',
        text: `Your GPA matches well with the ${acceptanceRate}% acceptance rate`,
        category: 'academic',
        strength: 'moderate',
      });
    } else if (gpa >= 3.0) {
      reasons.push({
        id: 'academic-safety',
        text: `May be a solid safety option with a ${acceptanceRate}% acceptance rate`,
        category: 'academic',
        strength: 'moderate',
      });
    }
  }

  // Program/Major matching
  if (preferences.desiredMajor && university.programs && university.programs.length > 0) {
    // Simple keyword matching - in production would be more sophisticated
    const hasRelevantProgram = university.programs.some(p => 
      p.name.toLowerCase().includes(preferences.desiredMajor!.toLowerCase())
    );
    
    if (hasRelevantProgram) {
      reasons.push({
        id: 'program-match',
        text: `Offers programs in ${preferences.desiredMajor}`,
        category: 'program',
        strength: 'strong',
      });
    } else if (university.programs.length > 0) {
      reasons.push({
        id: 'program-variety',
        text: `Wide variety of ${university.programs.length}+ programs to explore`,
        category: 'program',
        strength: 'weak',
      });
    }
  }

  // Scholarship availability
  if (university.scholarships && university.scholarships.length > 0) {
    const totalScholarshipValue = university.scholarships.reduce((sum, s) => sum + s.amount, 0);
    reasons.push({
      id: 'scholarships',
      text: `${university.scholarships.length} scholarship opportunities available`,
      category: 'budget',
      strength: 'moderate',
    });
  }

  // University type preference
  if (university.type === 'public' && preferences.budgetRange && university.averageTuition < 30000) {
    reasons.push({
      id: 'public-affordable',
      text: 'Public institution with more affordable tuition',
      category: 'budget',
      strength: 'moderate',
    });
  }

  // High ranking with reasonable acceptance
  if (university.ranking <= 50 && university.acceptanceRate && university.acceptanceRate > 10) {
    reasons.push({
      id: 'ranking-accessible',
      text: `Top ${university.ranking} university with a ${university.acceptanceRate}% acceptance rate`,
      category: 'academic',
      strength: 'strong',
    });
  }

  // Sort by strength and category priority
  const sortedReasons = reasons.sort((a, b) => {
    const strengthOrder = { strong: 0, moderate: 1, weak: 2 };
    const categoryOrder = { budget: 0, academic: 1, program: 2, location: 3, other: 4 };
    
    if (strengthOrder[a.strength] !== strengthOrder[b.strength]) {
      return strengthOrder[a.strength] - strengthOrder[b.strength];
    }
    return categoryOrder[a.category] - categoryOrder[b.category];
  });

  // Return top 2 for card display, all for detailed view
  return {
    shortReasons: sortedReasons.slice(0, 2),
    detailedReasons: sortedReasons,
  };
}

/**
 * Get encouraging copy for AI match badges
 */
export function getEncouragingCopy(fitScore: number): string {
  if (fitScore >= 80) {
    return "We think you'll love this!";
  } else if (fitScore >= 60) {
    return "May be a great fit for you";
  } else if (fitScore >= 40) {
    return "Worth exploring";
  }
  return "Consider looking into this";
}

/**
 * Get match level badge text
 */
export function getMatchBadgeText(fitScore: number): string {
  if (fitScore >= 80) return 'Excellent Match';
  if (fitScore >= 60) return 'Good Match';
  if (fitScore >= 40) return 'Fair Match';
  return 'Potential Match';
}


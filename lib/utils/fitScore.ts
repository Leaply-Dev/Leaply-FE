import { University } from '../store/universitiesStore';
import { UserProfile, UserPreferences } from '../store/userStore';

/**
 * Calculate fit score between user profile and university
 * Returns a percentage (0-100) indicating how well the university matches
 */
export function calculateFitScore(
  university: University,
  profile: UserProfile | null,
  preferences: UserPreferences
): number {
  if (!profile) return 0;

  let score = 0;
  let totalWeight = 0;

  // GPA Match (Weight: 25)
  if (profile.gpa && university.acceptanceRate) {
    const gpaWeight = 25;
    totalWeight += gpaWeight;
    
    // Simple GPA matching logic
    if (profile.gpa >= 3.7) score += gpaWeight;
    else if (profile.gpa >= 3.3) score += gpaWeight * 0.75;
    else if (profile.gpa >= 3.0) score += gpaWeight * 0.5;
    else score += gpaWeight * 0.25;
  }

  // Region Match (Weight: 20)
  if (preferences.preferredRegions && preferences.preferredRegions.length > 0) {
    const regionWeight = 20;
    totalWeight += regionWeight;
    
    if (preferences.preferredRegions.includes(university.region)) {
      score += regionWeight;
    }
  }

  // Budget Match (Weight: 30)
  if (preferences.budgetRange) {
    const budgetWeight = 30;
    totalWeight += budgetWeight;
    
    const { min, max } = preferences.budgetRange;
    const tuition = university.averageTuition;
    
    if (tuition >= min && tuition <= max) {
      score += budgetWeight;
    } else if (tuition <= max * 1.2) {
      // Within 20% over budget
      score += budgetWeight * 0.7;
    } else if (tuition <= max * 1.5) {
      // Within 50% over budget
      score += budgetWeight * 0.4;
    }
  }

  // Major/Field Match (Weight: 15)
  if (preferences.desiredMajor) {
    const majorWeight = 15;
    totalWeight += majorWeight;
    
    // Simplified matching - in real app would match against university programs
    score += majorWeight * 0.8;
  }

  // Language Match (Weight: 10)
  if (preferences.languagesOfInstruction && preferences.languagesOfInstruction.length > 0) {
    const languageWeight = 10;
    totalWeight += languageWeight;
    
    // Assume English for now - in real app would match university language
    if (preferences.languagesOfInstruction.includes('English')) {
      score += languageWeight;
    }
  }

  // Calculate final percentage
  const fitPercentage = totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 0;
  
  return Math.min(100, Math.max(0, fitPercentage));
}

/**
 * Get fit score color based on percentage
 */
export function getFitScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-leaf-green';
  if (score >= 40) return 'text-warning-orange';
  return 'text-mid-grey';
}

/**
 * Get fit score label
 */
export function getFitScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent Match';
  if (score >= 60) return 'Good Match';
  if (score >= 40) return 'Fair Match';
  return 'Consider Carefully';
}


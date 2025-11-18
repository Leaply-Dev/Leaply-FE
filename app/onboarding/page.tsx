'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OnboardingProgress } from '@/components/OnboardingProgress';
import { useUserStore } from '@/lib/store/userStore';
import { PageTransition } from '@/components/PageTransition';

export default function OnboardingPage() {
  const router = useRouter();
  const { updateProfile } = useUserStore();
  
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    nationality: '',
    currentEducationLevel: '',
    gpa: '',
    testScoreType: '',
    testScore: '',
    intendedStartYear: new Date().getFullYear() + 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update user profile
    updateProfile({
      dateOfBirth: formData.dateOfBirth,
      nationality: formData.nationality,
      currentEducationLevel: formData.currentEducationLevel,
      gpa: parseFloat(formData.gpa) || 0,
      testScores: formData.testScoreType ? [{
        type: formData.testScoreType,
        score: formData.testScore,
      }] : [],
      intendedStartYear: formData.intendedStartYear,
    });

    router.push('/onboarding/quiz');
  };

  const updateField = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-4rem)] bg-muted py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <OnboardingProgress
            steps={['Profile', 'Preferences', 'Summary']}
            currentStep={0}
            className="mb-12"
          />

          <Card>
            <CardHeader>
              <CardTitle>Complete Your Profile</CardTitle>
              <CardDescription>
                Tell us about your academic background to get personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateField('dateOfBirth', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Select
                      id="nationality"
                      value={formData.nationality}
                      onChange={(e) => updateField('nationality', e.target.value)}
                      required
                    >
                      <option value="">Select nationality</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="India">India</option>
                      <option value="China">China</option>
                      <option value="Japan">Japan</option>
                      <option value="South Korea">South Korea</option>
                      <option value="Other">Other</option>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="educationLevel">Current Education Level</Label>
                    <Select
                      id="educationLevel"
                      value={formData.currentEducationLevel}
                      onChange={(e) => updateField('currentEducationLevel', e.target.value)}
                      required
                    >
                      <option value="">Select level</option>
                      <option value="High School">High School</option>
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Graduate">Graduate</option>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gpa">GPA / Average Grade</Label>
                    <Input
                      id="gpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      placeholder="3.5"
                      value={formData.gpa}
                      onChange={(e) => updateField('gpa', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="testScoreType">Test Score Type (Optional)</Label>
                    <Select
                      id="testScoreType"
                      value={formData.testScoreType}
                      onChange={(e) => updateField('testScoreType', e.target.value)}
                    >
                      <option value="">Select test</option>
                      <option value="SAT">SAT</option>
                      <option value="ACT">ACT</option>
                      <option value="IELTS">IELTS</option>
                      <option value="TOEFL">TOEFL</option>
                      <option value="GRE">GRE</option>
                      <option value="GMAT">GMAT</option>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="testScore">Test Score (Optional)</Label>
                    <Input
                      id="testScore"
                      type="text"
                      placeholder="1450"
                      value={formData.testScore}
                      onChange={(e) => updateField('testScore', e.target.value)}
                      disabled={!formData.testScoreType}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startYear">Intended Start Year</Label>
                    <Select
                      id="startYear"
                      value={formData.intendedStartYear.toString()}
                      onChange={(e) => updateField('intendedStartYear', parseInt(e.target.value))}
                      required
                    >
                      {[0, 1, 2, 3].map(offset => {
                        const year = new Date().getFullYear() + offset;
                        return <option key={year} value={year}>{year}</option>;
                      })}
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-border">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Back
                  </Button>
                  <Button type="submit">
                    Continue to Preferences
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}

'use client';

import { useState } from 'react';
import { User, Mail, Globe, GraduationCap, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageContainer } from '@/components/Layout';
import { useUserStore } from '@/lib/store/userStore';
import { PageTransition, SlideUp } from '@/components/PageTransition';

export default function ProfilePage() {
  const { profile, updateProfile } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || '',
    email: profile?.email || '',
    dateOfBirth: profile?.dateOfBirth || '',
    nationality: profile?.nationality || '',
    currentEducationLevel: profile?.currentEducationLevel || '',
    gpa: profile?.gpa?.toString() || '',
  });

  const handleSave = () => {
    updateProfile({
      fullName: formData.fullName,
      dateOfBirth: formData.dateOfBirth,
      nationality: formData.nationality,
      currentEducationLevel: formData.currentEducationLevel,
      gpa: parseFloat(formData.gpa) || 0,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      fullName: profile?.fullName || '',
      email: profile?.email || '',
      dateOfBirth: profile?.dateOfBirth || '',
      nationality: profile?.nationality || '',
      currentEducationLevel: profile?.currentEducationLevel || '',
      gpa: profile?.gpa?.toString() || '',
    });
    setIsEditing(false);
  };

  return (
    <PageTransition>
      <PageContainer>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-grey mb-2">
            Profile
          </h1>
          <p className="text-lg text-mid-grey">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="max-w-3xl">
          {/* Personal Information */}
          <SlideUp>
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                      <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 bg-light-grey rounded-md">
                          <User className="w-4 h-4 text-mid-grey" />
                          <span>{profile?.fullName || 'Not set'}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="flex items-center gap-2 p-3 bg-light-grey rounded-md">
                        <Mail className="w-4 h-4 text-mid-grey" />
                        <span>{profile?.email || 'Not set'}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      {isEditing ? (
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 bg-light-grey rounded-md">
                          <Calendar className="w-4 h-4 text-mid-grey" />
                          <span>
                            {profile?.dateOfBirth 
                              ? new Date(profile.dateOfBirth).toLocaleDateString()
                              : 'Not set'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nationality">Nationality</Label>
                      {isEditing ? (
                        <Select
                          id="nationality"
                          value={formData.nationality}
                          onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
                        >
                          <option value="">Select nationality</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                          <option value="India">India</option>
                          <option value="China">China</option>
                          <option value="Other">Other</option>
                        </Select>
                      ) : (
                        <div className="flex items-center gap-2 p-3 bg-light-grey rounded-md">
                          <Globe className="w-4 h-4 text-mid-grey" />
                          <span>{profile?.nationality || 'Not set'}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="educationLevel">Education Level</Label>
                      {isEditing ? (
                        <Select
                          id="educationLevel"
                          value={formData.currentEducationLevel}
                          onChange={(e) => setFormData(prev => ({ ...prev, currentEducationLevel: e.target.value }))}
                        >
                          <option value="">Select level</option>
                          <option value="High School">High School</option>
                          <option value="Undergraduate">Undergraduate</option>
                          <option value="Graduate">Graduate</option>
                        </Select>
                      ) : (
                        <div className="flex items-center gap-2 p-3 bg-light-grey rounded-md">
                          <GraduationCap className="w-4 h-4 text-mid-grey" />
                          <span>{profile?.currentEducationLevel || 'Not set'}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gpa">GPA</Label>
                      {isEditing ? (
                        <Input
                          id="gpa"
                          type="number"
                          step="0.01"
                          min="0"
                          max="4"
                          value={formData.gpa}
                          onChange={(e) => setFormData(prev => ({ ...prev, gpa: e.target.value }))}
                        />
                      ) : (
                        <div className="p-3 bg-light-grey rounded-md">
                          <span>{profile?.gpa || 'Not set'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SlideUp>

          {/* Test Scores */}
          <SlideUp delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle>Test Scores</CardTitle>
              </CardHeader>
              <CardContent>
                {profile?.testScores && profile.testScores.length > 0 ? (
                  <div className="space-y-3">
                    {profile.testScores.map((score, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-light-grey rounded-md">
                        <span className="font-medium">{score.type}</span>
                        <span className="text-leaf-green font-semibold">{score.score}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-mid-grey text-center py-4">No test scores added</p>
                )}
                <Button variant="outline" className="w-full mt-4">
                  Add Test Score
                </Button>
              </CardContent>
            </Card>
          </SlideUp>
        </div>
      </PageContainer>
    </PageTransition>
  );
}

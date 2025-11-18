'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MessageCircle, Sparkles, Bot } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageTransition } from '@/components/PageTransition';
import { ChatbotAdvisor } from '@/components/ChatbotAdvisor';
import { PersonaLabProfile, ProfileConfig } from '@/components/PersonaLabProfile';

export default function AIPage() {
  const [activeTab, setActiveTab] = useState('chatbot');
  const [profileContext, setProfileContext] = useState<ProfileConfig | null>(null);

  const handleAskLeafy = (profile: ProfileConfig) => {
    setProfileContext(profile);
    setActiveTab('chatbot');
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Hero Header */}
        <section className="relative bg-background py-12 sm:py-16 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero.png"
              alt="Hero background"
              fill
              className="object-cover opacity-20"
              priority
              quality={90}
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0" />
          </div>
          
          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-card/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <Bot className="w-5 h-5 text-foreground" />
                <span className="text-sm font-medium text-foreground">AI-Powered Tools</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
                Your AI Study Abroad Assistant
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Get personalized guidance with our AI chatbot advisor and discover your perfect university matches with Persona Lab
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="chatbot" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Chatbot Advisor</span>
                  <span className="sm:hidden">Chatbot</span>
                </TabsTrigger>
                <TabsTrigger value="persona-lab" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">Persona Lab</span>
                  <span className="sm:hidden">Lab</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Chatbot Advisor Tab */}
            <TabsContent value="chatbot" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Info Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                  <Card className="p-6 bg-gradient-to-br from-chart-2/10 to-primary/10 border-primary/20">
                    <div className="space-y-4">
                      <div>
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-3">
                          <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">
                          Chat with Leafy
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Your AI study-abroad advisor. Get instant answers about admissions, scholarships, essays, and more.
                        </p>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <h4 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">
                          I can help with:
                        </h4>
                        <div className="space-y-2">
                          {[
                            'University recommendations',
                            'Admission requirements',
                            'Scholarship opportunities',
                            'Essay writing tips',
                            'Application timelines',
                            'Visa & immigration',
                          ].map((item) => (
                            <div key={item} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                              <p className="text-xs text-muted-foreground">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            AI-Powered
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            24/7 Available
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Responses are generated by AI and are for informational purposes only.
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Tips Card */}
                  <Card className="p-4 bg-card">
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Pro Tips
                    </h4>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Be specific in your questions for better answers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Use Persona Lab to create your profile first</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Try the quick reply buttons to get started</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Contact a human advisor for personalized guidance</span>
                      </li>
                    </ul>
                  </Card>
                </div>

                {/* Chat Interface */}
                <div className="lg:col-span-3">
                  <Card className="overflow-hidden shadow-lg h-[700px] sm:h-[750px] flex flex-col">
                    <ChatbotAdvisor profileContext={profileContext} />
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Persona Lab Tab */}
            <TabsContent value="persona-lab" className="mt-0">
              <div className="space-y-6">
                {/* Header Info */}
                <Card className="p-6 bg-gradient-to-r from-chart-2/10 via-primary/10 to-chart-4/10 border-primary/20">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shrink-0">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-foreground mb-2">
                        Persona Lab: Find Your Perfect Match
                      </h2>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        Adjust your academic profile using the sliders below to see real-time university matches. Each recommendation includes a fit score and personalized match reasons based on your profile.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-primary text-white">
                          Real-time Matching
                        </Badge>
                        <Badge className="bg-chart-2 text-white">
                          Personalized Insights
                        </Badge>
                        <Badge className="bg-chart-4 text-white">
                          Save Profiles
                        </Badge>
                        <Badge className="bg-chart-3 text-white">
                          AI Analysis
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Profile Configuration */}
                <PersonaLabProfile onAskLeafy={handleAskLeafy} />

                {/* How It Works */}
                <Card className="p-6 bg-gradient-to-r from-chart-2/10 to-primary/10 border-chart-2/20">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    How Persona Lab Works
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                        1
                      </div>
                      <h4 className="font-semibold text-foreground mb-2 text-sm">
                        Adjust Your Profile
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Use sliders to set your GPA, test scores, budget, and preferences
                      </p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-chart-2/20 text-chart-2 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                        2
                      </div>
                      <h4 className="font-semibold text-foreground mb-2 text-sm">
                        See Instant Matches
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        View universities ranked by fit score with detailed match reasons
                      </p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-chart-3/20 text-chart-3 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                        3
                      </div>
                      <h4 className="font-semibold text-foreground mb-2 text-sm">
                        Ask Leafy
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Send your profile to our AI chatbot for detailed analysis
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
}


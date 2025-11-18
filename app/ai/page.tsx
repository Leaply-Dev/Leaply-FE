'use client';

import { useState } from 'react';
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
      <div className="min-h-screen bg-gradient-to-br from-light-grey via-white to-light-green/10">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-leaf-green via-light-green to-sky-blue text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <Bot className="w-5 h-5" />
                <span className="text-sm font-medium">AI-Powered Tools</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Your AI Study Abroad Assistant
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
                Get personalized guidance with our AI chatbot advisor and discover your perfect university matches with Persona Lab
              </p>
            </div>
          </div>
        </div>

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
                  <Card className="p-6 bg-gradient-to-br from-sky-blue/10 to-leaf-green/10 border-leaf-green/20">
                    <div className="space-y-4">
                      <div>
                        <div className="w-12 h-12 bg-leaf-green rounded-full flex items-center justify-center mb-3">
                          <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-dark-grey mb-2">
                          Chat with Leafy
                        </h3>
                        <p className="text-sm text-mid-grey leading-relaxed">
                          Your AI study-abroad advisor. Get instant answers about admissions, scholarships, essays, and more.
                        </p>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-xs font-semibold text-dark-grey mb-2 uppercase tracking-wide">
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
                              <div className="w-1.5 h-1.5 rounded-full bg-leaf-green mt-1.5 shrink-0" />
                              <p className="text-xs text-mid-grey">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            AI-Powered
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            24/7 Available
                          </Badge>
                        </div>
                        <p className="text-xs text-mid-grey">
                          Responses are generated by AI and are for informational purposes only.
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Tips Card */}
                  <Card className="p-4 bg-white">
                    <h4 className="text-sm font-semibold text-dark-grey mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-leaf-green" />
                      Pro Tips
                    </h4>
                    <ul className="space-y-2 text-xs text-mid-grey">
                      <li className="flex items-start gap-2">
                        <span className="text-leaf-green">•</span>
                        <span>Be specific in your questions for better answers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-leaf-green">•</span>
                        <span>Use Persona Lab to create your profile first</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-leaf-green">•</span>
                        <span>Try the quick reply buttons to get started</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-leaf-green">•</span>
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
                <Card className="p-6 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 border-purple-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-leaf-green to-light-green rounded-xl flex items-center justify-center shrink-0">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-dark-grey mb-2">
                        Persona Lab: Find Your Perfect Match
                      </h2>
                      <p className="text-sm text-mid-grey mb-4 leading-relaxed">
                        Adjust your academic profile using the sliders below to see real-time university matches. Each recommendation includes a fit score and personalized match reasons based on your profile.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-leaf-green text-white">
                          Real-time Matching
                        </Badge>
                        <Badge className="bg-sky-blue text-white">
                          Personalized Insights
                        </Badge>
                        <Badge className="bg-warning-orange text-white">
                          Save Profiles
                        </Badge>
                        <Badge className="bg-purple-500 text-white">
                          AI Analysis
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Profile Configuration */}
                <PersonaLabProfile onAskLeafy={handleAskLeafy} />

                {/* How It Works */}
                <Card className="p-6 bg-gradient-to-r from-sky-blue/10 to-leaf-green/10 border-sky-blue/20">
                  <h3 className="text-lg font-semibold text-dark-grey mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-leaf-green" />
                    How Persona Lab Works
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-leaf-green/20 text-leaf-green rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                        1
                      </div>
                      <h4 className="font-semibold text-dark-grey mb-2 text-sm">
                        Adjust Your Profile
                      </h4>
                      <p className="text-xs text-mid-grey">
                        Use sliders to set your GPA, test scores, budget, and preferences
                      </p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-sky-blue/20 text-sky-blue rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                        2
                      </div>
                      <h4 className="font-semibold text-dark-grey mb-2 text-sm">
                        See Instant Matches
                      </h4>
                      <p className="text-xs text-mid-grey">
                        View universities ranked by fit score with detailed match reasons
                      </p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-purple-500/20 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                        3
                      </div>
                      <h4 className="font-semibold text-dark-grey mb-2 text-sm">
                        Ask Leafy
                      </h4>
                      <p className="text-xs text-mid-grey">
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


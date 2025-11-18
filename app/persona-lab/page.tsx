'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2, Lightbulb, BookOpen, Target, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PageContainer } from '@/components/Layout';
import { PageTransition, SlideUp } from '@/components/PageTransition';

const essayBlueprints = [
  {
    id: 1,
    emoji: '🔬',
    title: 'The "Failed Experiment" Arc',
    description: 'The project that flopped. Plot twist: What you learned became your superpower.',
    prompt: 'What unexpected experience challenged your assumptions and led you to see the world differently?',
    tags: ['Growth', 'Resilience', 'Innovation'],
    borderColor: 'border-leaf-green',
    bgColor: 'bg-green-50',
    tagColor: 'bg-green-100 text-green-800',
  },
  {
    id: 2,
    emoji: '🌍',
    title: 'The "Culture Collision" Story',
    description: 'Between two worlds. How you became a bridge between cultures.',
    prompt: 'Describe how navigating different cultural worlds has shaped your identity and perspective.',
    tags: ['Diversity', 'Empathy', 'Perspective'],
    borderColor: 'border-sky-blue',
    bgColor: 'bg-blue-50',
    tagColor: 'bg-blue-100 text-blue-800',
  },
  {
    id: 3,
    emoji: '🎨',
    title: 'The "Unexpected Obsession" Journey',
    description: 'That weird hobby. How it revealed something profound about you.',
    prompt: 'What unusual interest or hobby taught you something deeper about yourself?',
    tags: ['Authenticity', 'Curiosity', 'Unique'],
    borderColor: 'border-warning-orange',
    bgColor: 'bg-orange-50',
    tagColor: 'bg-orange-100 text-orange-800',
  },
  {
    id: 4,
    emoji: '👥',
    title: 'The "Behind the Scenes" Role',
    description: 'Not the president—the one who makes it work. Impact without spotlight.',
    prompt: 'Describe a time when you made a significant impact without being in the spotlight.',
    tags: ['Leadership', 'Teamwork', 'Humility'],
    borderColor: 'border-purple-500',
    bgColor: 'bg-purple-50',
    tagColor: 'bg-purple-100 text-purple-800',
  },
  {
    id: 5,
    emoji: '💡',
    title: 'The "Mundane Made Meaningful" Essay',
    description: 'Daily routines. Finding profound lessons in everyday rhythms.',
    prompt: 'What everyday activity or routine has taught you something profound?',
    tags: ['Gratitude', 'Mindfulness', 'Depth'],
    borderColor: 'border-pink-500',
    bgColor: 'bg-pink-50',
    tagColor: 'bg-pink-100 text-pink-800',
  },
  {
    id: 6,
    emoji: '🎭',
    title: 'The "Contradiction" Narrative',
    description: 'Math nerd who loves poetry. Embracing complexity, refusing labels.',
    prompt: 'How do you embrace the contradictions in your identity or interests?',
    tags: ['Complexity', 'Versatility', 'Self-Aware'],
    borderColor: 'border-teal-500',
    bgColor: 'bg-teal-50',
    tagColor: 'bg-teal-100 text-teal-800',
  },
];

const selfDiscoveryQuestions = [
  'What achievement are you most proud of, and why does it matter to you?',
  'Describe a time when you failed. What did you learn about yourself?',
  'What values guide your decisions? Where do they come from?',
  'Who or what has been your biggest influence, and how have they shaped you?',
  'What problem in the world concerns you most? Why?',
  'How do your extracurricular activities reflect who you are?',
];

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function PersonaLabPage() {
  const [selectedBlueprint, setSelectedBlueprint] = useState<number | null>(null);
  const [userResponse, setUserResponse] = useState('');
  const [insights, setInsights] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatTyping, setIsChatTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleGenerateInsights = async () => {
    if (!userResponse.trim()) return;

    setIsGenerating(true);

    // Simulate AI processing
    setTimeout(() => {
      const mockInsights = [
        '🎯 Your response shows strong self-awareness and growth mindset. Consider emphasizing the specific actions you took to overcome obstacles.',
        '✨ The personal connection you\'ve made is compelling. Try to quantify your impact to make it more concrete.',
        '💡 Your story demonstrates resilience. Link this quality to how you\'ll contribute to the university community.',
        '📚 Consider adding a specific example or anecdote to illustrate your point more vividly.',
      ];
      
      setInsights(mockInsights.slice(0, 2 + Math.floor(Math.random() * 2)));
      setIsGenerating(false);
    }, 2000);
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput.trim(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setIsChatTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(userMessage.content),
      };
      
      setChatMessages((prev) => [...prev, aiResponse]);
      setIsChatTyping(false);
    }, 1500);
  };

  const getAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('essay') || lowerMessage.includes('blueprint')) {
      return 'Great question! Each essay blueprint above is designed to highlight different aspects of your personality. The "Failed Experiment" arc works well for STEM students, while "Culture Collision" resonates with international experiences. Which blueprint interests you most?';
    } else if (lowerMessage.includes('university') || lowerMessage.includes('recommend')) {
      return 'I can help with that! First, tell me about your GPA, intended major, and target countries. Based on your profile, I\'ll recommend universities that match your goals.';
    } else if (lowerMessage.includes('profile') || lowerMessage.includes('improve')) {
      return 'To strengthen your profile: 1) Focus on depth over breadth in extracurriculars, 2) Develop a unique "spike" or specialty, 3) Seek leadership opportunities, 4) Build strong relationships with mentors for recommendations. What area would you like to improve first?';
    }
    
    return 'I\'m here to help with essay ideation, profile building, and university applications! You can ask me about writing strategies, how to improve your application, or get personalized university recommendations. What would you like to explore?';
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-leaf-green via-light-green to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-leaf-green to-light-green text-white py-16">
          <PageContainer>
            <div className="text-center">
              <SlideUp>
                <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-4">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm font-medium">AI-Powered Essay Coach</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Persona Lab
                </h1>
                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                  Discover your unique story and craft compelling essays with AI-powered guidance
                </p>
              </SlideUp>
            </div>
          </PageContainer>
        </div>

        <PageContainer className="py-12">
          {/* Essay Blueprints */}
          <SlideUp>
            <div className="mb-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-dark-grey mb-2">
                  🤖 Essay Blueprints
                </h2>
                <p className="text-mid-grey">
                  I've analyzed thousands of successful essays. Here are <strong>6 clever blueprints</strong> that make admissions officers stop and read:
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {essayBlueprints.map((blueprint) => (
                  <button
                    key={blueprint.id}
                    onClick={() => setSelectedBlueprint(blueprint.id)}
                    className={`text-left p-4 rounded-xl border-l-4 ${blueprint.borderColor} bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-x-1 ${
                      selectedBlueprint === blueprint.id
                        ? 'shadow-lg ring-2 ring-leaf-green ring-opacity-50'
                        : 'shadow'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="text-3xl">{blueprint.emoji}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-dark-grey text-sm mb-2 leading-tight">
                          {blueprint.title}
                        </h4>
                        <p className="text-xs text-mid-grey leading-relaxed">
                          {blueprint.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {blueprint.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-xs px-2 py-1 rounded-full ${blueprint.tagColor}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </SlideUp>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Writing Space */}
            <div className="lg:col-span-2">
              <SlideUp delay={0.1}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {selectedBlueprint
                        ? essayBlueprints.find(b => b.id === selectedBlueprint)?.title
                        : 'Start Your Reflection'}
                    </CardTitle>
                    {selectedBlueprint && (
                      <p className="text-mid-grey text-sm">
                        {essayBlueprints.find(b => b.id === selectedBlueprint)?.prompt}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      value={userResponse}
                      onChange={(e) => setUserResponse(e.target.value)}
                      placeholder="Share your thoughts here... Be authentic and specific. The AI will help you refine your ideas into a compelling essay."
                      rows={12}
                      className="resize-none"
                    />

                    <Button
                      onClick={handleGenerateInsights}
                      disabled={!userResponse.trim() || isGenerating}
                      className="w-full"
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing your story...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Insights
                        </>
                      )}
                    </Button>

                    {/* AI Insights */}
                    {insights.length > 0 && (
                      <div className="space-y-3 mt-6">
                        <h4 className="font-semibold text-dark-grey flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-leaf-green" />
                          AI Insights & Suggestions
                        </h4>
                        {insights.map((insight, index) => (
                          <div
                            key={index}
                            className="p-4 bg-leaf-green/5 border-l-4 border-leaf-green rounded-r-lg"
                          >
                            <p className="text-sm text-dark-grey">{insight}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </SlideUp>
            </div>

            {/* Self-Discovery Questions */}
            <div>
              <SlideUp delay={0.2}>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-lg">Self-Discovery Questions</CardTitle>
                    <p className="text-sm text-mid-grey">
                      Reflect on these to uncover your story
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selfDiscoveryQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => setUserResponse(question + '\n\nMy response:\n')}
                          className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-leaf-green hover:bg-leaf-green/5 transition-colors"
                        >
                          <p className="text-sm text-dark-grey">{question}</p>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </SlideUp>
            </div>
          </div>

          {/* AI Chat Assistant */}
          <SlideUp delay={0.3}>
            <Card className="mt-8 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-leaf-green to-light-green text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
                    🤖
                  </div>
                  <div>
                    <CardTitle className="text-white mb-1">LeapBot - Your AI Coach</CardTitle>
                    <p className="text-sm text-white/90">Ask me anything about essays, applications, or profile building</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Chat Messages */}
                <div className="h-96 overflow-y-auto bg-light-grey p-6 space-y-4">
                  {chatMessages.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">💬</div>
                      <p className="text-mid-grey mb-4">
                        Start a conversation! Ask me about:
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {[
                          'How to choose an essay blueprint?',
                          'What makes a strong application?',
                          'Tips for improving my profile',
                          'Which universities should I target?',
                        ].map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => setChatInput(suggestion)}
                            className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-full hover:border-leaf-green hover:bg-leaf-green/5 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          {message.role === 'assistant' && (
                            <div className="w-8 h-8 bg-gradient-to-br from-leaf-green to-light-green rounded-full flex items-center justify-center text-white flex-shrink-0">
                              🤖
                            </div>
                          )}
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                              message.role === 'user'
                                ? 'bg-leaf-green text-white'
                                : 'bg-white shadow-sm'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          </div>
                          {message.role === 'user' && (
                            <div className="w-8 h-8 bg-dark-grey rounded-full flex items-center justify-center text-white flex-shrink-0">
                              👤
                            </div>
                          )}
                        </div>
                      ))}
                      {isChatTyping && (
                        <div className="flex gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-leaf-green to-light-green rounded-full flex items-center justify-center text-white">
                            🤖
                          </div>
                          <div className="bg-white shadow-sm rounded-2xl px-4 py-3">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-mid-grey rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 bg-mid-grey rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 bg-mid-grey rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </>
                  )}
                </div>

                {/* Chat Input */}
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="flex gap-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
                      placeholder="Ask me anything..."
                      disabled={isChatTyping}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendChat}
                      disabled={!chatInput.trim() || isChatTyping}
                      size="icon"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SlideUp>

          {/* Info Section */}
          <SlideUp delay={0.4}>
            <Card className="mt-8 bg-gradient-to-r from-sky-blue/10 to-leaf-green/10 border-sky-blue/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-sky-blue/20 rounded-lg">
                    <Sparkles className="w-6 h-6 text-sky-blue" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark-grey mb-2">
                      The Best Essays Aren't About Achievements
                    </h4>
                    <p className="text-sm text-mid-grey mb-3">
                      They're about <strong>authentic reflection</strong>. Our AI analyzes thousands of successful essays to help you discover your unique narrative. 
                      Choose a blueprint above, answer prompts honestly, and chat with LeapBot to refine your story into something admissions officers will remember.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Essay Ideation</Badge>
                      <Badge variant="secondary">AI Chat Support</Badge>
                      <Badge variant="secondary">Self-Discovery</Badge>
                      <Badge variant="secondary">Profile Analysis</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SlideUp>
        </PageContainer>
      </div>
    </PageTransition>
  );
}


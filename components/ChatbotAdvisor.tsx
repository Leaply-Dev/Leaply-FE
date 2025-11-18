'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Sparkles, User as UserIcon, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import type { ProfileConfig } from './PersonaLabProfile';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

interface ChatbotAdvisorProps {
  profileContext?: ProfileConfig | null;
}

const QUICK_REPLIES = [
  'What are admission requirements?',
  'Tell me about scholarships',
  'How do I write a great essay?',
  'Which universities match my profile?',
  'Application deadlines?',
  'Study visa process?',
];

const SYSTEM_MESSAGE = "Hi, I'm Leafy, your AI study-abroad advisor! 🌿 I'm here to help you navigate the university application process. I can provide information about admissions, scholarships, essays, and more. Please note that I'm an AI assistant and my suggestions are for informational purposes only.";

export function ChatbotAdvisor({ profileContext }: ChatbotAdvisorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'system',
      content: SYSTEM_MESSAGE,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHumanAdvisorDialog, setShowHumanAdvisorDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (profileContext) {
      const profileMessage = `I've analyzed the profile you created in Persona Lab:\n\n📊 GPA: ${profileContext.gpa.toFixed(1)}\n📝 SAT Score: ${profileContext.testScore}\n💰 Budget: $${(profileContext.budget / 1000).toFixed(0)}k/year\n🌍 Preferred Region: ${profileContext.region}\n⭐ Extracurriculars: ${getExtracurricularLabel(profileContext.extracurriculars)}\n\nBased on this profile, I can recommend universities that match your qualifications and preferences. Would you like specific university recommendations, or do you have questions about improving any aspect of your profile?`;
      
      addMessage('assistant', profileMessage);
    }
  }, [profileContext]);

  const getExtracurricularLabel = (level: number): string => {
    const labels = ['Basic', 'Moderate', 'Strong', 'Exceptional', 'Outstanding'];
    return labels[level - 1] || 'N/A';
  };

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      id: `${Date.now()}_${Math.random()}`,
      role,
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('admission') || lowerMessage.includes('requirement')) {
      return `University admission requirements typically include:\n\n📚 **Academic Requirements:**\n- High school GPA (usually 3.0+)\n- Standardized test scores (SAT/ACT for US, A-levels for UK)\n- English proficiency (TOEFL/IELTS for international students)\n\n📝 **Application Materials:**\n- Personal statement/essays\n- Letters of recommendation (2-3)\n- Transcripts and certificates\n- Resume/CV\n\n💡 **Tip:** Requirements vary by university and program. Top universities typically expect GPA 3.5+, SAT 1400+, and strong extracurriculars. Would you like specific requirements for any particular university?`;
    }

    if (lowerMessage.includes('scholarship')) {
      return `Great question! Here are scholarship opportunities for international students:\n\n🏆 **Merit-Based Scholarships:**\n- University-specific scholarships (check each university's website)\n- Fulbright Program (US)\n- Chevening Scholarship (UK)\n- DAAD Scholarships (Germany)\n\n💰 **Need-Based Financial Aid:**\n- Many US universities offer need-based aid to international students\n- Some universities are "need-blind" for admissions\n\n📋 **Tips for Winning Scholarships:**\n1. Start early - many deadlines are 6-12 months before enrollment\n2. Highlight unique experiences and achievements\n3. Tailor each application to the specific scholarship\n4. Demonstrate leadership and community impact\n\nWould you like help finding scholarships for a specific country or field?`;
    }

    if (lowerMessage.includes('essay') || lowerMessage.includes('statement')) {
      return `Writing a compelling essay is crucial! Here's my advice:\n\n✍️ **Essay Structure:**\n1. **Hook:** Start with a compelling story or question\n2. **Personal Journey:** Show your growth and development\n3. **Why This University:** Be specific about programs/opportunities\n4. **Future Goals:** Connect your past to your aspirations\n5. **Strong Conclusion:** Leave a memorable impression\n\n💡 **Key Tips:**\n- Be authentic - admissions officers can spot insincerity\n- Show, don't tell - use specific examples\n- Focus on transformation and learning\n- Avoid clichés and generic statements\n- Stay within word limits\n\n🚫 **Common Mistakes:**\n- Listing achievements without reflection\n- Generic reasons for choosing the university\n- Poor grammar and typos\n- Controversial topics without nuance\n\nWant help brainstorming essay topics? Check out our Persona Lab for essay blueprints!`;
    }

    if (lowerMessage.includes('deadline')) {
      return `Application deadlines vary by country and university:\n\n📅 **US Universities:**\n- Early Decision/Action: November 1-15\n- Regular Decision: January 1-15\n- Rolling Admissions: Varies, apply early!\n\n🇬🇧 **UK Universities (UCAS):**\n- Oxford/Cambridge: October 15\n- Most courses: January 31\n- Some courses: March 31\n\n🇨🇦 **Canada:**\n- Most universities: January - March\n- Varies by province and university\n\n🇪🇺 **Europe:**\n- Wide variation; typically March-May\n- Earlier for international students\n\n⏰ **Important:** Start preparing 12-18 months before your intended start date! This gives time for tests, essays, and gathering materials.`;
    }

    if (lowerMessage.includes('visa')) {
      return `The visa process is an important step! Here's an overview:\n\n🇺🇸 **US (F-1 Student Visa):**\n1. Get I-20 form from university\n2. Pay SEVIS fee\n3. Complete DS-160 form\n4. Schedule visa interview\n5. Prepare financial documents\n6. Attend interview at embassy\n\n🇬🇧 **UK (Student Visa):**\n1. Receive CAS from university\n2. Prove English proficiency\n3. Show financial evidence\n4. Apply online and book biometrics\n5. Tuberculosis test (if required)\n\n⏱️ **Timeline:**\n- Apply 3-6 months before departure\n- Processing takes 2-8 weeks typically\n\n💰 **Financial Requirements:**\n- Proof of tuition + living expenses\n- Bank statements (usually 3-6 months)\n- Sponsor letters if applicable\n\n💡 **Tip:** Start gathering documents early, especially bank statements and sponsor letters!`;
    }

    if (lowerMessage.includes('recommend') || lowerMessage.includes('university') || lowerMessage.includes('match')) {
      if (profileContext) {
        return `Based on your profile (GPA: ${profileContext.gpa.toFixed(1)}, SAT: ${profileContext.testScore}, Budget: $${(profileContext.budget / 1000).toFixed(0)}k), here are some recommendations:\n\n🎓 **Top Matches:**\n${profileContext.gpa >= 3.7 && profileContext.testScore >= 1450 ? '- **Stanford University** - Excellent fit for your strong profile\n- **MIT** - Great for STEM with strong research opportunities\n- **UC Berkeley** - Top public university with diverse programs\n\n' : ''}${profileContext.gpa >= 3.3 ? '- **University of Toronto** - Excellent academics, more accessible\n- **University of Amsterdam** - Strong programs, lower tuition\n\n' : ''}${profileContext.budget <= 30000 ? '💰 **Budget-Friendly Options:**\n- **Technical University of Munich** - Low/no tuition, high quality\n- **University of Oslo** - Free tuition for international students\n\n' : ''}\n💡 Want more detailed recommendations? Adjust your profile in the Persona Lab tab to see different matches!`;
      }
      return `I'd love to recommend universities! To give you the best recommendations, I need to know more about your profile:\n\n- What's your GPA?\n- Test scores (SAT/ACT)?\n- Preferred region/country?\n- Budget for annual expenses?\n- Intended major/field of study?\n\nYou can also use the **Persona Lab** tab to input your profile and get instant matches!`;
    }

    // Default response
    return `Thanks for your question! I'm here to help with:\n\n✅ University recommendations\n✅ Admission requirements\n✅ Scholarship opportunities\n✅ Essay writing tips\n✅ Application deadlines\n✅ Visa and immigration process\n\nCould you be more specific about what you'd like to know? Or try one of the quick reply buttons below!`;
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);

    // Simulate AI typing
    setIsTyping(true);
    
    setTimeout(() => {
      const response = generateAIResponse(userMessage);
      addMessage('assistant', response);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickReply = (reply: string) => {
    setInput(reply);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-muted/50 p-4 sm:p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role !== 'user' && (
              <div className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
            )}
            
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : message.role === 'system'
                  ? 'bg-chart-2/10 border border-chart-2/20'
                  : 'bg-card shadow-sm'
              }`}
            >
              <p className={`text-sm whitespace-pre-wrap leading-relaxed ${
                message.role === 'user' ? 'text-primary-foreground' : 'text-foreground'
              }`}>
                {message.content}
              </p>
            </div>
            
            {message.role === 'user' && (
              <div className="shrink-0 w-10 h-10 rounded-full bg-foreground flex items-center justify-center shadow-sm">
                <UserIcon className="w-5 h-5 text-background" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="bg-card shadow-sm rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {messages.length <= 2 && (
        <div className="px-4 sm:px-6 py-3 bg-card border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_REPLIES.map((reply) => (
              <Button
                key={reply}
                variant="outline"
                size="sm"
                onClick={() => handleQuickReply(reply)}
                className="text-xs"
              >
                {reply}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-border bg-card p-4 sm:p-6">
        <div className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about studying abroad..."
            disabled={isTyping}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            size="icon"
            className="shrink-0"
          >
            {isTyping ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-muted-foreground">
            💡 AI-powered responses for informational purposes
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHumanAdvisorDialog(true)}
            className="text-xs text-primary hover:text-primary"
          >
            <Phone className="w-3 h-3 mr-1" />
            Talk to a human advisor
          </Button>
        </div>
      </div>

      {/* Human Advisor Dialog */}
      <Dialog open={showHumanAdvisorDialog} onOpenChange={setShowHumanAdvisorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect with a Human Advisor</DialogTitle>
            <DialogDescription>
              While Leafy can provide helpful information, sometimes you need personalized guidance from a real person.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Schedule a Free Consultation
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our expert advisors can provide personalized guidance on university selection, application strategy, and more.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-foreground">
                      📧 Email: advisors@leaply.com
                    </p>
                    <p className="text-sm text-foreground">
                      📞 Phone: +1 (555) 123-4567
                    </p>
                    <p className="text-sm text-foreground">
                      🕒 Available: Mon-Fri, 9am-6pm EST
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowHumanAdvisorDialog(false)}>
              Got it, thanks!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


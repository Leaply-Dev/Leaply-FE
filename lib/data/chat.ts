import { Conversation } from '../store/chatStore';

export const mockConversations: Conversation[] = [
  {
    id: 'conv-001',
    title: 'Getting Started with Applications',
    createdAt: '2024-11-10T10:00:00Z',
    updatedAt: '2024-11-10T10:15:00Z',
    messages: [
      {
        id: 'msg-001',
        role: 'user',
        content: 'Hi! I\'m interested in studying computer science abroad. Where should I start?',
        timestamp: '2024-11-10T10:00:00Z',
      },
      {
        id: 'msg-002',
        role: 'assistant',
        content: 'Hello! It\'s great that you\'re interested in studying computer science abroad. Here are some key steps to get started:\n\n1. **Research universities**: Look into top CS programs in countries you\'re interested in (US, UK, Canada, etc.)\n2. **Check requirements**: Each university has different admission requirements including GPA, test scores (SAT, GRE, IELTS/TOEFL), and application essays\n3. **Prepare your profile**: Start building your academic profile with relevant coursework, projects, and extracurriculars\n4. **Timeline**: Most applications are due between November-January for fall admission\n\nWhat specific aspects would you like to explore first?',
        timestamp: '2024-11-10T10:01:30Z',
      },
      {
        id: 'msg-003',
        role: 'user',
        content: 'What test scores do I need for top universities?',
        timestamp: '2024-11-10T10:05:00Z',
      },
      {
        id: 'msg-004',
        role: 'assistant',
        content: 'For top computer science programs, here are typical test score requirements:\n\n**US Universities (Stanford, MIT, etc.):**\n- SAT: 1450-1600 (Math section especially important)\n- ACT: 33-36\n- TOEFL: 100+ or IELTS: 7.5+\n\n**UK Universities (Oxford, Cambridge, Imperial):**\n- A-levels: A*A*A or equivalent\n- IELTS: 7.0-7.5\n\n**Other factors:**\n- Strong performance in math and science subjects\n- Coding projects and competitions\n- Research experience or internships\n\nRemember, test scores are just one part of your application. Universities also value essays, recommendations, and demonstrated passion for CS!',
        timestamp: '2024-11-10T10:06:45Z',
      },
    ],
  },
  {
    id: 'conv-002',
    title: 'Scholarship Opportunities',
    createdAt: '2024-11-12T14:00:00Z',
    updatedAt: '2024-11-12T14:20:00Z',
    messages: [
      {
        id: 'msg-005',
        role: 'user',
        content: 'Are there scholarships available for international students?',
        timestamp: '2024-11-12T14:00:00Z',
      },
      {
        id: 'msg-006',
        role: 'assistant',
        content: 'Yes! There are many scholarship opportunities for international students:\n\n**Merit-based Scholarships:**\n- Rhodes Scholarship (Oxford)\n- Gates Cambridge Scholarship\n- Fulbright Program (US)\n- Chevening Scholarship (UK)\n\n**University-specific:**\n- Most top universities offer need-based financial aid\n- Many have dedicated international student scholarships\n\n**Tips for winning scholarships:**\n1. Start early - many have deadlines before university applications\n2. Tailor each application to the specific scholarship\n3. Highlight unique experiences and leadership\n4. Get strong recommendation letters\n\nWould you like information about scholarships for a specific country or university?',
        timestamp: '2024-11-12T14:02:15Z',
      },
    ],
  },
];

export const mockAIResponses: Record<string, string> = {
  default: 'I\'m here to help you with your study abroad journey! I can assist with:\n\n- University selection and program recommendations\n- Application requirements and deadlines\n- Essay and personal statement guidance\n- Scholarship opportunities\n- Test preparation advice\n- Visa and immigration questions\n\nWhat would you like to know?',
  
  universities: 'Based on your profile and preferences, I recommend looking into these universities:\n\n1. **University of Oxford** - Excellent CS program, strong research opportunities\n2. **Stanford University** - Close to Silicon Valley, great for entrepreneurship\n3. **ETH Zurich** - Low tuition, top-ranked engineering programs\n\nWould you like detailed information about any of these?',
  
  essay: 'Here are some tips for writing a strong personal statement:\n\n**Structure:**\n- Opening hook that captures attention\n- Your academic journey and interests\n- Why this specific program/university\n- Your future goals\n- Strong closing\n\n**Do:**\n- Be specific and authentic\n- Show, don\'t tell (use examples)\n- Connect your experiences to your goals\n\n**Don\'t:**\n- Use clichés or generic statements\n- Simply list achievements\n- Exceed word limits\n\nWould you like me to review a draft?',
};


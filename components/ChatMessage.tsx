import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  className?: string;
}

export function ChatMessage({
  role,
  content,
  timestamp,
  className,
}: ChatMessageProps) {
  const isAssistant = role === 'assistant';

  return (
    <div
      className={cn(
        'flex gap-3 mb-4',
        isAssistant ? 'justify-start' : 'justify-end',
        className
      )}
    >
      {isAssistant && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-leaf-green flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-3',
          isAssistant
            ? 'bg-white border border-gray-200'
            : 'bg-leaf-green text-white'
        )}
      >
        <p className={cn('text-sm whitespace-pre-wrap', isAssistant ? 'text-dark-grey' : 'text-white')}>
          {content}
        </p>
        {timestamp && (
          <p
            className={cn(
              'text-xs mt-1',
              isAssistant ? 'text-mid-grey' : 'text-white/70'
            )}
          >
            {new Date(timestamp).toLocaleTimeString()}
          </p>
        )}
      </div>
      
      {!isAssistant && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-dark-grey flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
}


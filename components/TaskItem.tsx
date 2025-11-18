'use client';

import { Calendar, AlertCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  onToggle: (id: string) => void;
  className?: string;
}

const priorityConfig = {
  low: { color: 'text-chart-2', bgColor: 'bg-chart-2/10' },
  medium: { color: 'text-chart-4', bgColor: 'bg-chart-4/10' },
  high: { color: 'text-red-600', bgColor: 'bg-red-100' },
};

export function TaskItem({
  id,
  title,
  description,
  dueDate,
  completed,
  priority = 'medium',
  onToggle,
  className,
}: TaskItemProps) {
  const isOverdue = new Date(dueDate) < new Date() && !completed;
  const config = priorityConfig[priority];

  return (
    <div
      className={cn(
        'flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted transition-colors',
        completed && 'opacity-60',
        className
      )}
    >
      <Checkbox
        checked={completed}
        onChange={() => onToggle(id)}
        className="mt-1"
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4
            className={cn(
              'font-medium text-foreground',
              completed && 'line-through'
            )}
          >
            {title}
          </h4>
          {priority && (
            <Badge
              variant="outline"
              className={cn('text-xs', config.color, config.bgColor)}
            >
              {priority}
            </Badge>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>Due: {new Date(dueDate).toLocaleDateString()}</span>
          {isOverdue && (
            <>
              <AlertCircle className="w-3 h-3 text-red-600 ml-2" />
              <span className="text-red-600">Overdue</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


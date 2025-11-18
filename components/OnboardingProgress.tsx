import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingProgressProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function OnboardingProgress({
  steps,
  currentStep,
  className,
}: OnboardingProgressProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors',
                    isCompleted && 'bg-leaf-green text-white',
                    isCurrent && 'bg-leaf-green text-white',
                    !isCompleted && !isCurrent && 'bg-light-grey text-mid-grey'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs mt-2 text-center',
                    (isCompleted || isCurrent) && 'text-dark-grey font-medium',
                    !isCompleted && !isCurrent && 'text-mid-grey'
                  )}
                >
                  {step}
                </span>
              </div>
              
              {!isLast && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 transition-colors',
                    isCompleted ? 'bg-leaf-green' : 'bg-light-grey'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


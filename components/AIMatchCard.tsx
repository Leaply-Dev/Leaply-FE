'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, DollarSign, TrendingUp, HelpCircle, Sparkles, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useUniversitiesStore } from '@/lib/store/universitiesStore';
import { useUserStore } from '@/lib/store/userStore';
import { calculateFitScore, getFitScoreColor } from '@/lib/utils/fitScore';
import { generateMatchReasons, getEncouragingCopy, getMatchBadgeText } from '@/lib/utils/matchReasons';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface AIMatchCardProps {
  id: string;
  name: string;
  country: string;
  city: string;
  ranking: number;
  logo: string;
  averageTuition: number;
  overview: string;
  className?: string;
  onAskAI?: (universityId: string, universityName: string) => void;
}

export function AIMatchCard({
  id,
  name,
  country,
  city,
  ranking,
  logo,
  averageTuition,
  overview,
  className,
  onAskAI,
}: AIMatchCardProps) {
  const { saveUniversity, unsaveUniversity, isSaved, universities } = useUniversitiesStore();
  const { profile, preferences } = useUserStore();
  const saved = isSaved(id);
  const [isWhyDialogOpen, setIsWhyDialogOpen] = useState(false);

  const university = universities.find(u => u.id === id);
  const fitScore = university ? calculateFitScore(university, profile, preferences) : 0;
  const { shortReasons, detailedReasons } = university 
    ? generateMatchReasons(university, profile, preferences)
    : { shortReasons: [], detailedReasons: [] };

  const toggleSave = () => {
    if (saved) {
      unsaveUniversity(id);
    } else {
      saveUniversity(id);
    }
  };

  const handleAskAI = () => {
    if (onAskAI) {
      onAskAI(id, name);
    }
  };

  return (
    <Card className={cn('overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-leaf-green/20', className)}>
      <CardContent className="p-0">
        <div className="relative h-48 bg-gradient-to-br from-leaf-green/10 to-light-green/5">
          <Image
            src={logo}
            alt={name}
            fill
            className="object-cover"
          />
          
          {/* AI Match Badge - Top Left */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-gradient-to-r from-leaf-green to-light-green text-white border-0 font-semibold shadow-lg">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Match
            </Badge>
          </div>

          {/* Ranking Badge - Top Right */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Badge className="bg-white text-dark-grey border border-gray-200 shadow-md">
              <Star className="w-3 h-3 mr-1 fill-warning-orange text-warning-orange" />
              #{ranking}
            </Badge>
          </div>

          {/* Fit Score Badge - Bottom Left */}
          {fitScore > 0 && (
            <div className="absolute bottom-4 left-4">
              <Badge className={cn('bg-white border-2 font-semibold shadow-md', getFitScoreColor(fitScore))}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {fitScore}% Match
              </Badge>
            </div>
          )}
        </div>
        
        <div className="p-6">
          {/* Encouraging Copy */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-leaf-green">
              {getEncouragingCopy(fitScore)}
            </p>
            <Dialog open={isWhyDialogOpen} onOpenChange={setIsWhyDialogOpen}>
              <DialogTrigger asChild>
                <button className="text-xs text-sky-blue hover:text-sky-blue/80 flex items-center gap-1 transition-colors">
                  <HelpCircle className="w-3 h-3" />
                  Why?
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-leaf-green" />
                    Why {name}?
                  </DialogTitle>
                  <DialogDescription>
                    Here's why we think this university could be a great match for you
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="flex items-center gap-3 p-3 bg-leaf-green/5 rounded-lg border border-leaf-green/20">
                    <div className="flex-shrink-0">
                      <Badge className={cn('border-2', getFitScoreColor(fitScore))}>
                        {fitScore}%
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark-grey">{getMatchBadgeText(fitScore)}</p>
                      <p className="text-xs text-mid-grey">Based on your profile and preferences</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-dark-grey">Match Reasons:</h4>
                    {detailedReasons.length > 0 ? (
                      <ul className="space-y-2">
                        {detailedReasons.map((reason, index) => (
                          <li key={reason.id} className="flex items-start gap-2 text-sm">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-leaf-green/10 text-leaf-green flex items-center justify-center text-xs font-medium mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-mid-grey flex-1">{reason.text}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-mid-grey">
                        Complete your profile to see personalized match reasons!
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href={`/universities/${id}`}>View Details</Link>
                  </Button>
                  {onAskAI && (
                    <Button variant="outline" onClick={() => {
                      handleAskAI();
                      setIsWhyDialogOpen(false);
                    }}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Ask AI
                    </Button>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <h3 className="text-xl font-semibold text-dark-grey mb-2">{name}</h3>
          
          <div className="flex items-center gap-4 text-sm text-mid-grey mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {city}, {country}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              ${averageTuition.toLocaleString()}/yr
            </span>
          </div>

          {/* Match Reasons */}
          {shortReasons.length > 0 && (
            <div className="mb-4 space-y-1.5">
              {shortReasons.map((reason) => (
                <div key={reason.id} className="flex items-start gap-2 text-xs text-mid-grey">
                  <span className="text-leaf-green mt-0.5">✓</span>
                  <span className="flex-1">{reason.text}</span>
                </div>
              ))}
            </div>
          )}
          
          <p className="text-sm text-mid-grey mb-4 line-clamp-2">{overview}</p>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button asChild size="sm" className="flex-1">
              <Link href={`/universities/${id}`}>Learn More</Link>
            </Button>
            <Button
              size="sm"
              variant={saved ? 'default' : 'outline'}
              onClick={toggleSave}
              className={cn(
                'transition-all',
                saved && 'bg-warning-orange hover:bg-warning-orange/90'
              )}
            >
              {saved ? '★ Saved' : '+ Add to Dream List'}
            </Button>
          </div>

          {/* Ask AI Button */}
          {onAskAI && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAskAI}
              className="w-full mt-2 text-sky-blue hover:text-sky-blue/80 hover:bg-sky-blue/5"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Ask AI about this school
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


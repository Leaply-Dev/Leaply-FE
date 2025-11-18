'use client';

import Link from 'next/link';
import { GraduationCap, Brain, Target, Globe, ArrowRight, Sparkles, Users, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StaggerContainer, StaggerItem, SlideUp } from '@/components/PageTransition';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
  {
    icon: Globe,
    title: 'Global University Search',
    description: 'Explore thousands of universities worldwide with detailed information on programs, rankings, and requirements.',
    href: '/universities',
  },
  {
    icon: Brain,
    title: 'AI-Powered Matching',
    description: 'Get personalized university recommendations based on your academic profile, preferences, and career goals.',
    href: '/persona-lab',
  },
  {
    icon: Target,
    title: 'Application Management',
    description: 'Track deadlines, manage documents, and stay organized throughout your application journey.',
    href: '/dashboard/applications',
  },
  {
    icon: GraduationCap,
    title: '24/7 AI Assistant',
    description: 'Get instant answers to your questions about applications, requirements, and studying abroad.',
    href: '/dashboard',
  },
];

const featuredUniversities = [
  { name: 'Harvard University', location: 'USA', logo: '🎓' },
  { name: 'University of Oxford', location: 'UK', logo: '🎓' },
  { name: 'ETH Zurich', location: 'Switzerland', logo: '🎓' },
  { name: 'National University of Singapore', location: 'Singapore', logo: '🎓' },
  { name: 'University of Toronto', location: 'Canada', logo: '🎓' },
  { name: 'University of Melbourne', location: 'Australia', logo: '🎓' },
];

const howItWorksSteps = [
  {
    step: 1,
    icon: Users,
    title: 'Create Your Profile',
    quote: 'Where do I even start with my study abroad journey? 🤔',
    description: 'Begin by telling us about your academic background, interests, career goals, and preferences. Our intelligent form guides you through every detail we need to find your perfect university match.',
    illustration: Users,
  },
  {
    step: 2,
    icon: Brain,
    title: 'Get Matched',
    quote: 'Which universities are actually right for me? 🎯',
    description: 'Our AI analyzes thousands of universities worldwide and recommends the ones that best fit your profile, budget, and aspirations. Get personalized match scores and detailed insights for each recommendation.',
    illustration: Brain,
  },
  {
    step: 3,
    icon: FileCheck,
    title: 'Apply with Confidence',
    quote: 'How do I manage multiple deadlines and requirements? 📋',
    description: 'Track all your applications in one place. We help you stay organized with deadline reminders, document checklists, and step-by-step guidance through each university\'s unique requirements.',
    illustration: FileCheck,
  },
  {
    step: 4,
    icon: Sparkles,
    title: 'Reinforce Your Profile with AI',
    quote: 'My essays feel generic... how can I stand out? ✨',
    description: 'Use our AI assistant to craft compelling personal statements and essays. Get instant feedback, suggestions for improvement, and guidance to showcase your unique story that admissions officers will remember.',
    illustration: Sparkles,
  },
];

function ScrollHighlightStep({ 
  children, 
  index 
}: { 
  children: React.ReactNode; 
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    margin: '-40% 0px -40% 0px',
    amount: 0.5
  });

  return (
    <motion.div
      ref={ref}
      animate={{
        opacity: isInView ? 1 : 0.3,
        scale: isInView ? 1 : 0.95,
      }}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
      }}
      className="relative"
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const marqueeUniversities = [...featuredUniversities, ...featuredUniversities];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-white py-16 md:py-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col items-center gap-8">
            <SlideUp>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-dark-grey leading-tight">
                Study abroad, simplified by
                <span className="text-leaf-green"> Leaply</span>
              </h1>
            </SlideUp>
            <SlideUp delay={0.1}>
              <p className="text-xl md:text-2xl text-mid-grey max-w-3xl">
                Get personalized university matches, application tracking, and intelligent essay guidance - all in one place.
              </p>
            </SlideUp>
            <SlideUp delay={0.2}>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 sm:min-w-[220px]"
                  asChild
                >
                  <Link href="/signup">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 sm:min-w-[220px]"
                  asChild
                >
                  <Link href="/universities">Explore Universities</Link>
                </Button>
              </div>
            </SlideUp>
          </div>
        </div>
      </section>

      {/* Top Universities Section */}
      <section className="py-16 bg-light-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SlideUp>
              <h2 className="text-3xl md:text-4xl font-bold text-dark-grey mb-4">
                Bringing top universities to you
              </h2>
              <p className="text-lg text-mid-grey max-w-2xl mx-auto">
                Explore leading institutions welcoming Leaply students worldwide
              </p>
            </SlideUp>
          </div>

          <div className="relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-light-grey to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-light-grey to-transparent pointer-events-none" />

            <div className="marquee-track flex items-center gap-10 py-6">
              {marqueeUniversities.map((university, index) => (
                <div
                  key={`${university.name}-${index}`}
                  className="flex items-center gap-3 whitespace-nowrap"
                >
                  <span className="text-4xl">{university.logo}</span>
                  <div className="text-left">
                    <p className="text-base font-semibold text-dark-grey">
                      {university.name}
                    </p>
                    <p className="text-sm text-mid-grey">{university.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <SlideUp>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <h2 className="text-3xl md:text-4xl font-bold text-dark-grey leading-tight max-w-xl">
                  <span className="relative inline-block">
                    <span className="absolute inset-x-0 bottom-1 h-3 bg-light-green/60 rounded-md" />
                    <span className="relative lowercase">everything you need</span>
                  </span>{' '}
                  to study abroad
                </h2>
                <p className="text-lg text-mid-grey max-w-2xl">
                  Powerful tools and personalized guidance to help you navigate the complex world of international education.
                </p>
              </div>
            </SlideUp>
          </div>

          <StaggerContainer>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <StaggerItem key={feature.title}>
                    <Card className="h-full hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-6 flex flex-col h-full gap-4">
                        <div className="p-3 bg-leaf-green/10 rounded-2xl w-fit">
                          <Icon className="w-6 h-6 text-leaf-green" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-dark-grey mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-mid-grey leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                        <div className="mt-auto">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-11 w-11 rounded-full border border-dark-grey/20 hover:border-dark-grey/60"
                            asChild
                          >
                            <Link href={feature.href} aria-label={`Learn more about ${feature.title}`}>
                              <ArrowRight className="w-5 h-5 text-dark-grey" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                );
              })}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-light-grey">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <SlideUp>
              <h2 className="text-3xl md:text-4xl font-bold text-dark-grey mb-4">
                How Leaply Works
              </h2>
              <p className="text-lg text-mid-grey max-w-2xl mx-auto">
                Four simple steps to find and apply to your dream university
              </p>
            </SlideUp>
          </div>

          <div className="space-y-24">
            {howItWorksSteps.map((item, index) => {
              const Icon = item.icon;
              return (
                <ScrollHighlightStep key={item.step} index={index}>
                  <div className="relative">
                    {/* Step number badge */}
                    <div className="flex items-start gap-6 mb-6">
                      <div className="flex-shrink-0 w-16 h-16 bg-leaf-green text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                        {item.step}
                      </div>
                      <div className="flex-1 pt-2">
                        <h3 className="text-2xl md:text-3xl font-bold text-dark-grey mb-4">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    {/* User quote */}
                    <div className="bg-white/80 backdrop-blur-sm border-l-4 border-leaf-green rounded-lg p-6 mb-6 shadow-sm">
                      <p className="text-lg italic text-mid-grey">
                        &quot;{item.quote}&quot;
                      </p>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-xl p-8 shadow-md">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 p-3 bg-leaf-green/10 rounded-lg">
                          <Icon className="w-8 h-8 text-leaf-green" />
                        </div>
                        <p className="text-lg text-mid-grey leading-relaxed flex-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollHighlightStep>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-leaf-green to-light-green text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SlideUp>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg mb-8 text-white/90">
              Join Leaply today and take the first step towards your global education
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">
                  Create Free Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-leaf-green"
                asChild
              >
                <Link href="/chatbot">Try AI Assistant</Link>
              </Button>
            </div>
          </SlideUp>
        </div>
      </section>
      <style jsx global>{`
        @keyframes leaply-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .marquee-track {
          width: max-content;
          animation: leaply-marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}

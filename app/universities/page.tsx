'use client';

import { useEffect, useState } from 'react';
import { Search, GraduationCap } from 'lucide-react';
import { PageContainer } from '@/components/Layout';
import { UniversityCard } from '@/components/UniversityCard';
import { FilterBar } from '@/components/FilterBar';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useUniversitiesStore } from '@/lib/store/universitiesStore';
import { mockUniversities } from '@/lib/data/universities';
import { PageTransition, StaggerContainer, StaggerItem, SlideUp } from '@/components/PageTransition';

export default function UniversitiesPage() {
  const { universities, setUniversities, filters, setFilters, getFilteredUniversities } = useUniversitiesStore();
  const [sortBy, setSortBy] = useState<'ranking' | 'tuition' | 'fit'>('fit');
  const [searchInput, setSearchInput] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedRankings, setSelectedRankings] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [tuitionRange, setTuitionRange] = useState({ min: 0, max: 100000 });

  useEffect(() => {
    // Initialize universities on mount
    if (universities.length === 0) {
      setUniversities(mockUniversities);
    }
  }, [universities.length, setUniversities]);

  // Apply filters
  let filteredUniversities = universities;
  
  if (searchInput) {
    filteredUniversities = filteredUniversities.filter(uni =>
      uni.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      uni.city.toLowerCase().includes(searchInput.toLowerCase()) ||
      uni.country.toLowerCase().includes(searchInput.toLowerCase())
    );
  }
  
  if (selectedCountries.length > 0) {
    filteredUniversities = filteredUniversities.filter(uni =>
      selectedCountries.includes(uni.country)
    );
  }
  
  if (selectedRankings.length > 0) {
    filteredUniversities = filteredUniversities.filter(uni => {
      return selectedRankings.some(range => {
        if (range === '1-10') return uni.ranking <= 10;
        if (range === '11-50') return uni.ranking >= 11 && uni.ranking <= 50;
        if (range === '51-100') return uni.ranking >= 51 && uni.ranking <= 100;
        return false;
      });
    });
  }
  
  // Sort universities
  const sortedUniversities = [...filteredUniversities].sort((a, b) => {
    if (sortBy === 'ranking') {
      return a.ranking - b.ranking;
    } else if (sortBy === 'tuition') {
      return a.averageTuition - b.averageTuition;
    } else {
      // Sort by fit score (mock)
      return b.ranking - a.ranking;
    }
  });

  // Get unique countries for filter
  const countries = Array.from(new Set(mockUniversities.map(uni => uni.country))).sort();
  
  const handleCountryToggle = (country: string) => {
    setSelectedCountries(prev =>
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
  };
  
  const handleRankingToggle = (range: string) => {
    setSelectedRankings(prev =>
      prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
    );
  };
  
  const clearAllFilters = () => {
    setSearchInput('');
    setSelectedCountries([]);
    setSelectedRankings([]);
    setSelectedFields([]);
    setTuitionRange({ min: 0, max: 100000 });
  };

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="bg-linear-to-br from-leaf-green to-light-green text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SlideUp>
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Discover Your Perfect Match
              </h1>
              <p className="text-xl text-white/90">
                Search from 1000+ universities worldwide
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="flex gap-3 bg-white rounded-xl p-2 shadow-lg">
                <div className="flex-1 flex items-center gap-3 px-3">
                  <Search className="w-5 h-5 text-mid-grey" />
                  <Input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search universities, programs, or countries..."
                    className="border-0 focus-visible:ring-0 text-dark-grey"
                  />
                </div>
                <Button size="lg" className="px-8">
                  Search
                </Button>
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                <span className="text-sm text-white/80">Popular:</span>
                {['USA', 'UK', 'Canada', 'Australia'].map((country) => (
                  <button
                    key={country}
                    onClick={() => handleCountryToggle(country)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      selectedCountries.includes(country)
                        ? 'bg-white text-leaf-green font-medium'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>
          </SlideUp>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Filters Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-dark-grey">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>

              {/* Country Filter */}
              <div>
                <h4 className="font-medium text-dark-grey mb-3">Country</h4>
                <div className="space-y-2">
                  {countries.map((country) => (
                    <label
                      key={country}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCountries.includes(country)}
                        onChange={() => handleCountryToggle(country)}
                        className="w-4 h-4 rounded-sm border-gray-300 text-leaf-green focus:ring-leaf-green"
                      />
                      <span className="text-sm text-mid-grey">{country}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ranking Filter */}
              <div>
                <h4 className="font-medium text-dark-grey mb-3">Global Ranking</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Top 10', value: '1-10' },
                    { label: 'Top 11-50', value: '11-50' },
                    { label: 'Top 51-100', value: '51-100' },
                  ].map((range) => (
                    <label
                      key={range.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRankings.includes(range.value)}
                        onChange={() => handleRankingToggle(range.value)}
                        className="w-4 h-4 rounded-sm border-gray-300 text-leaf-green focus:ring-leaf-green"
                      />
                      <span className="text-sm text-mid-grey">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results Section */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-dark-grey">All Universities</h2>
                <p className="text-sm text-mid-grey mt-1">
                  Showing {sortedUniversities.length} results
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="sortBy" className="text-sm text-mid-grey">
                  Sort by:
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-leaf-green focus:border-transparent"
                >
                  <option value="fit">Best Fit</option>
                  <option value="ranking">Ranking</option>
                  <option value="tuition">Tuition (Low to High)</option>
                </select>
              </div>
            </div>

            {/* University Grid */}
            <StaggerContainer>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedUniversities.map((university) => (
                  <StaggerItem key={university.id}>
                    <UniversityCard
                      id={university.id}
                      name={university.name}
                      country={university.country}
                      city={university.city}
                      ranking={university.ranking}
                      logo={university.logo}
                      averageTuition={university.averageTuition}
                      overview={university.overview}
                    />
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>

            {sortedUniversities.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-mid-grey mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-dark-grey mb-2">
                  No universities found
                </h3>
                <p className="text-mid-grey">
                  Try adjusting your filters to see more results
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </PageTransition>
  );
}

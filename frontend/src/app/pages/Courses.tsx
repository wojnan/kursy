import { useEffect, useState } from 'react';
import { CourseCard } from '../components/CourseCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Badge } from '../components/ui/badge';

import { getAllCourses, type Course } from '../services/database';

export function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch courses from API
  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        const data = await getAllCourses();
        setCourses(data);
      } catch (err) {
        setError('Failed to load courses');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  // Derive categories dynamically from DB data
  const categories = ['All', ...Array.from(new Set(courses.map(c => c.category)))];

  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      selectedCategory === 'All' || course.category === selectedCategory;

    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container px-4 py-8">
          <h1 className="text-4xl font-bold mb-4">All Courses</h1>
          <p className="text-gray-600">
            Explore our comprehensive catalog of courses
          </p>
        </div>
      </div>

      <div className="container px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 sticky top-20">
              
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="h-5 w-5" />
                <h3 className="font-semibold">Filters</h3>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-3 block">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Category
                </label>
                <div className="space-y-2">
                  {categories.map((category: string) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedCategory === category
                          ? 'text-gray-900 font-medium'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                      style={
                        selectedCategory === category
                          ? { backgroundColor: '#e9f5e1' }
                          : {}
                      }
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-gray-600">
                  {filteredCourses.length}{' '}
                  {filteredCourses.length === 1 ? 'course' : 'courses'}
                </span>

                {selectedCategory !== 'All' && (
                  <Badge variant="secondary" className="gap-2">
                    {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory('All')}
                      className="ml-1 hover:text-gray-900"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            </div>

            {filteredCourses.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 mb-4">
                  No courses found matching your criteria
                </p>
                <Button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course: Course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
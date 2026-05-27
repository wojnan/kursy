import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import { Button } from '../components/ui/button';
import { CourseCard } from '../components/CourseCard';

import {
  ArrowRight,
  Award,
  Users,
  BookOpen,
  Star,
} from 'lucide-react';

import {
  getAllCourses,
  type Course,
} from '../services/database';

export function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const featuredCourses = courses.slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section
        className="text-white py-20"
        style={{
          backgroundImage:
            'linear-gradient(to bottom right, #4F772D, #3d5a22)',
        }}
      >
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">

            <h1 className="text-5xl font-bold mb-6">
              Unlock Your Potential with Online Learning
            </h1>

            <p className="text-xl mb-8 opacity-90">
              Discover thousands of courses taught by expert instructors.
              Start learning today and advance your career.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/courses">
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 bg-amber-50 hover:bg-amber-100"
                  style={{ color: '#1a3a0f' }}
                >
                  Explore Courses <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link to="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white"
                >
                  My Learning
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-amber-50">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">

            <div>
              <BookOpen className="h-12 w-12 mx-auto mb-4" style={{ color: '#4F772D' }} />
              <div className="text-3xl font-bold mb-2">
                {courses.length * 1000 || 10000}+
              </div>
              <div className="text-gray-600">Online Courses</div>
            </div>

            <div>
              <Users className="h-12 w-12 mx-auto mb-4" style={{ color: '#4F772D' }} />
              <div className="text-3xl font-bold mb-2">50,000+</div>
              <div className="text-gray-600">Students</div>
            </div>

            <div>
              <Award className="h-12 w-12 mx-auto mb-4" style={{ color: '#4F772D' }} />
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-gray-600">Expert Instructors</div>
            </div>

            <div>
              <Star className="h-12 w-12 mx-auto mb-4" style={{ color: '#4F772D' }} />
              <div className="text-3xl font-bold mb-2">4.8</div>
              <div className="text-gray-600">Average Rating</div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-16">
        <div className="container px-4">

          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Featured Courses
              </h2>
              <p className="text-gray-600">
                Start learning with our most popular courses
              </p>
            </div>

            <Link to="/courses">
              <Button variant="outline" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course: Course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-white" style={{ backgroundColor: '#4F772D' }}>
        <div className="container px-4 text-center">

          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Learning?
          </h2>

          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of students already learning on LearnHub.
            Get started with a course today.
          </p>

          <Link to="/courses">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 bg-amber-50 hover:bg-amber-100"
              style={{ color: '#1a3a0f' }}
            >
              Browse All Courses <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

        </div>
      </section>

    </div>
  );
}
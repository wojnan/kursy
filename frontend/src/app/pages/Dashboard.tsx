import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BookOpen, Clock, Award, TrendingUp, Play } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

import {
  getAllCourses,
  getCourseSections,
  type Course,
  type Section,
} from '../services/database';

export function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [sectionsMap, setSectionsMap] = useState<Record<string, Section[]>>({});
  const [loading, setLoading] = useState(true);

  // Load courses + sections from API
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const allCourses = await getAllCourses();
        setCourses(allCourses);

        // fetch sections for each course (needed for progress)
        const map: Record<string, Section[]> = {};

        await Promise.all(
          allCourses.map(async (course) => {
            try {
              const sections = await getCourseSections(course.id);
              map[course.id] = sections;
            } catch {
              map[course.id] = [];
            }
          })
        );

        setSectionsMap(map);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Enrolled courses (demo = first 3)
  const enrolledCourses = courses.slice(0, 3);

  // Progress per course
  const getProgress = (courseId: string) => {
    const saved = localStorage.getItem(`course-${courseId}-progress`);
    if (!saved) return 0;

    const completedSections: string[] = JSON.parse(saved);
    const sections = sectionsMap[courseId] || [];

    const total = sections.length;
    if (total === 0) return 0;

    return Math.round((completedSections.length / total) * 100);
  };

  // Total hours (API doesn't guarantee numeric duration → safe fallback)
  const totalHours = enrolledCourses.reduce((acc, course) => {
    const parsed = parseInt(course.duration);
    return acc + (isNaN(parsed) ? 0 : parsed);
  }, 0);

  const completedCount = enrolledCourses.filter(
    (course) => getProgress(course.id) === 100
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container px-4 py-8">
          <h1 className="text-4xl font-bold mb-2">My Learning Dashboard</h1>
          <p className="text-gray-600">
            Track your progress and continue learning
          </p>
        </div>
      </div>

      <div className="container px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Enrolled Courses</p>
              <p className="text-3xl font-bold">{enrolledCourses.length}</p>
              <BookOpen className="h-10 w-10 opacity-20" style={{ color: '#BED784' }} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Hours Learned</p>
              <p className="text-3xl font-bold">{totalHours}</p>
              <Clock className="h-10 w-10 opacity-20" style={{ color: '#BED784' }} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold">{completedCount}</p>
              <Award className="h-10 w-10 opacity-20" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">This Week</p>
              <p className="text-3xl font-bold">8h</p>
              <TrendingUp className="h-10 w-10 opacity-20" style={{ color: '#BED784' }} />
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="in-progress" className="w-full">
          <TabsList>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>

          {/* IN PROGRESS */}
          <TabsContent value="in-progress" className="mt-6">
            <div className="space-y-6">
              {enrolledCourses.map((course) => {
                const progress = getProgress(course.id);

                return (
                  <Card key={course.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">

                        {/* Image */}
                        <div className="lg:w-64 flex-shrink-0">
                          <div className="aspect-video rounded-lg overflow-hidden">
                            <ImageWithFallback
                              src={course.image}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mb-4">

                            <div>
                              <h3 className="text-xl font-bold mb-1">
                                {course.title}
                              </h3>
                              <p className="text-gray-600">
                                By {course.instructor}
                              </p>
                            </div>

                            <Link to={`/learn/${course.id}`}>
                              <Button className="gap-2 bg-green-700 hover:bg-green-800">
                                <Play className="h-4 w-4" />
                                Continue
                              </Button>
                            </Link>

                          </div>

                          {/* Progress */}
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-600">
                                Progress
                              </span>
                              <span className="font-semibold">{progress}%</span>
                            </div>

                            <Progress value={progress} className="h-2" />
                          </div>

                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* COMPLETED */}
          <TabsContent value="completed" className="mt-6">
            <Card>
              <CardContent className="p-12 text-center">
                <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No completed courses yet
                </h3>
                <Link to="/courses">
                  <Button>Browse Courses</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SAVED */}
          <TabsContent value="saved" className="mt-6">
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No saved courses
                </h3>
                <Link to="/courses">
                  <Button>Explore Courses</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
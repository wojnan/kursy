import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BookOpen, Clock, Award, TrendingUp, Play } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

import { useAuth } from '../contexts/AuthContext';

import {
  getAllCourses,
  getCourseSections,
  getUserPurchases,
  getUserProgress,
  type Course,
  type Section,
  type Purchase,
  type UserProgress,
} from '../services/database';

export function Dashboard() {
  const { user, loginWithGoogle } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [sectionsMap, setSectionsMap] = useState<Record<string, Section[]>>({});
  const [progressMap, setProgressMap] = useState<Record<string, UserProgress[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [allCourses, userPurchases] = await Promise.all([
          getAllCourses(),
          getUserPurchases(user.id),
        ]);

        setCourses(allCourses);
        setPurchases(userPurchases);

        const purchasedCourseIds = new Set(
          userPurchases.map((p) => String(p.courseId ?? p.course_id))
        );

        const enrolled = allCourses.filter((course) =>
          purchasedCourseIds.has(String(course.id))
        );

        const sectionData: Record<string, Section[]> = {};
        const progressData: Record<string, UserProgress[]> = {};

        // LOAD USER PROGRESS ONCE
        const userProgress = await getUserProgress(user.id);

        await Promise.all(
          enrolled.map(async (course) => {
            try {
              const sections = await getCourseSections(course.id);

              sectionData[course.id] = sections;

              // same progress reused for every course
              progressData[course.id] = userProgress;
            } catch (err) {
              console.error(`Failed loading data for course ${course.id}`, err);
              sectionData[course.id] = [];
              progressData[course.id] = [];
            }
          })
        );

        setSectionsMap(sectionData);
        setProgressMap(progressData);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user?.id]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Please Sign In</h2>
            <p className="text-gray-600 mb-6">
              Sign in to view your purchased courses.
            </p>
            <Button onClick={loginWithGoogle}>Sign In with Google</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const purchasedCourseIds = new Set(
    purchases.map((p) => String(p.courseId ?? p.course_id))
  );

  const enrolledCourses = courses.filter((course) =>
    purchasedCourseIds.has(String(course.id))
  );

  const getProgress = (courseId: string) => {
    const sections = sectionsMap[courseId] || [];
    const progress = progressMap[courseId] || [];

    if (sections.length === 0) return 0;

    const completedSectionIds = new Set(
      progress
        .map((p) => p.sectionId ?? p.section_id)
        .filter(Boolean)
        .map(String)
    );

    const completedCount = sections.filter((section) =>
      completedSectionIds.has(String(section.id))
    ).length;

    return Math.round((completedCount / sections.length) * 100);
  };

  const totalHours = enrolledCourses.reduce((acc, course) => {
    const match = String(course.duration).match(/\d+/);
    return acc + (match ? Number(match[0]) : 0);
  }, 0);

  const completedCourses = enrolledCourses.filter(
    (course) => getProgress(course.id) === 100
  );

  const inProgressCourses = enrolledCourses.filter(
    (course) => getProgress(course.id) < 100
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container px-4 py-8">
          <h1 className="text-4xl font-bold mb-2">My Learning Dashboard</h1>
          <p className="text-gray-600">
            Track your progress and continue learning
          </p>
        </div>
      </div>

      <div className="container px-4 py-8">
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
              <p className="text-3xl font-bold">{completedCourses.length}</p>
              <Award className="h-10 w-10 opacity-20" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">This Week</p>
              <p className="text-3xl font-bold">0h</p>
              <TrendingUp className="h-10 w-10 opacity-20" style={{ color: '#BED784' }} />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="in-progress" className="w-full">
          <TabsList>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>

          <TabsContent value="in-progress" className="mt-6">
            {inProgressCourses.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No courses in progress
                  </h3>
                  <Link to="/courses">
                    <Button>Browse Courses</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {inProgressCourses.map((course) => {
                  const progress = getProgress(course.id);

                  return (
                    <Card key={course.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          <div className="lg:w-64 flex-shrink-0">
                            <div className="aspect-video rounded-lg overflow-hidden">
                              <ImageWithFallback
                                src={course.image}
                                alt={course.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>

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

                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Progress</span>
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
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            {completedCourses.length === 0 ? (
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
            ) : (
              <div className="space-y-6">
                {completedCourses.map((course) => (
                  <Card key={course.id}>
                    <CardContent className="p-6 flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold">{course.title}</h3>
                        <p className="text-gray-600">Completed</p>
                      </div>
                      <Link to={`/learn/${course.id}`}>
                        <Button variant="outline">Review</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

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
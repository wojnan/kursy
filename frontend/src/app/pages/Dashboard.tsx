import { Link } from 'react-router';
import { courses } from '../data/courses';
import { courseLessons } from '../data/lessons';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BookOpen, Clock, Award, TrendingUp, Play } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function Dashboard() {
  // Get enrolled courses (for demo, we'll use first 3 courses)
  const enrolledCourses = courses.slice(0, 3);

  // Calculate progress for each enrolled course
  const getProgress = (courseId: string) => {
    const saved = localStorage.getItem(`course-${courseId}-progress`);
    if (!saved) return 0;
    
    const completedSections = JSON.parse(saved);
    const sections = courseLessons[courseId] || [];
    const totalSections = sections.length;
    
    return totalSections > 0 ? Math.round((completedSections.length / totalSections) * 100) : 0;
  };

  // Calculate total hours (mock data)
  const totalHours = enrolledCourses.reduce((acc, course) => {
    const hours = parseInt(course.duration);
    return acc + (isNaN(hours) ? 0 : hours);
  }, 0);

  // Calculate completed courses
  const completedCount = enrolledCourses.filter(course => getProgress(course.id) === 100).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container px-4 py-8">
          <h1 className="text-4xl font-bold mb-2">My Learning Dashboard</h1>
          <p className="text-gray-600">Track your progress and continue learning</p>
        </div>
      </div>

      <div className="container px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Enrolled Courses</p>
                  <p className="text-3xl font-bold">{enrolledCourses.length}</p>
                </div>
                <BookOpen className="h-12 w-12 opacity-20" style={{ color: '#BED784' }} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Hours Learned</p>
                  <p className="text-3xl font-bold">{totalHours}</p>
                </div>
                <Clock className="h-12 w-12 opacity-20" style={{ color: '#BED784' }} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completed</p>
                  <p className="text-3xl font-bold">{completedCount}</p>
                </div>
                <Award className="h-12 w-12 text-yellow-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">This Week</p>
                  <p className="text-3xl font-bold">8h</p>
                </div>
                <TrendingUp className="h-12 w-12 opacity-20" style={{ color: '#BED784' }} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="in-progress" className="w-full">
          <TabsList>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>

          <TabsContent value="in-progress" className="mt-6">
            <div className="space-y-6">
              {enrolledCourses.map((course) => (
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
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                            <p className="text-gray-600 mb-2">By {course.instructor}</p>
                            <p className="text-sm text-gray-500">Last accessed: {course.lastAccessed}</p>
                          </div>
                          <div className="flex gap-2">
                            <Link to={`/learn/${course.id}`}>
                              <Button className="gap-2 bg-green-700 hover:bg-green-800">
                                <Play className="h-4 w-4" />
                                Continue Learning
                              </Button>
                            </Link>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-600">
                                {course.completedLessons} of {course.lessons} lessons completed
                              </span>
                              <span className="font-semibold">{getProgress(course.id)}%</span>
                            </div>
                            <Progress value={getProgress(course.id)} className="h-2" />
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <BookOpen className="h-4 w-4" />
                            <span>Next: {course.nextLesson}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <Card>
              <CardContent className="p-12 text-center">
                <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No completed courses yet</h3>
                <p className="text-gray-600 mb-6">
                  Keep learning to complete your first course and earn a certificate!
                </p>
                <Link to="/courses">
                  <Button>Browse Courses</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No saved courses</h3>
                <p className="text-gray-600 mb-6">
                  Save courses you're interested in to access them quickly later
                </p>
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
import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  User,
  Mail,
  Calendar,
  Award,
  BookOpen,
  Clock,
  Settings,
  LogOut
} from 'lucide-react';

// ✅ NOW USING DATABASE (API) INSTEAD OF MOCK DATA
import type { Course } from '../services/database';
import { getAllCourses, getCourseSections } from '../services/database';
import { useEffect, useState } from 'react';

export function Profile() {
  const { user, logout } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);

  // Load courses from backend
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch (err) {
        console.error('Failed to load courses', err);
      }
    };

    loadCourses();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-12 text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Please Log In</h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to view your profile
            </p>
            <Link to="/">
              <Button>Go to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // fallback-safe helper
  const enrolledCourses = courses.slice(0, 3);

  const getProgress = (courseId: string) => {
    const saved = localStorage.getItem(`course-${courseId}-progress`);
    if (!saved) return 0;

    const completedSections: string[] = JSON.parse(saved);

    // NOTE: we fetch sections lazily via localStorage fallback only
    // (real backend progress would replace this later)
    const fakeTotalSections = 5;

    return Math.round((completedSections.length / fakeTotalSections) * 100);
  };

  const completedCourses = enrolledCourses.filter(
    (course) => getProgress(course.id) === 100
  ).length;

  const totalHours = enrolledCourses.reduce((acc, course) => {
    const hours = Number(course.duration);
    return acc + (isNaN(hours) ? 0 : hours);
  }, 0);

  const joinDate = new Date(user.created_at || Date.now()).toLocaleDateString(
    'en-US',
    {
      month: 'long',
      year: 'numeric'
    }
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container px-4 py-8">
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account and view your progress</p>
        </div>
      </div>

      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PROFILE CARD */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4"
                    style={{ backgroundColor: '#BED784' }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </div>

                  <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                  <p className="text-gray-600 mb-6">LearnHub Student</p>

                  <div className="w-full space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {joinDate}</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mb-3 gap-2">
                    <Settings className="h-4 w-4" />
                    Edit Profile
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full gap-2 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* STATS */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600">Enrolled Courses</p>
                  <p className="text-3xl font-bold">{enrolledCourses.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-3xl font-bold">{completedCourses}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600">Learning Hours</p>
                  <p className="text-3xl font-bold">{totalHours}h</p>
                </CardContent>
              </Card>
            </div>

            {/* COURSES FROM API */}
            <Card>
              <CardHeader>
                <CardTitle>Your Courses</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex justify-between items-center border-b pb-3"
                    >
                      <div>
                        <p className="font-medium">{course.title}</p>
                        <p className="text-sm text-gray-600">
                          {getProgress(course.id)}% complete
                        </p>
                      </div>

                      <Link to={`/learn/${course.id}`}>
                        <Button size="sm">Continue</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ACTIVITY (STATIC FOR NOW) */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Activity tracking will be loaded from backend later.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
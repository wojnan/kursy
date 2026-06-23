import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  User,
  Mail,
  Calendar,
  BookOpen,
  Settings,
  LogOut,
} from 'lucide-react';

import type { Course, Purchase } from '../services/database';
import { getAllCourses, getUserPurchases } from '../services/database';
import { useEffect, useState } from 'react';

export function Profile() {
  const { user, logout } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        const [courseData, purchaseData] = await Promise.all([
          getAllCourses(),
          getUserPurchases(user.id),
        ]);

        setCourses(courseData);
        setPurchases(purchaseData);
      } catch (err) {
        console.error('Failed to load profile data', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user?.id]);

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

  const purchasedCourseIds = new Set(
    purchases.map((purchase) =>
      String(purchase.courseId ?? purchase.course_id)
    )
  );

  const enrolledCourses = courses.filter((course) =>
    purchasedCourseIds.has(String(course.id))
  );

  const completedCourses = 0;

  const totalHours = enrolledCourses.reduce((acc, course) => {
    const match = String(course.duration).match(/\d+/);
    const hours = match ? Number(match[0]) : 0;
    return acc + hours;
  }, 0);

  const joinDate = new Date(user.createdAt || Date.now()).toLocaleDateString(
    'en-US',
    {
      month: 'long',
      year: 'numeric',
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
                  <p className="text-gray-600 mb-6">
                    {user.role === 'ADMIN' ? 'LearnHub Admin' : 'LearnHub Student'}
                  </p>

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

            <Card>
              <CardHeader>
                <CardTitle>Your Courses</CardTitle>
              </CardHeader>

              <CardContent>
                {loading ? (
                  <p className="text-gray-600">Loading your courses...</p>
                ) : enrolledCourses.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">
                      You have not purchased any courses yet.
                    </p>
                    <Link to="/courses">
                      <Button>Browse Courses</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrolledCourses.map((course) => (
                      <div
                        key={course.id}
                        className="flex justify-between items-center border-b pb-3"
                      >
                        <div>
                          <p className="font-medium">{course.title}</p>
                          <p className="text-sm text-gray-600">
                            Purchased
                          </p>
                        </div>

                        <Link to={`/learn/${course.id}`}>
                          <Button size="sm">Continue</Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {purchases.length === 0 ? (
                  <p className="text-gray-600 text-sm">
                    No purchase activity yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {purchases.map((purchase) => (
                      <div key={purchase.id} className="text-sm text-gray-600">
                        Purchased course #{purchase.courseId ?? purchase.course_id}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
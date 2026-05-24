import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { courses } from '../data/courses';
import { courseLessons } from '../data/lessons';
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

export function Profile() {
  const { user, logout } = useAuth();

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

  // Calculate stats
  const enrolledCourses = courses.slice(0, 3);
  const getProgress = (courseId: string) => {
    const saved = localStorage.getItem(`course-${courseId}-progress`);
    if (!saved) return 0;
    const completedSections = JSON.parse(saved);
    const sections = courseLessons[courseId] || [];
    return sections.length > 0 ? Math.round((completedSections.length / sections.length) * 100) : 0;
  };

  const completedCourses = enrolledCourses.filter(course => getProgress(course.id) === 100).length;
  const totalHours = enrolledCourses.reduce((acc, course) => {
    const hours = parseInt(course.duration);
    return acc + (isNaN(hours) ? 0 : hours);
  }, 0);

  const joinDate = new Date(user.joinedDate).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

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
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4"
                    style={{ backgroundColor: '#BED784' }}
                  >
                    {user.name.charAt(0).toUpperCase()}
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

                  <Button 
                    variant="outline" 
                    className="w-full mb-3 gap-2"
                  >
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

            {/* Achievements */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Award className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <div className="font-medium">Quick Learner</div>
                      <div className="text-sm text-gray-600">Completed first lesson</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 opacity-50">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <Award className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <div className="font-medium">Course Completer</div>
                      <div className="text-sm text-gray-600">Complete your first course</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 opacity-50">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <Award className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <div className="font-medium">Dedicated Student</div>
                      <div className="text-sm text-gray-600">Complete 5 courses</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats & Activity */}
          <div className="lg:col-span-2">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                      <p className="text-sm text-gray-600 mb-1">Completed</p>
                      <p className="text-3xl font-bold">{completedCourses}</p>
                    </div>
                    <Award className="h-12 w-12 text-yellow-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Learning Hours</p>
                      <p className="text-3xl font-bold">{totalHours}h</p>
                    </div>
                    <Clock className="h-12 w-12 opacity-20" style={{ color: '#BED784' }} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 pb-4 border-b">
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#BED784' }} />
                    <div>
                      <p className="font-medium">Started Complete Web Development Bootcamp</p>
                      <p className="text-sm text-gray-600">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 pb-4 border-b">
                    <div className="w-2 h-2 rounded-full bg-gray-300 mt-2" />
                    <div>
                      <p className="font-medium">Completed Section 1 Quiz</p>
                      <p className="text-sm text-gray-600">Yesterday</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 pb-4 border-b">
                    <div className="w-2 h-2 rounded-full bg-gray-300 mt-2" />
                    <div>
                      <p className="font-medium">Enrolled in Digital Marketing Mastery</p>
                      <p className="text-sm text-gray-600">3 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-gray-300 mt-2" />
                    <div>
                      <p className="font-medium">Created LearnHub account</p>
                      <p className="text-sm text-gray-600">{joinDate}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Preferences */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Learning Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-600">Get updates about your courses</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-700"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Course Recommendations</p>
                      <p className="text-sm text-gray-600">Personalized course suggestions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-700"></div>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

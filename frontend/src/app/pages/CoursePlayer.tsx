import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { courses } from '../data/courses';
import { courseLessons, Lesson, Section } from '../data/lessons';
import { sectionQuizzes } from '../data/quizzes';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Quiz } from '../components/Quiz';
import { AuthModal } from '../components/AuthModal';
import { useAuth } from '../contexts/AuthContext';
import { usePurchase } from '../contexts/PurchaseContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  BookOpen,
  List,
  X,
  Lock,
  ShoppingCart,
  LogIn
} from 'lucide-react';
import { Progress } from '../components/ui/progress';

export function CoursePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { hasPurchased, purchaseCourse } = usePurchase();
  const course = courses.find((c) => c.id === id);
  const sections = courseLessons[id || ''] || [];
  
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isPurchased = hasPurchased(id || '');
  const canAccessSection = (sectionIndex: number) => {
    // First section is always free
    if (sectionIndex === 0) return true;
    // Other sections require login and purchase
    return isAuthenticated && isPurchased;
  };

  useEffect(() => {
    // Load completed sections from localStorage
    const saved = localStorage.getItem(`course-${id}-progress`);
    if (saved) {
      setCompletedSections(new Set(JSON.parse(saved)));
    }
  }, [id]);

  // Redirect to first section if trying to access locked section
  useEffect(() => {
    if (!canAccessSection(currentSectionIndex)) {
      setCurrentSectionIndex(0);
    }
  }, [currentSectionIndex, isAuthenticated, isPurchased]);

  if (!course || sections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Course content not available</h2>
          <Link to="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentSection = sections[currentSectionIndex];
  const totalSections = sections.length;
  const completedCount = completedSections.size;
  const progressPercentage = (completedCount / totalSections) * 100;

  const handleCompleteSection = () => {
    if (currentSection && canAccessSection(currentSectionIndex)) {
      const newCompleted = new Set(completedSections);
      newCompleted.add(currentSection.id);
      setCompletedSections(newCompleted);
      localStorage.setItem(`course-${id}-progress`, JSON.stringify([...newCompleted]));
    }
  };

  const handleNextSection = () => {
    handleCompleteSection();
    
    if (currentSectionIndex < sections.length - 1) {
      const nextIndex = currentSectionIndex + 1;
      if (canAccessSection(nextIndex)) {
        setCurrentSectionIndex(nextIndex);
        window.scrollTo(0, 0);
      }
    }
  };

  const handlePreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSectionClick = (sectionIndex: number) => {
    if (canAccessSection(sectionIndex)) {
      setCurrentSectionIndex(sectionIndex);
      window.scrollTo(0, 0);
    }
  };

  const handlePurchase = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    // Mock purchase
    purchaseCourse(id || '');
  };

  const canGoNext = currentSectionIndex < sections.length - 1 && canAccessSection(currentSectionIndex + 1);
  const canGoPrevious = currentSectionIndex > 0;
  const sectionQuiz = sectionQuizzes[id || '']?.[currentSectionIndex];

  const renderLessonContent = (lesson: Lesson) => {
    return (
      <div key={lesson.id} className="mb-12">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">{lesson.title}</h2>
          <div className="text-sm text-gray-500">{lesson.duration}</div>
        </div>
        
        <div className="prose max-w-none">
          {lesson.content.map((block, index) => {
            switch (block.type) {
              case 'heading':
                return (
                  <h3 key={index} className="text-2xl font-bold mb-4 mt-8 first:mt-0">
                    {block.value as string}
                  </h3>
                );
              case 'text':
                return (
                  <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                    {block.value as string}
                  </p>
                );
              case 'list':
                return (
                  <ul key={index} className="list-disc pl-6 mb-6 space-y-2">
                    {(block.value as string[]).map((item, i) => (
                      <li key={i} className="text-gray-700 leading-relaxed">{item}</li>
                    ))}
                  </ul>
                );
              case 'code':
                return (
                  <pre key={index} className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-6 overflow-x-auto">
                    <code>{block.value as string}</code>
                  </pre>
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div 
        className={`${showSidebar ? 'w-80' : 'w-0'} bg-white border-r transition-all duration-300 overflow-hidden flex-shrink-0`}
      >
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <Link to={`/course/${id}`}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
            </Link>
          </div>
          <h2 className="font-bold mb-2 line-clamp-2">{course.title}</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{completedCount} of {totalSections} sections</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} />
          </div>
        </div>

        <div className="overflow-y-auto" style={{ height: 'calc(100vh - 180px)' }}>
          {sections.map((section, sectionIndex) => (
            <div key={section.id} className="border-b">
              <button
                onClick={() => handleSectionClick(sectionIndex)}
                disabled={!canAccessSection(sectionIndex)}
                className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                  currentSectionIndex === sectionIndex
                    ? 'bg-green-50 border-l-4 border-green-700'
                    : ''
                } ${!canAccessSection(sectionIndex) ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {!canAccessSection(sectionIndex) ? (
                      <Lock className="h-5 w-5 text-gray-400" />
                    ) : completedSections.has(section.id) ? (
                      <CheckCircle className="h-5 w-5" style={{ color: '#BED784' }} />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium mb-1 flex items-center gap-2">
                      <span>Section {sectionIndex + 1}: {section.title}</span>
                      {!canAccessSection(sectionIndex) && (
                        <Lock className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {section.lessons.length} lessons
                      {sectionIndex === 0 && (
                        <span className="ml-2 px-2 py-0.5 rounded text-white" style={{ backgroundColor: '#BED784' }}>
                          FREE
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSidebar(!showSidebar)}
            className="gap-2"
          >
            {showSidebar ? <X className="h-4 w-4" /> : <List className="h-4 w-4" />}
            {showSidebar ? 'Hide' : 'Show'} Curriculum
          </Button>
          
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Section {currentSectionIndex + 1} of {totalSections}
            </span>
          </div>
        </div>

        {/* Section Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">
            {/* Section Header */}
            <div className="mb-8">
              <div className="text-sm text-gray-500 mb-2">
                Section {currentSectionIndex + 1} of {totalSections}
              </div>
              <h1 className="text-4xl font-bold mb-4">{currentSection.title}</h1>
              {currentSectionIndex === 0 && (
                <span className="inline-block px-3 py-1 rounded text-white text-sm font-medium" style={{ backgroundColor: '#BED784' }}>
                  FREE PREVIEW
                </span>
              )}
              {completedSections.has(currentSection.id) && (
                <div className="flex items-center gap-2 mt-3" style={{ color: '#BED784' }}>
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Section Completed</span>
                </div>
              )}
            </div>

            {/* All Lessons in Section */}
            <Card className="mb-8">
              <CardContent className="p-8">
                {currentSection.lessons.map((lesson) => renderLessonContent(lesson))}
              </CardContent>
            </Card>

            {/* Section Quiz */}
            {sectionQuiz && (
              <div className="mb-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold mb-2">Section Quiz</h2>
                  <p className="text-gray-600">Test your knowledge before moving to the next section</p>
                </div>
                <Quiz
                  title={`${currentSection.title} Quiz`}
                  questions={sectionQuiz.questions}
                />
              </div>
            )}

            {/* Complete Section Button */}
            {!completedSections.has(currentSection.id) && (
              <div className="mb-8">
                <Button 
                  onClick={handleCompleteSection}
                  className="gap-2 bg-green-700 hover:bg-green-800"
                  size="lg"
                >
                  <CheckCircle className="h-5 w-5" />
                  Mark Section as Complete
                </Button>
              </div>
            )}

            {/* Paywall for Free Preview */}
            {currentSectionIndex === 0 && !isPurchased && (
              <Card className="border-2" style={{ borderColor: '#BED784' }}>
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <div 
                      className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4"
                      style={{ backgroundColor: '#BED784' }}
                    >
                      <Lock className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      Unlock Full Course Access
                    </h3>
                    <p className="text-gray-600 mb-6">
                      You've completed the free preview! Get access to {totalSections - 1} more sections with {sections.slice(1).reduce((acc, s) => acc + s.lessons.length, 0)} lessons.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-1">{totalSections - 1}</div>
                        <div className="text-sm text-gray-600">More Sections</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-1">{sections.slice(1).reduce((acc, s) => acc + s.lessons.length, 0)}</div>
                        <div className="text-sm text-gray-600">More Lessons</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-1">∞</div>
                        <div className="text-sm text-gray-600">Lifetime Access</div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-3xl font-bold mb-2">${course.price}</div>
                    <p className="text-sm text-gray-600">One-time payment, lifetime access</p>
                  </div>

                  {!isAuthenticated ? (
                    <div>
                      <Button 
                        onClick={() => setShowAuthModal(true)}
                        size="lg"
                        className="gap-2 bg-green-700 hover:bg-green-800 mb-3"
                      >
                        <LogIn className="h-5 w-5" />
                        Log In to Purchase
                      </Button>
                      <p className="text-xs text-gray-500">
                        Need an account? Sign up when you click above
                      </p>
                    </div>
                  ) : (
                    <Button 
                      onClick={handlePurchase}
                      size="lg"
                      className="gap-2 bg-green-700 hover:bg-green-800"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Purchase Full Course
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousSection}
              disabled={!canGoPrevious}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous Section
            </Button>

            <div className="text-sm text-gray-600">
              {completedCount} of {totalSections} sections completed
            </div>

            <Button
              onClick={handleNextSection}
              disabled={!canGoNext}
              className="gap-2 bg-green-700 hover:bg-green-800"
            >
              Next Section
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
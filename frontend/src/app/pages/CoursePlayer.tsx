import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { toast } from 'sonner';

import type { Course, Section, SectionQuiz, QuizQuestion } from '../services/database';

import {
  getCourseById,
  getCourseSections,
  getSectionQuiz,
  getUserProgress,
  markSectionComplete,
  submitQuizResults,
} from '../services/database';

import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Quiz } from '../components/Quiz';
import { useAuth } from '../contexts/AuthContext';
import { usePurchase } from '../contexts/PurchaseContext';
import { useCart } from '../contexts/CartContext';

import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  BookOpen,
  List,
  X,
  Lock,
  ShoppingCart,
  LogIn,
} from 'lucide-react';

import { Progress } from '../components/ui/progress';

export function CoursePlayer() {
  const { id } = useParams();

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Invalid course ID</p>
      </div>
    );
  }

  const courseId = id;

  const { user, isAuthenticated, loginWithGoogle } = useAuth();
  const { hasPurchased } = usePurchase();
  const { addToCart, isInCart } = useCart();

  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sectionQuiz, setSectionQuiz] = useState<SectionQuiz[]>([]);
  const [finalQuestions, setFinalQuestions] = useState<QuizQuestion[]>([]);
  const [showFinalQuiz, setShowFinalQuiz] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  const isPurchased = hasPurchased(courseId);

  const canAccessSection = (index: number) => {
    if (index === 0) return true;
    return isAuthenticated && isPurchased;
  };

  useEffect(() => {
    async function load() {
      try {
        const [c, s] = await Promise.all([
          getCourseById(courseId),
          getCourseSections(courseId),
        ]);

        const loadedSections = Array.isArray(s) ? s : [];

        setCourse(c);
        setSections(loadedSections);

        if (user && loadedSections.length > 0) {
          const progress = await getUserProgress(user.id);

          const completedSectionIds = new Set(
            progress
              .map((p) => p.sectionId ?? p.section_id)
              .filter(Boolean)
              .map(String)
          );

          let lastCompletedIndex = -1;

          loadedSections.forEach((section, index) => {
            if (completedSectionIds.has(String(section.id))) {
              lastCompletedIndex = index;
            }
          });

          const completedSet = new Set<string>();

          loadedSections.forEach((section) => {
            if (completedSectionIds.has(String(section.id))) {
              completedSet.add(String(section.id));
            }
          });

          setCompletedSections(completedSet);

          if (
            lastCompletedIndex >= 0 &&
            lastCompletedIndex < loadedSections.length - 1 &&
            canAccessSection(lastCompletedIndex + 1)
          ) {
            setCurrentSectionIndex(lastCompletedIndex + 1);
          }
        }
      } catch (err) {
        console.error('Failed loading course player:', err);
      }
    }

    load();
  }, [courseId, user, isAuthenticated, isPurchased]);

  useEffect(() => {
    async function loadQuiz() {
      if (!sections[currentSectionIndex]) {
        setSectionQuiz([]);
        return;
      }

      try {
        const quiz = await getSectionQuiz(sections[currentSectionIndex].id);
        setSectionQuiz(Array.isArray(quiz) ? quiz : []);
      } catch (err) {
        console.error('Failed loading quiz:', err);
        setSectionQuiz([]);
      }
    }

    loadQuiz();
  }, [currentSectionIndex, sections]);

  useEffect(() => {
    async function loadFinalQuiz() {
      if (!sections.length) {
        setFinalQuestions([]);
        return;
      }

      try {
        const allQuizzes = await Promise.all(
          sections.map((section) => getSectionQuiz(section.id))
        );

        const questions = allQuizzes
          .flat()
          .flatMap((quiz) => quiz.questions || []);

        setFinalQuestions(questions);
      } catch (err) {
        console.error('Failed loading final quiz:', err);
        setFinalQuestions([]);
      }
    }

    loadFinalQuiz();
  }, [sections]);

  useEffect(() => {
    if (sections.length > 0 && !canAccessSection(currentSectionIndex)) {
      setCurrentSectionIndex(0);
    }
  }, [currentSectionIndex, sections.length, isAuthenticated, isPurchased]);

  useEffect(() => {
    setShowFinalQuiz(false);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [currentSectionIndex]);

  const currentSection = sections[currentSectionIndex];

  if (!course || !currentSection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading course...</p>
      </div>
    );
  }

  const totalSections = sections.length;
  const completedCount = completedSections.size;
  const courseProgress = totalSections
    ? Math.round((completedCount / totalSections) * 100)
    : 0;

  const isLastSection = currentSectionIndex === totalSections - 1;

  const getLessonContentType = (block: any) =>
    block.contentType || block.content_type || block.type;

  const getLessonContentValue = (block: any) =>
    block.contentValue || block.content_value || block.value;

  const parseListItems = (value: unknown): string[] => {
    if (Array.isArray(value)) return value.map(String);

    if (typeof value === 'string') {
      try {
        const cleaned = value.replace(/\\"/g, '"');
        const parsed = JSON.parse(cleaned);
        return Array.isArray(parsed) ? parsed.map(String) : [value];
      } catch {
        return value
          .replace(/^\[|\]$/g, '')
          .split(',')
          .map((item) => item.replace(/^"|"$/g, '').trim())
          .filter(Boolean);
      }
    }

    return [];
  };

  const saveCurrentSectionProgress = async () => {
    if (!user || !currentSection || !canAccessSection(currentSectionIndex)) return;

    try {
      await markSectionComplete(user.id, currentSection.id);

      setCompletedSections((prev) => {
        const updated = new Set(prev);
        updated.add(String(currentSection.id));
        return updated;
      });
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  };

  const handleLockedAccess = () => {
    if (!isAuthenticated) {
      toast.info('Login Required', {
        description: 'Please sign in to continue.',
      });

      loginWithGoogle();
      return;
    }

    toast.error('Course Locked', {
      description: 'Purchase this course to access this section.',
    });
  };

  const handlePurchase = () => {
    if (!isAuthenticated) {
      loginWithGoogle();
      return;
    }

    if (isInCart(course.id)) {
      toast.info('Already in Cart', {
        description: `${course.title} is already in your cart.`,
      });
      return;
    }

    addToCart(course);

    toast.success('Added to Cart', {
      description: `${course.title} was added to your cart.`,
    });
  };

  const handleCompleteSection = async () => {
    await saveCurrentSectionProgress();
  };

  const handleTakeFinalQuiz = async () => {
    await saveCurrentSectionProgress();

    if (finalQuestions.length === 0) {
      toast.error('Final Quiz Not Available', {
        description: 'This course does not have quiz questions yet.',
      });
      return;
    }

    setShowFinalQuiz(true);

    setTimeout(() => {
      document.getElementById('final-course-quiz')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  const handleNext = async () => {
    await saveCurrentSectionProgress();

    if (currentSectionIndex >= sections.length - 1) return;

    const next = currentSectionIndex + 1;

    if (canAccessSection(next)) {
      setCurrentSectionIndex(next);
    } else {
      handleLockedAccess();
    }
  };

  const handlePrev = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const handleSectionClick = (index: number) => {
    if (canAccessSection(index)) {
      setCurrentSectionIndex(index);
    } else {
      handleLockedAccess();
    }
  };

  const canGoPrevious = currentSectionIndex > 0;

  const lockedNextSection =
    currentSectionIndex < sections.length - 1 &&
    !canAccessSection(currentSectionIndex + 1);

  const lockedSectionsCount = sections.slice(1).length;

  const lockedLessonsCount = sections
    .slice(1)
    .reduce((acc, section) => acc + (section.lessons?.length || 0), 0);

  const renderLessonContent = (lesson: any) => (
    <div key={lesson.id} className="mb-12">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">{lesson.title}</h2>
        <div className="text-sm text-gray-500">{lesson.duration}</div>
      </div>

      <div className="prose max-w-none">
        {(lesson.content || []).map((block: any, index: number) => {
          const type = getLessonContentType(block);
          const value = getLessonContentValue(block);
          const key = block.id ?? `${type}-${index}`;

          switch (type) {
            case 'heading':
              return (
                <h3 key={key} className="text-2xl font-bold mb-4 mt-8 first:mt-0">
                  {value}
                </h3>
              );

            case 'text':
              return (
                <p key={key} className="text-gray-700 mb-4 leading-relaxed">
                  {value}
                </p>
              );

            case 'list':
              return (
                <ul key={key} className="list-disc pl-6 mb-6 space-y-2">
                  {parseListItems(value).map((item, i) => (
                    <li key={i} className="text-gray-700 leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              );

            case 'code':
              return (
                <pre
                  key={key}
                  className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-6 overflow-x-auto"
                >
                  <code>{value}</code>
                </pre>
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div
        className={`${
          showSidebar ? 'w-80' : 'w-0'
        } bg-white border-r transition-all duration-300 overflow-hidden flex-shrink-0`}
      >
        <div className="p-6 border-b">
          <Link to={`/course/${courseId}`}>
            <Button variant="ghost" size="sm" className="gap-2 mb-4">
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
          </Link>

          <h2 className="font-bold mb-2 line-clamp-2">{course.title}</h2>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                {completedCount} of {totalSections} sections
              </span>
              <span>{courseProgress}%</span>
            </div>
            <Progress value={courseProgress} />
          </div>
        </div>

        <div className="overflow-y-auto" style={{ height: 'calc(100vh - 180px)' }}>
          {sections.map((section, sectionIndex) => {
            const locked = !canAccessSection(sectionIndex);
            const completed = completedSections.has(String(section.id));

            return (
              <div key={section.id} className="border-b">
                <button
                  onClick={() => handleSectionClick(sectionIndex)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                    currentSectionIndex === sectionIndex
                      ? 'bg-green-50 border-l-4 border-green-700'
                      : ''
                  } ${locked ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    {locked ? (
                      <Lock className="h-5 w-5 text-gray-400" />
                    ) : completed ? (
                      <CheckCircle className="h-5 w-5" style={{ color: '#BED784' }} />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium mb-1">
                        Section {sectionIndex + 1}: {section.title}
                      </div>

                      <div className="text-xs text-gray-500">
                        {section.lessons?.length || 0} lessons
                        {sectionIndex === 0 && (
                          <span
                            className="ml-2 px-2 py-0.5 rounded text-white"
                            style={{ backgroundColor: '#BED784' }}
                          >
                            FREE
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
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

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">
            <div className="mb-8">
              <div className="text-sm text-gray-500 mb-2">
                Section {currentSectionIndex + 1} of {totalSections}
              </div>

              <h1 className="text-4xl font-bold mb-4">{currentSection.title}</h1>

              {currentSectionIndex === 0 && (
                <span
                  className="inline-block px-3 py-1 rounded text-white text-sm font-medium"
                  style={{ backgroundColor: '#BED784' }}
                >
                  FREE PREVIEW
                </span>
              )}
            </div>

            <Card className="mb-8">
              <CardContent className="p-8">
                {(currentSection.lessons || []).map((lesson: any) =>
                  renderLessonContent(lesson)
                )}
              </CardContent>
            </Card>

            {sectionQuiz.length > 0 && (
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Section Quiz</h2>

                {sectionQuiz.map((quiz) => (
                <Quiz
                  key={quiz.id}
                  title={
                    quiz.sectionTitle ||
                    quiz.section_title ||
                    `${currentSection.title} Quiz`
                  }
                  questions={quiz.questions || []}
                  onComplete={async (score) => {
                    if (!user) return;

                    await submitQuizResults(
                      user.id,
                      Number(currentSection.id),
                      quiz.id,
                      null,
                      score
                    );
                  }}
                />
                ))}
              </div>
            )}

            {!completedSections.has(String(currentSection.id)) && (
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

            {showFinalQuiz && finalQuestions.length > 0 && (
              <div id="final-course-quiz" className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Final Course Quiz</h2>
                <p className="text-gray-600 mb-6">
                  This quiz combines questions from all section quizzes.
                </p>

                <Quiz
                  title={`${course.title} Final Quiz`}
                  questions={finalQuestions}
                  onComplete={async (score) => {
                    if (!user) return;

                    await submitQuizResults(
                      user.id,
                      null,
                      null,
                      Number(course.id),
                      score
                    );
                  }}
                />
              </div>
            )}

            {currentSectionIndex === 0 && !isPurchased && (
              <Card className="border-2" style={{ borderColor: '#BED784' }}>
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-2">
                    Unlock Full Course Access
                  </h3>

                  <p className="text-gray-600 mb-6">
                    You've completed the free preview! Get access to{' '}
                    {lockedSectionsCount} more sections with {lockedLessonsCount} lessons.
                  </p>

                  <div className="text-3xl font-bold mb-4">${course.price}</div>

                  {!isAuthenticated ? (
                    <Button
                      onClick={loginWithGoogle}
                      size="lg"
                      className="gap-2 bg-green-700 hover:bg-green-800"
                    >
                      <LogIn className="h-5 w-5" />
                      Log In to Purchase
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePurchase}
                      size="lg"
                      className="gap-2 bg-green-700 hover:bg-green-800"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      {isInCart(course.id) ? 'Already in Cart' : 'Purchase Full Course'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="bg-white border-t p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={!canGoPrevious}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous Section
            </Button>

            <div className="text-sm text-gray-600 text-center">
              {completedCount} of {totalSections} sections completed
            </div>

            {isLastSection ? (
              <Button
                onClick={handleTakeFinalQuiz}
                className="gap-2 bg-green-700 hover:bg-green-800"
              >
                Finish Course & Take Final Quiz
              </Button>
            ) : (
              <Button
                onClick={lockedNextSection ? handleLockedAccess : handleNext}
                className="gap-2 bg-green-700 hover:bg-green-800"
              >
                {lockedNextSection ? 'Unlock Next Section' : 'Next Section'}
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
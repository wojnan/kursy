import { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import type { Course, Section, SectionQuiz } from '../services/database';

import {
  getCourseById,
  getCourseSections,
  getSectionQuiz,
  getUserProgress,
  markSectionComplete,
} from '../services/database';

import { Button } from '../components/ui/button';
import { Quiz } from '../components/Quiz';
import { useAuth } from '../contexts/AuthContext';
import { usePurchase } from '../contexts/PurchaseContext';

import { CheckCircle, List, X, Lock } from 'lucide-react';
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

  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sectionQuiz, setSectionQuiz] = useState<SectionQuiz[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [completedSections, setCompletedSections] = useState<Set<string>>(
    new Set()
  );

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

        if (
          lastCompletedIndex >= 0 &&
          lastCompletedIndex < loadedSections.length - 1
        ) {
          setCurrentSectionIndex(lastCompletedIndex + 1);
        }

        const completedSet = new Set<string>();

        loadedSections.forEach((section) => {
          if (completedSectionIds.has(String(section.id))) {
            completedSet.add(String(section.id));
          }
        });

        setCompletedSections(completedSet);
      }
    } catch (err) {
      console.error('Failed loading course player:', err);
    }
  }

  load();
}, [courseId, user]);

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

  const saveCurrentSectionProgress = async () => {
    if (!user || !currentSection) return;

    try {
      await markSectionComplete(user.id, currentSection.id);

      setCompletedSections((prev) => {
        const updated = new Set(prev);
        updated.add(currentSection.id);
        return updated;
      });
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  };

  const handleLockedAccess = () => {
    if (!isAuthenticated) {
      loginWithGoogle();
      return;
    }

    alert('You need to purchase this course to access this section.');
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

  const courseProgress = totalSections
    ? Math.round((completedSections.size / totalSections) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div
        className={`${
          showSidebar ? 'w-80' : 'w-0'
        } bg-white border-r overflow-hidden`}
      >
        <div className="p-4 border-b">
          <h2 className="font-bold">{course.title}</h2>
          <Progress value={courseProgress} />
        </div>

        {sections.map((section, i) => {
          const locked = !canAccessSection(i);
          const completed = completedSections.has(section.id);

          return (
            <button
              key={section.id}
              onClick={() => handleSectionClick(i)}
              className="w-full text-left p-4 border-b"
            >
              <div className="flex gap-2 items-center">
                {locked ? (
                  <Lock className="h-4 w-4 text-gray-400" />
                ) : completed ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-gray-300" />
                )}

                Section {i + 1}: {section.title}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b bg-white flex justify-between">
          <Button onClick={() => setShowSidebar(!showSidebar)}>
            {showSidebar ? <X /> : <List />}
          </Button>

          <span>
            Section {currentSectionIndex + 1} of {totalSections}
          </span>
        </div>

        <div className="p-8 max-w-4xl mx-auto w-full">
          <h1 className="text-3xl font-bold mb-6">{currentSection.title}</h1>

          {(currentSection.lessons || []).map((lesson: any) => (
            <div key={lesson.id} className="mb-10">
              <h2 className="text-xl font-bold">{lesson.title}</h2>

              <p className="text-sm text-gray-500">{lesson.duration}</p>

              {(lesson.content || []).map((block: any) => {
                const type =
                  block.contentType || block.content_type || block.type;

                const value =
                  block.contentValue || block.content_value || block.value;

                return (
                  <div key={block.id ?? `${type}-${value}`} className="mt-4">
                    {type === 'heading' && (
                      <h3 className="text-lg font-semibold">{value}</h3>
                    )}

                    {type === 'text' && <p className="leading-7">{value}</p>}

                    {type === 'code' && (
                      <pre className="bg-black text-white p-4 rounded overflow-auto">
                        <code>{value}</code>
                      </pre>
                    )}

                    {type === 'list' && (
                      <ul className="list-disc pl-6">
                        {(() => {
                          let items: string[] = [];

                          if (Array.isArray(value)) {
                            items = value;
                          } else if (typeof value === 'string') {
                            try {
                              const cleaned = value.replace(/\\"/g, '"');
                              const parsed = JSON.parse(cleaned);
                              items = Array.isArray(parsed) ? parsed : [value];
                            } catch {
                              items = value
                                .replace(/^\[|\]$/g, '')
                                .split(',')
                                .map((item) =>
                                  item.replace(/^"|"$/g, '').trim()
                                );
                            }
                          }

                          return items.map((item: string, idx: number) => (
                            <li key={idx}>{item}</li>
                          ));
                        })()}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {sectionQuiz.map((quiz) => (
            <Quiz
              key={quiz.id}
              title={quiz.sectionTitle || quiz.section_title || 'Section Quiz'}
              questions={quiz.questions || []}
            />
          ))}

          <div className="flex justify-between mt-10">
            <Button onClick={handlePrev} disabled={currentSectionIndex === 0}>
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={currentSectionIndex === totalSections - 1}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import type {
  Course,
  Section,
  Lesson,
  SectionQuiz
} from '../services/database';

import {
  getCourseById,
  getCourseSections,
  getSectionQuiz
} from '../services/database';

import { Button } from '../components/ui/button';
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
  Lock
} from 'lucide-react';

import { Progress } from '../components/ui/progress';

export function CoursePlayer() {
  const { id } = useParams();

  // ======================
  // INVALID ID GUARD
  // ======================
  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Invalid course ID</p>
      </div>
    );
  }

  const courseId = id;

  const { isAuthenticated } = useAuth();
  const { hasPurchased } = usePurchase();

  const [course, setCourse] = useState<Course | null>(null);

  // ✅ SAFE DEFAULT EMPTY ARRAY
  const [sections, setSections] = useState<Section[]>([]);

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const [sectionQuiz, setSectionQuiz] = useState<SectionQuiz[]>([]);

  const [completedSections, setCompletedSections] =
    useState<Set<string>>(new Set());

  const [showSidebar, setShowSidebar] = useState(true);

  const [showAuthModal, setShowAuthModal] = useState(false);

  const isPurchased = hasPurchased(courseId);

  // ======================
  // ACCESS CONTROL
  // ======================
  const canAccessSection = (index: number) => {
    if (index === 0) return true;

    return isAuthenticated && isPurchased;
  };

  // ======================
  // LOAD COURSE + SECTIONS
  // ======================
  useEffect(() => {
    async function load() {
      try {
        const [c, s] = await Promise.all([
          getCourseById(courseId),
          getCourseSections(courseId)
        ]);

        console.log('COURSE:', c);
        console.log('SECTIONS:', s);

        setCourse(c);

        // ✅ SAFETY
        setSections(Array.isArray(s) ? s : []);
      } catch (err) {
        console.error('Failed loading course player:', err);
      }
    }

    load();
  }, [courseId]);

  // ======================
  // LOAD QUIZ
  // ======================
  useEffect(() => {
    async function loadQuiz() {
      if (!sections[currentSectionIndex]) {
        setSectionQuiz([]);
        return;
      }

      try {
        const quiz = await getSectionQuiz(
          sections[currentSectionIndex].id
        );

        console.log('SECTION QUIZ:', quiz);

        setSectionQuiz(quiz);
      } catch (err) {
        console.error('Failed loading quiz:', err);
        setSectionQuiz([]);
      }
    }

    loadQuiz();
  }, [currentSectionIndex, sections]);

  // ======================
  // CURRENT SECTION
  // ======================
  const currentSection: Section | undefined =
    sections[currentSectionIndex];

    console.log(
  'CURRENT SECTION:',
  JSON.stringify(currentSection, null, 2)
);

  // ======================
  // LOADING STATE
  // ======================
  if (!course || !currentSection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading course...</p>
      </div>
    );
  }

  const totalSections = sections.length;

  // ======================
  // NAVIGATION
  // ======================
  const handleNext = () => {
    if (currentSectionIndex < sections.length - 1) {
      const next = currentSectionIndex + 1;

      if (canAccessSection(next)) {
        setCurrentSectionIndex(next);
      }
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
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* SIDEBAR */}
      <div
        className={`${
          showSidebar ? 'w-80' : 'w-0'
        } bg-white border-r overflow-hidden`}
      >
        <div className="p-4 border-b">
          <h2 className="font-bold">{course.title}</h2>

          <Progress
            value={
              totalSections
                ? ((currentSectionIndex + 1) / totalSections) * 100
                : 0
            }
          />
        </div>

        {/* SAFE MAP */}
        {(sections || []).map((section: Section, i: number) => (
          <button
            key={section.id}
            onClick={() => handleSectionClick(i)}
            className="w-full text-left p-4 border-b"
          >
            <div className="flex gap-2 items-center">
              {i === currentSectionIndex ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Lock className="h-4 w-4 text-gray-400" />
              )}

              Section {i + 1}: {section.title}
            </div>
          </button>
        ))}
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <div className="p-4 border-b bg-white flex justify-between">
          <Button onClick={() => setShowSidebar(!showSidebar)}>
            {showSidebar ? <X /> : <List />}
          </Button>

          <span>
            Section {currentSectionIndex + 1} of {totalSections}
          </span>
        </div>

        {/* CONTENT */}
        <div className="p-8 max-w-4xl mx-auto w-full">

          <h1 className="text-3xl font-bold mb-6">
            {currentSection.title}
          </h1>

          {/* LESSONS */}
          {(currentSection.lessons || []).map(
            (lesson: Lesson) => (
              <div key={lesson.id} className="mb-10">

                <h2 className="text-xl font-bold">
                  {lesson.title}
                </h2>

                <p className="text-sm text-gray-500">
                  {lesson.duration}
                </p>

                {/* SAFE CONTENT */}
                {(lesson.content || []).map((block, i: number) => (
                  <div key={i} className="mt-2">

                    {block.type === 'text' && (
                      <p>{block.value as string}</p>
                    )}

                    {block.type === 'heading' && (
                      <h3 className="font-bold">
                        {block.value as string}
                      </h3>
                    )}

                    {block.type === 'list' && (
                      <ul className="list-disc pl-6">
                        {Array.isArray(block.value) &&
                          block.value.map((item, j) => (
                            <li key={j}>{item}</li>
                          ))}
                      </ul>
                    )}

                    {block.type === 'code' && (
                      <pre className="bg-black text-white p-3 rounded">
                        {block.value as string}
                      </pre>
                    )}

                  </div>
                ))}
              </div>
            )
          )}

          {/* QUIZ */}
          {sectionQuiz.map((quiz) => (
            <Quiz
              key={quiz.id}
              title={quiz.section_title || 'Section Quiz'}
              questions={quiz.questions || []}
            />
          ))}

          {/* NAVIGATION */}
          <div className="flex justify-between mt-10">

            <Button
              onClick={handlePrev}
              disabled={currentSectionIndex === 0}
            >
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={
                currentSectionIndex === totalSections - 1
              }
            >
              Next
            </Button>

          </div>
        </div>
      </div>

      {/* AUTH MODAL */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
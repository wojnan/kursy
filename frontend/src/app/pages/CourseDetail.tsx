import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';

import {
  getCourseById,
  getCourseSections,
  getSectionQuiz,
  getFinalQuiz,
} from '../services/database';

import type { Course, SectionQuiz, FinalQuiz } from '../services/database';

import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Quiz } from '../components/Quiz';
import { useCart } from '../contexts/CartContext';

import {
  Star,
  Clock,
  BarChart,
  Award,
  FileText,
  CheckCircle,
  Globe,
  Smartphone,
  Trophy,
  ArrowLeft,
  ShoppingCart,
  Check,
  BookOpen,
} from 'lucide-react';

import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';

export function CourseDetail() {
  const { id } = useParams();

  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [finalQuiz, setFinalQuiz] = useState<FinalQuiz[]>([]);
  const [loading, setLoading] = useState(true);

  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    async function loadData() {
      if (!id) return;

      try {
        setLoading(true);

        const courseData = await getCourseById(id);
        setCourse(courseData);

        const sectionData = await getCourseSections(id);
        setSections(sectionData);

        const finalQ = await getFinalQuiz(id);
        setFinalQuiz(finalQ);

        // load quizzes per section safely
        const quizPromises = sectionData.map((section: any) =>
          getSectionQuiz(section.id).catch(() => null)
        );

        const quizResults = await Promise.all(quizPromises);
        setQuizzes(quizResults.filter(Boolean));
      } catch (err) {
        console.error('Failed to load course:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const inCart = course ? isInCart(course.id) : false;

  const handleAddToCart = () => {
    if (course) addToCart(course);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading course...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
          <Link to="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back */}
      <div className="bg-white border-b">
        <div className="container px-4 py-4">
          <Link to="/courses">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Courses
            </Button>
          </Link>
        </div>
      </div>

      {/* HERO */}
      <div
        className="text-white py-12"
        style={{
          backgroundImage:
            'linear-gradient(to bottom right, #4F772D, #3d5a22)',
        }}
      >
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Badge className="mb-4 bg-amber-100" style={{ color: '#1a3a0f' }}>
                {course.category}
              </Badge>

              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl opacity-90 mb-6">
                {course.description}
              </p>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span>{course.rating}</span>
                  <span className="opacity-75">
                    ({course.students.toLocaleString()} students)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{course.duration}</span>
                </div>

                <div className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  <span>{course.level}</span>
                </div>
              </div>
            </div>

            {/* CARD */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <div className="aspect-video">
                  <ImageWithFallback
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <CardContent className="p-6">
                  <div className="text-3xl font-bold mb-4">
                    ${course.price}
                  </div>

                  <Link to={`/learn/${course.id}`} className="block mb-3">
                    <Button className="w-full bg-green-700">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Start Learning
                    </Button>
                  </Link>

                  {inCart ? (
                    <Button disabled className="w-full mb-3">
                      <Check className="h-5 w-5 mr-2" />
                      Added to Cart
                    </Button>
                  ) : (
                    <Button
                      onClick={handleAddToCart}
                      variant="outline"
                      className="w-full mb-3"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container px-4 py-12">
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-4">
                  What you'll learn
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex gap-2">
                    <CheckCircle className="text-green-700" />
                    Master fundamentals
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="text-green-700" />
                    Build real projects
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CURRICULUM */}
          <TabsContent value="curriculum">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-4">
                  Course Curriculum
                </h3>

                <Accordion type="single" collapsible>
                  {sections.map((section: any) => (
                    <AccordionItem
                      key={section.id}
                      value={`section-${section.id}`}
                    >
                      <AccordionTrigger>
                        {section.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        {section.lessons?.map((lesson: any) => (
                          <div
                            key={lesson.id}
                            className="flex gap-2 py-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            {lesson.title}
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* QUIZZES */}
          <TabsContent value="quizzes">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-4">
                  Quizzes
                </h3>

                {quizzes.flat().map((quiz: any, index: number) => (
                  <div key={quiz.id ?? index} className="mb-6">
                    <Quiz
                      title={quiz.sectionTitle || quiz.section_title || 'Section Quiz'}
                      questions={quiz.questions || []}
                    />
                  </div>
                ))}

                {finalQuiz.map((quiz: any, index: number) => (
                  <div key={quiz.id ?? index} className="mt-8">
                    <h4 className="font-bold mb-3">
                      Final Quiz
                    </h4>

                    <Quiz
                      title="Final Test"
                      questions={quiz.questions || []}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
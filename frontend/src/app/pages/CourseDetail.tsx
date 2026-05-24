import { useParams, Link } from 'react-router';
import { courses } from '../data/courses';
import { sectionQuizzes, finalQuizzes } from '../data/quizzes';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Quiz } from '../components/Quiz';
import { useCart } from '../context/CartContext';
import { 
  Star, 
  Users, 
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
  BookOpen
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

export function CourseDetail() {
  const { id } = useParams();
  const course = courses.find((c) => c.id === id);
  const { addToCart, isInCart } = useCart();

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

  const curriculum = [
    {
      title: 'Getting Started',
      lessons: [
        'Introduction to the Course',
        'Setting Up Your Environment',
        'Course Resources and Materials',
        'How to Get the Most Out of This Course'
      ]
    },
    {
      title: 'Fundamentals',
      lessons: [
        'Core Concepts Overview',
        'Understanding the Basics',
        'Hands-on Practice Session',
        'Common Patterns and Best Practices'
      ]
    },
    {
      title: 'Advanced Topics',
      lessons: [
        'Deep Dive into Advanced Features',
        'Real-World Applications',
        'Case Studies and Examples',
        'Optimization Techniques'
      ]
    },
    {
      title: 'Final Project',
      lessons: [
        'Project Requirements and Planning',
        'Building Your Project',
        'Testing and Debugging',
        'Final Presentation and Review'
      ]
    }
  ];

  const quizzes = sectionQuizzes[course.id] || [];
  const finalQuiz = finalQuizzes[course.id];
  const inCart = isInCart(course.id);

  const handleAddToCart = () => {
    addToCart(course);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container px-4 py-4">
          <Link to="/courses">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Courses
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-white py-12" style={{ backgroundImage: 'linear-gradient(to bottom right, #4F772D, #3d5a22)' }}>
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Badge className="mb-4 bg-amber-100 hover:bg-amber-100" style={{ color: '#1a3a0f' }}>{course.category}</Badge>
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl opacity-90 mb-6">{course.description}</p>
              
              <div className="flex items-center gap-6 flex-wrap mb-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{course.rating}</span>
                  <span className="opacity-75">({course.students.toLocaleString()} students)</span>
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

            <div className="lg:col-span-1">
              <Card className="overflow-hidden sticky top-20">
                <div className="aspect-video relative">
                  <ImageWithFallback
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="text-3xl font-bold mb-4">${course.price}</div>
                  
                  <Link to={`/learn/${course.id}`} className="block mb-3">
                    <Button className="w-full gap-2 bg-green-700 hover:bg-green-800" size="lg">
                      <BookOpen className="h-5 w-5" /> Start Learning
                    </Button>
                  </Link>
                  
                  {inCart ? (
                    <Button className="w-full mb-3" size="lg" variant="outline" disabled>
                      <Check className="h-5 w-5 mr-2" /> Added to Cart
                    </Button>
                  ) : (
                    <Button className="w-full mb-3" size="lg" variant="outline" onClick={handleAddToCart}>
                      <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
                    </Button>
                  )}
                  
                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-green-700" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-green-700" />
                      <span>Lifetime access</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-green-700" />
                      <span>Access on mobile and desktop</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Trophy className="h-5 w-5 text-green-700" />
                      <span>Assignments and projects</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container px-4 py-12">
        <div className="max-w-4xl">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-4">What you'll learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                    <div className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-green-700 flex-shrink-0 mt-0.5" />
                      <span>Master the fundamentals and advanced concepts</span>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-green-700 flex-shrink-0 mt-0.5" />
                      <span>Build real-world projects from scratch</span>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-green-700 flex-shrink-0 mt-0.5" />
                      <span>Learn industry best practices and techniques</span>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-green-700 flex-shrink-0 mt-0.5" />
                      <span>Get hands-on experience with practical exercises</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-4">Course Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div>
                      <div className="text-gray-600 text-sm mb-1">Duration</div>
                      <div className="font-semibold">{course.duration}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 text-sm mb-1">Lessons</div>
                      <div className="font-semibold">{course.lessons} lectures</div>
                    </div>
                    <div>
                      <div className="text-gray-600 text-sm mb-1">Level</div>
                      <div className="font-semibold">{course.level}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 text-sm mb-1">Last Updated</div>
                      <div className="font-semibold">{course.lastUpdated}</div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-4">Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {course.description} This comprehensive course is designed to take you from beginner to advanced level. 
                    You'll learn through a combination of lectures, hands-on projects, and quizzes. Our expert instructor 
                    will guide you through each concept with clear explanations and practical examples. By the end of this course, 
                    you'll have the skills and confidence to apply what you've learned in real-world scenarios.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="curriculum" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold">Course Curriculum</h3>
                    <div className="text-sm text-gray-600">
                      {curriculum.length} sections • {course.lessons} lectures • {course.duration}
                    </div>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    {curriculum.map((section, index) => (
                      <AccordionItem key={index} value={`section-${index}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-green-700" />
                              <span className="font-semibold">Section {index + 1}: {section.title}</span>
                              {index === 0 && (
                                <Badge className="ml-2" style={{ backgroundColor: '#BED784', color: 'white' }}>
                                  FREE
                                </Badge>
                              )}
                            </div>
                            <span className="text-sm text-gray-600">{section.lessons.length} lessons</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pl-8 pt-2">
                            {index === 0 && (
                              <div className="mb-4 p-3 rounded-lg border-2" style={{ backgroundColor: '#e9f5e1', borderColor: '#BED784' }}>
                                <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#1a3a0f' }}>
                                  <CheckCircle className="h-4 w-4" />
                                  <span>This section is FREE to preview</span>
                                </div>
                              </div>
                            )}
                            {section.lessons.map((lesson, lessonIndex) => (
                              <div key={lessonIndex} className="flex items-center gap-3 py-2">
                                <CheckCircle className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{lesson}</span>
                                {index === 0 && (
                                  <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#e9f5e1', color: '#1a3a0f' }}>
                                    Free
                                  </span>
                                )}
                              </div>
                            ))}
                            {quizzes[index] && (
                              <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                                <div className="flex items-center gap-2 text-sm text-green-800">
                                  <Trophy className="h-4 w-4" />
                                  <span className="font-medium">Section Quiz: {quizzes[index].questions.length} questions</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                    
                    {finalQuiz && (
                      <AccordionItem value="final-quiz">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="flex items-center gap-3">
                              <Trophy className="h-5 w-5 text-green-700" />
                              <span className="font-semibold">Final Course Test</span>
                            </div>
                            <span className="text-sm text-gray-600">{finalQuiz.questions.length} questions</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-8 pt-2">
                            <p className="text-sm text-gray-600 mb-3">
                              Complete this comprehensive test to demonstrate your understanding of all course material.
                            </p>
                            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                              <div className="flex items-center gap-2 text-sm text-green-800">
                                <Award className="h-4 w-4" />
                                <span className="font-medium">Pass this test to earn your certificate of completion</span>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quizzes" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-2">Course Quizzes</h3>
                    <p className="text-gray-600 mb-6">Test your knowledge with section quizzes and a final comprehensive test.</p>
                    
                    {quizzes.length > 0 ? (
                      <div className="space-y-4">
                        {quizzes.map((quiz, index) => (
                          <div key={quiz.sectionId} className="border rounded-lg p-4">
                            <h4 className="font-semibold mb-2">Section {index + 1} Quiz: {quiz.sectionTitle}</h4>
                            <p className="text-sm text-gray-600 mb-4">{quiz.questions.length} questions</p>
                            <details className="group">
                              <summary className="cursor-pointer text-green-700 font-medium hover:text-green-800 list-none flex items-center gap-2">
                                <span>Take Quiz</span>
                                <span className="group-open:rotate-180 transition-transform">▼</span>
                              </summary>
                              <div className="mt-4">
                                <Quiz 
                                  title={`${quiz.sectionTitle} Quiz`}
                                  questions={quiz.questions}
                                />
                              </div>
                            </details>
                          </div>
                        ))}
                        
                        {finalQuiz && (
                          <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                            <div className="flex items-center gap-2 mb-2">
                              <Trophy className="h-5 w-5 text-green-700" />
                              <h4 className="font-semibold">Final Course Test</h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                              {finalQuiz.questions.length} comprehensive questions covering all course material
                            </p>
                            <details className="group">
                              <summary className="cursor-pointer text-green-700 font-medium hover:text-green-800 list-none flex items-center gap-2">
                                <span>Take Final Test</span>
                                <span className="group-open:rotate-180 transition-transform">▼</span>
                              </summary>
                              <div className="mt-4">
                                <Quiz 
                                  title="Final Course Test"
                                  questions={finalQuiz.questions}
                                />
                              </div>
                            </details>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500">Quizzes will be available after enrollment.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
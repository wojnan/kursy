const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `API Error: ${response.status}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return await response.json();
  } catch (error) {
    console.error(`Database request failed for ${endpoint}:`, error);
    throw error;
  }
}

// COURSE OPERATIONS

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  rating: number;
  students: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  image: string;
  lessons_count: number;
  last_updated: string;
}

export async function getAllCourses(): Promise<Course[]> {
  return apiRequest<Course[]>('/courses');
}

export async function getCourseById(courseId: string): Promise<Course> {
  return apiRequest<Course>(`/courses/${courseId}`);
}

export async function getCoursesByCategory(category: string): Promise<Course[]> {
  return apiRequest<Course[]>(`/courses/category/${category}`);
}

export async function searchCourses(query: string): Promise<Course[]> {
  return apiRequest<Course[]>(`/courses/search?q=${encodeURIComponent(query)}`);
}

// LESSON & SECTION OPERATIONS

export interface LessonContent {
  id: number;
  lesson_id: number;
  content_type: 'text' | 'list' | 'heading' | 'code';
  content_value: string;
  order_index: number;
}

export interface Lesson {
  id: string;
  section_id: number;
  title: string;
  duration: string;
  order_index: number;
  content: Array<{
    type: 'text' | 'list' | 'heading' | 'code';
    value: string | string[];
  }>;
}

export interface Section {
  id: string;
  course_id: number;
  title: string;
  order_index: number;
  lessons: Lesson[];
}

export async function getCourseSections(courseId: string): Promise<Section[]> {
  return apiRequest<Section[]>(`/sections/course/${courseId}`);
}

export async function getSectionById(sectionId: string): Promise<Section> {
  return apiRequest<Section>(`/sections/${sectionId}`);
}

// QUIZ OPERATIONS

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface FinalQuiz {
  id: number;
  course_id: number;
  questions: QuizQuestion[];
}

export interface SectionQuiz {
  id: number;
  section_id: number;
  section_title: string;
  questions: QuizQuestion[];
}

export async function getSectionQuiz(sectionId: string): Promise<SectionQuiz[]> {
  return apiRequest<SectionQuiz[]>(`/section-quizzes/section/${sectionId}`);
}

export async function getFinalQuiz(courseId: string): Promise<FinalQuiz[]> {
  return apiRequest<FinalQuiz[]>(`/final-quizzes/course/${courseId}`);
}

// USER OPERATIONS

export interface User {
  id: number;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt?: string;
}

export async function getCurrentUser(): Promise<User> {
  return apiRequest<User>('/../users/me');
}

// PURCHASE OPERATIONS

export interface Purchase {
  id: number;
  user_id: number;
  course_id: number;
  purchase_date: string;
  amount_paid: number;
}

export async function getUserPurchases(userId: number): Promise<Purchase[]> {
  return apiRequest<Purchase[]>(`/users/${userId}/purchases`);
}

export async function purchaseCourse(
  userId: number,
  courseId: string
): Promise<Purchase> {
  return apiRequest<Purchase>('/purchases', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, course_id: courseId }),
  });
}

export async function hasPurchasedCourse(
  userId: number,
  courseId: string
): Promise<boolean> {
  const purchases = await getUserPurchases(userId);
  return purchases.some((p) => p.course_id === parseInt(courseId));
}


// PAYMENT OPERATIONS

export interface CheckoutSessionRequest {
  userId: number;
  courseId: string;
  courseTitle: string;
  amount: number;
}

export interface CheckoutSessionResponse {
  url: string;
}

export async function createCheckoutSession(
  data: CheckoutSessionRequest
): Promise<CheckoutSessionResponse> {
  return apiRequest<CheckoutSessionResponse>('/payments/checkout', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
// PROGRESS TRACKING OPERATIONS

export interface UserProgress {
  id: number;
  user_id: number;
  section_id?: number;
  section_quiz_id?: number;
  final_quiz_id?: number;
  completed_at: string;
  score?: number;
}

export async function getUserProgress(
  userId: number,
  courseId: string
): Promise<UserProgress[]> {
  return apiRequest<UserProgress[]>(
    `/users/${userId}/progress?course_id=${courseId}`
  );
}

export async function markSectionComplete(
  userId: number,
  sectionId: string
): Promise<UserProgress> {
  return apiRequest<UserProgress>('/progress/section', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, section_id: sectionId }),
  });
}

export async function submitQuizResults(
  userId: number,
  sectionQuizId: number | null,
  finalQuizId: number | null,
  score: number
): Promise<UserProgress> {
  return apiRequest<UserProgress>('/progress/quiz', {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
      section_quiz_id: sectionQuizId,
      final_quiz_id: finalQuizId,
      score,
    }),
  });
}

// CART OPERATIONS

export interface CartItem {
  id: number;
  user_id: number;
  course_id: number;
  added_at: string;
  course?: Course;
}

export async function getCartItems(userId: number): Promise<CartItem[]> {
  return apiRequest<CartItem[]>(`/users/${userId}/cart`);
}

export async function addToCart(
  userId: number,
  courseId: string
): Promise<CartItem> {
  return apiRequest<CartItem>('/cart', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, course_id: courseId }),
  });
}

export async function removeFromCart(
  userId: number,
  courseId: string
): Promise<void> {
  return apiRequest<void>(`/cart/${courseId}`, {
    method: 'DELETE',
    body: JSON.stringify({ user_id: userId }),
  });
}

export async function clearCart(userId: number): Promise<void> {
  return apiRequest<void>(`/users/${userId}/cart`, {
    method: 'DELETE',
  });
}
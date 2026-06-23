const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

const BACKEND_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:8081';

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

async function backendRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${BACKEND_BASE_URL}${endpoint}`, {
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

  return response.json();
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
  course_id?: number;
  courseId?: number;
  questions: QuizQuestion[];
}

export interface SectionQuiz {
  id: number;
  section_id?: number;
  sectionId?: number;
  section_title?: string;
  sectionTitle?: string;
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
  role?: 'USER' | 'ADMIN';
}

export async function getCurrentUser(): Promise<User> {
  return backendRequest<User>('/users/me');
}

// PURCHASE OPERATIONS

export interface Purchase {
  id: number;
  userId?: number;
  user_id?: number;
  courseId?: number;
  course_id?: number;
  purchaseDate?: string;
  purchase_date?: string;
  amountPaid?: number;
  amount_paid?: number;
}

export async function getUserPurchases(userId: number): Promise<Purchase[]> {
  return apiRequest<Purchase[]>(`/purchases/user/${userId}`);
}

export async function purchaseCourse(
  userId: number,
  courseId: string
): Promise<Purchase> {
  return apiRequest<Purchase>('/purchases', {
    method: 'POST',
    body: JSON.stringify({ userId, courseId }),
  });
}

export async function hasPurchasedCourse(
  userId: number,
  courseId: string
): Promise<boolean> {
  const purchases = await getUserPurchases(userId);

  return purchases.some(
    (p) => String(p.courseId ?? p.course_id) === courseId
  );
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

export async function confirmStripePayment(sessionId: string): Promise<any> {
  return apiRequest('/payments/confirm-stripe', {
    method: 'POST',
    body: JSON.stringify({ sessionId }),
  });
}

export async function createOfflinePayment(data: {
  userId: number;
  courseId: string;
  amount: number;
  note: string;
}): Promise<any> {
  return apiRequest('/payments/offline', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getPendingPayments(): Promise<any[]> {
  return apiRequest('/payments/admin/pending');
}

export async function approvePayment(paymentId: number): Promise<any> {
  return apiRequest(`/payments/admin/${paymentId}/approve`, {
    method: 'POST',
  });
}

export async function rejectPayment(paymentId: number): Promise<any> {
  return apiRequest(`/payments/admin/${paymentId}/reject`, {
    method: 'POST',
  });
}

// PROGRESS TRACKING OPERATIONS

export interface UserProgress {
  id: number;
  user_id?: number;
  userId?: number;
  section_id?: number;
  sectionId?: number;
  section_quiz_id?: number;
  sectionQuizId?: number;
  final_quiz_id?: number;
  finalQuizId?: number;
  completed_at?: string;
  completedAt?: string;
  score?: number;
}

export async function getUserProgress(
  userId: number
): Promise<UserProgress[]> {
  return apiRequest<UserProgress[]>(
    `/progress/user/${userId}`
  );
}

export async function markSectionComplete(
  userId: number,
  sectionId: string
): Promise<UserProgress> {
  return apiRequest<UserProgress>('/progress', {
    method: 'POST',
    body: JSON.stringify({
      userId,
      sectionId: Number(sectionId),
    }),
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
      userId,
      sectionQuizId,
      finalQuizId,
      score,
    }),
  });
}

// CART OPERATIONS

export interface CartItem {
  id: number;
  user_id?: number;
  userId?: number;
  course_id?: number;
  courseId?: number;
  added_at?: string;
  addedAt?: string;
  course?: Course;
}

export async function getCartItems(userId: number): Promise<CartItem[]> {
  return backendRequest<CartItem[]>(`/users/${userId}/cart`);
}

export async function addToCart(
  userId: number,
  courseId: string
): Promise<CartItem> {
  return apiRequest<CartItem>('/cart', {
    method: 'POST',
    body: JSON.stringify({ userId, courseId }),
  });
}

export async function removeFromCart(
  userId: number,
  courseId: string
): Promise<void> {
  return apiRequest<void>(`/cart/${courseId}`, {
    method: 'DELETE',
    body: JSON.stringify({ userId }),
  });
}

export async function clearCart(userId: number): Promise<void> {
  return backendRequest<void>(`/users/${userId}/cart`, {
    method: 'DELETE',
  });
}
import { describe, it, expect, vi, beforeEach } from 'vitest'

import {
  getAllCourses,
  getCourseById,
  getCoursesByCategory,
  searchCourses,
  getCourseSections,
  getSectionById,
  getSectionQuiz,
  getFinalQuiz,
  getCurrentUser,
  getUserPurchases,
  purchaseCourse,
  hasPurchasedCourse,
  createCheckoutSession,
  confirmStripePayment,
  createOfflinePayment,
  getPendingPayments,
  approvePayment,
  rejectPayment,
  getUserProgress,
  markSectionComplete,
  submitQuizResults,
  getCartItems,
  addToCart,
  removeFromCart,
  clearCart,
} from '../app/services/database'

describe('database service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function mockJsonResponse(data: unknown, status = 200) {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: status >= 200 && status < 300,
        status,
        json: async () => data,
        text: async () => 'Error message',
      })
    )
  }

  function expectFetchCalledWith(url: string, options?: Partial<RequestInit>) {
    expect(fetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        credentials: 'include',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        ...options,
      })
    )
  }

  it('gets all courses', async () => {
    mockJsonResponse([{ id: '1', title: 'React' }])

    const result = await getAllCourses()

    expect(result).toEqual([{ id: '1', title: 'React' }])
    expectFetchCalledWith('http://localhost:8081/api/courses')
  })

  it('gets course by id', async () => {
    mockJsonResponse({ id: '1', title: 'React' })

    const result = await getCourseById('1')

    expect(result).toEqual({ id: '1', title: 'React' })
    expectFetchCalledWith('http://localhost:8081/api/courses/1')
  })

  it('gets courses by category', async () => {
    mockJsonResponse([{ id: '1', category: 'Programming' }])

    const result = await getCoursesByCategory('Programming')

    expect(result).toHaveLength(1)
    expectFetchCalledWith(
      'http://localhost:8081/api/courses/category/Programming'
    )
  })

  it('searches courses with encoded query', async () => {
    mockJsonResponse([{ id: '1', title: 'React Basics' }])

    await searchCourses('react basics')

    expectFetchCalledWith(
      'http://localhost:8081/api/courses/search?q=react%20basics'
    )
  })

  it('gets course sections', async () => {
    mockJsonResponse([{ id: '1', title: 'Intro' }])

    await getCourseSections('10')

    expectFetchCalledWith('http://localhost:8081/api/sections/course/10')
  })

  it('gets section by id', async () => {
    mockJsonResponse({ id: '5', title: 'Basics' })

    await getSectionById('5')

    expectFetchCalledWith('http://localhost:8081/api/sections/5')
  })

  it('gets section quiz', async () => {
    mockJsonResponse([{ id: 1 }])

    await getSectionQuiz('7')

    expectFetchCalledWith(
      'http://localhost:8081/api/section-quizzes/section/7'
    )
  })

  it('gets final quiz', async () => {
    mockJsonResponse([{ id: 1 }])

    await getFinalQuiz('3')

    expectFetchCalledWith('http://localhost:8081/api/final-quizzes/course/3')
  })

  it('gets current user from backend base URL', async () => {
    mockJsonResponse({ id: 1, email: 'test@example.com' })

    const result = await getCurrentUser()

    expect(result.email).toBe('test@example.com')
    expectFetchCalledWith('http://localhost:8081/users/me')
  })

  it('gets user purchases', async () => {
    mockJsonResponse([{ id: 1, courseId: 10 }])

    await getUserPurchases(1)

    expectFetchCalledWith('http://localhost:8081/api/purchases/user/1')
  })

  it('creates purchase course request', async () => {
    mockJsonResponse({ id: 1 })

    await purchaseCourse(1, '10')

    expectFetchCalledWith('http://localhost:8081/api/purchases', {
      method: 'POST',
      body: JSON.stringify({ userId: 1, courseId: '10' }),
    })
  })

  it('returns true when user has purchased course using courseId', async () => {
    mockJsonResponse([{ courseId: 10 }])

    const result = await hasPurchasedCourse(1, '10')

    expect(result).toBe(true)
  })

  it('returns true when user has purchased course using course_id', async () => {
    mockJsonResponse([{ course_id: 10 }])

    const result = await hasPurchasedCourse(1, '10')

    expect(result).toBe(true)
  })

  it('returns false when user has not purchased course', async () => {
    mockJsonResponse([{ courseId: 20 }])

    const result = await hasPurchasedCourse(1, '10')

    expect(result).toBe(false)
  })

  it('creates checkout session', async () => {
    mockJsonResponse({ url: 'https://stripe.test/session' })

    await createCheckoutSession({
      userId: 1,
      courseId: '10',
      courseTitle: 'React',
      amount: 9900,
    })

    expectFetchCalledWith('http://localhost:8081/api/payments/checkout', {
      method: 'POST',
      body: JSON.stringify({
        userId: 1,
        courseId: '10',
        courseTitle: 'React',
        amount: 9900,
      }),
    })
  })

  it('confirms stripe payment', async () => {
    mockJsonResponse({ status: 'PAID' })

    await confirmStripePayment('cs_test_123')

    expectFetchCalledWith('http://localhost:8081/api/payments/confirm-stripe', {
      method: 'POST',
      body: JSON.stringify({ sessionId: 'cs_test_123' }),
    })
  })

  it('creates offline payment', async () => {
    mockJsonResponse({ status: 'AWAITING_ADMIN_APPROVAL' })

    await createOfflinePayment({
      userId: 1,
      courseId: '10',
      amount: 99,
      note: 'Bank transfer',
    })

    expectFetchCalledWith('http://localhost:8081/api/payments/offline', {
      method: 'POST',
      body: JSON.stringify({
        userId: 1,
        courseId: '10',
        amount: 99,
        note: 'Bank transfer',
      }),
    })
  })

  it('gets pending payments', async () => {
    mockJsonResponse([{ id: 1 }])

    await getPendingPayments()

    expectFetchCalledWith('http://localhost:8081/api/payments/admin/pending')
  })

  it('approves payment', async () => {
    mockJsonResponse({ id: 1, status: 'PAID' })

    await approvePayment(1)

    expectFetchCalledWith('http://localhost:8081/api/payments/admin/1/approve', {
      method: 'POST',
    })
  })

  it('rejects payment', async () => {
    mockJsonResponse({ id: 1, status: 'REJECTED' })

    await rejectPayment(1)

    expectFetchCalledWith('http://localhost:8081/api/payments/admin/1/reject', {
      method: 'POST',
    })
  })

  it('gets user progress', async () => {
    mockJsonResponse([{ id: 1 }])

    await getUserProgress(1)

    expectFetchCalledWith('http://localhost:8081/api/progress/user/1')
  })

  it('marks section complete', async () => {
    mockJsonResponse({ id: 1 })

    await markSectionComplete(1, '5')

    expectFetchCalledWith('http://localhost:8081/api/progress', {
      method: 'POST',
      body: JSON.stringify({
        userId: 1,
        sectionId: 5,
      }),
    })
  })

  it('submits quiz results', async () => {
    mockJsonResponse({ id: 1, score: 80 })

    await submitQuizResults(1, 2, 3, null, 80)

    expectFetchCalledWith('http://localhost:8081/api/progress', {
      method: 'POST',
      body: JSON.stringify({
        userId: 1,
        sectionId: 2,
        sectionQuizId: 3,
        finalQuizId: null,
        score: 80,
      }),
    })
  })

  it('gets cart items from backend base URL', async () => {
    mockJsonResponse([{ id: 1 }])

    await getCartItems(1)

    expectFetchCalledWith('http://localhost:8081/users/1/cart')
  })

  it('adds item to cart', async () => {
    mockJsonResponse({ id: 1 })

    await addToCart(1, '10')

    expectFetchCalledWith('http://localhost:8081/api/cart', {
      method: 'POST',
      body: JSON.stringify({
        userId: 1,
        courseId: '10',
      }),
    })
  })

  it('removes item from cart', async () => {
    mockJsonResponse(undefined, 204)

    await removeFromCart(1, '10')

    expectFetchCalledWith('http://localhost:8081/api/cart/10', {
      method: 'DELETE',
      body: JSON.stringify({
        userId: 1,
      }),
    })
  })

  it('clears cart from backend base URL', async () => {
    mockJsonResponse(undefined, 204)

    await clearCart(1)

    expectFetchCalledWith('http://localhost:8081/users/1/cart', {
      method: 'DELETE',
    })
  })

  it('throws error when API request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => 'Server error',
      })
    )

    await expect(getAllCourses()).rejects.toThrow('Server error')
  })

  it('throws fallback error when API error has no text', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        text: async () => '',
      })
    )

    await expect(getAllCourses()).rejects.toThrow('API Error: 404')
  })
})
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { CourseCard } from '../app/components/CourseCard'

// Mock image component
vi.mock('../app/components/figma/ImageWithFallback', () => ({
  ImageWithFallback: ({ src, alt }: any) => (
    <img src={src} alt={alt} data-testid="course-image" />
  ),
}))

describe('CourseCard', () => {
  const course = {
    id: '1',
    title: 'React Fundamentals',
    description: 'Learn React from scratch',
    instructor: 'John Doe',
    price: 99,
    rating: 4.8,
    students: 1250,
    duration: '10 hours',
    category: 'Programming',
    level: 'Beginner',
    image: '/react.jpg',
  } as any

  it('renders course information', () => {
    render(
      <MemoryRouter>
        <CourseCard course={course} />
      </MemoryRouter>
    )

    expect(screen.getByText('React Fundamentals')).toBeInTheDocument()
    expect(screen.getByText('Learn React from scratch')).toBeInTheDocument()
    expect(screen.getByText('By John Doe')).toBeInTheDocument()
    expect(screen.getByText('Programming')).toBeInTheDocument()
    expect(screen.getByText('Beginner')).toBeInTheDocument()
  })

  it('renders course price', () => {
    render(
      <MemoryRouter>
        <CourseCard course={course} />
      </MemoryRouter>
    )

    expect(screen.getByText('$99')).toBeInTheDocument()
  })

  it('renders course statistics', () => {
    render(
      <MemoryRouter>
        <CourseCard course={course} />
      </MemoryRouter>
    )

    expect(screen.getByText('4.8')).toBeInTheDocument()

    expect(screen.getByText('1250')).toBeInTheDocument()

    expect(screen.getByText('10 hours')).toBeInTheDocument()
  })

  it('renders course image', () => {
    render(
      <MemoryRouter>
        <CourseCard course={course} />
      </MemoryRouter>
    )

    const image = screen.getByTestId('course-image')

    expect(image).toHaveAttribute('src', '/react.jpg')
    expect(image).toHaveAttribute('alt', 'React Fundamentals')
  })

  it('creates link to course details page', () => {
    render(
      <MemoryRouter>
        <CourseCard course={course} />
      </MemoryRouter>
    )

    const link = screen.getByRole('link')

    expect(link).toHaveAttribute('href', '/course/1')
  })
})
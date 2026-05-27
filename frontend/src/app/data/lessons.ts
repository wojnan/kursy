/**
 * TEMPORARY MOCK DATA
 *
 * This file provides mock lesson data while you set up your database.
 * All lesson content is now in database/seed_data.sql
 *
 * Once your database is ready, update components to use src/app/services/database.ts
 * See DATABASE_MIGRATION.md for instructions.
 */

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  content: {
    type: 'text' | 'list' | 'heading' | 'code';
    value: string | string[];
  }[];
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

// Minimal mock data for Course 1 - Section 1 (first section is free)
export const courseLessons: Record<string, Section[]> = {
  '1': [
    {
      id: 'section-1',
      title: 'Getting Started',
      lessons: [
        {
          id: 'lesson-1-1',
          title: 'Introduction to Web Development',
          duration: '12:30',
          content: [
            { type: 'heading', value: 'Welcome to Complete Web Development Bootcamp!' },
            { type: 'text', value: 'In this comprehensive course, you will learn everything you need to become a professional web developer.' },
            { type: 'heading', value: 'Course Prerequisites' },
            { type: 'list', value: [
              'A computer with internet connection',
              'Willingness to learn and practice',
              'Dedication to complete the exercises',
              'A code editor'
            ]},
            { type: 'text', value: 'By the end of this course, you\'ll be able to build complete, professional websites from scratch!' }
          ]
        },
        {
          id: 'lesson-1-2',
          title: 'Setting Up Your Development Environment',
          duration: '18:45',
          content: [
            { type: 'heading', value: 'Setting Up Your Workspace' },
            { type: 'text', value: 'Before we start coding, we need to set up our development environment.' },
            { type: 'heading', value: 'Required Software' },
            { type: 'list', value: [
              'Visual Studio Code',
              'Node.js',
              'Git',
              'A modern web browser'
            ]}
          ]
        }
      ]
    }
  ],
  '2': [
    {
      id: 'section-1',
      title: 'Digital Marketing Foundations',
      lessons: [
        {
          id: 'lesson-1-1',
          title: 'Introduction to Digital Marketing',
          duration: '15:00',
          content: [
            { type: 'heading', value: 'Welcome to Digital Marketing Mastery' },
            { type: 'text', value: 'Digital marketing is the practice of promoting products or services using digital channels.' }
          ]
        }
      ]
    }
  ]
};

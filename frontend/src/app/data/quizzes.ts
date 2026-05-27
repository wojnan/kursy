/**
 * TEMPORARY MOCK DATA
 *
 * This file provides mock quiz data while you set up your database.
 * All quiz data is now in database/seed_data.sql
 *
 * Once your database is ready, update components to use src/app/services/database.ts
 * See DATABASE_MIGRATION.md for instructions.
 */

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface SectionQuiz {
  sectionId: string;
  sectionTitle: string;
  questions: QuizQuestion[];
}

export interface FinalQuiz {
  courseId: string;
  questions: QuizQuestion[];
}

// Minimal mock section quizzes
export const sectionQuizzes: Record<string, SectionQuiz[]> = {
  '1': [
    {
      sectionId: 'section-1',
      sectionTitle: 'Getting Started',
      questions: [
        {
          id: 'q1-1',
          question: 'What is the primary purpose of setting up your development environment?',
          options: [
            'To make your computer look professional',
            'To ensure you have all necessary tools and dependencies installed',
            'To slow down your learning process',
            'To impress other developers'
          ],
          correctAnswer: 1
        },
        {
          id: 'q1-2',
          question: 'Which of the following is NOT a recommended course resource?',
          options: [
            'Official documentation',
            'Practice exercises',
            'Random internet forums',
            'Video lectures'
          ],
          correctAnswer: 2
        },
        {
          id: 'q1-3',
          question: 'How often should you review course materials to maximize learning?',
          options: [
            'Only once at the end',
            'Regularly and consistently',
            'Never, just watch once',
            'Only when confused'
          ],
          correctAnswer: 1
        },
        {
          id: 'q1-4',
          question: 'What is the best approach when you encounter a difficult concept?',
          options: [
            'Skip it and move on',
            'Give up completely',
            'Take time to understand, practice, and ask questions',
            'Memorize without understanding'
          ],
          correctAnswer: 2
        }
      ]
    }
  ]
};

// Minimal mock final quizzes
export const finalQuizzes: Record<string, FinalQuiz> = {
  '1': {
    courseId: '1',
    questions: [
      {
        id: 'final-1',
        question: 'What is the most important factor for success in web development?',
        options: [
          'Memorizing all syntax',
          'Continuous practice and learning',
          'Expensive equipment',
          'Working alone'
        ],
        correctAnswer: 1
      },
      {
        id: 'final-2',
        question: 'Which approach best describes effective problem-solving in development?',
        options: [
          'Giving up when stuck',
          'Breaking down problems and testing solutions systematically',
          'Copying code without understanding',
          'Avoiding difficult challenges'
        ],
        correctAnswer: 1
      },
      {
        id: 'final-3',
        question: 'Why is understanding fundamentals crucial before moving to advanced topics?',
        options: [
          'It\'s not crucial',
          'Advanced topics build on fundamental knowledge',
          'Fundamentals and advanced topics are unrelated',
          'You can skip fundamentals'
        ],
        correctAnswer: 1
      },
      {
        id: 'final-4',
        question: 'What is the value of building projects while learning?',
        options: [
          'Projects are unnecessary',
          'They help apply knowledge and build portfolio',
          'They only waste time',
          'They are only for advanced learners'
        ],
        correctAnswer: 1
      }
    ]
  }
};

// Generic quizzes for courses without specific quiz data
export const getGenericSectionQuizzes = (): SectionQuiz[] => [
  {
    sectionId: 'section-1',
    sectionTitle: 'Getting Started',
    questions: [
      {
        id: 'gen-q1-1',
        question: 'What is the first step in beginning this course?',
        options: [
          'Jump to advanced topics',
          'Review the course overview and objectives',
          'Skip the introduction',
          'Start the final project'
        ],
        correctAnswer: 1
      },
      {
        id: 'gen-q1-2',
        question: 'Why is it important to set learning goals?',
        options: [
          'Goals are unnecessary',
          'They provide direction and motivation',
          'Goals limit creativity',
          'They are only for beginners'
        ],
        correctAnswer: 1
      },
      {
        id: 'gen-q1-3',
        question: 'What should you do when you encounter new terminology?',
        options: [
          'Ignore it',
          'Look it up and understand it',
          'Guess the meaning',
          'Skip to the next section'
        ],
        correctAnswer: 1
      },
      {
        id: 'gen-q1-4',
        question: 'How can you maximize learning from this course?',
        options: [
          'Watch videos at 2x speed without understanding',
          'Engage actively, take notes, and practice',
          'Multitask while watching',
          'Skip practice exercises'
        ],
        correctAnswer: 1
      }
    ]
  }
];

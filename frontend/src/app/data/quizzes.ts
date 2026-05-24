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

// Section quizzes (4-5 questions each)
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
    },
    {
      sectionId: 'section-2',
      sectionTitle: 'Fundamentals',
      questions: [
        {
          id: 'q2-1',
          question: 'Why are fundamental concepts important in any learning path?',
          options: [
            'They are not important',
            'They provide the foundation for advanced topics',
            'They are only for beginners',
            'They waste time'
          ],
          correctAnswer: 1
        },
        {
          id: 'q2-2',
          question: 'What is the best way to reinforce fundamental concepts?',
          options: [
            'Reading alone',
            'Watching videos only',
            'Hands-on practice and repetition',
            'Memorizing definitions'
          ],
          correctAnswer: 2
        },
        {
          id: 'q2-3',
          question: 'Which learning approach is most effective for mastering fundamentals?',
          options: [
            'Passive listening',
            'Active practice and application',
            'Speed reading',
            'Multitasking while learning'
          ],
          correctAnswer: 1
        },
        {
          id: 'q2-4',
          question: 'What should you do if you don\'t understand a fundamental concept?',
          options: [
            'Move to advanced topics anyway',
            'Pretend you understand',
            'Review and seek clarification before moving forward',
            'Ignore it completely'
          ],
          correctAnswer: 2
        },
        {
          id: 'q2-5',
          question: 'How do best practices benefit your learning?',
          options: [
            'They don\'t matter for beginners',
            'They help you develop good habits from the start',
            'They are only for experts',
            'They slow down development'
          ],
          correctAnswer: 1
        }
      ]
    },
    {
      sectionId: 'section-3',
      sectionTitle: 'Advanced Topics',
      questions: [
        {
          id: 'q3-1',
          question: 'What distinguishes advanced topics from fundamentals?',
          options: [
            'They are easier to learn',
            'They build upon and extend fundamental concepts',
            'They are completely unrelated to basics',
            'They require no prior knowledge'
          ],
          correctAnswer: 1
        },
        {
          id: 'q3-2',
          question: 'Why are real-world applications important in advanced learning?',
          options: [
            'They are not important',
            'They help connect theory to practical use',
            'They are only for entertainment',
            'They complicate learning'
          ],
          correctAnswer: 1
        },
        {
          id: 'q3-3',
          question: 'What is the purpose of studying case studies?',
          options: [
            'To waste time',
            'To learn from real-world examples and solutions',
            'To make courses longer',
            'To confuse students'
          ],
          correctAnswer: 1
        },
        {
          id: 'q3-4',
          question: 'How should you approach optimization techniques?',
          options: [
            'Ignore them completely',
            'Apply them randomly',
            'Understand when and why to use them',
            'Use them everywhere without thinking'
          ],
          correctAnswer: 2
        }
      ]
    },
    {
      sectionId: 'section-4',
      sectionTitle: 'Final Project',
      questions: [
        {
          id: 'q4-1',
          question: 'What is the main purpose of a final project?',
          options: [
            'To stress students',
            'To apply everything learned in a comprehensive way',
            'To fill time',
            'To grade students unfairly'
          ],
          correctAnswer: 1
        },
        {
          id: 'q4-2',
          question: 'Why is project planning important?',
          options: [
            'It\'s not important',
            'It helps organize work and set clear goals',
            'It\'s just paperwork',
            'It wastes development time'
          ],
          correctAnswer: 1
        },
        {
          id: 'q4-3',
          question: 'What should be your approach to testing and debugging?',
          options: [
            'Skip testing entirely',
            'Test only at the end',
            'Test continuously throughout development',
            'Let users find the bugs'
          ],
          correctAnswer: 2
        },
        {
          id: 'q4-4',
          question: 'How important is the final presentation of your project?',
          options: [
            'Not important at all',
            'Very important - it showcases your work and communication skills',
            'Only the code matters',
            'Presentation is everything, code doesn\'t matter'
          ],
          correctAnswer: 1
        },
        {
          id: 'q4-5',
          question: 'What is the best mindset for completing a final project?',
          options: [
            'Rush to finish quickly',
            'Aim for perfection only',
            'Balance quality, learning, and timely completion',
            'Copy someone else\'s work'
          ],
          correctAnswer: 2
        }
      ]
    }
  ]
};

// Final course quiz (comprehensive test)
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
      },
      {
        id: 'final-5',
        question: 'How should you approach learning new technologies?',
        options: [
          'Learn everything at once',
          'Never learn anything new',
          'Start with fundamentals and build gradually',
          'Only watch tutorials'
        ],
        correctAnswer: 2
      },
      {
        id: 'final-6',
        question: 'What role does documentation play in development?',
        options: [
          'Documentation is useless',
          'It\'s an essential resource for learning and reference',
          'Only beginners need documentation',
          'Documentation slows you down'
        ],
        correctAnswer: 1
      },
      {
        id: 'final-7',
        question: 'Why is code testing important?',
        options: [
          'It\'s not important',
          'It ensures code works correctly and catches bugs early',
          'It\'s only for large companies',
          'It makes development slower'
        ],
        correctAnswer: 1
      },
      {
        id: 'final-8',
        question: 'What is the best way to stay current in web development?',
        options: [
          'Stop learning after one course',
          'Continuously learn, read, and practice new technologies',
          'Ignore industry changes',
          'Only use old technologies'
        ],
        correctAnswer: 1
      }
    ]
  }
};

// Generic quizzes for other courses (reusable)
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

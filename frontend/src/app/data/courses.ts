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
  lessons: number;
  lastUpdated: string;
}

export const courses: Course[] = [
  {
    id: '1',
    title: 'Complete Web Development Bootcamp',
    description: 'Master web development from scratch. Learn HTML, CSS, JavaScript, React, Node.js, and more in this comprehensive course.',
    instructor: 'Sarah Johnson',
    price: 89.99,
    rating: 4.8,
    students: 12543,
    duration: '42 hours',
    level: 'Beginner',
    category: 'Development',
    image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGNvZGluZ3xlbnwxfHx8fDE3NzQxNDgwODN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    lessons: 156,
    lastUpdated: 'March 2026'
  },
  {
    id: '2',
    title: 'Digital Marketing Masterclass',
    description: 'Learn SEO, social media marketing, content marketing, email marketing, and analytics to grow your business online.',
    instructor: 'Michael Chen',
    price: 79.99,
    rating: 4.6,
    students: 8234,
    duration: '28 hours',
    level: 'Intermediate',
    category: 'Marketing',
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWFya2V0aW5nJTIwc3RyYXRlZ3l8ZW58MXx8fHwxNzc0MTU2MzMzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    lessons: 98,
    lastUpdated: 'February 2026'
  },
  {
    id: '3',
    title: 'Graphic Design for Beginners',
    description: 'Master the fundamentals of graphic design including typography, color theory, layout, and design software.',
    instructor: 'Emma Davis',
    price: 69.99,
    rating: 4.9,
    students: 15672,
    duration: '35 hours',
    level: 'Beginner',
    category: 'Design',
    image: 'https://images.unsplash.com/photo-1689267166689-795f4f536819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwZGVzaWduJTIwY3JlYXRpdmV8ZW58MXx8fHwxNzc0MTg1NjI5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    lessons: 124,
    lastUpdated: 'March 2026'
  },
  {
    id: '4',
    title: 'Data Science & Machine Learning',
    description: 'Learn Python, statistics, machine learning algorithms, and data visualization to become a data scientist.',
    instructor: 'Dr. James Wilson',
    price: 99.99,
    rating: 4.7,
    students: 9876,
    duration: '58 hours',
    level: 'Advanced',
    category: 'Data Science',
    image: 'https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMGFuYWx5dGljc3xlbnwxfHx8fDE3NzQxNjI5MzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    lessons: 187,
    lastUpdated: 'January 2026'
  },
  {
    id: '5',
    title: 'Business Finance Essentials',
    description: 'Understand financial statements, budgeting, financial planning, and investment strategies for business success.',
    instructor: 'Robert Martinez',
    price: 74.99,
    rating: 4.5,
    students: 6543,
    duration: '24 hours',
    level: 'Beginner',
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1770271359908-a0e5e2214f8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGZpbmFuY2UlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzc0MDc2NTk2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    lessons: 84,
    lastUpdated: 'February 2026'
  },
  {
    id: '6',
    title: 'Professional Photography Course',
    description: 'Learn camera settings, composition, lighting, and post-processing to take stunning professional photographs.',
    instructor: 'Lisa Anderson',
    price: 84.99,
    rating: 4.8,
    students: 11234,
    duration: '32 hours',
    level: 'Intermediate',
    category: 'Photography',
    image: 'https://images.unsplash.com/photo-1752649938189-25651a4040fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeSUyMGNhbWVyYSUyMGFydHxlbnwxfHx8fDE3NzQxODU2MzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    lessons: 112,
    lastUpdated: 'March 2026'
  }
];

export const categories = [
  'All',
  'Development',
  'Marketing',
  'Design',
  'Data Science',
  'Business',
  'Photography'
];

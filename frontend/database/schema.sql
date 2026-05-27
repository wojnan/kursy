-- LearnHub Database Schema
-- PostgreSQL / MySQL compatible

-- ============================================
-- TABLES
-- ============================================

-- Users table for authentication
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  instructor VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  rating DECIMAL(3, 2) NOT NULL,
  students INTEGER NOT NULL DEFAULT 0,
  duration VARCHAR(50) NOT NULL,
  level VARCHAR(50) NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  category VARCHAR(100) NOT NULL,
  image TEXT NOT NULL,
  lessons_count INTEGER NOT NULL DEFAULT 0,
  last_updated VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sections table (belongs to course)
CREATE TABLE sections (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lessons table (belongs to section)
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  section_id INTEGER NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  duration VARCHAR(20) NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lesson content blocks (belongs to lesson)
CREATE TABLE lesson_content (
  id SERIAL PRIMARY KEY,
  lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('text', 'list', 'heading', 'code')),
  content_value TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Section quizzes (belongs to section)
CREATE TABLE section_quizzes (
  id SERIAL PRIMARY KEY,
  section_id INTEGER NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  section_title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Final course quizzes (belongs to course)
CREATE TABLE final_quizzes (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz questions (belongs to section_quiz or final_quiz)
CREATE TABLE quiz_questions (
  id SERIAL PRIMARY KEY,
  section_quiz_id INTEGER REFERENCES section_quizzes(id) ON DELETE CASCADE,
  final_quiz_id INTEGER REFERENCES final_quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  option_1 TEXT NOT NULL,
  option_2 TEXT NOT NULL,
  option_3 TEXT NOT NULL,
  option_4 TEXT NOT NULL,
  correct_answer INTEGER NOT NULL CHECK (correct_answer BETWEEN 0 AND 3),
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User purchases (tracks which courses users have bought)
CREATE TABLE user_purchases (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  amount_paid DECIMAL(10, 2) NOT NULL,
  UNIQUE(user_id, course_id)
);

-- User progress (tracks completed sections and quizzes)
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  section_id INTEGER REFERENCES sections(id) ON DELETE CASCADE,
  section_quiz_id INTEGER REFERENCES section_quizzes(id) ON DELETE CASCADE,
  final_quiz_id INTEGER REFERENCES final_quizzes(id) ON DELETE CASCADE,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  score INTEGER,
  UNIQUE(user_id, section_id, section_quiz_id, final_quiz_id)
);

-- Shopping cart items
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, course_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_sections_course_id ON sections(course_id);
CREATE INDEX idx_lessons_section_id ON lessons(section_id);
CREATE INDEX idx_lesson_content_lesson_id ON lesson_content(lesson_id);
CREATE INDEX idx_section_quizzes_section_id ON section_quizzes(section_id);
CREATE INDEX idx_quiz_questions_section_quiz_id ON quiz_questions(section_quiz_id);
CREATE INDEX idx_quiz_questions_final_quiz_id ON quiz_questions(final_quiz_id);
CREATE INDEX idx_final_quizzes_course_id ON final_quizzes(course_id);
CREATE INDEX idx_user_purchases_user_id ON user_purchases(user_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);

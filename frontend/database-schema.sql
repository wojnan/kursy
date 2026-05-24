-- LearnHub Database Schema Design
-- PostgreSQL Compatible SQL

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- ============================================
-- COURSES
-- ============================================

CREATE TABLE courses (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(500),
    instructor_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL, -- Beginner, Intermediate, Advanced
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_students INTEGER DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    duration VARCHAR(50), -- e.g., "12 hours"
    image_url TEXT,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_courses_rating ON courses(rating DESC);
CREATE INDEX idx_courses_created_at ON courses(created_at DESC);

-- ============================================
-- COURSE SECTIONS
-- ============================================

CREATE TABLE sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id VARCHAR(50) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    is_free BOOLEAN DEFAULT false, -- First section should be true
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, order_index)
);

CREATE INDEX idx_sections_course_id ON sections(course_id);
CREATE INDEX idx_sections_order ON sections(course_id, order_index);

-- ============================================
-- LESSONS
-- ============================================

CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    duration VARCHAR(50), -- e.g., "15 min"
    order_index INTEGER NOT NULL,
    content JSONB NOT NULL, -- Stores content blocks (headings, text, lists, code)
    video_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(section_id, order_index)
);

CREATE INDEX idx_lessons_section_id ON lessons(section_id);
CREATE INDEX idx_lessons_order ON lessons(section_id, order_index);

-- ============================================
-- QUIZZES
-- ============================================

CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    passing_score INTEGER DEFAULT 70, -- Percentage
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(section_id) -- One quiz per section
);

CREATE INDEX idx_quizzes_section_id ON quizzes(section_id);

-- ============================================
-- QUIZ QUESTIONS
-- ============================================

CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(quiz_id, order_index)
);

CREATE INDEX idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);

-- ============================================
-- QUIZ QUESTION OPTIONS
-- ============================================

CREATE TABLE quiz_question_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    order_index INTEGER NOT NULL,
    UNIQUE(question_id, order_index)
);

CREATE INDEX idx_quiz_options_question_id ON quiz_question_options(question_id);

-- ============================================
-- ENROLLMENTS (Purchases)
-- ============================================

CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR(50) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    progress_percentage DECIMAL(5, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, course_id)
);

CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_enrollments_enrolled_at ON enrollments(enrolled_at DESC);

-- ============================================
-- PURCHASES (Payment Records)
-- ============================================

CREATE TABLE purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR(50) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50), -- credit_card, paypal, etc.
    transaction_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'completed', -- pending, completed, refunded
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    refunded_at TIMESTAMP
);

CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_course_id ON purchases(course_id);
CREATE INDEX idx_purchases_purchased_at ON purchases(purchased_at DESC);
CREATE INDEX idx_purchases_status ON purchases(status);

-- ============================================
-- SECTION PROGRESS
-- ============================================

CREATE TABLE section_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, section_id)
);

CREATE INDEX idx_section_progress_user_id ON section_progress(user_id);
CREATE INDEX idx_section_progress_section_id ON section_progress(section_id);

-- ============================================
-- LESSON PROGRESS
-- ============================================

CREATE TABLE lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP,
    last_position INTEGER DEFAULT 0, -- For video progress
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);

-- ============================================
-- QUIZ ATTEMPTS
-- ============================================

CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    score DECIMAL(5, 2) NOT NULL, -- Percentage
    passed BOOLEAN NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    answers JSONB -- Stores user's answers
);

CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_completed_at ON quiz_attempts(completed_at DESC);

-- ============================================
-- COURSE REVIEWS
-- ============================================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR(50) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_visible BOOLEAN DEFAULT true,
    UNIQUE(user_id, course_id)
);

CREATE INDEX idx_reviews_course_id ON reviews(course_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- ============================================
-- SHOPPING CART
-- ============================================

CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR(50) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);

-- ============================================
-- ACHIEVEMENTS/BADGES
-- ============================================

CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    criteria JSONB, -- Defines how to earn this achievement
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_earned_at ON user_achievements(earned_at DESC);

-- ============================================
-- CERTIFICATES
-- ============================================

CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR(50) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pdf_url TEXT,
    UNIQUE(user_id, course_id)
);

CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_certificates_certificate_number ON certificates(certificate_number);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50), -- course_update, achievement, reminder, etc.
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View: Course with enrollment count and average rating
CREATE VIEW course_stats AS
SELECT 
    c.id,
    c.title,
    c.category,
    c.price,
    COUNT(DISTINCT e.user_id) as enrollment_count,
    COALESCE(AVG(r.rating), 0) as avg_rating,
    COUNT(DISTINCT r.id) as review_count
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
LEFT JOIN reviews r ON c.id = r.course_id AND r.is_visible = true
GROUP BY c.id, c.title, c.category, c.price;

-- View: User progress summary
CREATE VIEW user_progress_summary AS
SELECT 
    u.id as user_id,
    u.full_name,
    COUNT(DISTINCT e.course_id) as enrolled_courses,
    COUNT(DISTINCT CASE WHEN e.progress_percentage = 100 THEN e.course_id END) as completed_courses,
    COUNT(DISTINCT sp.section_id) as completed_sections,
    COUNT(DISTINCT ua.achievement_id) as total_achievements
FROM users u
LEFT JOIN enrollments e ON u.id = e.user_id
LEFT JOIN section_progress sp ON u.id = sp.user_id AND sp.completed = true
LEFT JOIN user_achievements ua ON u.id = ua.user_id
GROUP BY u.id, u.full_name;

-- ============================================
-- TRIGGERS FOR AUTO-UPDATE
-- ============================================

-- Update course rating when review is added/updated
CREATE OR REPLACE FUNCTION update_course_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE courses
    SET 
        rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM reviews
            WHERE course_id = NEW.course_id AND is_visible = true
        ),
        total_reviews = (
            SELECT COUNT(*)
            FROM reviews
            WHERE course_id = NEW.course_id AND is_visible = true
        ),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.course_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_course_rating
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_course_rating();

-- Update enrollment progress when section is completed
CREATE OR REPLACE FUNCTION update_enrollment_progress()
RETURNS TRIGGER AS $$
DECLARE
    course_id_val VARCHAR(50);
    total_sections INTEGER;
    completed_sections INTEGER;
    new_progress DECIMAL(5,2);
BEGIN
    -- Get course_id from section
    SELECT s.course_id INTO course_id_val
    FROM sections s
    WHERE s.id = NEW.section_id;
    
    -- Count total sections
    SELECT COUNT(*) INTO total_sections
    FROM sections
    WHERE course_id = course_id_val;
    
    -- Count completed sections
    SELECT COUNT(*) INTO completed_sections
    FROM section_progress sp
    JOIN sections s ON sp.section_id = s.id
    WHERE sp.user_id = NEW.user_id 
    AND s.course_id = course_id_val 
    AND sp.completed = true;
    
    -- Calculate progress
    new_progress := (completed_sections::DECIMAL / total_sections::DECIMAL) * 100;
    
    -- Update enrollment
    UPDATE enrollments
    SET 
        progress_percentage = new_progress,
        completed_at = CASE WHEN new_progress = 100 THEN CURRENT_TIMESTAMP ELSE NULL END
    WHERE user_id = NEW.user_id AND course_id = course_id_val;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_enrollment_progress
AFTER INSERT OR UPDATE ON section_progress
FOR EACH ROW
WHEN (NEW.completed = true)
EXECUTE FUNCTION update_enrollment_progress();

-- Update user's last_login timestamp
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_login := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Updated_at timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_courses_updated_at
BEFORE UPDATE ON courses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_lessons_updated_at
BEFORE UPDATE ON lessons
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_reviews_updated_at
BEFORE UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SAMPLE DATA SEEDS
-- ============================================

-- Insert sample achievements
INSERT INTO achievements (name, description, icon_url, criteria) VALUES
('First Steps', 'Complete your first lesson', '/achievements/first-steps.png', '{"type": "lesson_count", "value": 1}'),
('Quick Learner', 'Complete a course in under a week', '/achievements/quick-learner.png', '{"type": "course_speed", "days": 7}'),
('Knowledge Seeker', 'Enroll in 5 courses', '/achievements/knowledge-seeker.png', '{"type": "enrollment_count", "value": 5}'),
('Perfect Score', 'Get 100% on a quiz', '/achievements/perfect-score.png', '{"type": "quiz_score", "value": 100}'),
('Dedicated Student', 'Study for 7 days in a row', '/achievements/dedicated-student.png', '{"type": "streak_days", "value": 7}'),
('Course Master', 'Complete a course', '/achievements/course-master.png', '{"type": "course_completion", "value": 1}'),
('Review Writer', 'Write your first course review', '/achievements/review-writer.png', '{"type": "review_count", "value": 1}');

-- ============================================
-- USEFUL QUERIES
-- ============================================

-- Get user's enrolled courses with progress
/*
SELECT 
    c.id,
    c.title,
    c.image_url,
    e.enrolled_at,
    e.progress_percentage,
    e.completed_at
FROM enrollments e
JOIN courses c ON e.course_id = c.id
WHERE e.user_id = 'user-uuid-here'
ORDER BY e.enrolled_at DESC;
*/

-- Get course content structure
/*
SELECT 
    c.title as course_title,
    s.title as section_title,
    s.order_index as section_order,
    l.title as lesson_title,
    l.order_index as lesson_order,
    l.duration
FROM courses c
JOIN sections s ON c.id = s.course_id
JOIN lessons l ON s.id = l.section_id
WHERE c.id = 'course-id-here'
ORDER BY s.order_index, l.order_index;
*/

-- Get user's quiz history for a course
/*
SELECT 
    q.title as quiz_title,
    qa.score,
    qa.passed,
    qa.completed_at
FROM quiz_attempts qa
JOIN quizzes q ON qa.quiz_id = q.id
JOIN sections s ON q.section_id = s.id
WHERE qa.user_id = 'user-uuid-here'
AND s.course_id = 'course-id-here'
ORDER BY qa.completed_at DESC;
*/

-- Get popular courses
/*
SELECT 
    c.*,
    COUNT(e.user_id) as enrollment_count
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
GROUP BY c.id
ORDER BY enrollment_count DESC
LIMIT 10;
*/

-- Get user's achievements
/*
SELECT 
    a.name,
    a.description,
    a.icon_url,
    ua.earned_at
FROM user_achievements ua
JOIN achievements a ON ua.achievement_id = a.id
WHERE ua.user_id = 'user-uuid-here'
ORDER BY ua.earned_at DESC;
*/

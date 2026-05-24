# LearnHub Database Design Documentation

## Overview
This document describes the complete database schema for the LearnHub online learning platform. The database is designed to support user authentication, course management, progress tracking, quizzes, purchases, and gamification features.

## Database Tables

### 1. Users & Authentication

#### `users`
Stores user account information and authentication credentials.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | VARCHAR(255) | Unique email address |
| password_hash | VARCHAR(255) | Hashed password |
| full_name | VARCHAR(255) | User's full name |
| avatar_url | TEXT | Profile picture URL |
| bio | TEXT | User biography |
| created_at | TIMESTAMP | Account creation date |
| updated_at | TIMESTAMP | Last profile update |
| last_login | TIMESTAMP | Last login timestamp |
| is_active | BOOLEAN | Account status |
| email_verified | BOOLEAN | Email verification status |

**Indexes:** email, created_at

---

### 2. Course Content

#### `courses`
Main course catalog table.

| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(50) | Primary key (e.g., 'web-dev-101') |
| title | VARCHAR(255) | Course title |
| description | TEXT | Full course description |
| short_description | VARCHAR(500) | Brief summary |
| instructor_name | VARCHAR(255) | Instructor name |
| category | VARCHAR(100) | Course category |
| level | VARCHAR(50) | Difficulty level |
| price | DECIMAL(10,2) | Course price |
| rating | DECIMAL(3,2) | Average rating (0-5) |
| total_students | INTEGER | Enrollment count |
| total_reviews | INTEGER | Number of reviews |
| duration | VARCHAR(50) | Total course duration |
| image_url | TEXT | Course thumbnail |
| is_published | BOOLEAN | Visibility status |
| created_at | TIMESTAMP | Course creation date |
| updated_at | TIMESTAMP | Last update |

**Indexes:** category, level, rating, created_at

#### `sections`
Course sections/modules.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| course_id | VARCHAR(50) | Foreign key to courses |
| title | VARCHAR(255) | Section title |
| description | TEXT | Section description |
| order_index | INTEGER | Display order (0-based) |
| is_free | BOOLEAN | Free preview section |
| created_at | TIMESTAMP | Creation date |

**Unique Constraint:** (course_id, order_index)  
**Indexes:** course_id, (course_id, order_index)

#### `lessons`
Individual lessons within sections.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| section_id | UUID | Foreign key to sections |
| title | VARCHAR(255) | Lesson title |
| duration | VARCHAR(50) | Lesson duration |
| order_index | INTEGER | Display order |
| content | JSONB | Lesson content blocks |
| video_url | TEXT | Video URL (optional) |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update |

**Content JSONB Structure:**
```json
[
  {
    "type": "heading",
    "value": "Introduction"
  },
  {
    "type": "text",
    "value": "This lesson covers..."
  },
  {
    "type": "list",
    "value": ["Item 1", "Item 2"]
  },
  {
    "type": "code",
    "value": "const example = 'code';"
  }
]
```

**Unique Constraint:** (section_id, order_index)  
**Indexes:** section_id, (section_id, order_index)

---

### 3. Quizzes & Assessments

#### `quizzes`
Quiz metadata for each section.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| section_id | UUID | Foreign key to sections |
| title | VARCHAR(255) | Quiz title |
| description | TEXT | Quiz instructions |
| passing_score | INTEGER | Minimum score to pass (%) |
| created_at | TIMESTAMP | Creation date |

**Unique Constraint:** section_id (one quiz per section)

#### `quiz_questions`
Individual quiz questions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| quiz_id | UUID | Foreign key to quizzes |
| question_text | TEXT | Question content |
| order_index | INTEGER | Display order |
| created_at | TIMESTAMP | Creation date |

**Unique Constraint:** (quiz_id, order_index)

#### `quiz_question_options`
Answer options for each question.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| question_id | UUID | Foreign key to quiz_questions |
| option_text | TEXT | Answer option text |
| is_correct | BOOLEAN | Correct answer flag |
| order_index | INTEGER | Display order |

**Unique Constraint:** (question_id, order_index)

#### `quiz_attempts`
User quiz submission records.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| quiz_id | UUID | Foreign key to quizzes |
| score | DECIMAL(5,2) | Score percentage |
| passed | BOOLEAN | Pass/fail status |
| started_at | TIMESTAMP | Attempt start time |
| completed_at | TIMESTAMP | Completion time |
| answers | JSONB | User's answer selections |

**Answers JSONB Structure:**
```json
{
  "question_uuid_1": "selected_option_uuid",
  "question_uuid_2": "selected_option_uuid"
}
```

---

### 4. Enrollments & Purchases

#### `enrollments`
User course registrations and progress.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| course_id | VARCHAR(50) | Foreign key to courses |
| enrolled_at | TIMESTAMP | Enrollment date |
| completed_at | TIMESTAMP | Completion date (nullable) |
| progress_percentage | DECIMAL(5,2) | Overall progress (0-100) |
| is_active | BOOLEAN | Enrollment status |

**Unique Constraint:** (user_id, course_id)  
**Indexes:** user_id, course_id, enrolled_at

#### `purchases`
Payment transaction records.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| course_id | VARCHAR(50) | Foreign key to courses |
| amount | DECIMAL(10,2) | Purchase amount |
| currency | VARCHAR(3) | Currency code |
| payment_method | VARCHAR(50) | Payment type |
| transaction_id | VARCHAR(255) | External transaction ID |
| status | VARCHAR(50) | Payment status |
| purchased_at | TIMESTAMP | Purchase date |
| refunded_at | TIMESTAMP | Refund date (nullable) |

**Status Values:** pending, completed, refunded  
**Indexes:** user_id, course_id, purchased_at, status

---

### 5. Progress Tracking

#### `section_progress`
User progress through course sections.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| section_id | UUID | Foreign key to sections |
| completed | BOOLEAN | Completion status |
| completed_at | TIMESTAMP | Completion date |
| started_at | TIMESTAMP | First access date |

**Unique Constraint:** (user_id, section_id)  
**Indexes:** user_id, section_id

#### `lesson_progress`
User progress through individual lessons.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| lesson_id | UUID | Foreign key to lessons |
| completed | BOOLEAN | Completion status |
| completed_at | TIMESTAMP | Completion date |
| last_position | INTEGER | Video position (seconds) |
| started_at | TIMESTAMP | First access date |

**Unique Constraint:** (user_id, lesson_id)  
**Indexes:** user_id, lesson_id

---

### 6. Reviews & Ratings

#### `reviews`
User course reviews and ratings.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| course_id | VARCHAR(50) | Foreign key to courses |
| rating | INTEGER | Star rating (1-5) |
| review_text | TEXT | Written review |
| created_at | TIMESTAMP | Review date |
| updated_at | TIMESTAMP | Last edit date |
| is_visible | BOOLEAN | Moderation status |

**Unique Constraint:** (user_id, course_id) - one review per user per course  
**Indexes:** course_id, user_id, rating, created_at

---

### 7. Shopping Cart

#### `cart_items`
User shopping cart contents.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| course_id | VARCHAR(50) | Foreign key to courses |
| added_at | TIMESTAMP | Date added to cart |

**Unique Constraint:** (user_id, course_id)  
**Indexes:** user_id

---

### 8. Gamification

#### `achievements`
Available achievements/badges.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(255) | Achievement name |
| description | TEXT | Achievement description |
| icon_url | TEXT | Badge icon URL |
| criteria | JSONB | Earning requirements |
| created_at | TIMESTAMP | Creation date |

**Criteria JSONB Examples:**
```json
{"type": "lesson_count", "value": 1}
{"type": "course_speed", "days": 7}
{"type": "quiz_score", "value": 100}
{"type": "streak_days", "value": 7}
```

#### `user_achievements`
User earned achievements.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| achievement_id | UUID | Foreign key to achievements |
| earned_at | TIMESTAMP | Date earned |

**Unique Constraint:** (user_id, achievement_id)  
**Indexes:** user_id, earned_at

---

### 9. Certificates

#### `certificates`
Course completion certificates.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| course_id | VARCHAR(50) | Foreign key to courses |
| certificate_number | VARCHAR(50) | Unique certificate ID |
| issued_at | TIMESTAMP | Issue date |
| pdf_url | TEXT | Certificate PDF URL |

**Unique Constraints:** certificate_number, (user_id, course_id)  
**Indexes:** user_id, certificate_number

---

### 10. Notifications

#### `notifications`
User notifications and messages.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| title | VARCHAR(255) | Notification title |
| message | TEXT | Notification content |
| type | VARCHAR(50) | Notification type |
| is_read | BOOLEAN | Read status |
| action_url | TEXT | Click destination URL |
| created_at | TIMESTAMP | Creation date |

**Type Values:** course_update, achievement, reminder, promotion  
**Indexes:** user_id, (user_id, is_read), created_at

---

## Database Views

### `course_stats`
Aggregated course statistics.

```sql
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
LEFT JOIN reviews r ON c.id = r.course_id
```

### `user_progress_summary`
User learning statistics.

```sql
SELECT 
    u.id as user_id,
    u.full_name,
    COUNT(DISTINCT e.course_id) as enrolled_courses,
    COUNT(DISTINCT CASE WHEN e.progress_percentage = 100 THEN e.course_id END) as completed_courses,
    COUNT(DISTINCT sp.section_id) as completed_sections,
    COUNT(DISTINCT ua.achievement_id) as total_achievements
FROM users u
LEFT JOIN enrollments e ON u.id = e.user_id
LEFT JOIN section_progress sp ON u.id = sp.user_id
LEFT JOIN user_achievements ua ON u.id = ua.user_id
```

---

## Database Triggers

### 1. Auto-Update Course Rating
Automatically recalculates course rating when reviews are added/updated.

**Trigger:** `trigger_update_course_rating`  
**Event:** AFTER INSERT OR UPDATE on `reviews`  
**Action:** Updates `courses.rating` and `courses.total_reviews`

### 2. Auto-Update Enrollment Progress
Updates overall course progress when sections are completed.

**Trigger:** `trigger_update_enrollment_progress`  
**Event:** AFTER INSERT OR UPDATE on `section_progress`  
**Action:** Recalculates and updates `enrollments.progress_percentage`

### 3. Timestamp Triggers
Automatically maintains `updated_at` timestamps.

**Triggers:** 
- `trigger_users_updated_at`
- `trigger_courses_updated_at`
- `trigger_lessons_updated_at`
- `trigger_reviews_updated_at`

---

## Relationships Diagram

```
users
├── enrollments (1:N)
├── purchases (1:N)
├── section_progress (1:N)
├── lesson_progress (1:N)
├── quiz_attempts (1:N)
├── reviews (1:N)
├── cart_items (1:N)
├── user_achievements (1:N)
├── certificates (1:N)
└── notifications (1:N)

courses
├── sections (1:N)
│   ├── lessons (1:N)
│   └── quizzes (1:1)
│       └── quiz_questions (1:N)
│           └── quiz_question_options (1:N)
├── enrollments (1:N)
├── purchases (1:N)
├── reviews (1:N)
├── cart_items (1:N)
└── certificates (1:N)

achievements
└── user_achievements (1:N)
```

---

## Common Queries

### Get User's Dashboard Data
```sql
SELECT 
    u.full_name,
    u.avatar_url,
    COUNT(DISTINCT e.course_id) as enrolled_courses,
    COUNT(DISTINCT CASE WHEN e.completed_at IS NOT NULL THEN e.course_id END) as completed_courses,
    COUNT(DISTINCT ua.achievement_id) as total_achievements
FROM users u
LEFT JOIN enrollments e ON u.id = e.user_id
LEFT JOIN user_achievements ua ON u.id = ua.user_id
WHERE u.id = ?
GROUP BY u.id;
```

### Get Course with Full Content Structure
```sql
SELECT 
    c.*,
    json_agg(
        json_build_object(
            'id', s.id,
            'title', s.title,
            'order_index', s.order_index,
            'is_free', s.is_free,
            'lessons', (
                SELECT json_agg(
                    json_build_object(
                        'id', l.id,
                        'title', l.title,
                        'duration', l.duration,
                        'content', l.content
                    ) ORDER BY l.order_index
                )
                FROM lessons l
                WHERE l.section_id = s.id
            )
        ) ORDER BY s.order_index
    ) as sections
FROM courses c
JOIN sections s ON c.id = s.course_id
WHERE c.id = ?
GROUP BY c.id;
```

### Check User Access to Section
```sql
SELECT 
    s.is_free,
    EXISTS(
        SELECT 1 FROM enrollments e
        WHERE e.user_id = ? AND e.course_id = s.course_id AND e.is_active = true
    ) as is_enrolled
FROM sections s
WHERE s.id = ?;
```

### Get User's Course Progress
```sql
SELECT 
    c.id,
    c.title,
    e.progress_percentage,
    COUNT(DISTINCT s.id) as total_sections,
    COUNT(DISTINCT sp.section_id) FILTER (WHERE sp.completed = true) as completed_sections
FROM courses c
JOIN enrollments e ON c.id = e.course_id
JOIN sections s ON c.id = s.course_id
LEFT JOIN section_progress sp ON s.id = sp.section_id AND sp.user_id = e.user_id
WHERE e.user_id = ?
GROUP BY c.id, c.title, e.progress_percentage;
```

---

## Implementation Notes

### Security Considerations
1. **Password Storage:** Always hash passwords using bcrypt or Argon2
2. **SQL Injection:** Use parameterized queries/prepared statements
3. **Access Control:** Implement row-level security for sensitive data
4. **Data Encryption:** Encrypt sensitive fields (payment info, PII)
5. **API Rate Limiting:** Prevent abuse of quiz/enrollment endpoints

### Performance Optimization
1. **Indexes:** All foreign keys are indexed
2. **Partitioning:** Consider partitioning `quiz_attempts` and `notifications` by date
3. **Caching:** Cache course content, user profiles, and course stats
4. **Materialized Views:** Consider materializing `course_stats` for better performance
5. **Connection Pooling:** Use connection pooling for database access

### Data Integrity
1. **Foreign Keys:** All relationships use proper foreign key constraints
2. **Cascading Deletes:** Configured for dependent records
3. **Check Constraints:** Ratings limited to 1-5 range
4. **Unique Constraints:** Prevent duplicate enrollments, reviews, etc.
5. **Triggers:** Automatic data consistency maintenance

### Backup Strategy
1. **Daily Backups:** Full database backup daily
2. **Point-in-Time Recovery:** Enable WAL archiving (PostgreSQL)
3. **Test Restores:** Regular backup restoration testing
4. **Replication:** Consider read replicas for scalability

---

## Migration Path

To implement this database:

1. **Create Database:**
   ```bash
   createdb learnhub
   ```

2. **Run Schema:**
   ```bash
   psql learnhub < database-schema.sql
   ```

3. **Seed Initial Data:**
   - Import existing course data
   - Create achievement definitions
   - Set up system notifications

4. **Test Queries:**
   - Verify all relationships
   - Test trigger functionality
   - Validate indexes

5. **Set Up Backups:**
   - Configure automated backups
   - Test restoration procedure

---

## API Integration Points

### Authentication Endpoints
- `POST /auth/register` → Insert into `users`
- `POST /auth/login` → Query `users`, update `last_login`
- `POST /auth/logout` → Session management

### Course Endpoints
- `GET /courses` → Query `courses` with filters
- `GET /courses/:id` → Query `courses` + `sections` + `lessons`
- `POST /courses/:id/enroll` → Insert into `enrollments`, `purchases`

### Progress Endpoints
- `GET /my-courses` → Query `enrollments` for user
- `POST /sections/:id/complete` → Update `section_progress`
- `GET /progress/:courseId` → Query progress tables

### Quiz Endpoints
- `GET /quizzes/:id` → Query quiz with questions and options
- `POST /quizzes/:id/submit` → Insert into `quiz_attempts`, evaluate answers

### Review Endpoints
- `GET /courses/:id/reviews` → Query `reviews` for course
- `POST /courses/:id/review` → Insert/update `reviews`

---

## Sample Achievement Implementations

### First Steps (Complete First Lesson)
```sql
-- Check if user earned "First Steps"
SELECT COUNT(*) FROM lesson_progress 
WHERE user_id = ? AND completed = true
```

### Perfect Score (100% on Quiz)
```sql
-- Check after quiz submission
SELECT score FROM quiz_attempts 
WHERE user_id = ? AND score = 100 
ORDER BY completed_at DESC LIMIT 1
```

### Course Master (Complete a Course)
```sql
-- Check from enrollments
SELECT COUNT(*) FROM enrollments 
WHERE user_id = ? AND progress_percentage = 100
```

---

## Future Enhancements

1. **Discussion Forums:** Add `forum_threads` and `forum_posts` tables
2. **Live Classes:** Add `live_sessions` and `session_attendees` tables
3. **Course Prerequisites:** Add `course_prerequisites` junction table
4. **Learning Paths:** Add `learning_paths` and `path_courses` tables
5. **Assignments:** Add `assignments` and `submissions` tables
6. **Instructor Accounts:** Add `instructors` table with separate permissions
7. **Coupon Codes:** Add `coupons` and `coupon_usage` tables
8. **Wishlist:** Add `wishlist_items` table
9. **Notes:** Add `user_notes` table for lesson annotations
10. **Social Features:** Add friend/follow relationships

---

## Conclusion

This database schema provides a complete foundation for the LearnHub learning platform with:
- ✅ User authentication and profiles
- ✅ Course content management
- ✅ Progress tracking (sections, lessons, quizzes)
- ✅ Purchase and enrollment system
- ✅ Review and rating system
- ✅ Gamification (achievements, certificates)
- ✅ Shopping cart functionality
- ✅ Notification system
- ✅ Optimized queries and indexes
- ✅ Automated data integrity (triggers)
- ✅ Scalable architecture

The schema is normalized, indexed for performance, and includes triggers for automatic data consistency. It's ready to be implemented in PostgreSQL, MySQL, or any compatible relational database.

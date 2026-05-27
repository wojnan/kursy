# LearnHub Database Setup

This directory contains all SQL files needed to set up the LearnHub database with your course data.

## Database Structure

### Tables
- **users** - User accounts and authentication
- **courses** - Course catalog
- **sections** - Course sections (belongs to courses)
- **lessons** - Individual lessons (belongs to sections)
- **lesson_content** - Lesson content blocks
- **section_quizzes** - Quizzes for each section
- **quiz_questions** - Quiz questions
- **final_quizzes** - Final comprehensive quizzes
- **user_purchases** - Track purchased courses
- **user_progress** - Track completed sections and quiz scores
- **cart_items** - Shopping cart

## Setup Instructions

### Option 1: PostgreSQL

1. **Install PostgreSQL**
   ```bash
   # macOS with Homebrew
   brew install postgresql@15
   brew services start postgresql@15

   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

2. **Create Database**
   ```bash
   createdb learnhub
   ```

3. **Run Schema**
   ```bash
   psql learnhub < database/schema.sql
   ```

4. **Load Data**
   ```bash
   psql learnhub < database/seed_data.sql
   ```

5. **Set Environment Variable**
   Create `.env` file in project root:
   ```
   VITE_API_URL=http://localhost:3000/api
   DATABASE_URL=postgresql://username:password@localhost:5432/learnhub
   ```

### Option 2: MySQL

1. **Install MySQL**
   ```bash
   # macOS with Homebrew
   brew install mysql
   brew services start mysql

   # Ubuntu/Debian
   sudo apt-get install mysql-server
   sudo systemctl start mysql
   ```

2. **Create Database**
   ```sql
   mysql -u root -p
   CREATE DATABASE learnhub;
   USE learnhub;
   ```

3. **Run Schema & Data**
   ```bash
   mysql -u root -p learnhub < database/schema.sql
   mysql -u root -p learnhub < database/seed_data.sql
   ```

4. **Set Environment Variable**
   ```
   VITE_API_URL=http://localhost:3000/api
   DATABASE_URL=mysql://username:password@localhost:3306/learnhub
   ```

### Option 3: Supabase (Hosted PostgreSQL)

1. **Create Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for database to be provisioned

2. **Run SQL**
   - Go to SQL Editor in Supabase dashboard
   - Copy and paste contents of `schema.sql`
   - Click "Run"
   - Then copy and paste contents of `seed_data.sql`
   - Click "Run"

3. **Get API URL**
   - Go to Project Settings > API
   - Copy "URL" and "anon public" key

4. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-project.supabase.co/rest/v1
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_KEY=your-anon-key
   ```

## Backend API Required

The frontend expects a REST API at the URL specified in `VITE_API_URL`. You need to create a backend server with these endpoints:

### Required Endpoints

```
GET    /api/courses                          - Get all courses
GET    /api/courses/:id                      - Get course by ID
GET    /api/courses/category/:category       - Get courses by category
GET    /api/courses/search?q=query           - Search courses
GET    /api/courses/:id/sections             - Get course sections with lessons
GET    /api/sections/:id                     - Get section by ID
GET    /api/sections/:id/quiz                - Get section quiz
GET    /api/courses/:id/final-quiz           - Get final quiz

POST   /api/auth/login                       - Login user
POST   /api/auth/signup                      - Register user
POST   /api/auth/logout                      - Logout user

GET    /api/users/:id/purchases              - Get user purchases
POST   /api/purchases                        - Purchase a course

GET    /api/users/:id/progress               - Get user progress
POST   /api/progress/section                 - Mark section complete
POST   /api/progress/quiz                    - Submit quiz results

GET    /api/users/:id/cart                   - Get cart items
POST   /api/cart                             - Add to cart
DELETE /api/cart/:courseId                   - Remove from cart
DELETE /api/users/:id/cart                   - Clear cart
```

## Example Backend Setup (Node.js + Express + PostgreSQL)

Create a simple backend server:

```bash
# In a separate directory
mkdir learnhub-api
cd learnhub-api
npm init -y
npm install express pg dotenv cors bcrypt jsonwebtoken
```

Create `server.js`:
```javascript
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Example endpoint
app.get('/api/courses', async (req, res) => {
  const result = await pool.query('SELECT * FROM courses ORDER BY id');
  res.json(result.rows);
});

// Add more endpoints here...

app.listen(3000, () => {
  console.log('API running on http://localhost:3000');
});
```

## Testing the Database

After setup, verify with:

```sql
-- Check courses
SELECT * FROM courses;

-- Check sections for course 1
SELECT * FROM sections WHERE course_id = 1;

-- Check lessons for section 1
SELECT * FROM lessons WHERE section_id = 1;
```

## Frontend Changes

The frontend has been updated to use the database service layer in `src/app/services/database.ts` instead of hardcoded data files.

All components now fetch data from your API endpoint configured in `.env`.

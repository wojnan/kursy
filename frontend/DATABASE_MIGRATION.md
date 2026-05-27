# LearnHub Database Migration Guide

## What Has Been Created

I've created a complete database structure for your LearnHub application with all your course data. Here's what's ready for you:

### 1. Database Files (in `/database` folder)

- **`schema.sql`** - Complete database schema with 11 tables
  - users, courses, sections, lessons, lesson_content
  - section_quizzes, quiz_questions, final_quizzes
  - user_purchases, user_progress, cart_items

- **`seed_data.sql`** - All INSERT statements with your actual course data
  - All 6 courses (Web Development, Digital Marketing, Design, Data Science, Business, Photography)
  - All sections, lessons, and lesson content for Course 1
  - All quiz questions and final quizzes
  - Ready to import into any PostgreSQL or MySQL database

- **`README.md`** - Complete setup instructions for PostgreSQL, MySQL, or Supabase

- **`example-server.txt`** - Full Node.js/Express backend API server code
  - All required endpoints implemented
  - JWT authentication
  - Database queries for courses, lessons, quizzes, purchases, progress
  - Save as `.js` file and run separately from your React app

### 2. Frontend Service Layer

- **`src/app/services/database.ts`** - Database service with all API calls
  - Functions for courses, lessons, quizzes
  - User authentication
  - Purchase tracking
  - Progress tracking
  - Shopping cart operations

### 3. Configuration Files

- **`.env.example`** - Environment variable template
  - Copy to `.env` and configure your database URL

## How to Use This

### Step 1: Set Up Your Database

Choose one option:

**Option A: Local PostgreSQL**
```bash
createdb learnhub
psql learnhub < database/schema.sql
psql learnhub < database/seed_data.sql
```

**Option B: Supabase (Recommended - Free)**
1. Create account at supabase.com
2. Create new project
3. Go to SQL Editor
4. Paste and run `schema.sql`
5. Paste and run `seed_data.sql`
6. Get your API URL and anon key from Project Settings

### Step 2: Set Up Backend API

You need a backend server to handle database requests. Two options:

**Option A: Use the Example Server**
```bash
# Create a separate backend folder
mkdir learnhub-api
cd learnhub-api

# Copy example-server.txt and rename to server.js
# Install dependencies
npm init -y
npm install express pg dotenv cors bcrypt jsonwebtoken

# Create .env file
echo "DATABASE_URL=postgresql://user:pass@localhost:5432/learnhub" > .env
echo "JWT_SECRET=your-secret-key" >> .env

# Run server
node server.js
```

**Option B: Use Supabase Auto-API**
If using Supabase, you can use their auto-generated REST API:
- No backend server needed
- Configure `VITE_API_URL` to your Supabase REST endpoint
- Supabase handles authentication automatically

### Step 3: Configure Frontend

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:3000/api
# OR for Supabase:
# VITE_API_URL=https://your-project.supabase.co/rest/v1
```

### Step 4: Update Frontend to Use Database

The frontend components currently use hardcoded data from:
- `src/app/data/courses.ts`
- `src/app/data/lessons.ts`
- `src/app/data/quizzes.ts`

You need to update components to use `src/app/services/database.ts` instead.

**Example - Update Courses Page:**

```typescript
// OLD CODE (current):
import { courses } from '../data/courses';

function CoursesPage() {
  const [courses, setCourses] = useState(coursesData);
  // ...
}

// NEW CODE (using database):
import { getAllCourses, Course } from '../services/database';

function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch (error) {
        console.error('Failed to load courses:', error);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  if (loading) return <div>Loading...</div>;
  // ... rest of component
}
```

## Files That Need Updating

These components need to be updated to use the database service:

1. **Course Listing Pages**
   - Use `getAllCourses()` instead of importing courses array
   - Use `getCoursesByCategory()` for filtered lists
   - Use `searchCourses()` for search functionality

2. **Course Player Page**
   - Use `getCourseSections()` to load sections and lessons
   - Use `getSectionQuiz()` to load quizzes
   - Use `getFinalQuiz()` for final course quiz

3. **Authentication Components**
   - Use `login()` and `signup()` functions
   - Store returned token in localStorage
   - Send token with authenticated requests

4. **Purchase Flow**
   - Use `purchaseCourse()` to record purchases
   - Use `getUserPurchases()` to check owned courses
   - Use `hasPurchasedCourse()` for paywall checks

5. **Progress Tracking**
   - Use `markSectionComplete()` when section is finished
   - Use `submitQuizResults()` when quiz is submitted
   - Use `getUserProgress()` to display progress

6. **Shopping Cart**
   - Use `getCartItems()`, `addToCart()`, `removeFromCart()`
   - Replace localStorage cart with database cart

## Testing Your Setup

Once configured, test with:

```bash
# Terminal 1 - Backend API (if using example server)
cd learnhub-api
node server.js

# Terminal 2 - Frontend
cd code
npm install
npm run dev
```

Visit `http://localhost:5173` and verify:
- Courses load from database
- Course details display correctly
- Login/signup works
- Purchasing courses saves to database
- Progress tracking persists

## Summary

**What you have now:**
- ✅ Complete SQL schema
- ✅ All your course data as SQL INSERT statements
- ✅ Database service layer (TypeScript)
- ✅ Example backend server code
- ✅ Configuration files

**What you need to do:**
1. Set up database (PostgreSQL, MySQL, or Supabase)
2. Run schema.sql and seed_data.sql
3. Set up backend API server (or use Supabase)
4. Configure .env with your database URL
5. Update frontend components to use database service
6. Test everything works

All data is now separated from your frontend code and lives in a proper database!

-- LearnHub Seed Data
-- Complete data dump from frontend

-- ============================================
-- COURSES
-- ============================================

INSERT INTO courses (id, title, description, instructor, price, rating, students, duration, level, category, image, lessons_count, last_updated) VALUES
(1, 'Complete Web Development Bootcamp', 'Master web development from scratch. Learn HTML, CSS, JavaScript, React, Node.js, and more in this comprehensive course.', 'Sarah Johnson', 89.99, 4.8, 12543, '42 hours', 'Beginner', 'Development', 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGNvZGluZ3xlbnwxfHx8fDE3NzQxNDgwODN8MA&ixlib=rb-4.1.0&q=80&w=1080', 156, 'March 2026'),
(2, 'Digital Marketing Masterclass', 'Learn SEO, social media marketing, content marketing, email marketing, and analytics to grow your business online.', 'Michael Chen', 79.99, 4.6, 8234, '28 hours', 'Intermediate', 'Marketing', 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWFya2V0aW5nJTIwc3RyYXRlZ3l8ZW58MXx8fHwxNzc0MTU2MzMzfDA&ixlib=rb-4.1.0&q=80&w=1080', 98, 'February 2026'),
(3, 'Graphic Design for Beginners', 'Master the fundamentals of graphic design including typography, color theory, layout, and design software.', 'Emma Davis', 69.99, 4.9, 15672, '35 hours', 'Beginner', 'Design', 'https://images.unsplash.com/photo-1689267166689-795f4f536819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwZGVzaWduJTIwY3JlYXRpdmV8ZW58MXx8fHwxNzc0MTg1NjI5fDA&ixlib=rb-4.1.0&q=80&w=1080', 124, 'March 2026'),
(4, 'Data Science & Machine Learning', 'Learn Python, statistics, machine learning algorithms, and data visualization to become a data scientist.', 'Dr. James Wilson', 99.99, 4.7, 9876, '58 hours', 'Advanced', 'Data Science', 'https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMGFuYWx5dGljc3xlbnwxfHx8fDE3NzQxNjI5MzB8MA&ixlib=rb-4.1.0&q=80&w=1080', 187, 'January 2026'),
(5, 'Business Finance Essentials', 'Understand financial statements, budgeting, financial planning, and investment strategies for business success.', 'Robert Martinez', 74.99, 4.5, 6543, '24 hours', 'Beginner', 'Business', 'https://images.unsplash.com/photo-1770271359908-a0e5e2214f8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGZpbmFuY2UlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzc0MDc2NTk2fDA&ixlib=rb-4.1.0&q=80&w=1080', 84, 'February 2026'),
(6, 'Professional Photography Course', 'Learn camera settings, composition, lighting, and post-processing to take stunning professional photographs.', 'Lisa Anderson', 84.99, 4.8, 11234, '32 hours', 'Intermediate', 'Photography', 'https://images.unsplash.com/photo-1752649938189-25651a4040fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeSUyMGNhbWVyYSUyMGFydHxlbnwxfHx8fDE3NzQxODU2MzB8MA&ixlib=rb-4.1.0&q=80&w=1080', 112, 'March 2026');

-- ============================================
-- SECTIONS FOR COURSE 1 (Web Development)
-- ============================================

INSERT INTO sections (id, course_id, title, order_index) VALUES
(1, 1, 'Getting Started', 1),
(2, 1, 'CSS Fundamentals', 2),
(3, 1, 'JavaScript Basics', 3),
(4, 1, 'Building Your First Project', 4);

-- ============================================
-- LESSONS FOR SECTION 1 (Getting Started)
-- ============================================

INSERT INTO lessons (id, section_id, title, duration, order_index) VALUES
(1, 1, 'Introduction to Web Development', '12:30', 1),
(2, 1, 'Setting Up Your Development Environment', '18:45', 2),
(3, 1, 'Understanding HTML Basics', '25:15', 3),
(4, 1, 'Your First Web Page', '20:00', 4);

-- Lesson 1 Content
INSERT INTO lesson_content (lesson_id, content_type, content_value, order_index) VALUES
(1, 'heading', 'Welcome to Complete Web Development Bootcamp!', 1),
(1, 'text', 'In this comprehensive course, you will learn everything you need to become a professional web developer. We will cover both front-end and back-end development, starting from the basics and progressing to advanced topics.', 2),
(1, 'heading', 'What is Web Development?', 3),
(1, 'text', 'Web development is the process of building and maintaining websites and web applications. It involves several different aspects:', 4),
(1, 'list', '["Front-end Development: Creating the visual and interactive parts of websites that users see","Back-end Development: Building the server-side logic and database management","Full-stack Development: Combining both front-end and back-end skills","DevOps: Managing deployment, hosting, and maintenance"]', 5),
(1, 'heading', 'Course Prerequisites', 6),
(1, 'text', 'This course is designed for complete beginners. You don''t need any prior programming experience. All you need is:', 7),
(1, 'list', '["A computer with internet connection","Willingness to learn and practice","Dedication to complete the exercises and projects","A code editor (we''ll help you set this up in the next lesson)"]', 8),
(1, 'text', 'By the end of this course, you''ll be able to build complete, professional websites from scratch!', 9);

-- Lesson 2 Content
INSERT INTO lesson_content (lesson_id, content_type, content_value, order_index) VALUES
(2, 'heading', 'Setting Up Your Workspace', 1),
(2, 'text', 'Before we start coding, we need to set up our development environment. This lesson will guide you through installing all the necessary tools.', 2),
(2, 'heading', 'Required Software', 3),
(2, 'list', '["Visual Studio Code - A free, powerful code editor","Node.js - JavaScript runtime for running development tools","Git - Version control system for tracking your code changes","A modern web browser - Chrome, Firefox, or Edge recommended"]', 4),
(2, 'heading', 'Installing Visual Studio Code', 5),
(2, 'text', 'Visual Studio Code (VS Code) is one of the most popular code editors for web development. Here''s how to install it:', 6),
(2, 'list', '["Visit code.visualstudio.com","Download the version for your operating system","Run the installer and follow the setup wizard","Launch VS Code once installation is complete"]', 7),
(2, 'heading', 'Essential VS Code Extensions', 8),
(2, 'text', 'Install these extensions to enhance your development experience:', 9),
(2, 'list', '["Live Server - Launch a local development server with live reload","Prettier - Code formatter for consistent styling","ESLint - JavaScript code quality tool","Auto Rename Tag - Automatically rename paired HTML tags"]', 10),
(2, 'text', 'Once you have everything installed, you''re ready to start coding! In the next lesson, we''ll create your first web page.', 11);

-- Lesson 3 Content
INSERT INTO lesson_content (lesson_id, content_type, content_value, order_index) VALUES
(3, 'heading', 'Introduction to HTML', 1),
(3, 'text', 'HTML (HyperText Markup Language) is the foundation of all web pages. It provides the structure and content of websites.', 2),
(3, 'heading', 'What is HTML?', 3),
(3, 'text', 'HTML uses tags to mark up content and tell the browser how to display it. Tags are enclosed in angle brackets, like <tag>.', 4),
(3, 'heading', 'Basic HTML Structure', 5),
(3, 'code', '<!DOCTYPE html>
<html>
  <head>
    <title>My First Web Page</title>
  </head>
  <body>
    <h1>Hello World!</h1>
    <p>This is my first paragraph.</p>
  </body>
</html>', 6),
(3, 'heading', 'Common HTML Tags', 7),
(3, 'list', '["<h1> to <h6> - Headings, from largest to smallest","<p> - Paragraphs of text","<a> - Links to other pages","<img> - Images","<div> - Container for other elements","<ul> and <li> - Unordered lists","<ol> and <li> - Ordered lists"]', 8),
(3, 'heading', 'Practice Exercise', 9),
(3, 'text', 'Create a simple HTML page about yourself with:', 10),
(3, 'list', '["A heading with your name","A paragraph describing your interests","A list of your hobbies","An image (you can use a placeholder)"]', 11);

-- Lesson 4 Content
INSERT INTO lesson_content (lesson_id, content_type, content_value, order_index) VALUES
(4, 'heading', 'Creating Your First Complete Web Page', 1),
(4, 'text', 'Now that you understand the basics of HTML, let''s create a complete web page from scratch.', 2),
(4, 'heading', 'Step 1: Create a New File', 3),
(4, 'list', '["Open Visual Studio Code","Create a new file called index.html","Save it in a folder called \"my-first-website\""]', 4),
(4, 'heading', 'Step 2: Add the HTML Structure', 5),
(4, 'text', 'Type the following code into your index.html file:', 6),
(4, 'code', '<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to My Website</title>
  </head>
  <body>
    <header>
      <h1>Welcome to My Website</h1>
      <nav>
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>

    <main>
      <section id="about">
        <h2>About Me</h2>
        <p>I''m learning web development!</p>
      </section>
    </main>

    <footer>
      <p>&copy; 2024 My Website</p>
    </footer>
  </body>
</html>', 7),
(4, 'heading', 'Step 3: View Your Page', 8),
(4, 'list', '["Right-click on index.html in VS Code","Select \"Open with Live Server\"","Your page will open in the browser!","Any changes you make will automatically refresh"]', 9),
(4, 'text', 'Congratulations! You''ve created your first web page. In the next section, we''ll learn how to style it with CSS.', 10);

-- ============================================
-- LESSONS FOR SECTION 2 (CSS Fundamentals)
-- ============================================

INSERT INTO lessons (id, section_id, title, duration, order_index) VALUES
(5, 2, 'Introduction to CSS', '22:30', 1),
(6, 2, 'Colors and Typography', '19:45', 2),
(7, 2, 'The Box Model', '28:00', 3),
(8, 2, 'Layouts with Flexbox', '32:15', 4);

-- Lesson 5 Content (Introduction to CSS)
INSERT INTO lesson_content (lesson_id, content_type, content_value, order_index) VALUES
(5, 'heading', 'What is CSS?', 1),
(5, 'text', 'CSS (Cascading Style Sheets) is used to style and layout web pages. While HTML provides the structure, CSS makes it look beautiful.', 2),
(5, 'heading', 'How CSS Works', 3),
(5, 'text', 'CSS works by selecting HTML elements and applying styles to them. A CSS rule consists of a selector and a declaration block:', 4),
(5, 'code', 'selector {
  property: value;
}', 5),
(5, 'heading', 'Three Ways to Add CSS', 6),
(5, 'list', '["Inline CSS: Using the style attribute directly on HTML elements","Internal CSS: Using a <style> tag in the <head> section","External CSS: Linking to a separate .css file (recommended)"]', 7),
(5, 'heading', 'Basic CSS Properties', 8),
(5, 'text', 'Here are some fundamental CSS properties you''ll use frequently:', 9),
(5, 'list', '["color - Text color","background-color - Background color","font-size - Size of text","font-family - Type of font","margin - Space outside an element","padding - Space inside an element","border - Border around an element"]', 10),
(5, 'heading', 'Example', 11),
(5, 'code', 'h1 {
  color: #4F772D;
  font-size: 36px;
  text-align: center;
}

p {
  color: #333;
  font-size: 16px;
  line-height: 1.6;
}', 12);

-- Lesson 6 Content (Colors and Typography)
INSERT INTO lesson_content (lesson_id, content_type, content_value, order_index) VALUES
(6, 'heading', 'Working with Colors in CSS', 1),
(6, 'text', 'Colors are one of the most important aspects of web design. CSS provides several ways to specify colors.', 2),
(6, 'heading', 'Color Formats', 3),
(6, 'list', '["Named colors: red, blue, green, etc.","Hexadecimal: #4F772D, #FF5733","RGB: rgb(79, 119, 45)","RGBA: rgba(79, 119, 45, 0.8) - includes transparency","HSL: hsl(88, 45%, 32%)"]', 4),
(6, 'heading', 'Typography Properties', 5),
(6, 'text', 'Typography controls how text appears on your website:', 6),
(6, 'list', '["font-family - Choose the typeface","font-size - Set text size","font-weight - Control boldness (normal, bold, 100-900)","font-style - Italic or normal","line-height - Space between lines","text-align - Alignment (left, right, center, justify)","text-decoration - Underline, strikethrough, etc.","letter-spacing - Space between letters"]', 7),
(6, 'heading', 'Web-Safe Fonts', 8),
(6, 'text', 'Some fonts that work across all browsers:', 9),
(6, 'code', 'body {
  font-family: Arial, Helvetica, sans-serif;
}

h1 {
  font-family: Georgia, serif;
  font-weight: bold;
  font-size: 2.5em;
}', 10);

-- Lesson 7 Content (The Box Model)
INSERT INTO lesson_content (lesson_id, content_type, content_value, order_index) VALUES
(7, 'heading', 'Understanding the CSS Box Model', 1),
(7, 'text', 'Every HTML element is essentially a rectangular box. The CSS box model describes how these boxes are sized and spaced.', 2),
(7, 'heading', 'Box Model Components', 3),
(7, 'list', '["Content - The actual content of the element","Padding - Space between content and border","Border - A line around the padding","Margin - Space outside the border"]', 4),
(7, 'heading', 'Setting Box Model Properties', 5),
(7, 'code', '.box {
  width: 300px;
  padding: 20px;
  border: 2px solid #4F772D;
  margin: 10px;
}', 6),
(7, 'heading', 'Shorthand Properties', 7),
(7, 'text', 'You can set all four sides at once:', 8),
(7, 'code', '/* All sides */
margin: 20px;

/* Top/Bottom, Left/Right */
margin: 20px 40px;

/* Top, Right, Bottom, Left */
margin: 10px 20px 15px 30px;

/* Individual sides */
margin-top: 10px;
margin-right: 20px;', 9),
(7, 'heading', 'Box-Sizing Property', 10),
(7, 'text', 'The box-sizing property controls how width and height are calculated:', 11),
(7, 'code', '/* Makes width/height include padding and border */
* {
  box-sizing: border-box;
}', 12);

-- Lesson 8 Content (Layouts with Flexbox)
INSERT INTO lesson_content (lesson_id, content_type, content_value, order_index) VALUES
(8, 'heading', 'Introduction to Flexbox', 1),
(8, 'text', 'Flexbox is a powerful layout system that makes it easy to create flexible, responsive layouts without using floats or positioning.', 2),
(8, 'heading', 'Creating a Flex Container', 3),
(8, 'text', 'To use flexbox, you need to create a flex container:', 4),
(8, 'code', '.container {
  display: flex;
}', 5),
(8, 'heading', 'Main Flexbox Properties', 6),
(8, 'list', '["flex-direction - Set direction (row, column)","justify-content - Align along main axis (center, space-between, etc.)","align-items - Align along cross axis","flex-wrap - Allow items to wrap to new line","gap - Space between flex items"]', 7),
(8, 'heading', 'Practical Example', 8),
(8, 'code', '.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #4F772D;
}

.nav-links {
  display: flex;
  gap: 20px;
}', 9),
(8, 'text', 'Flexbox is perfect for navigation bars, card layouts, centering content, and creating responsive designs!', 10);

-- ============================================
-- LESSONS FOR SECTION 3 (JavaScript Basics)
-- ============================================

INSERT INTO lessons (id, section_id, title, duration, order_index) VALUES
(9, 3, 'Introduction to JavaScript', '24:30', 1),
(10, 3, 'Variables and Data Types', '26:45', 2),
(11, 3, 'Functions and Events', '30:00', 3),
(12, 3, 'DOM Manipulation', '28:30', 4);

-- Lesson 9 Content (Introduction to JavaScript)
INSERT INTO lesson_content (lesson_id, content_type, content_value, order_index) VALUES
(9, 'heading', 'What is JavaScript?', 1),
(9, 'text', 'JavaScript is a programming language that adds interactivity to websites. While HTML structures the page and CSS styles it, JavaScript makes it dynamic and interactive.', 2),
(9, 'heading', 'What Can JavaScript Do?', 3),
(9, 'list', '["Respond to user actions (clicks, typing, scrolling)","Manipulate HTML and CSS dynamically","Validate forms before submission","Create animations and visual effects","Fetch data from servers without refreshing the page","Store data in the browser"]', 4),
(9, 'heading', 'Adding JavaScript to Your Page', 5),
(9, 'code', '<!-- Internal JavaScript -->
<script>
  console.log("Hello, JavaScript!");
</script>

<!-- External JavaScript (recommended) -->
<script src="script.js"></script>', 6),
(9, 'heading', 'Your First JavaScript Code', 7),
(9, 'text', 'Let''s write some basic JavaScript:', 8),
(9, 'code', '// Display a message in the console
console.log("Welcome to JavaScript!");

// Show an alert box
alert("Hello, World!");

// Change HTML content
document.getElementById("demo").innerHTML = "JavaScript is fun!";', 9);

-- Lesson 10 Content (Variables and Data Types)
INSERT INTO lesson_content (lesson_id, content_type, content_value, order_index) VALUES
(10, 'heading', 'JavaScript Variables', 1),
(10, 'text', 'Variables are containers for storing data. In modern JavaScript, we use let and const to declare variables.', 2),
(10, 'heading', 'Declaring Variables', 3),
(10, 'code', '// Use const for values that won''t change
const courseName = "Web Development";
const price = 49.99;

// Use let for values that will change
let studentCount = 0;
let isEnrolled = false;', 4),
(10, 'heading', 'Data Types in JavaScript', 5),
(10, 'list', '["String - Text data: \"hello\", ''world''","Number - Numeric values: 42, 3.14","Boolean - True or false values","Array - List of values: [1, 2, 3]","Object - Key-value pairs: {name: \"John\", age: 25}","Null - Intentionally empty value","Undefined - Variable declared but not assigned"]', 6),
(10, 'heading', 'Working with Strings', 7),
(10, 'code', 'const firstName = "John";
const lastName = "Doe";

// String concatenation
const fullName = firstName + " " + lastName;

// Template literals (modern way)
const greeting = `Hello, ${fullName}!`;', 8),
(10, 'heading', 'Working with Numbers', 9),
(10, 'code', 'const price = 49.99;
const quantity = 3;
const total = price * quantity;

console.log(`Total: $${total}`); // Total: $149.97', 10);

-- Lesson 11 Content (Functions and Events)
INSERT INTO lesson_content (lesson_id, content_type, content_value, order_index) VALUES
(11, 'heading', 'JavaScript Functions', 1),
(11, 'text', 'Functions are reusable blocks of code that perform specific tasks. They help organize your code and avoid repetition.', 2),
(11, 'heading', 'Creating Functions', 3),
(11, 'code', '// Function declaration
function greetUser(name) {
  return `Hello, ${name}!`;
}

// Arrow function (modern syntax)
const calculateTotal = (price, quantity) => {
  return price * quantity;
};

// Calling functions
const message = greetUser("Sarah");
const total = calculateTotal(29.99, 2);', 4),
(11, 'heading', 'Event Handling', 5),
(11, 'text', 'Events allow you to respond to user actions like clicks, typing, or hovering.', 6),
(11, 'code', '// HTML button
// <button id="myButton">Click me!</button>

// JavaScript
const button = document.getElementById("myButton");

button.addEventListener("click", function() {
  alert("Button was clicked!");
});

// With arrow function
button.addEventListener("click", () => {
  console.log("Button clicked!");
});', 7),
(11, 'heading', 'Common Events', 8),
(11, 'list', '["click - Mouse click","submit - Form submission","keypress - Keyboard key pressed","mouseover - Mouse enters element","change - Form input changes","load - Page finished loading"]', 9);

-- Lesson 12 Content (DOM Manipulation)
INSERT INTO lesson_content (lesson_id, content_type, content_value, order_index) VALUES
(12, 'heading', 'The Document Object Model (DOM)', 1),
(12, 'text', 'The DOM is a programming interface for HTML documents. It represents the page as a tree of objects that JavaScript can manipulate.', 2),
(12, 'heading', 'Selecting Elements', 3),
(12, 'code', '// Select by ID
const header = document.getElementById("header");

// Select by class
const buttons = document.getElementsByClassName("btn");

// Select with CSS selector (recommended)
const firstButton = document.querySelector(".btn");
const allButtons = document.querySelectorAll(".btn");', 4),
(12, 'heading', 'Modifying Elements', 5),
(12, 'code', '// Change text content
element.textContent = "New text";

// Change HTML content
element.innerHTML = "<strong>Bold text</strong>";

// Change styles
element.style.color = "#4F772D";
element.style.fontSize = "20px";

// Add/remove CSS classes
element.classList.add("active");
element.classList.remove("hidden");
element.classList.toggle("selected");', 6),
(12, 'heading', 'Creating New Elements', 7),
(12, 'code', '// Create new element
const newDiv = document.createElement("div");
newDiv.textContent = "I''m a new div!";
newDiv.classList.add("card");

// Add to page
document.body.appendChild(newDiv);', 8),
(12, 'text', 'DOM manipulation is at the heart of making interactive web pages. Practice these techniques to build dynamic user interfaces!', 9);

-- ============================================
-- LESSONS FOR SECTION 4 (Building Your First Project)
-- ============================================

INSERT INTO lessons (id, section_id, title, duration, order_index) VALUES
(13, 4, 'Project Planning', '15:30', 1),
(14, 4, 'Building the HTML Structure', '20:00', 2),
(15, 4, 'Styling with CSS', '25:00', 3),
(16, 4, 'Adding JavaScript Functionality', '35:00', 4);

-- Lesson 13 Content (Project Planning)
INSERT INTO lesson_content (lesson_id, content_type, content_value, order_index) VALUES
(13, 'heading', 'Planning Your Web Project', 1),
(13, 'text', 'Before writing any code, it''s important to plan your project. Good planning saves time and prevents issues later.', 2),
(13, 'heading', 'Steps to Plan a Project', 3),
(13, 'list', '["1. Define the project goals - What should the website do?","2. Identify your target audience - Who will use it?","3. Create wireframes - Sketch the layout","4. List required features - What functionality is needed?","5. Plan the file structure - Organize your code","6. Break into tasks - Create a step-by-step checklist"]', 4),
(13, 'heading', 'Our Project: Interactive To-Do List', 5),
(13, 'text', 'We''ll build a fully functional to-do list application with these features:', 6),
(13, 'list', '["Add new tasks","Mark tasks as complete","Delete tasks","Filter tasks (all, active, completed)","Store tasks in browser (persist on refresh)","Responsive design for mobile and desktop"]', 7),
(13, 'heading', 'File Structure', 8),
(13, 'code', 'todo-app/
├── index.html
├── styles.css
└── script.js', 9);

-- Lesson 14 Content (Building the HTML Structure)
INSERT INTO lesson_content (lesson_id, content_type, content_value, order_index) VALUES
(14, 'heading', 'Creating the HTML', 1),
(14, 'text', 'Let''s build the HTML structure for our to-do list application.', 2),
(14, 'code', '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My To-Do List</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>My Tasks</h1>

    <div class="input-section">
      <input
        type="text"
        id="taskInput"
        placeholder="Add a new task..."
      >
      <button id="addBtn">Add Task</button>
    </div>

    <div class="filters">
      <button class="filter-btn active" data-filter="all">All</button>
      <button class="filter-btn" data-filter="active">Active</button>
      <button class="filter-btn" data-filter="completed">Completed</button>
    </div>

    <ul id="taskList"></ul>
  </div>

  <script src="script.js"></script>
</body>
</html>', 3),
(14, 'heading', 'Understanding the Structure', 4),
(14, 'list', '["Container div - Holds all content","Input section - For adding new tasks","Filters - Buttons to filter task display","Task list - Empty ul that will be populated with JavaScript"]', 5);

-- Lesson 15 Content (Styling with CSS)
INSERT INTO lesson_content (lesson_id, content_type, content_value, order_index) VALUES
(15, 'heading', 'Adding Styles', 1),
(15, 'text', 'Now let''s make our to-do list look beautiful with CSS.', 2),
(15, 'code', '* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', sans-serif;
  background: linear-gradient(135deg, #4F772D, #3d5f23);
  min-height: 100vh;
  padding: 40px 20px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
}

h1 {
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.input-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input[type="text"] {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
}

button {
  padding: 12px 24px;
  background: #4F772D;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #3d5f23;
}', 3),
(15, 'text', 'This creates a modern, clean interface with a beautiful gradient background and smooth interactions.', 4);

-- Lesson 16 Content (Adding JavaScript Functionality)
INSERT INTO lesson_content (lesson_id, content_type, content_value, order_index) VALUES
(16, 'heading', 'Making It Interactive', 1),
(16, 'text', 'Now for the fun part - adding JavaScript to make our to-do list actually work!', 2),
(16, 'code', '// Get elements
const taskInput = document.getElementById(''taskInput'');
const addBtn = document.getElementById(''addBtn'');
const taskList = document.getElementById(''taskList'');

// Array to store tasks
let tasks = [];

// Add task function
function addTask() {
  const taskText = taskInput.value.trim();

  if (taskText === '''') return;

  const task = {
    id: Date.now(),
    text: taskText,
    completed: false
  };

  tasks.push(task);
  renderTasks();
  taskInput.value = '''';
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = '''';

  tasks.forEach(task => {
    const li = document.createElement(''li'');
    li.className = task.completed ? ''completed'' : '''';
    li.innerHTML = `
      <input type="checkbox" ${task.completed ? ''checked'' : ''''}>
      <span>${task.text}</span>
      <button class="delete-btn">Delete</button>
    `;

    taskList.appendChild(li);
  });
}

// Event listeners
addBtn.addEventListener(''click'', addTask);
taskInput.addEventListener(''keypress'', (e) => {
  if (e.key === ''Enter'') addTask();
});', 3),
(16, 'heading', 'What We Accomplished', 4),
(16, 'list', '["Created a functional to-do list application","Used HTML for structure","Applied CSS for beautiful styling","Added JavaScript for interactivity","Implemented CRUD operations (Create, Read, Update, Delete)","Built a complete project from scratch!"]', 5),
(16, 'text', 'Congratulations! You''ve completed your first full web development project. This demonstrates all the core concepts you''ve learned.', 6);

-- ============================================
-- SECTIONS FOR COURSE 2 (Digital Marketing)
-- ============================================

INSERT INTO sections (id, course_id, title, order_index) VALUES
(5, 2, 'Digital Marketing Foundations', 1);

INSERT INTO lessons (id, section_id, title, duration, order_index) VALUES
(17, 5, 'Introduction to Digital Marketing', '15:00', 1);

INSERT INTO lesson_content (lesson_id, content_type, content_value, order_index) VALUES
(17, 'heading', 'Welcome to Digital Marketing Mastery', 1),
(17, 'text', 'Digital marketing is the practice of promoting products or services using digital channels such as websites, social media, email, and search engines.', 2),
(17, 'heading', 'Why Digital Marketing Matters', 3),
(17, 'list', '["Reach billions of people worldwide","Target specific audiences with precision","Measure results in real-time","Cost-effective compared to traditional marketing","Build lasting relationships with customers"]', 4),
(17, 'heading', 'Digital Marketing Channels', 5),
(17, 'list', '["Search Engine Optimization (SEO)","Social Media Marketing","Email Marketing","Content Marketing","Pay-Per-Click Advertising (PPC)","Influencer Marketing"]', 6),
(17, 'text', 'In this course, you''ll master all these channels and learn how to create integrated marketing campaigns that drive real results.', 7);

-- ============================================
-- SECTION QUIZZES FOR COURSE 1
-- ============================================

INSERT INTO section_quizzes (id, section_id, section_title) VALUES
(1, 1, 'Getting Started'),
(2, 2, 'CSS Fundamentals'),
(3, 3, 'JavaScript Basics'),
(4, 4, 'Building Your First Project');

-- Quiz Questions for Section 1 (Getting Started)
INSERT INTO quiz_questions (section_quiz_id, question, option_1, option_2, option_3, option_4, correct_answer, order_index) VALUES
(1, 'What is the primary purpose of setting up your development environment?', 'To make your computer look professional', 'To ensure you have all necessary tools and dependencies installed', 'To slow down your learning process', 'To impress other developers', 1, 1),
(1, 'Which of the following is NOT a recommended course resource?', 'Official documentation', 'Practice exercises', 'Random internet forums', 'Video lectures', 2, 2),
(1, 'How often should you review course materials to maximize learning?', 'Only once at the end', 'Regularly and consistently', 'Never, just watch once', 'Only when confused', 1, 3),
(1, 'What is the best approach when you encounter a difficult concept?', 'Skip it and move on', 'Give up completely', 'Take time to understand, practice, and ask questions', 'Memorize without understanding', 2, 4);

-- Quiz Questions for Section 2 (CSS Fundamentals)
INSERT INTO quiz_questions (section_quiz_id, question, option_1, option_2, option_3, option_4, correct_answer, order_index) VALUES
(2, 'Why are fundamental concepts important in any learning path?', 'They are not important', 'They provide the foundation for advanced topics', 'They are only for beginners', 'They waste time', 1, 1),
(2, 'What is the best way to reinforce fundamental concepts?', 'Reading alone', 'Watching videos only', 'Hands-on practice and repetition', 'Memorizing definitions', 2, 2),
(2, 'Which learning approach is most effective for mastering fundamentals?', 'Passive listening', 'Active practice and application', 'Speed reading', 'Multitasking while learning', 1, 3),
(2, 'What should you do if you don''t understand a fundamental concept?', 'Move to advanced topics anyway', 'Pretend you understand', 'Review and seek clarification before moving forward', 'Ignore it completely', 2, 4),
(2, 'How do best practices benefit your learning?', 'They don''t matter for beginners', 'They help you develop good habits from the start', 'They are only for experts', 'They slow down development', 1, 5);

-- Quiz Questions for Section 3 (JavaScript Basics)
INSERT INTO quiz_questions (section_quiz_id, question, option_1, option_2, option_3, option_4, correct_answer, order_index) VALUES
(3, 'What distinguishes advanced topics from fundamentals?', 'They are easier to learn', 'They build upon and extend fundamental concepts', 'They are completely unrelated to basics', 'They require no prior knowledge', 1, 1),
(3, 'Why are real-world applications important in advanced learning?', 'They are not important', 'They help connect theory to practical use', 'They are only for entertainment', 'They complicate learning', 1, 2),
(3, 'What is the purpose of studying case studies?', 'To waste time', 'To learn from real-world examples and solutions', 'To make courses longer', 'To confuse students', 1, 3),
(3, 'How should you approach optimization techniques?', 'Ignore them completely', 'Apply them randomly', 'Understand when and why to use them', 'Use them everywhere without thinking', 2, 4);

-- Quiz Questions for Section 4 (Building Your First Project)
INSERT INTO quiz_questions (section_quiz_id, question, option_1, option_2, option_3, option_4, correct_answer, order_index) VALUES
(4, 'What is the main purpose of a final project?', 'To stress students', 'To apply everything learned in a comprehensive way', 'To fill time', 'To grade students unfairly', 1, 1),
(4, 'Why is project planning important?', 'It''s not important', 'It helps organize work and set clear goals', 'It''s just paperwork', 'It wastes development time', 1, 2),
(4, 'What should be your approach to testing and debugging?', 'Skip testing entirely', 'Test only at the end', 'Test continuously throughout development', 'Let users find the bugs', 2, 3),
(4, 'How important is the final presentation of your project?', 'Not important at all', 'Very important - it showcases your work and communication skills', 'Only the code matters', 'Presentation is everything, code doesn''t matter', 1, 4),
(4, 'What is the best mindset for completing a final project?', 'Rush to finish quickly', 'Aim for perfection only', 'Balance quality, learning, and timely completion', 'Copy someone else''s work', 2, 5);

-- ============================================
-- FINAL QUIZ FOR COURSE 1
-- ============================================

INSERT INTO final_quizzes (id, course_id) VALUES (1, 1);

INSERT INTO quiz_questions (final_quiz_id, question, option_1, option_2, option_3, option_4, correct_answer, order_index) VALUES
(1, 'What is the most important factor for success in web development?', 'Memorizing all syntax', 'Continuous practice and learning', 'Expensive equipment', 'Working alone', 1, 1),
(1, 'Which approach best describes effective problem-solving in development?', 'Giving up when stuck', 'Breaking down problems and testing solutions systematically', 'Copying code without understanding', 'Avoiding difficult challenges', 1, 2),
(1, 'Why is understanding fundamentals crucial before moving to advanced topics?', 'It''s not crucial', 'Advanced topics build on fundamental knowledge', 'Fundamentals and advanced topics are unrelated', 'You can skip fundamentals', 1, 3),
(1, 'What is the value of building projects while learning?', 'Projects are unnecessary', 'They help apply knowledge and build portfolio', 'They only waste time', 'They are only for advanced learners', 1, 4),
(1, 'How should you approach learning new technologies?', 'Learn everything at once', 'Never learn anything new', 'Start with fundamentals and build gradually', 'Only watch tutorials', 2, 5),
(1, 'What role does documentation play in development?', 'Documentation is useless', 'It''s an essential resource for learning and reference', 'Only beginners need documentation', 'Documentation slows you down', 1, 6),
(1, 'Why is code testing important?', 'It''s not important', 'It ensures code works correctly and catches bugs early', 'It''s only for large companies', 'It makes development slower', 1, 7),
(1, 'What is the best way to stay current in web development?', 'Stop learning after one course', 'Continuously learn, read, and practice new technologies', 'Ignore industry changes', 'Only use old technologies', 1, 8);

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
            { type: 'text', value: 'In this comprehensive course, you will learn everything you need to become a professional web developer. We will cover both front-end and back-end development, starting from the basics and progressing to advanced topics.' },
            { type: 'heading', value: 'What is Web Development?' },
            { type: 'text', value: 'Web development is the process of building and maintaining websites and web applications. It involves several different aspects:' },
            { type: 'list', value: [
              'Front-end Development: Creating the visual and interactive parts of websites that users see',
              'Back-end Development: Building the server-side logic and database management',
              'Full-stack Development: Combining both front-end and back-end skills',
              'DevOps: Managing deployment, hosting, and maintenance'
            ]},
            { type: 'heading', value: 'Course Prerequisites' },
            { type: 'text', value: 'This course is designed for complete beginners. You don\'t need any prior programming experience. All you need is:' },
            { type: 'list', value: [
              'A computer with internet connection',
              'Willingness to learn and practice',
              'Dedication to complete the exercises and projects',
              'A code editor (we\'ll help you set this up in the next lesson)'
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
            { type: 'text', value: 'Before we start coding, we need to set up our development environment. This lesson will guide you through installing all the necessary tools.' },
            { type: 'heading', value: 'Required Software' },
            { type: 'list', value: [
              'Visual Studio Code - A free, powerful code editor',
              'Node.js - JavaScript runtime for running development tools',
              'Git - Version control system for tracking your code changes',
              'A modern web browser - Chrome, Firefox, or Edge recommended'
            ]},
            { type: 'heading', value: 'Installing Visual Studio Code' },
            { type: 'text', value: 'Visual Studio Code (VS Code) is one of the most popular code editors for web development. Here\'s how to install it:' },
            { type: 'list', value: [
              'Visit code.visualstudio.com',
              'Download the version for your operating system',
              'Run the installer and follow the setup wizard',
              'Launch VS Code once installation is complete'
            ]},
            { type: 'heading', value: 'Essential VS Code Extensions' },
            { type: 'text', value: 'Install these extensions to enhance your development experience:' },
            { type: 'list', value: [
              'Live Server - Launch a local development server with live reload',
              'Prettier - Code formatter for consistent styling',
              'ESLint - JavaScript code quality tool',
              'Auto Rename Tag - Automatically rename paired HTML tags'
            ]},
            { type: 'text', value: 'Once you have everything installed, you\'re ready to start coding! In the next lesson, we\'ll create your first web page.' }
          ]
        },
        {
          id: 'lesson-1-3',
          title: 'Understanding HTML Basics',
          duration: '25:15',
          content: [
            { type: 'heading', value: 'Introduction to HTML' },
            { type: 'text', value: 'HTML (HyperText Markup Language) is the foundation of all web pages. It provides the structure and content of websites.' },
            { type: 'heading', value: 'What is HTML?' },
            { type: 'text', value: 'HTML uses tags to mark up content and tell the browser how to display it. Tags are enclosed in angle brackets, like <tag>.' },
            { type: 'heading', value: 'Basic HTML Structure' },
            { type: 'code', value: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>My First Web Page</title>\n  </head>\n  <body>\n    <h1>Hello World!</h1>\n    <p>This is my first paragraph.</p>\n  </body>\n</html>' },
            { type: 'heading', value: 'Common HTML Tags' },
            { type: 'list', value: [
              '<h1> to <h6> - Headings, from largest to smallest',
              '<p> - Paragraphs of text',
              '<a> - Links to other pages',
              '<img> - Images',
              '<div> - Container for other elements',
              '<ul> and <li> - Unordered lists',
              '<ol> and <li> - Ordered lists'
            ]},
            { type: 'heading', value: 'Practice Exercise' },
            { type: 'text', value: 'Create a simple HTML page about yourself with:' },
            { type: 'list', value: [
              'A heading with your name',
              'A paragraph describing your interests',
              'A list of your hobbies',
              'An image (you can use a placeholder)'
            ]}
          ]
        },
        {
          id: 'lesson-1-4',
          title: 'Your First Web Page',
          duration: '20:00',
          content: [
            { type: 'heading', value: 'Creating Your First Complete Web Page' },
            { type: 'text', value: 'Now that you understand the basics of HTML, let\'s create a complete web page from scratch.' },
            { type: 'heading', value: 'Step 1: Create a New File' },
            { type: 'list', value: [
              'Open Visual Studio Code',
              'Create a new file called index.html',
              'Save it in a folder called "my-first-website"'
            ]},
            { type: 'heading', value: 'Step 2: Add the HTML Structure' },
            { type: 'text', value: 'Type the following code into your index.html file:' },
            { type: 'code', value: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Welcome to My Website</title>\n  </head>\n  <body>\n    <header>\n      <h1>Welcome to My Website</h1>\n      <nav>\n        <a href="#about">About</a>\n        <a href="#projects">Projects</a>\n        <a href="#contact">Contact</a>\n      </nav>\n    </header>\n    \n    <main>\n      <section id="about">\n        <h2>About Me</h2>\n        <p>I\'m learning web development!</p>\n      </section>\n    </main>\n    \n    <footer>\n      <p>&copy; 2024 My Website</p>\n    </footer>\n  </body>\n</html>' },
            { type: 'heading', value: 'Step 3: View Your Page' },
            { type: 'list', value: [
              'Right-click on index.html in VS Code',
              'Select "Open with Live Server"',
              'Your page will open in the browser!',
              'Any changes you make will automatically refresh'
            ]},
            { type: 'text', value: 'Congratulations! You\'ve created your first web page. In the next section, we\'ll learn how to style it with CSS.' }
          ]
        }
      ]
    },
    {
      id: 'section-2',
      title: 'CSS Fundamentals',
      lessons: [
        {
          id: 'lesson-2-1',
          title: 'Introduction to CSS',
          duration: '22:30',
          content: [
            { type: 'heading', value: 'What is CSS?' },
            { type: 'text', value: 'CSS (Cascading Style Sheets) is used to style and layout web pages. While HTML provides the structure, CSS makes it look beautiful.' },
            { type: 'heading', value: 'How CSS Works' },
            { type: 'text', value: 'CSS works by selecting HTML elements and applying styles to them. A CSS rule consists of a selector and a declaration block:' },
            { type: 'code', value: 'selector {\n  property: value;\n}' },
            { type: 'heading', value: 'Three Ways to Add CSS' },
            { type: 'list', value: [
              'Inline CSS: Using the style attribute directly on HTML elements',
              'Internal CSS: Using a <style> tag in the <head> section',
              'External CSS: Linking to a separate .css file (recommended)'
            ]},
            { type: 'heading', value: 'Basic CSS Properties' },
            { type: 'text', value: 'Here are some fundamental CSS properties you\'ll use frequently:' },
            { type: 'list', value: [
              'color - Text color',
              'background-color - Background color',
              'font-size - Size of text',
              'font-family - Type of font',
              'margin - Space outside an element',
              'padding - Space inside an element',
              'border - Border around an element'
            ]},
            { type: 'heading', value: 'Example' },
            { type: 'code', value: 'h1 {\n  color: #BED784;\n  font-size: 36px;\n  text-align: center;\n}\n\np {\n  color: #333;\n  font-size: 16px;\n  line-height: 1.6;\n}' }
          ]
        },
        {
          id: 'lesson-2-2',
          title: 'Colors and Typography',
          duration: '19:45',
          content: [
            { type: 'heading', value: 'Working with Colors in CSS' },
            { type: 'text', value: 'Colors are one of the most important aspects of web design. CSS provides several ways to specify colors.' },
            { type: 'heading', value: 'Color Formats' },
            { type: 'list', value: [
              'Named colors: red, blue, green, etc.',
              'Hexadecimal: #BED784, #FF5733',
              'RGB: rgb(190, 215, 132)',
              'RGBA: rgba(190, 215, 132, 0.8) - includes transparency',
              'HSL: hsl(75, 55%, 68%)'
            ]},
            { type: 'heading', value: 'Typography Properties' },
            { type: 'text', value: 'Typography controls how text appears on your website:' },
            { type: 'list', value: [
              'font-family - Choose the typeface',
              'font-size - Set text size',
              'font-weight - Control boldness (normal, bold, 100-900)',
              'font-style - Italic or normal',
              'line-height - Space between lines',
              'text-align - Alignment (left, right, center, justify)',
              'text-decoration - Underline, strikethrough, etc.',
              'letter-spacing - Space between letters'
            ]},
            { type: 'heading', value: 'Web-Safe Fonts' },
            { type: 'text', value: 'Some fonts that work across all browsers:' },
            { type: 'code', value: 'body {\n  font-family: Arial, Helvetica, sans-serif;\n}\n\nh1 {\n  font-family: Georgia, serif;\n  font-weight: bold;\n  font-size: 2.5em;\n}' }
          ]
        },
        {
          id: 'lesson-2-3',
          title: 'The Box Model',
          duration: '28:00',
          content: [
            { type: 'heading', value: 'Understanding the CSS Box Model' },
            { type: 'text', value: 'Every HTML element is essentially a rectangular box. The CSS box model describes how these boxes are sized and spaced.' },
            { type: 'heading', value: 'Box Model Components' },
            { type: 'list', value: [
              'Content - The actual content of the element',
              'Padding - Space between content and border',
              'Border - A line around the padding',
              'Margin - Space outside the border'
            ]},
            { type: 'heading', value: 'Setting Box Model Properties' },
            { type: 'code', value: '.box {\n  width: 300px;\n  padding: 20px;\n  border: 2px solid #BED784;\n  margin: 10px;\n}' },
            { type: 'heading', value: 'Shorthand Properties' },
            { type: 'text', value: 'You can set all four sides at once:' },
            { type: 'code', value: '/* All sides */\nmargin: 20px;\n\n/* Top/Bottom, Left/Right */\nmargin: 20px 40px;\n\n/* Top, Right, Bottom, Left */\nmargin: 10px 20px 15px 30px;\n\n/* Individual sides */\nmargin-top: 10px;\nmargin-right: 20px;' },
            { type: 'heading', value: 'Box-Sizing Property' },
            { type: 'text', value: 'The box-sizing property controls how width and height are calculated:' },
            { type: 'code', value: '/* Makes width/height include padding and border */\n* {\n  box-sizing: border-box;\n}' }
          ]
        },
        {
          id: 'lesson-2-4',
          title: 'Layouts with Flexbox',
          duration: '32:15',
          content: [
            { type: 'heading', value: 'Introduction to Flexbox' },
            { type: 'text', value: 'Flexbox is a powerful layout system that makes it easy to create flexible, responsive layouts without using floats or positioning.' },
            { type: 'heading', value: 'Creating a Flex Container' },
            { type: 'text', value: 'To use flexbox, you need to create a flex container:' },
            { type: 'code', value: '.container {\n  display: flex;\n}' },
            { type: 'heading', value: 'Main Flexbox Properties' },
            { type: 'list', value: [
              'flex-direction - Set direction (row, column)',
              'justify-content - Align along main axis (center, space-between, etc.)',
              'align-items - Align along cross axis',
              'flex-wrap - Allow items to wrap to new line',
              'gap - Space between flex items'
            ]},
            { type: 'heading', value: 'Practical Example' },
            { type: 'code', value: '.navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 20px;\n  background: #BED784;\n}\n\n.nav-links {\n  display: flex;\n  gap: 20px;\n}' },
            { type: 'text', value: 'Flexbox is perfect for navigation bars, card layouts, centering content, and creating responsive designs!' }
          ]
        }
      ]
    },
    {
      id: 'section-3',
      title: 'JavaScript Basics',
      lessons: [
        {
          id: 'lesson-3-1',
          title: 'Introduction to JavaScript',
          duration: '24:30',
          content: [
            { type: 'heading', value: 'What is JavaScript?' },
            { type: 'text', value: 'JavaScript is a programming language that adds interactivity to websites. While HTML structures the page and CSS styles it, JavaScript makes it dynamic and interactive.' },
            { type: 'heading', value: 'What Can JavaScript Do?' },
            { type: 'list', value: [
              'Respond to user actions (clicks, typing, scrolling)',
              'Manipulate HTML and CSS dynamically',
              'Validate forms before submission',
              'Create animations and visual effects',
              'Fetch data from servers without refreshing the page',
              'Store data in the browser'
            ]},
            { type: 'heading', value: 'Adding JavaScript to Your Page' },
            { type: 'code', value: '<!-- Internal JavaScript -->\n<script>\n  console.log("Hello, JavaScript!");\n</script>\n\n<!-- External JavaScript (recommended) -->\n<script src="script.js"></script>' },
            { type: 'heading', value: 'Your First JavaScript Code' },
            { type: 'text', value: 'Let\'s write some basic JavaScript:' },
            { type: 'code', value: '// Display a message in the console\nconsole.log("Welcome to JavaScript!");\n\n// Show an alert box\nalert("Hello, World!");\n\n// Change HTML content\ndocument.getElementById("demo").innerHTML = "JavaScript is fun!";' }
          ]
        },
        {
          id: 'lesson-3-2',
          title: 'Variables and Data Types',
          duration: '26:45',
          content: [
            { type: 'heading', value: 'JavaScript Variables' },
            { type: 'text', value: 'Variables are containers for storing data. In modern JavaScript, we use let and const to declare variables.' },
            { type: 'heading', value: 'Declaring Variables' },
            { type: 'code', value: '// Use const for values that won\'t change\nconst courseName = "Web Development";\nconst price = 49.99;\n\n// Use let for values that will change\nlet studentCount = 0;\nlet isEnrolled = false;' },
            { type: 'heading', value: 'Data Types in JavaScript' },
            { type: 'list', value: [
              'String - Text data: "hello", \'world\'',
              'Number - Numeric values: 42, 3.14',
              'Boolean - True or false values',
              'Array - List of values: [1, 2, 3]',
              'Object - Key-value pairs: {name: "John", age: 25}',
              'Null - Intentionally empty value',
              'Undefined - Variable declared but not assigned'
            ]},
            { type: 'heading', value: 'Working with Strings' },
            { type: 'code', value: 'const firstName = "John";\nconst lastName = "Doe";\n\n// String concatenation\nconst fullName = firstName + " " + lastName;\n\n// Template literals (modern way)\nconst greeting = `Hello, ${fullName}!`;' },
            { type: 'heading', value: 'Working with Numbers' },
            { type: 'code', value: 'const price = 49.99;\nconst quantity = 3;\nconst total = price * quantity;\n\nconsole.log(`Total: $${total}`); // Total: $149.97' }
          ]
        },
        {
          id: 'lesson-3-3',
          title: 'Functions and Events',
          duration: '30:00',
          content: [
            { type: 'heading', value: 'JavaScript Functions' },
            { type: 'text', value: 'Functions are reusable blocks of code that perform specific tasks. They help organize your code and avoid repetition.' },
            { type: 'heading', value: 'Creating Functions' },
            { type: 'code', value: '// Function declaration\nfunction greetUser(name) {\n  return `Hello, ${name}!`;\n}\n\n// Arrow function (modern syntax)\nconst calculateTotal = (price, quantity) => {\n  return price * quantity;\n};\n\n// Calling functions\nconst message = greetUser("Sarah");\nconst total = calculateTotal(29.99, 2);' },
            { type: 'heading', value: 'Event Handling' },
            { type: 'text', value: 'Events allow you to respond to user actions like clicks, typing, or hovering.' },
            { type: 'code', value: '// HTML button\n// <button id="myButton">Click me!</button>\n\n// JavaScript\nconst button = document.getElementById("myButton");\n\nbutton.addEventListener("click", function() {\n  alert("Button was clicked!");\n});\n\n// With arrow function\nbutton.addEventListener("click", () => {\n  console.log("Button clicked!");\n});' },
            { type: 'heading', value: 'Common Events' },
            { type: 'list', value: [
              'click - Mouse click',
              'submit - Form submission',
              'keypress - Keyboard key pressed',
              'mouseover - Mouse enters element',
              'change - Form input changes',
              'load - Page finished loading'
            ]}
          ]
        },
        {
          id: 'lesson-3-4',
          title: 'DOM Manipulation',
          duration: '28:30',
          content: [
            { type: 'heading', value: 'The Document Object Model (DOM)' },
            { type: 'text', value: 'The DOM is a programming interface for HTML documents. It represents the page as a tree of objects that JavaScript can manipulate.' },
            { type: 'heading', value: 'Selecting Elements' },
            { type: 'code', value: '// Select by ID\nconst header = document.getElementById("header");\n\n// Select by class\nconst buttons = document.getElementsByClassName("btn");\n\n// Select with CSS selector (recommended)\nconst firstButton = document.querySelector(".btn");\nconst allButtons = document.querySelectorAll(".btn");' },
            { type: 'heading', value: 'Modifying Elements' },
            { type: 'code', value: '// Change text content\nelement.textContent = "New text";\n\n// Change HTML content\nelement.innerHTML = "<strong>Bold text</strong>";\n\n// Change styles\nelement.style.color = "#BED784";\nelement.style.fontSize = "20px";\n\n// Add/remove CSS classes\nelement.classList.add("active");\nelement.classList.remove("hidden");\nelement.classList.toggle("selected");' },
            { type: 'heading', value: 'Creating New Elements' },
            { type: 'code', value: '// Create new element\nconst newDiv = document.createElement("div");\nnewDiv.textContent = "I\'m a new div!";\nnewDiv.classList.add("card");\n\n// Add to page\ndocument.body.appendChild(newDiv);' },
            { type: 'text', value: 'DOM manipulation is at the heart of making interactive web pages. Practice these techniques to build dynamic user interfaces!' }
          ]
        }
      ]
    },
    {
      id: 'section-4',
      title: 'Building Your First Project',
      lessons: [
        {
          id: 'lesson-4-1',
          title: 'Project Planning',
          duration: '15:30',
          content: [
            { type: 'heading', value: 'Planning Your Web Project' },
            { type: 'text', value: 'Before writing any code, it\'s important to plan your project. Good planning saves time and prevents issues later.' },
            { type: 'heading', value: 'Steps to Plan a Project' },
            { type: 'list', value: [
              '1. Define the project goals - What should the website do?',
              '2. Identify your target audience - Who will use it?',
              '3. Create wireframes - Sketch the layout',
              '4. List required features - What functionality is needed?',
              '5. Plan the file structure - Organize your code',
              '6. Break into tasks - Create a step-by-step checklist'
            ]},
            { type: 'heading', value: 'Our Project: Interactive To-Do List' },
            { type: 'text', value: 'We\'ll build a fully functional to-do list application with these features:' },
            { type: 'list', value: [
              'Add new tasks',
              'Mark tasks as complete',
              'Delete tasks',
              'Filter tasks (all, active, completed)',
              'Store tasks in browser (persist on refresh)',
              'Responsive design for mobile and desktop'
            ]},
            { type: 'heading', value: 'File Structure' },
            { type: 'code', value: 'todo-app/\n├── index.html\n├── styles.css\n└── script.js' }
          ]
        },
        {
          id: 'lesson-4-2',
          title: 'Building the HTML Structure',
          duration: '20:00',
          content: [
            { type: 'heading', value: 'Creating the HTML' },
            { type: 'text', value: 'Let\'s build the HTML structure for our to-do list application.' },
            { type: 'code', value: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>My To-Do List</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <div class="container">\n    <h1>My Tasks</h1>\n    \n    <div class="input-section">\n      <input \n        type="text" \n        id="taskInput" \n        placeholder="Add a new task..."\n      >\n      <button id="addBtn">Add Task</button>\n    </div>\n    \n    <div class="filters">\n      <button class="filter-btn active" data-filter="all">All</button>\n      <button class="filter-btn" data-filter="active">Active</button>\n      <button class="filter-btn" data-filter="completed">Completed</button>\n    </div>\n    \n    <ul id="taskList"></ul>\n  </div>\n  \n  <script src="script.js"></script>\n</body>\n</html>' },
            { type: 'heading', value: 'Understanding the Structure' },
            { type: 'list', value: [
              'Container div - Holds all content',
              'Input section - For adding new tasks',
              'Filters - Buttons to filter task display',
              'Task list - Empty ul that will be populated with JavaScript'
            ]}
          ]
        },
        {
          id: 'lesson-4-3',
          title: 'Styling with CSS',
          duration: '25:00',
          content: [
            { type: 'heading', value: 'Adding Styles' },
            { type: 'text', value: 'Now let\'s make our to-do list look beautiful with CSS.' },
            { type: 'code', value: '* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', sans-serif;\n  background: linear-gradient(135deg, #BED784, #a8cc6f);\n  min-height: 100vh;\n  padding: 40px 20px;\n}\n\n.container {\n  max-width: 600px;\n  margin: 0 auto;\n  background: white;\n  border-radius: 16px;\n  padding: 40px;\n  box-shadow: 0 10px 40px rgba(0,0,0,0.1);\n}\n\nh1 {\n  color: #333;\n  margin-bottom: 30px;\n  text-align: center;\n}\n\n.input-section {\n  display: flex;\n  gap: 10px;\n  margin-bottom: 20px;\n}\n\ninput[type="text"] {\n  flex: 1;\n  padding: 12px 16px;\n  border: 2px solid #e0e0e0;\n  border-radius: 8px;\n  font-size: 16px;\n}\n\nbutton {\n  padding: 12px 24px;\n  background: #BED784;\n  color: white;\n  border: none;\n  border-radius: 8px;\n  font-size: 16px;\n  cursor: pointer;\n  transition: background 0.3s;\n}\n\nbutton:hover {\n  background: #a8cc6f;\n}' },
            { type: 'text', value: 'This creates a modern, clean interface with a beautiful gradient background and smooth interactions.' }
          ]
        },
        {
          id: 'lesson-4-4',
          title: 'Adding JavaScript Functionality',
          duration: '35:00',
          content: [
            { type: 'heading', value: 'Making It Interactive' },
            { type: 'text', value: 'Now for the fun part - adding JavaScript to make our to-do list actually work!' },
            { type: 'code', value: '// Get elements\nconst taskInput = document.getElementById(\'taskInput\');\nconst addBtn = document.getElementById(\'addBtn\');\nconst taskList = document.getElementById(\'taskList\');\n\n// Array to store tasks\nlet tasks = [];\n\n// Add task function\nfunction addTask() {\n  const taskText = taskInput.value.trim();\n  \n  if (taskText === \'\') return;\n  \n  const task = {\n    id: Date.now(),\n    text: taskText,\n    completed: false\n  };\n  \n  tasks.push(task);\n  renderTasks();\n  taskInput.value = \'\';\n}\n\n// Render tasks\nfunction renderTasks() {\n  taskList.innerHTML = \'\';\n  \n  tasks.forEach(task => {\n    const li = document.createElement(\'li\');\n    li.className = task.completed ? \'completed\' : \'\';\n    li.innerHTML = `\n      <input type="checkbox" ${task.completed ? \'checked\' : \'\'}>\n      <span>${task.text}</span>\n      <button class="delete-btn">Delete</button>\n    `;\n    \n    taskList.appendChild(li);\n  });\n}\n\n// Event listeners\naddBtn.addEventListener(\'click\', addTask);\ntaskInput.addEventListener(\'keypress\', (e) => {\n  if (e.key === \'Enter\') addTask();\n});' },
            { type: 'heading', value: 'What We Accomplished' },
            { type: 'list', value: [
              'Created a functional to-do list application',
              'Used HTML for structure',
              'Applied CSS for beautiful styling',
              'Added JavaScript for interactivity',
              'Implemented CRUD operations (Create, Read, Update, Delete)',
              'Built a complete project from scratch!'
            ]},
            { type: 'text', value: 'Congratulations! You\'ve completed your first full web development project. This demonstrates all the core concepts you\'ve learned.' }
          ]
        }
      ]
    }
  ],
  // Add similar structures for other courses
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
            { type: 'text', value: 'Digital marketing is the practice of promoting products or services using digital channels such as websites, social media, email, and search engines.' },
            { type: 'heading', value: 'Why Digital Marketing Matters' },
            { type: 'list', value: [
              'Reach billions of people worldwide',
              'Target specific audiences with precision',
              'Measure results in real-time',
              'Cost-effective compared to traditional marketing',
              'Build lasting relationships with customers'
            ]},
            { type: 'heading', value: 'Digital Marketing Channels' },
            { type: 'list', value: [
              'Search Engine Optimization (SEO)',
              'Social Media Marketing',
              'Email Marketing',
              'Content Marketing',
              'Pay-Per-Click Advertising (PPC)',
              'Influencer Marketing'
            ]},
            { type: 'text', value: 'In this course, you\'ll master all these channels and learn how to create integrated marketing campaigns that drive real results.' }
          ]
        }
      ]
    }
  ]
};

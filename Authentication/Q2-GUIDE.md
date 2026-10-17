# LearnHub MERN Project – Question 2

## Introduction
In Question 2, I added authentication and role-based access to my LearnHub project. I used React, Node.js, Express.js, MongoDB, and Mongoose to complete the project.

## Features
- User registration and login
- Password security using bcryptjs
- JWT authentication
- Three roles: Admin, Instructor, and Student
- Protected routes according to user roles
- Student course enrollment
- My Courses page
- Admin dashboard to view users and manage roles
- Error handling and input validation

## How to Run the Project

First, I opened the project folder in VS Code and checked that Node.js and npm were installed. I made sure MongoDB was running and configured the backend `.env` file with the database URL and JWT secret.

Then I opened the terminal and ran these commands:

```bash
cd backend
npm install
npm run dev
```

After starting the backend, I opened another terminal and ran:

```bash
cd frontend
npm install
npm run dev
```

I opened the local URL shown in the terminal to access the website.

## Testing
I tested registration and login, password security, and protected routes. I also checked the Admin, Instructor, and Student roles. Students can enroll in courses and view their enrolled courses in the My Courses page. The Admin can view users and manage their roles.

## Conclusion
This project helped me understand JWT authentication, password hashing, role-based access, and how the frontend connects with the backend. Before submitting, I will test the features and add screenshots of my actual project.
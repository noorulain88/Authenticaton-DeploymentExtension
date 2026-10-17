# LearnHub MERN Project

## Introduction

LearnHub is a learning management system where users can view courses, create an account, log in, and enroll in courses. It uses React for the frontend and Node.js, Express, and MongoDB for the backend.

## Technologies Used

- React JS
- React Router
- Axios
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- CSS

## Main Features

1. Users can register and log in to their accounts.
2. Passwords are hashed using bcryptjs.
3. JWT is used for authentication.
4. The project has three roles: Admin, Instructor, and Student.
5. Users can view the available courses and their details.
6. Instructors can create, update, and delete their own courses.
7. Students can enroll in courses.
8. Students can see their enrolled courses on the My Courses page.
9. Protected routes restrict access to authorized users.
10. The Admin can view users and basic project information.
11. Input validation and error messages are included.
12. Instructors can add lesson information and a lesson URL.

## Project Folder Structure

```text
LearnHub-MERN/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Requirements

Before running the project, make sure you have:

- Node.js installed
- npm installed
- MongoDB installed and running, or a MongoDB Atlas database
- VS Code or another code editor

## How to Run the Project

### 1. Run the Backend

Open the project folder in VS Code and open the terminal. Run these commands:

```bash
cd backend
npm install
```

Copy the `.env.example` file and rename the copy to `.env`. Add your MongoDB connection URL and a secure JWT secret to the file.

Example configuration for a local MongoDB database:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/learnhub
JWT_SECRET=your_private_secret_key
CLIENT_URL=http://localhost:5173
```

Use your own secret value and do not upload the `.env` file to GitHub.

Now start the backend:

```bash
npm run dev
```

The backend API runs at:

`http://localhost:5000/api`

You can check the health route at:

`http://localhost:5000/api/health`

### 2. Run the Frontend

Open another terminal in VS Code and run:

```bash
cd frontend
npm install
```

Copy the frontend `.env.example` file to `.env` if it exists. Set the API URL like this:

```env
VITE_API_URL=http://localhost:5000/api
```

Now run the frontend:

```bash
npm run dev
```

Open the local URL shown in the terminal. It is usually:

`http://localhost:5173`

Keep both terminals running while using the website.

## User Roles

**Student:** Students can view courses, enroll in courses, and see their enrolled courses.

**Instructor:** Instructors can manage their own courses and add lesson information.

**Admin:** The Admin can view users and basic project information and manage user roles.

For security, users cannot make themselves Admin through public registration. To create an Admin account, register a normal account first and update its role in MongoDB.

Example MongoDB command:

```javascript
use learnhub

db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

Replace the example email with the email of your registered account. Log out and log in again after changing the role.

## API Routes

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Get logged-in user details |
| GET | `/api/courses` | View all courses |
| GET | `/api/courses/:id` | View one course |
| POST | `/api/courses` | Create a course |
| PUT | `/api/courses/:id` | Update a course |
| DELETE | `/api/courses/:id` | Delete a course |
| POST | `/api/enroll` | Enroll in a course |
| GET | `/api/enroll/my-courses` | View enrolled courses |
| GET | `/api/admin/analytics` | View admin information |
| GET | `/api/admin/users` | View users |
| PATCH | `/api/admin/users/:id/role` | Change a user's role |
| POST | `/api/courses/:id/lessons` | Add lesson information |

Some routes require a valid login, and others are restricted to particular roles. Course editing and deletion are limited to the course owner or Admin.

## Testing

Local verification was completed on 2026-10-17 with Node.js 24.18.0, npm 11.16.0, and MongoDB 8.3. MongoDB connected successfully, the API started on port 5000, the frontend ran at `http://localhost:5173`, and `npm run build` completed successfully.

Live API checks covered registration and login, JWT-protected endpoints, admin analytics, course create/update/delete and lesson creation, student enrollment and My Courses, duplicate enrollment (`409`), role-denied actions (`403`), unauthenticated admin access (`401`), and invalid credentials (`401`). Browser checks covered registration, login feedback, all three role dashboards, course browsing/detail, enrollment, progress updates, and protected-route redirects.

Actual browser captures from this run are saved as `report-*.png` in the project root. The included Postman collection was not used for this verification, and the application has not been deployed. The `npm install` audit summaries reported 3 high-severity backend advisories and 2 moderate-severity frontend advisories; review `npm audit` in both packages before deployment. No automated dependency upgrades were applied.

## Deployment

The frontend can be deployed using Vercel or Netlify, and the backend can be deployed using Render or another Node.js hosting service.

For deployment, the database URL, JWT secret, frontend URL, and API URL must be configured correctly. The frontend build can be checked using:

```bash
cd frontend
npm run build
```

The project should be tested before deployment. I should also make sure that private environment files and passwords are not uploaded to GitHub.

## Conclusion

LearnHub demonstrates a full-stack learning platform with JWT authentication, password hashing, role-based access, course management, student enrollment, and progress tracking. See `REPORT_TEMPLATE.md` for the captured local screenshots and verification details.
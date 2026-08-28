# College Complaint Management System (CCMS) — Architecture

## 1. Architecture Overview

The system will use a three-layer web application architecture:

```text
Frontend
   ↓
Backend API
   ↓
Database
```

The frontend is responsible for the user interface.

The backend is responsible for business logic, authentication, authorization, and APIs.

The database is responsible for storing users, complaints, complaint history, notifications, departments, categories, and feedback.

---

## 2. Technology Architecture

### Frontend

* React.js
* JavaScript
* React Router
* Bootstrap or Tailwind CSS
* Axios or Fetch API

### Backend

* Node.js
* Express.js
* JWT authentication
* bcrypt/password hashing

### Database

* MongoDB
* Mongoose

---

## 3. High-Level Architecture

```text
                   ┌─────────────────────┐
                   │       Student       │
                   └──────────┬──────────┘
                              │
                   ┌──────────▼──────────┐
                   │       Frontend      │
                   │       React.js       │
                   └──────────┬──────────┘
                              │
                         HTTP / REST
                              │
                   ┌──────────▼──────────┐
                   │       Backend       │
                   │ Node.js + Express   │
                   └──────────┬──────────┘
                              │
                   ┌──────────▼──────────┐
                   │      MongoDB        │
                   └─────────────────────┘
```

Staff and Administrators use the same frontend and backend architecture with role-based access.

---

## 4. Frontend Architecture

The frontend will be organized into:

```text
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── services/
│   ├── context/
│   ├── hooks/
│   ├── utils/
│   ├── routes/
│   ├── App.jsx
│   └── main.jsx
├── public/
└── package.json
```

### Components

Reusable UI components such as:

* Navbar
* Sidebar
* ComplaintCard
* ComplaintTable
* StatusBadge
* PriorityBadge
* NotificationItem
* LoadingSpinner
* ProtectedRoute

### Pages

Pages will be separated according to user roles.

### Services

API communication will be centralized in service files.

Examples:

```text
authService.js
complaintService.js
notificationService.js
feedbackService.js
userService.js
```

### Context

Application-wide state such as authentication can be managed using React Context.

---

## 5. Frontend Routes

### Public Routes

```text
/
 /login
 /register
```

### Student Routes

```text
/student/dashboard
/student/complaints
/student/complaints/:id
/student/complaints/new
/student/notifications
/student/profile
```

### Staff Routes

```text
/staff/dashboard
/staff/complaints
/staff/complaints/:id
/staff/notifications
/staff/profile
```

### Admin Routes

```text
/admin/dashboard
/admin/complaints
/admin/complaints/:id
/admin/users
/admin/staff
/admin/departments
/admin/categories
/admin/feedback
/admin/notifications
/admin/reports
/admin/settings
```

---

## 6. Route Protection

The frontend will use protected routes.

The system will verify:

1. Whether the user is authenticated.
2. The user's role.
3. Whether the role is allowed to access the requested page.

Example:

```text
Student → Student routes only
Staff → Staff routes only
Admin → Admin routes
```

---

## 7. Backend Architecture

The backend will follow a modular structure:

```text
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── .env
└── package.json
```

### Controllers

Controllers handle incoming requests and return responses.

Examples:

```text
authController.js
complaintController.js
userController.js
notificationController.js
feedbackController.js
departmentController.js
categoryController.js
```

### Services

Services contain business logic.

Examples:

```text
authService.js
complaintService.js
notificationService.js
```

### Models

MongoDB/Mongoose models represent database collections.

Examples:

```text
User.js
Complaint.js
ComplaintUpdate.js
Feedback.js
Department.js
Category.js
Notification.js
```

### Routes

Routes define API endpoints.

Examples:

```text
authRoutes.js
complaintRoutes.js
userRoutes.js
notificationRoutes.js
feedbackRoutes.js
departmentRoutes.js
categoryRoutes.js
```

---

## 8. Backend Middleware

The backend will use middleware for:

* Authentication
* Role authorization
* Request validation
* Error handling
* File validation

Example flow:

```text
Request
   ↓
Authentication Middleware
   ↓
Role Authorization
   ↓
Validation
   ↓
Controller
   ↓
Service
   ↓
Database
```

---

## 9. Authentication Architecture

The authentication system will use JWT.

Login flow:

```text
User enters email/password
        ↓
Frontend sends login request
        ↓
Backend validates credentials
        ↓
Password is verified
        ↓
Backend generates JWT
        ↓
Frontend stores authentication state
        ↓
User accesses protected routes
```

Passwords must never be stored as plain text.

Passwords should be securely hashed.

---

## 10. Role-Based Authorization

The backend must enforce role permissions.

Example:

```text
Student
  ↓
Can access own complaints

Staff
  ↓
Can access assigned complaints

Admin
  ↓
Can access all complaints
```

Authorization must be enforced on the backend even if frontend routes are protected.

---

## 11. Complaint Architecture

Complaint creation flow:

```text
Student
   ↓
Complaint Form
   ↓
POST /api/complaints
   ↓
Backend Validation
   ↓
Create Complaint
   ↓
Generate Complaint ID
   ↓
Save to MongoDB
   ↓
Create Complaint History
   ↓
Create Notification
   ↓
Return Success Response
```

---

## 12. Complaint Assignment Architecture

```text
Complaint Status = Submitted
        ↓
Admin reviews complaint
        ↓
Admin selects Department
        ↓
Admin selects Staff
        ↓
Backend validates assignment
        ↓
Complaint updated
        ↓
Status = Assigned
        ↓
Complaint history created
        ↓
Staff notification created
```

---

## 13. Complaint Status Architecture

Allowed workflow:

```text
Submitted
    ↓
Assigned
    ↓
In Progress
    ↓
Resolved
    ↓
Closed
```

Rejected complaints follow:

```text
Submitted → Rejected
```

Backend validation must prevent invalid status transitions.

---

## 14. Complaint History

Every important complaint action should create a history record.

Examples:

* Complaint submitted
* Complaint assigned
* Staff assigned
* Priority changed
* Status changed
* Remark added
* Complaint resolved
* Complaint closed
* Complaint rejected

The history should record:

* Complaint ID
* User who performed the action
* Action
* Previous value
* New value
* Remark
* Timestamp

---

## 15. Notification Architecture

Notifications will be stored in MongoDB.

When an important event occurs:

```text
Complaint Event
      ↓
Backend Service
      ↓
Create Notification
      ↓
Save Notification
      ↓
Display in user's notification page
```

The initial MVP will use in-app notifications.

---

## 16. Database Architecture

Main collections:

```text
users
complaints
complaintupdates
feedback
departments
categories
notifications
```

Relationships:

```text
User
  ↓
Complaints

Complaint
  ↓
Complaint Updates
  ↓
Feedback
  ↓
Notifications
```

---

## 17. API Architecture

The backend will expose REST APIs.

Base URL:

```text
/api
```

Authentication:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me
```

Complaints:

```text
POST /api/complaints
GET /api/complaints
GET /api/complaints/:id
PUT /api/complaints/:id
GET /api/complaints/my
```

Assignment:

```text
PUT /api/complaints/:id/assign
```

Status:

```text
PUT /api/complaints/:id/status
```

Priority:

```text
PUT /api/complaints/:id/priority
```

Feedback:

```text
POST /api/complaints/:id/feedback
GET /api/complaints/:id/feedback
```

Notifications:

```text
GET /api/notifications
PUT /api/notifications/:id/read
```

Departments:

```text
GET /api/departments
POST /api/departments
PUT /api/departments/:id
```

Categories:

```text
GET /api/categories
POST /api/categories
PUT /api/categories/:id
```

---

## 18. Error Handling Architecture

The backend will use centralized error handling.

Errors should return consistent responses.

Example:

```json
{
  "success": false,
  "message": "You are not authorized to perform this action."
}
```

The frontend should display user-friendly messages.

---

## 19. Security Architecture

Security measures include:

* Password hashing
* JWT authentication
* Role-based authorization
* Protected API endpoints
* Input validation
* File validation
* Ownership validation
* Environment variables for secrets
* Secure error responses
* No password hashes in API responses

---

## 20. File Upload Architecture

Complaint attachments will be optional.

The system should:

* Validate file type.
* Validate file size.
* Reject unsupported files.
* Store file references rather than unnecessary file data in the complaint document.

The exact storage solution will be finalized during implementation.

---

## 21. Development Structure

The application will be developed in the following order:

```text
1. Project setup
2. Backend setup
3. Database connection
4. User model
5. Authentication
6. Role-based authorization
7. Frontend setup
8. Student module
9. Complaint creation
10. Complaint tracking
11. Staff module
12. Admin module
13. Assignment system
14. Complaint status management
15. Complaint history
16. Notifications
17. Feedback
18. Search and filtering
19. Testing
20. Deployment
```

Each stage should be tested before moving to the next stage.

---

## 22. Deployment Architecture

The final application will contain:

```text
Frontend
   ↓
Frontend Hosting

Backend
   ↓
Backend Hosting

MongoDB
   ↓
Cloud Database
```

The exact hosting providers will be selected during the deployment stage.

---

## 23. Architecture Principles

The implementation should follow these principles:

* Keep frontend and backend responsibilities separate.
* Use reusable components.
* Keep business logic out of UI components.
* Use modular backend architecture.
* Validate data on both frontend and backend.
* Enforce security on the backend.
* Avoid unnecessary dependencies.
* Keep the system easy to maintain and extend.
* Follow the approved `spec.md`.
* Implement features incrementally.

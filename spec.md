# College Complaint Management System — Project Specification

## Project Overview & Tech Stack

### Project Overview

Build a full-stack **College Complaint Management System** that enables students to submit complaints digitally and allows faculty and administrators to review, assign, track, resolve, and manage complaints through a centralized platform. The system must provide role-based access, complaint tracking, real-time notifications, complaint history, audit logs, dashboards, and administrative controls.

The platform must allow students to submit complaints with categories, departments, priorities, descriptions, and attachments; allow faculty to manage assigned complaints; and allow administrators to monitor the complete complaint-management process.

### Tech Stack

* **Frontend:** React.js, React Router, Tailwind CSS, Zustand, Axios, lucide-react
* **Backend:** Node.js, Express.js, MongoDB, Mongoose
* **Authentication:** JSON Web Tokens, bcryptjs
* **Real-Time:** Socket.IO
* **Validation:** express-validator
* **Security:** helmet, CORS, express-rate-limit
* **File Uploads:** Multer
* **Logging:** Morgan

---

## Authentication, Complaints, and Role-Based Access

### Authentication

The authentication system must support registration, login, JWT-based session handling, protected routes, an `/auth/me` profile endpoint, role-based access control, password hashing with bcrypt, persistent login state through Zustand, logout, validation, and authentication error handling.

The system must support three roles:

1. **Student**
2. **Faculty**
3. **Admin**

### Student

Students must be able to:

* Register and login
* Submit complaints
* View their complaints
* Track complaint status
* View complaint details
* Add comments
* Upload attachments
* Receive notifications
* Reopen eligible complaints
* View complaint history

### Faculty

Faculty must be able to:

* View assigned complaints
* Review complaint details
* Update complaint status
* Add comments
* Add resolution remarks
* Resolve complaints
* View complaint history
* Receive assignment notifications

### Admin

Administrators must be able to:

* View all complaints
* Assign complaints to faculty
* Manage users
* Manage departments
* Manage complaint categories
* Change complaint priority
* Monitor unresolved complaints
* View analytics
* View audit history
* Manage system settings

---

## Complaint Management

Users must be able to create complaints containing:

* Complaint title
* Description
* Category
* Department
* Priority
* Attachment
* Submission date

Every complaint must receive a unique complaint number.

Example:

```text
CMP-2026-00001
CMP-2026-00002
CMP-2026-00003
```

### Complaint Status

The system must support:

```text
PENDING
ASSIGNED
IN_PROGRESS
RESOLVED
CLOSED
REOPENED
REJECTED
```

### Complaint Lifecycle

```text
Student submits complaint
        ↓
PENDING
        ↓
ASSIGNED
        ↓
IN_PROGRESS
        ↓
RESOLVED
        ↓
CLOSED
```

If required:

```text
RESOLVED
    ↓
REOPENED
    ↓
IN_PROGRESS
```

Every status change must create an audit-log entry.

---

## Complaint Categories

The system must support configurable categories including:

* Academic
* Hostel
* Transport
* Library
* Laboratory
* Infrastructure
* Examination
* Fees
* IT/Technical
* Canteen
* Security
* Other

Administrators must be able to create, update, activate, deactivate, and manage categories.

---

## Department Management

The system must support departments including:

* Computer Science
* Administration
* Examination Cell
* Hostel
* Library
* Transport
* Accounts
* IT Support

Administrators must be able to create, update, activate, deactivate, and manage departments.

---

## Complaint Assignment

Administrators must be able to assign complaints to faculty members.

Assignment data must include:

```text
complaintId
assignedBy
assignedTo
department
assignedAt
```

The assigned faculty member must receive a notification.

---

## Complaint Priority

Complaints must support:

```text
LOW
MEDIUM
HIGH
URGENT
```

Authorized users must be able to update complaint priority.

Urgent complaints must be visually highlighted.

---

## Complaint Comments

Students, faculty, and administrators must be able to communicate through complaint-specific comments.

Each comment must contain:

```text
complaintId
author
message
createdAt
updatedAt
```

Comments must be displayed chronologically.

---

## Complaint Audit Trail

The system must record every important complaint action.

Examples:

```text
Complaint Created
Complaint Assigned
Priority Changed
Status Changed
Comment Added
Attachment Uploaded
Complaint Resolved
Complaint Reopened
Complaint Closed
Complaint Rejected
```

Each log must contain:

```text
complaintId
userId
action
oldValue
newValue
metadata
createdAt
```

---

## Notifications and Real-Time Layer

The system must provide real-time notifications using Socket.IO.

Notifications must be generated for:

* Complaint submitted
* Complaint assigned
* Complaint status changed
* Complaint resolved
* Complaint reopened
* New comment
* Complaint rejected

Notifications must persist in MongoDB and appear in a notification drawer.

Each notification must contain:

```text
owner
complaintId
type
title
message
isRead
createdAt
```

The frontend must receive real-time notifications without requiring a page refresh.

---

## Dashboard

### Student Dashboard

The student dashboard must display:

```text
Total Complaints
Pending
In Progress
Resolved
Closed
```

It must also display:

* Recent complaints
* Complaint status
* Notifications
* Complaint activity
* Submit Complaint button

### Faculty Dashboard

The faculty dashboard must display:

```text
Assigned Complaints
Pending
In Progress
Resolved
Urgent
```

It must also display:

* Recently assigned complaints
* Complaints requiring action
* Recent activity
* Resolution statistics

### Admin Dashboard

The admin dashboard must display:

```text
Total Complaints
Pending
In Progress
Resolved
Closed
Urgent
```

It must also display:

* Complaints by category
* Complaints by department
* Complaints by status
* Complaints by priority
* Resolution rate
* Average resolution time
* Recent complaints
* Faculty statistics
* Monthly complaint trends

---

## Frontend Pages

The application must use React Router.

### `/`

Landing page containing:

* Platform introduction
* Features
* Complaint lifecycle
* Student benefits
* Faculty benefits
* Admin benefits
* Login CTA
* Register CTA
* Responsive design

### `/login`

Login page containing:

* Email
* Password
* Login button
* Validation
* Loading state
* Error state
* Registration link

### `/register`

Registration page containing:

* Name
* Email
* Password
* Confirm password
* Validation
* Password requirements
* Registration errors

### `/dashboard`

Role-specific dashboard containing:

* AppShell
* Sidebar
* Navbar
* MetricGrid
* Recent complaints
* Statistics
* Notifications
* Activity feed
* Skeleton loaders

### `/complaints`

Complaint listing page containing:

* Search
* Status filter
* Priority filter
* Category filter
* Department filter
* Pagination
* Sorting
* Complaint table/cards
* Status badges

Students must only see their complaints.

Faculty must see assigned complaints.

Admins must see all complaints.

### `/complaints/create`

Complaint creation page containing:

* Title
* Description
* Category
* Department
* Priority
* Attachment upload
* Submit button
* Validation
* Loading state
* Success/error states

### `/complaints/:id`

Complaint details page containing:

* Complaint number
* Title
* Description
* Category
* Department
* Priority
* Status
* Submitted date
* Assigned faculty
* Attachments
* Comments
* Timeline
* Status controls
* Assignment controls

### `/users`

Admin-only user management page containing:

* User list
* Search
* Role filter
* Activate/deactivate
* User details
* Role management

### `/departments`

Admin-only department management page containing:

* Department list
* Create department
* Edit department
* Activate/deactivate
* Faculty assignment

### `/categories`

Admin-only category management page containing:

* Category list
* Create category
* Edit category
* Activate/deactivate

### `/reports`

Admin-only reports page containing:

* Complaint statistics
* Department performance
* Category distribution
* Resolution rate
* Average resolution time
* Status distribution
* Priority distribution
* Export reports

### `/notifications`

Notification page containing:

* All notifications
* Read/unread status
* Complaint reference
* Timestamp
* Mark as read
* Mark all as read

### `/settings`

Settings page containing:

* Profile management
* Password change
* Account information
* Role information
* Theme settings
* Security settings

---

## Backend Architecture

### Routes

Routes must handle:

* HTTP routing
* Authentication middleware
* Authorization middleware
* Request validation
* Controller invocation

Routes must not contain business logic.

### Controllers

Controllers must only:

* Parse requests
* Call services
* Return responses

Controllers must never directly access MongoDB.

### Services

Services must own all business logic.

Required services:

```text
authService.js
complaintService.js
userService.js
departmentService.js
categoryService.js
notificationService.js
reportService.js
```

### Middleware

Required middleware:

```text
authMiddleware.js
roleMiddleware.js
validationMiddleware.js
errorMiddleware.js
uploadMiddleware.js
```

---

## Database Collections

### Users

```text
_id
name
email
password
role
department
isActive
lastLogin
createdAt
updatedAt
```

Password must use:

```text
select: false
```

### Complaints

```text
_id
complaintNumber
title
description
category
department
priority
status
submittedBy
assignedTo
attachments
resolutionRemarks
createdAt
updatedAt
resolvedAt
closedAt
```

### Categories

```text
_id
name
description
isActive
createdAt
updatedAt
```

### Departments

```text
_id
name
description
head
isActive
createdAt
updatedAt
```

### Comments

```text
_id
complaintId
author
message
createdAt
updatedAt
```

### ComplaintLogs

```text
_id
complaintId
userId
action
oldValue
newValue
metadata
createdAt
```

### Notifications

```text
_id
owner
complaintId
type
title
message
isRead
createdAt
```

---

## API Endpoints

### Health & Authentication

```text
GET    /api/health

POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout
PUT    /api/auth/profile
PUT    /api/auth/change-password
```

### Complaints

```text
GET    /api/complaints
POST   /api/complaints
GET    /api/complaints/:id
PUT    /api/complaints/:id
DELETE /api/complaints/:id

POST   /api/complaints/:id/assign
POST   /api/complaints/:id/status
POST   /api/complaints/:id/comments
GET    /api/complaints/:id/comments
GET    /api/complaints/:id/timeline
POST   /api/complaints/:id/reopen
```

### Dashboard

```text
GET /api/dashboard
GET /api/dashboard/student
GET /api/dashboard/faculty
GET /api/dashboard/admin
```

### Users

```text
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
PATCH  /api/users/:id/status
PATCH  /api/users/:id/role
DELETE /api/users/:id
```

### Departments

```text
GET    /api/departments
POST   /api/departments
GET    /api/departments/:id
PUT    /api/departments/:id
DELETE /api/departments/:id
```

### Categories

```text
GET    /api/categories
POST   /api/categories
GET    /api/categories/:id
PUT    /api/categories/:id
DELETE /api/categories/:id
```

### Notifications

```text
GET   /api/notifications
PATCH /api/notifications/:id/read
PATCH /api/notifications/read-all
```

### Reports

```text
GET /api/reports/complaints
GET /api/reports/departments
GET /api/reports/categories
GET /api/reports/resolution
```

---

## Folder Structure & Development Phases

### Frontend Structure

```text
client/
└── src/
    ├── components/
    │   ├── AppShell/
    │   ├── Sidebar/
    │   ├── Navbar/
    │   ├── MetricGrid/
    │   ├── ComplaintCard/
    │   ├── ComplaintForm/
    │   ├── ComplaintTable/
    │   ├── ComplaintFilters/
    │   ├── ComplaintTimeline/
    │   ├── CommentSection/
    │   ├── NotificationDrawer/
    │   ├── StatusBadge/
    │   ├── LoadingSkeleton/
    │   └── ProtectedRoute/
    │
    ├── pages/
    │   ├── index.jsx
    │   ├── login.jsx
    │   ├── register.jsx
    │   ├── dashboard.jsx
    │   ├── complaints/
    │   │   ├── index.jsx
    │   │   ├── create.jsx
    │   │   └── [id].jsx
    │   ├── users/
    │   │   └── index.jsx
    │   ├── departments/
    │   │   └── index.jsx
    │   ├── categories/
    │   │   └── index.jsx
    │   ├── reports/
    │   │   └── index.jsx
    │   ├── notifications.jsx
    │   └── settings.jsx
    │
    ├── store/
    │   ├── authStore.js
    │   ├── complaintStore.js
    │   └── notificationStore.js
    │
    ├── services/
    │   ├── api.js
    │   └── socket.js
    │
    └── utils/
        ├── constants.js
        └── helpers.js
```

### Backend Structure

```text
server/
└── src/
    ├── config/
    │   ├── env.js
    │   ├── db.js
    │   └── socket.js
    │
    ├── routes/
    │   ├── authRoutes.js
    │   ├── complaintRoutes.js
    │   ├── userRoutes.js
    │   ├── departmentRoutes.js
    │   ├── categoryRoutes.js
    │   ├── notificationRoutes.js
    │   ├── dashboardRoutes.js
    │   └── reportRoutes.js
    │
    ├── controllers/
    │   ├── authController.js
    │   ├── complaintController.js
    │   ├── userController.js
    │   ├── departmentController.js
    │   ├── categoryController.js
    │   ├── notificationController.js
    │   ├── dashboardController.js
    │   └── reportController.js
    │
    ├── services/
    │   ├── authService.js
    │   ├── complaintService.js
    │   ├── userService.js
    │   ├── departmentService.js
    │   ├── categoryService.js
    │   ├── notificationService.js
    │   └── reportService.js
    │
    ├── middleware/
    │   ├── authMiddleware.js
    │   ├── roleMiddleware.js
    │   ├── validationMiddleware.js
    │   ├── errorMiddleware.js
    │   └── uploadMiddleware.js
    │
    ├── models/
    │   ├── User.js
    │   ├── Complaint.js
    │   ├── Category.js
    │   ├── Department.js
    │   ├── Comment.js
    │   ├── ComplaintLog.js
    │   └── Notification.js
    │
    └── utils/
        ├── jwt.js
        ├── complaintNumber.js
        └── logger.js
```

---

## Development Phases

### Phase 1: Project Setup & Authentication

* React project setup
* Express server setup
* MongoDB connection
* Environment configuration
* User model
* Registration
* Login
* JWT authentication
* bcrypt password hashing
* Protected routes
* Role-based authorization
* Zustand auth store
* AppShell
* Sidebar
* Navbar
* Dashboard structure

### Phase 2: Complaint Management

* Complaint model
* Complaint creation
* Complaint listing
* Complaint details
* Complaint number generation
* Categories
* Departments
* Priority management
* Status management
* Search
* Filtering
* Sorting
* Pagination
* Comments
* Complaint timeline

### Phase 3: Faculty & Admin Management

* Faculty dashboard
* Admin dashboard
* Complaint assignment
* User management
* Department management
* Category management
* Role-based UI
* Status management
* Priority management
* Resolution remarks

### Phase 4: Notifications & Real-Time Updates

* Socket.IO server
* Socket.IO client
* Real-time complaint updates
* Notification service
* Notification drawer
* Read/unread notifications
* Assignment notifications
* Status notifications
* Comment notifications

### Phase 5: Attachments, Audit Trail & Reports

* File upload
* Complaint attachments
* Complaint logs
* Complete audit history
* Dashboard analytics
* Department statistics
* Category statistics
* Resolution statistics
* Report generation
* Export functionality

### Phase 6: Security, Testing & Deployment

* Helmet
* CORS
* Authentication rate limiting
* Express-validator
* Secure JWT handling
* File validation
* Centralized error handling
* API testing
* Frontend testing
* Environment configuration
* MongoDB Atlas
* Frontend deployment
* Backend deployment

---

## UI, Security, Outcome, and Codex Instructions

### UI & UX Requirements

The UI must use a clean, modern **college administration dashboard aesthetic**.

The application must be:

* Fully responsive
* Mobile friendly
* Desktop friendly
* Accessible
* Professional
* Consistent

The UI must include:

* Sidebar navigation
* Top navigation
* Dashboard cards
* Complaint tables
* Complaint cards
* Status badges
* Priority indicators
* Modal dialogs
* Toast notifications
* Loading states
* Skeleton loaders
* Empty states
* Error states
* Confirmation dialogs
* Notification drawer
* Complaint timeline

The complaint timeline must clearly display:

```text
Created
Assigned
In Progress
Comment Added
Resolved
Closed
```

---

## Security Requirements

The application must:

* Hash passwords using bcrypt
* Never store plain-text passwords
* Sign JWTs using `JWT_SECRET`
* Verify JWTs on protected routes
* Apply role-based authorization
* Set HTTP security headers using Helmet
* Restrict CORS to `CLIENT_URL`
* Rate-limit authentication endpoints
* Validate requests using express-validator
* Validate MongoDB IDs
* Validate uploaded files
* Restrict file sizes
* Never expose environment secrets
* Never log passwords or JWT secrets
* Use centralized error handling
* Return appropriate HTTP status codes

---

## Error Handling

The API must return consistent error responses.

Example:

```json
{
  "success": false,
  "message": "Complaint not found",
  "errorCode": "COMPLAINT_NOT_FOUND"
}
```

Required error codes include:

```text
INVALID_CREDENTIALS
UNAUTHORIZED
FORBIDDEN
USER_NOT_FOUND
COMPLAINT_NOT_FOUND
INVALID_COMPLAINT_STATUS
INVALID_CATEGORY
INVALID_DEPARTMENT
DUPLICATE_EMAIL
FILE_TOO_LARGE
INVALID_FILE_TYPE
VALIDATION_ERROR
SERVER_ERROR
```

The frontend must display user-friendly error messages.

---

## Final Expected Outcome

The completed **College Complaint Management System** must allow students to submit and track complaints, faculty to manage assigned complaints, and administrators to control and monitor the complete complaint-management process.

The complete workflow must be:

```text
Student
   ↓
Submit Complaint
   ↓
Complaint Created
   ↓
Admin Reviews
   ↓
Faculty Assigned
   ↓
Faculty Processes Complaint
   ↓
Status Updates
   ↓
Resolution
   ↓
Student Reviews
   ↓
Closed / Reopened
```

The system must maintain:

* Complete complaint history
* Real-time notifications
* Role-based access
* Complaint audit logs
* Attachments
* Dashboard analytics
* Search and filtering
* Secure authentication
* Centralized complaint management

---

## Codex & AI Agent Implementation Instructions

The AI coding agent must:

1. Build the application phase by phase.
2. Follow the folder structure strictly.
3. Complete and verify each phase before starting the next.
4. Keep controllers thin.
5. Keep business logic inside services.
6. Never access MongoDB directly from controllers.
7. Use Mongoose models through services.
8. Keep authentication logic inside `authService.js`.
9. Keep complaint logic inside `complaintService.js`.
10. Use middleware for authentication.
11. Use role middleware for authorization.
12. Use Zustand for persistent authentication state.
13. Use Socket.IO for real-time notifications.
14. Create a ComplaintLog for every important complaint action.
15. Never expose passwords or secrets.
16. Store secrets in environment variables.
17. Validate every request using express-validator.
18. Validate uploaded files.
19. Use centralized error handling.
20. Do not introduce unnecessary dependencies.
21. Maintain consistent API naming.
22. Prevent students from accessing other students' complaints.
23. Prevent faculty from accessing unauthorized complaints.
24. Protect admin-only endpoints.
25. Test each feature before proceeding.
26. Do not unnecessarily replace working functionality.
27. Preserve existing functionality when modifying files.
28. At the end of every phase, report:

* Files created
* Files modified
* Features implemented
* Tests performed
* Known issues
* Next phase

---

## Where Each Specification Parameter Shows Up

* **Clarity:** The Project Overview defines students, faculty, administrators, and the complaint lifecycle.
* **Completeness:** The specification covers authentication, complaints, roles, departments, categories, assignments, comments, attachments, notifications, dashboards, reports, audit logs, APIs, database models, security, testing, and deployment.
* **Consistency:** Complaint statuses, roles, database models, API endpoints, frontend pages, and backend services use consistent naming.
* **Concrete Technology Choices:** React, Tailwind CSS, Zustand, Axios, Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Socket.IO, Helmet, express-validator, and Multer are explicitly defined.
* **Structured Sections:** The specification separates project requirements into authentication, complaint management, dashboards, database, APIs, frontend, backend, security, phases, and implementation instructions.
* **Phased Delivery:** The project is divided into six sequential development phases.
* **Authoritative Tone:** Strong requirements such as "must", "never", and "required" prevent the AI coding agent from skipping important functionality or changing the architecture.

# 🎓 College Complaint Management System (CCMS)

A modern, full-stack, transparent web application for managing campus grievances across students, faculty departments, and college administrators. CCMS replaces manual complaint handling with an automated digital workflow featuring role-based dashboards, unique tracking numbers, full audit trails, threaded discussions, real-time notifications via Socket.IO, and satisfaction feedback ratings.

---

## 🚀 Key Features

* **Role-Based Portals**:
  * **Students**: Self-serve registration, complaint submission with file attachments, live status tracking, interactive discussions, satisfaction ratings (1–5 stars), and reopening resolved issues.
  * **Faculty / Staff**: Dedicated task queue for assigned complaints, status workflows (`IN_PROGRESS`, `RESOLVED`), official resolution remarks, and discussion replies.
  * **Administrators**: Platform-wide complaint oversight, faculty department assignment, priority controls, user management (staff account creation & status toggling), department/category configuration, and executive reports.
* **Complaint Lifecycle**: Strict status progression:
  $$\text{PENDING} \longrightarrow \text{ASSIGNED} \longrightarrow \text{IN\_PROGRESS} \longrightarrow \text{RESOLVED} \longrightarrow \text{CLOSED}$$
  *(with support for `REOPENED` and `REJECTED`)*.
* **Unique Identification**: Atomic sequential counter formatting IDs as `CMP-2026-00001`.
* **Full Audit Trail**: Every lifecycle event (submission, assignment, priority change, status update, remark, feedback) is immutably logged with timestamp, actor, and state changes.
* **Real-Time Notification Hub**: In-app notification drawer powered by Socket.IO rooms and MongoDB persistence.
* **Analytics & Performance Reports**: Department resolution matrices, turnaround duration tracking, category breakdowns, and student satisfaction reviews.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, React Router v6, Tailwind CSS, Zustand, Axios, Lucide React, Socket.IO Client, Vite |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JSON Web Tokens (JWT), bcryptjs, Socket.IO |
| **Security & Middleware** | Helmet, CORS, Express Rate Limit, Express-Validator, Multer (file uploads), Morgan |

---

## 📋 Prerequisites

Ensure you have the following installed on your local machine:

1. **Node.js**: Version `18.x` or later ([Download Node.js](https://nodejs.org/))
2. **npm**: Version `9.x` or later (bundled with Node.js)
3. **MongoDB**: A running local instance on `mongodb://127.0.0.1:27017` or a cloud [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string.

---

## ⚡ Quick Start / Local Setup

Follow these steps to run the complete project locally:

### 1. Clone or Open the Repository
```bash
cd College-complaint-management-system
```

---

### 2. Configure Backend Environment
Navigate to the `server/` directory and check/create the `.env` file:

```bash
cd server
```

Create or verify `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/ccms_db
JWT_SECRET=ccms_super_secret_jwt_key_2026_secure_complaint_portal
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
UPLOAD_PATH=uploads
MAX_FILE_SIZE=5242880
```

---

### 3. Install & Start Backend Server
Inside the `server/` directory:

```bash
# Install dependencies
npm install

# Start the server (auto-connects to MongoDB and seeds demo data on first run)
npm start
```

> **Backend API will be running at:** `http://localhost:5000`  
> *(Socket.IO server initialized on port 5000)*

---

### 4. Install & Start Frontend Client
Open a **new terminal window** and navigate to the `client/` directory:

```bash
cd client

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

> **Frontend Application will be running at:** `http://localhost:5173`

Open [http://localhost:5173](http://localhost:5173) in your web browser.

---

## 👥 Pre-Seeded Demo Credentials

The database automatically seeds standard demo accounts upon initial startup. You can also use the **1-Click Demo Login** buttons on the landing page or login screen:

| Role | Email | Password | Pre-Configured Access |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@ccms.edu` | `Admin@12345` | Master dashboard, complaint assignments, user & department management, analytics reports |
| **Faculty (CS)** | `faculty.cs@ccms.edu` | `Faculty@12345` | Computer Science department queue |
| **Faculty (Hostel)** | `faculty.hostel@ccms.edu` | `Faculty@12345` | Hostel & residential grievance queue |
| **Faculty (IT Support)** | `faculty.it@ccms.edu` | `Faculty@12345` | Campus Wi-Fi & IT infrastructure queue |
| **Student 1** | `student1@ccms.edu` | `Student@12345` | Rahul Verma (Sample student account) |
| **Student 2** | `student2@ccms.edu` | `Student@12345` | Priya Patel (Sample student account) |

---

## 🧪 Running Automated Tests

CCMS includes an end-to-end automated API verification test suite testing health, authentication, complaint creation, assignment, status progression, audit logging, feedback submission, and dashboard analytics.

Run the test suite from the `server/` directory:

```bash
cd server
npm test
```

Expected output:
```text
====================================================
🚀 CCMS Backend API Automated Test Suite
====================================================

[Test 1] Testing Health Endpoint: GET /api/health ... ✅
[Test 2] Admin Login: POST /api/auth/login ... ✅
[Test 3] Faculty Login: POST /api/auth/login ... ✅
[Test 4] Student Registration: POST /api/auth/register ... ✅
[Test 5] Fetching Categories & Departments ... ✅
[Test 6] Student Submits Complaint: POST /api/complaints ... ✅
[Test 7] Admin Assigns Complaint: POST /api/complaints/:id/assign ... ✅
[Test 8] Faculty Updates Status to IN_PROGRESS & RESOLVED ... ✅
[Test 9] Comments & Audit Timeline ... ✅
[Test 10] Student Feedback: POST /api/complaints/:id/feedback ... ✅
[Test 11] Dashboards Analytics Verification ... ✅

====================================================
🎉 ALL BACKEND API TESTS PASSED PERFECTLY!
====================================================
```

---

## 🏗️ Project Architecture & Directory Structure

```text
College-complaint-management-system/
├── client/                              # Frontend React 18 Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppShell/                # Main layout wrapper
│   │   │   ├── Navbar/                  # Header with user menu & alert bell
│   │   │   ├── Sidebar/                 # Dynamic role-tailored sidebar
│   │   │   ├── MetricGrid/              # Analytics KPI stat cards
│   │   │   ├── ComplaintTable/          # Searchable, filterable complaints table
│   │   │   ├── ComplaintFilters/        # Search & dropdown filter bar
│   │   │   ├── ComplaintTimeline/       # Historical audit trail stepper
│   │   │   ├── CommentSection/          # Discussion thread per complaint
│   │   │   ├── NotificationDrawer/      # Slide-over real-time alert panel
│   │   │   ├── StatusBadge/             # Colored status indicators
│   │   │   ├── PriorityBadge/           # Priority urgency tags
│   │   │   ├── LoadingSkeleton/         # Shimmer loading states
│   │   │   └── ProtectedRoute/          # Role authorization route guard
│   │   ├── pages/
│   │   │   ├── index.jsx                # Landing page with 1-click logins
│   │   │   ├── login.jsx                # Login page
│   │   │   ├── register.jsx             # Student registration page
│   │   │   ├── dashboard.jsx            # Dynamic role dashboard
│   │   │   ├── complaints/              # Listing, creation, & details pages
│   │   │   ├── users/                   # Admin user management
│   │   │   ├── departments/             # Admin department configuration
│   │   │   ├── categories/              # Admin category configuration
│   │   │   ├── reports/                 # Admin analytics & resolution reports
│   │   │   ├── notifications.jsx        # Notification center
│   │   │   └── settings.jsx             # Profile & password management
│   │   ├── store/                       # Zustand stores (auth, notifications)
│   │   ├── services/                    # Axios API client & Socket.IO service
│   │   ├── utils/                       # Constants, formatters, helpers
│   │   ├── App.jsx                      # Router configuration
│   │   ├── index.css                    # Tailwind CSS & glassmorphic design system
│   │   └── main.jsx                     # Client entrypoint
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                              # Backend Node.js / Express API
│   ├── src/
│   │   ├── config/                      # Database (Mongoose), Socket.IO, Env
│   │   ├── controllers/                 # Thin controllers (parse req, call service)
│   │   ├── services/                    # Core business logic layer
│   │   ├── models/                      # User, Complaint, Category, Department, Comment, Log, Notification
│   │   ├── middleware/                  # Auth, Role, Validation, Upload, Error handler
│   │   ├── routes/                      # REST API endpoints
│   │   ├── utils/                       # ID generator, JWT, seed data, logger
│   │   ├── app.js                       # Express app setup with security headers
│   │   └── server.js                    # HTTP + Socket.IO server startup
│   ├── tests/                           # Automated API test suite
│   ├── uploads/                         # Stored file attachments
│   ├── .env                             # Server environment variables
│   └── package.json
│
├── spec.md                              # Approved single-source-of-truth specification
└── README.md                            # Local setup and project guide
```

---

## 📡 REST API Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Student registration
- `POST /api/auth/login` — User login (returns JWT token)
- `GET /api/auth/me` — Current authenticated user profile
- `POST /api/auth/logout` — Invalidate user session
- `PUT /api/auth/profile` — Update name
- `PUT /api/auth/change-password` — Change account password

### Complaints (`/api/complaints`)
- `GET /api/complaints` — List complaints (scoped by role with search & multi-filters)
- `POST /api/complaints` — Submit new complaint with file attachments
- `GET /api/complaints/:id` — Get single complaint details
- `PUT /api/complaints/:id` — Update complaint details
- `DELETE /api/complaints/:id` — Delete complaint (Admin only)
- `POST /api/complaints/:id/assign` — Assign department & faculty (Admin only)
- `POST /api/complaints/:id/status` — Update status & remarks (`IN_PROGRESS`, `RESOLVED`, `CLOSED`, etc.)
- `POST /api/complaints/:id/reopen` — Reopen resolved complaint (Student/Admin)
- `GET /api/complaints/:id/comments` — Fetch discussion thread
- `POST /api/complaints/:id/comments` — Post comment
- `GET /api/complaints/:id/timeline` — Fetch immutable audit history
- `POST /api/complaints/:id/feedback` — Submit 1–5 star satisfaction review (Student)

### Administration & Dashboards
- `GET /api/dashboard` — Dynamic role dashboard metrics
- `GET /api/users` — List and filter users (Admin only)
- `POST /api/users` — Create faculty/staff accounts (Admin only)
- `PATCH /api/users/:id/status` — Toggle user active/inactive (Admin only)
- `GET /api/departments` & `POST /api/departments` — Department management
- `GET /api/categories` & `POST /api/categories` — Category management
- `GET /api/reports/complaints` — Complaint statistics & turnaround time
- `GET /api/reports/departments` — Department performance matrix
- `GET /api/reports/resolution` — Student reviews & satisfaction ratings
- `GET /api/notifications` — In-app notification feed

---

## 📄 License
This project is developed for college grievance management under the ISC License.

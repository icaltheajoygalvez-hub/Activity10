# QRentry Event Registration System
## Activity Documentation Report

**Date:** January 11, 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Description](#2-system-description)
3. [Features](#3-features)
4. [Architecture Overview](#4-architecture-overview)
5. [Application Pages & Screenshots](#5-application-pages--screenshots)
6. [API Integration](#6-api-integration)
7. [Installation & Setup Instructions](#7-installation--setup-instructions)
8. [Running the Project](#8-running-the-project)
9. [Technical Stack](#9-technical-stack)
10. [Support & Documentation](#10-support--documentation)

---

## 1. Project Overview

**QRentry** is a comprehensive Event Registration System that streamlines event management through QR code technology. It enables attendees to register for events, organizers to manage events and registrations, and administrators to oversee the entire system.

The system provides a seamless experience for managing events from creation to check-in, with integrated QR code functionality for efficient attendee verification and tracking.

---

## 2. System Description

QRentry simplifies the event registration process by leveraging QR codes for quick check-ins, ticket management, and attendee tracking. The system supports multiple user roles (Attendee, Organizer, Admin) with different permissions and capabilities.

| Aspect | Details |
|--------|---------|
| System Name | QRentry Event Registration System |
| Primary Purpose | Event registration, ticketing, and check-in management |
| Target Users | Event Attendees, Event Organizers, System Administrators |
| Key Technology | QR Code scanning for registration and check-in |

---

## 3. Features

### Authentication
- User Registration (Attendee, Organizer, Admin roles)
- Secure Login with JWT authentication
- Password reset functionality
- Email verification
- Session management
- Role-based access control

### Event Management
- Create and manage events
- Set event details, date, time, and location
- Manage event capacity and availability
- View event registrations and attendee counts
- Generate QR codes for events
- Edit and delete events

### Registration & Ticketing
- Browse and register for events
- Download event tickets
- QR code integration for ticket verification
- Multiple registration categories
- Event status tracking (upcoming, past, cancelled)
- Ticket display with QR codes

### Check-in Management
- QR code scanning for attendee check-in
- Real-time attendance tracking
- Check-in status updates
- Attendee list management
- Check-in history and reporting
- Attendance statistics

### Admin Dashboard
- System overview and analytics
- User management and role assignment
- Event oversight and monitoring
- Registration monitoring
- System configuration

---

## 4. Architecture Overview

### Frontend Stack
- **React** with TypeScript for type-safe component development
- **Tailwind CSS** for responsive, utility-first styling
- **React Router** for client-side navigation
- **Zustand** for state management
- **Axios** for HTTP API communication
- **QR Code Scanner** library for ticket verification

### Backend Stack
- **NestJS** framework for robust API development
- **PostgreSQL** database for data persistence
- **JWT** (JSON Web Tokens) for authentication
- **TypeORM** for database ORM and migrations
- **Role-based Access Control (RBAC)** for authorization
- **RESTful API** endpoints

### Authentication Flow
1. User registers with email, password, and role (Attendee/Organizer/Admin)
2. User logs in with credentials
3. Backend validates credentials and issues JWT token
4. Frontend stores token in secure storage
5. Token is included in all subsequent API requests
6. Backend validates token on protected routes

---

## 5. Application Pages & Screenshots

### 1. Login Page
**Description:** User authentication interface. Attendees, organizers, and admins use this page to log in with their email/username and password. Includes forgot password link and signup option for new users.

**Accessible to:** All user types

**Features:**
- Email/Username input field
- Password input field
- Remember me checkbox
- Forgot password link
- Sign up redirect
- Login button with loading state

*[Screenshot: Login page with purple gradient background and form fields]*

---

### 2. Registration Page
**Description:** New user account creation. Users select their role (Attendee, Organizer, Admin), enter email, password, name, and optional company information. Form includes validation and error handling.

**Accessible to:** New users

**Features:**
- Name input field
- Email input field
- Password input field (with minimum 6 character requirement)
- Account Type dropdown (Attendee, Organizer, Admin)
- Company Name field (optional)
- Terms of service checkbox
- Sign up button with loading state
- Login redirect for existing users

*[Screenshot: Registration form with all input fields and validation]*

---

### 3. Discover Events Page
**Description:** Browse all available events in the system. Displays event cards with name, date, time, location, and registration button. Users can search and filter events by category or date.

**Accessible to:** Attendees, Organizers

**Features:**
- Event listing in card format
- Event name, date, time, location display
- Attendee count and capacity indicator
- Search functionality
- Filter by event status
- Register button on each event card
- Event details preview

*[Screenshot: Grid of event cards with information and register buttons]*

---

### 4. Create Event Page
**Description:** Form for organizers to create new events. Includes fields for event name, description, date, time, location, capacity, and other event details. Organizers can preview event before publishing.

**Accessible to:** Organizers

**Features:**
- Event name input
- Event description textarea
- Date and time pickers
- Location input
- Event capacity field
- Event category selection
- Event image upload
- Create/Draft buttons
- Form validation

*[Screenshot: Event creation form with all input fields]*

---

### 5. Event Details Page
**Description:** Detailed view of a single event. Shows full event information, registration status, attendee count, and action buttons (Register, View Tickets, Check-in).

**Accessible to:** Attendees, Organizers

**Features:**
- Full event description
- Event poster/image
- Date, time, location information
- Attendee count and capacity
- Registration status indicator
- Register button (if not registered)
- View tickets option (if registered)
- Check-in option (for organizers)
- Event organizer information

*[Screenshot: Detailed event page with all information and action buttons]*

---

### 6. My Events Page
**Description:** Dashboard showing registered events for attendees. Displays list of events with registration status, allows filtering by status (upcoming, past, cancelled).

**Accessible to:** Attendees

**Features:**
- List of registered events
- Event status badges (Upcoming, Past, Cancelled)
- Filter by status
- Sort by date
- View event details link
- Cancel registration option
- Upcoming events highlighted

*[Screenshot: List of registered events with status indicators]*

---

### 7. My Tickets Page
**Description:** View and manage event tickets. Shows QR codes for each ticket, ticket details, and options to download or print tickets. Tickets display registration information and event details.

**Accessible to:** Attendees

**Features:**
- Ticket list/grid view
- QR code for each ticket
- Ticket number/reference
- Event information on ticket
- Download ticket option
- Print ticket option
- Share ticket option
- Ticket status indicator

*[Screenshot: Tickets with QR codes and ticket information]*

---

### 8. Check-in Page
**Description:** QR code scanner interface for checking in attendees. Organizers and admins can scan attendee QR codes to verify attendance. Shows real-time attendance statistics and scanner status.

**Accessible to:** Organizers, Admins

**Features:**
- QR code scanner interface
- Camera access permission
- Scan success/failure feedback
- Attendee information display on scan
- Check-in confirmation
- Attendance count display
- List of checked-in attendees
- Scanner controls (start/stop)

*[Screenshot: QR scanner interface with camera feed and check-in feedback]*

---

### 9. Admin Dashboard
**Description:** System overview for administrators. Shows key metrics including total events, registrations, users, and system status. Provides access to manage users, events, and registrations.

**Accessible to:** Admins only

**Features:**
- Total events count
- Total registrations count
- Total users count
- Recent activities
- System status overview
- Links to management pages
- Quick action buttons
- Analytics charts/graphs

*[Screenshot: Dashboard with metrics and overview cards]*

---

### 10. Admin Users Management
**Description:** Manage system users. Admins can view user list, edit user details, change user roles, and delete accounts. Shows user registration date and activity status.

**Accessible to:** Admins only

**Features:**
- User list table
- User details (name, email, role)
- Registration date
- User status (active/inactive)
- Edit user button
- Delete user button
- Change role dropdown
- Search/filter users
- Pagination

*[Screenshot: Users management table with user information and action buttons]*

---

## 6. API Integration

QRentry frontend communicates with the backend API for all operations. The API follows RESTful principles.

### Core API Endpoints

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|----------------|
| `/api/auth/register` | POST | User registration | No |
| `/api/auth/login` | POST | User authentication | No |
| `/api/auth/logout` | POST | User logout | Yes |
| `/api/events` | GET | List all events | No |
| `/api/events` | POST | Create new event | Yes |
| `/api/events/:id` | GET | Get event details | No |
| `/api/events/:id` | PUT | Update event | Yes |
| `/api/events/:id` | DELETE | Delete event | Yes |
| `/api/registrations` | POST | Register for event | Yes |
| `/api/my-registrations` | GET | User registrations | Yes |
| `/api/registrations/:id/cancel` | POST | Cancel registration | Yes |
| `/api/check-in` | POST | Check in attendee | Yes |
| `/api/events/:id/attendees` | GET | Event attendees list | Yes |
| `/api/admin/dashboard` | GET | Admin dashboard stats | Yes (Admin) |
| `/api/admin/users` | GET | List all users | Yes (Admin) |
| `/api/admin/users/:id` | PUT | Update user | Yes (Admin) |
| `/api/admin/users/:id` | DELETE | Delete user | Yes (Admin) |

---

## 7. Installation & Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- PostgreSQL database (v12 or higher)
- Git for version control

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd event-registration-system
```

### Step 2: Backend Setup

Navigate to backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create `.env` file in the backend directory with the following configuration:
```
DATABASE_URL=postgresql://username:password@localhost:5432/qrentry
JWT_SECRET=your_secret_key_here
JWT_EXPIRATION=24h
PORT=3001
NODE_ENV=development
```

Run database migrations:
```bash
npm run typeorm migration:run
```

### Step 3: Frontend Setup

Navigate to frontend directory (from project root):
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Configure API base URL in the environment configuration or create a `.env` file:
```
REACT_APP_API_URL=http://localhost:3001/api
```

---

## 8. Running the Project

### Backend Startup

From the backend directory:
```bash
npm run start:dev
```

The backend will start on: **http://localhost:3001**

You should see output indicating:
```
[Nest] 1234  - 01/11/2026, 10:00:00 AM     LOG [NestFactory] Nest application successfully started
```

### Frontend Startup

From the frontend directory (in a separate terminal):
```bash
npm start
```

The frontend will start on: **http://localhost:3000**

The browser should automatically open to the application.

### Accessing the Application

1. Open your browser and navigate to: **http://localhost:3000**
2. Create a new account or use provided test credentials
3. Select your role: Attendee, Organizer, or Admin
4. Complete registration
5. You will be redirected to the main application

### Test Credentials (Example)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | Test@123 |
| Organizer | organizer@test.com | Test@123 |
| Attendee | attendee@test.com | Test@123 |

---

## 9. Technical Stack

### Frontend Technologies
- **React 18.x** - Modern UI framework with hooks
- **TypeScript** - Type-safe JavaScript for better development experience
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **React Router** - Client-side navigation and routing
- **Zustand** - Lightweight state management
- **Axios** - Promise-based HTTP client
- **QR Code Scanner** - Library for scanning QR codes
- **React Icons** - Icon library for UI components

### Backend Technologies
- **NestJS** - Progressive Node.js framework with TypeScript support
- **TypeScript** - Type-safe language for Node.js
- **PostgreSQL** - Robust relational database
- **TypeORM** - Object-Relational Mapping for database operations
- **JWT** - JSON Web Tokens for stateless authentication
- **bcrypt** - Password hashing and verification
- **Passport.js** - Authentication middleware and strategies
- **class-validator** - Data validation using decorators

### Development Tools
- **VS Code** - Recommended code editor
- **Git** - Version control system
- **npm** - Package manager
- **Postman** - API testing tool (optional)
- **ESLint** - Code quality tool
- **Prettier** - Code formatter
- **Docker** - Containerization (optional)

---

## 10. Support & Documentation

### Troubleshooting

**Port Already in Use**
- Change the port in configuration files or kill the process using the port
- On Windows: `netstat -ano | findstr :3001` then `taskkill /PID <PID> /F`

**Database Connection Issues**
- Verify PostgreSQL is running and accessible
- Check database credentials in `.env` file
- Ensure database exists with correct name

**Module Not Found**
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again

**CORS Errors**
- Ensure backend CORS configuration includes frontend URL
- Update CORS settings in `main.ts` (NestJS)

**Authentication Failures**
- Check JWT token expiration settings
- Verify localStorage/sessionStorage is storing tokens correctly
- Check browser console for error messages

### Common Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm start` | Start frontend development server |
| `npm run start:dev` | Start backend in development mode |
| `npm run build` | Build frontend for production |
| `npm run test` | Run test suite |
| `npm run lint` | Run ESLint code quality checks |
| `npm run format` | Format code with Prettier |

### Resources & Documentation

- **React Documentation:** https://react.dev
- **NestJS Documentation:** https://docs.nestjs.com
- **Tailwind CSS:** https://tailwindcss.com
- **TypeScript:** https://www.typescriptlang.org
- **PostgreSQL:** https://www.postgresql.org
- **JWT Introduction:** https://jwt.io
- **Zustand:** https://github.com/pmndrs/zustand

---

## Conclusion

QRentry is a comprehensive event registration and management system that combines modern web technologies with practical event management features. The system is designed to be:

- **User-friendly:** Intuitive interfaces for all user types
- **Scalable:** Built with modern architecture for growth
- **Secure:** JWT authentication and role-based access control
- **Efficient:** QR code technology for fast check-ins
- **Responsive:** Works on desktop, tablet, and mobile devices

By following the setup and running instructions in this document, you should have a fully functional event management platform ready to deploy and use.

### Next Steps
1. Clone the repository
2. Follow the installation steps
3. Run both frontend and backend
4. Create a test event and registration
5. Test QR code scanning functionality
6. Explore all features as different user roles

For additional support, refer to the README files in the respective directories and the inline code documentation.

---

**Document Version:** 1.0
**Last Updated:** January 11, 2026
**System Name:** QRentry Event Registration System

# QRentry - Code Review Quick Reference Guide

A quick lookup guide for understanding each source code file's purpose and key functions.

---

## BACKEND FILES QUICK REFERENCE

### Core Application
| File | Purpose | Key Responsibility | Quality |
|------|---------|-------------------|---------|
| `main.ts` | Server entry point | CORS, validation, static files | 8/10 |
| `app.module.ts` | Root module | Module imports, MongoDB connection | 9/10 |
| `app.controller.ts` | Root routes | Health checks, base endpoints | 8/10 |

### Authentication (`auth/`)
| File | Purpose | Key Responsibility | Quality |
|------|---------|-------------------|---------|
| `auth.service.ts` | Auth logic | Registration, login, validation | 8/10 |
| `auth.controller.ts` | Auth endpoints | POST /register, POST /login | 8/10 |
| `jwt.strategy.ts` | JWT strategy | Token validation | 8/10 |
| `guards/jwt-auth.guard.ts` | Auth protection | Route access control | 8/10 |
| `guards/roles.guard.ts` | RBAC protection | Role-based access | 8/10 |
| `decorators/roles.decorator.ts` | Role marker | Endpoint role requirement | 8/10 |
| `schemas/user.schema.ts` | User model | User data structure | 8.5/10 |
| `dto/login.dto.ts` | Login validation | Input validation | 8/10 |
| `dto/register.dto.ts` | Registration validation | Input validation | 8/10 |
| `dto/update-profile.dto.ts` | Profile update validation | Input validation | 8/10 |

### Events (`events/`)
| File | Purpose | Key Responsibility | Quality |
|------|---------|-------------------|---------|
| `events.service.ts` | Event logic | CRUD, filtering, pagination | 8.5/10 |
| `events.controller.ts` | Event endpoints | GET/POST/PUT/DELETE routes | 8/10 |
| `schemas/event.schema.ts` | Event model | Event data structure | 8/10 |
| `dto/create-event.dto.ts` | Event creation validation | Input validation | 8/10 |
| `dto/update-event.dto.ts` | Event update validation | Input validation | 8/10 |
| `dto/filter-event.dto.ts` | Event filter validation | Query validation | 8/10 |

### Registrations (`registrations/`)
| File | Purpose | Key Responsibility | Quality |
|------|---------|-------------------|---------|
| `registrations.service.ts` | Registration logic | Tickets, QR codes, analytics | 8/10 |
| `registrations.controller.ts` | Registration endpoints | Registration routes | 8/10 |
| `schemas/registration.schema.ts` | Registration model | Ticket data structure | 8/10 |
| `dto/create-registration.dto.ts` | Registration validation | Input validation | 8/10 |

### Check-ins (`check-ins/`)
| File | Purpose | Key Responsibility | Quality |
|------|---------|-------------------|---------|
| `check-ins.service.ts` | Check-in logic | QR scanning, validation | 8.5/10 |
| `check-ins.controller.ts` | Check-in endpoints | Scan routes | 8/10 |
| `check-ins.gateway.ts` | WebSocket gateway | Real-time updates | 8.5/10 |
| `schemas/check-in.schema.ts` | Check-in model | Check-in data structure | 8/10 |
| `dto/scan-ticket.dto.ts` | Scan validation | Input validation | 8/10 |

### Admin (`admin/`)
| File | Purpose | Key Responsibility | Quality |
|------|---------|-------------------|---------|
| `admin.service.ts` | Admin logic | User management, analytics | 7.5/10 |
| `admin.controller.ts` | Admin endpoints | Admin routes | 8/10 |
| `dto/update-user-role.dto.ts` | Role update validation | Input validation | 8/10 |

### Notifications (`notifications/`)
| File | Purpose | Key Responsibility | Quality |
|------|---------|-------------------|---------|
| `notifications.service.ts` | Notification logic | Email, in-app alerts | 7.5/10 |
| `notifications.module.ts` | Module definition | Module setup | 8/10 |

---

## FRONTEND FILES QUICK REFERENCE

### Pages - Authentication
| File | Purpose | Key Features | Quality |
|------|---------|--------------|---------|
| `pages/Login.tsx` | Login page | Email/password form, auto-redirect | 8/10 |
| `pages/Register.tsx` | Signup page | Role selection, company field | 8.5/10 |
| `pages/Profile.tsx` | Profile management | Edit profile, password change | 8/10 |

### Pages - Events
| File | Purpose | Key Features | Quality |
|------|---------|--------------|---------|
| `pages/Events/EventList.tsx` | Event discovery | Search, filter, pagination | 8.5/10 |
| `pages/Events/EventDetails.tsx` | Event details | Full info, attendees, register | 8/10 |
| `pages/Events/CreateEvent.tsx` | Event creation | Form with image upload | 8.5/10 |
| `pages/Events/EditEvent.tsx` | Event editing | Pre-filled form, update | 8/10 |
| `pages/Events/MyEvents.tsx` | Organizer dashboard | Manage events, statistics | 8/10 |
| `pages/Events/ViewAttendees.tsx` | Attendee list | Show registered users | 8/10 |

### Pages - Registrations
| File | Purpose | Key Features | Quality |
|------|---------|--------------|---------|
| `pages/Registrations/RegisterForEvent.tsx` | Event registration | Confirmation, details | 8.5/10 |
| `pages/Registrations/MyTickets.tsx` | Ticket management | QR code, cancel, analytics | 9/10 |
| `pages/Registrations/TicketDetails.tsx` | Ticket details | Full ticket info, QR code | 8/10 |

### Pages - Check-in
| File | Purpose | Key Features | Quality |
|------|---------|--------------|---------|
| `pages/CheckIn/Scanner.tsx` | QR scanner | Live scanning, validation | 8.5/10 |
| `pages/CheckIn/CheckInHistory.tsx` | Check-in history | Timeline, attendees | 8/10 |

### Pages - Admin
| File | Purpose | Key Features | Quality |
|------|---------|--------------|---------|
| `pages/Admin/Dashboard.tsx` | Admin overview | Statistics, metrics | 8/10 |
| `pages/Admin/UserManagement.tsx` | User management | CRUD users, roles | 8.5/10 |
| `pages/Admin/Analytics.tsx` | System analytics | Charts, reports | 8/10 |

### Services
| File | Purpose | Key Responsibility | Quality |
|------|---------|-------------------|---------|
| `services/api.ts` | API config | Axios setup, interceptors | 8.5/10 |
| `services/auth.service.ts` | Auth API | Login, register, profile | 8/10 |
| `services/events.service.ts` | Events API | Event CRUD | 8/10 |
| `services/registrations.service.ts` | Registration API | Ticket CRUD | 8/10 |
| `services/checkins.service.ts` | Check-in API | Scan, history | 8/10 |
| `services/admin.service.ts` | Admin API | User management | 8/10 |

### State Management
| File | Purpose | Key Features | Quality |
|------|---------|--------------|---------|
| `store/authStore.ts` | Auth state (Zustand) | User, token, persistence | 9/10 |

### Context
| File | Purpose | Key Features | Quality |
|------|---------|--------------|---------|
| `contexts/ToastContext.tsx` | Toast notifications | Global notifications | 8.5/10 |

### Components - Common
| File | Purpose | Key Features | Quality |
|------|---------|--------------|---------|
| `components/common/Sidebar.tsx` | Navigation menu | Role-based menu | 8.5/10 |
| `components/common/Navbar.tsx` | Top bar | Branding, user menu | 8/10 |
| `components/common/Layout.tsx` | Main layout | Sidebar + content | 8/10 |
| `components/common/Button.tsx` | Button control | Variants, loading state | 8/10 |
| `components/common/Card.tsx` | Card container | Flexible content | 8/10 |
| `components/common/Modal.tsx` | Modal dialog | Customizable | 8.5/10 |
| `components/common/FormInputs.tsx` | Form fields | Text, email, select, etc. | 8.5/10 |
| `components/common/ErrorMessage.tsx` | Error display | Error messages | 8/10 |
| `components/common/LoadingSpinner.tsx` | Loading indicator | Animated spinner | 8/10 |
| `components/common/Toast.tsx` | Toast notification | Local notifications | 8/10 |
| `components/common/PageHeader.tsx` | Page header | Title, breadcrumb | 8/10 |

### Routes & Guards
| File | Purpose | Key Features | Quality |
|------|---------|--------------|---------|
| `routes/ProtectedRoute.tsx` | Auth guard | Redirect if not logged in | 8.5/10 |
| `routes/RoleBasedRoute.tsx` | RBAC guard | Role-based access | 8.5/10 |

### Types & Utils
| File | Purpose | Key Features | Quality |
|------|---------|--------------|---------|
| `types/user.types.ts` | Type definitions | User, role types | 8/10 |
| `utils/export.ts` | Export utilities | CSV, PDF, Excel | 8/10 |
| `components/icons/IconSystem.tsx` | Icon system | Consistent icons | 8.5/10 |

---

## File Organization Overview

```
backend/src/
├── main.ts                          ← Server entry point
├── app.module.ts                    ← Root module
├── auth/                            ← Authentication
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── jwt.strategy.ts
│   ├── guards/
│   ├── decorators/
│   ├── schemas/
│   └── dto/
├── events/                          ← Event management
│   ├── events.service.ts
│   ├── events.controller.ts
│   ├── schemas/
│   └── dto/
├── registrations/                   ← Ticket system
│   ├── registrations.service.ts
│   ├── registrations.controller.ts
│   ├── schemas/
│   └── dto/
├── check-ins/                       ← QR scanning
│   ├── check-ins.service.ts
│   ├── check-ins.controller.ts
│   ├── check-ins.gateway.ts
│   ├── schemas/
│   └── dto/
├── admin/                           ← Admin operations
│   ├── admin.service.ts
│   ├── admin.controller.ts
│   ├── dto/
│   └── admin.module.ts
└── notifications/                   ← Notifications
    ├── notifications.service.ts
    └── notifications.module.ts

frontend/src/
├── App.tsx                          ← Root component
├── index.tsx                        ← Entry point
├── pages/                           ← Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Profile.tsx
│   ├── Events/
│   ├── Registrations/
│   ├── CheckIn/
│   └── Admin/
├── components/                      ← Reusable components
│   ├── common/
│   ├── icons/
│   └── ...
├── services/                        ← API communication
│   ├── api.ts
│   ├── auth.service.ts
│   ├── events.service.ts
│   ├── registrations.service.ts
│   ├── checkins.service.ts
│   └── admin.service.ts
├── store/                           ← State management
│   └── authStore.ts
├── routes/                          ← Route guards
│   ├── ProtectedRoute.tsx
│   └── RoleBasedRoute.tsx
├── contexts/                        ← React context
│   └── ToastContext.tsx
├── types/                           ← TypeScript types
│   └── user.types.ts
└── utils/                           ← Utilities
    └── export.ts
```

---

## Key Implementation Patterns

### Backend Patterns
- **Module-based Architecture:** Feature modules (Auth, Events, etc.)
- **Service Layer Pattern:** Business logic in services
- **DTO Pattern:** Request/response validation
- **Guard Pattern:** Authentication and authorization
- **Decorator Pattern:** Custom decorators for metadata
- **Schema Pattern:** Mongoose models for data structure

### Frontend Patterns
- **Container/Presentational:** Pages (containers) + Components (presentational)
- **Custom Hooks:** Reusable logic extraction
- **Service Layer:** API communication abstraction
- **Context API:** Global state (Toast notifications)
- **Zustand:** Persistent state management (Auth)
- **Render Props:** Component composition
- **HOC Pattern:** Route guards as wrappers

---

## Technology Stack Summary

### Backend
- **Framework:** NestJS
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + Passport.js
- **Real-time:** WebSocket (Socket.IO)
- **Validation:** class-validator
- **Security:** bcrypt for password hashing

### Frontend
- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State:** Zustand + Context API
- **HTTP:** Axios
- **QR Code:** html5-qrcode
- **Notifications:** Custom Toast Context
- **Icons:** Custom Icon System

---

## Code Quality Metrics

| Metric | Score | Notes |
|--------|-------|-------|
| Type Safety | 9/10 | Excellent TypeScript coverage |
| Security | 8/10 | Good auth/RBAC, could add more features |
| Maintainability | 8/10 | Clean architecture, well-organized |
| Performance | 8/10 | Good pagination, some optimization possible |
| Testing | 6/10 | Minimal test coverage |
| Documentation | 7/10 | Good code comments, comprehensive reviews |
| Error Handling | 8/10 | Proper exception handling |
| Accessibility | 7/10 | Basic a11y, room for improvement |

---

## Development Quick Tips

### Adding a New Feature
1. Create service method in backend
2. Create controller endpoint
3. Create service method in frontend
4. Create/update component
5. Update routes if needed
6. Add tests

### Code Style Notes
- **Backend:** NestJS conventions, camelCase for properties
- **Frontend:** React/TypeScript patterns, arrow functions preferred
- **Naming:** Descriptive names for services, components, types
- **Comments:** Add comments for complex logic

### Common Imports
```typescript
// Backend
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Frontend
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/contexts/ToastContext';
```

---

## For Code Reviews

When reviewing code, check:
- ✅ Type safety (no `any` types)
- ✅ Error handling (try-catch, proper exceptions)
- ✅ Security (no hardcoded secrets, input validation)
- ✅ Performance (pagination, optimization)
- ✅ Naming (clear, descriptive names)
- ✅ Comments (complex logic documented)
- ✅ Testing (unit tests for logic)
- ✅ Accessibility (for UI components)

---

## Resources

- **Backend API Docs:** See `docs/API_DOCUMENTATION.md`
- **Frontend Docs:** See `QRentry_Activity_Documentation.md`
- **Architecture:** Modular feature-based approach
- **Database:** MongoDB collections for each entity
- **Security:** JWT + Role-based access control

---

Generated for QRentry Event Registration System
Date: January 12, 2026

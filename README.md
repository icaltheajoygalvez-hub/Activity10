# 🎫 Event Registration & QR Scanner System

A comprehensive full-stack event management system with QR code-based check-in functionality, built with **NestJS**, **React**, **MongoDB**, and **TypeScript**.

![System Architecture](https://img.shields.io/badge/Architecture-Microservices-blue)
![Backend](https://img.shields.io/badge/Backend-NestJS-red)
![Frontend](https://img.shields.io/badge/Frontend-React-blue)
![Database](https://img.shields.io/badge/Database-MongoDB-green)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)

## 🌟 Features

### Core Functionality
- ✅ **User Authentication** - JWT-based auth with role-based access control (Admin, Organizer, Attendee)
- ✅ **Event Management** - Complete CRUD operations with image uploads and capacity management
- ✅ **Registration System** - Automated ticket generation with unique QR codes
- ✅ **QR Code Scanning** - Real-time check-in with duplicate prevention
- ✅ **Admin Dashboard** - User management, analytics, and data export
- ✅ **Email Notifications** - Queued email system for confirmations and reminders

### Advanced Features
- 🔄 **Real-time Updates** - WebSocket integration for live check-in status
- 📊 **Analytics & Reports** - Comprehensive statistics and CSV/Excel export
- 🔍 **Search & Filtering** - Advanced event discovery
- 📱 **Responsive Design** - Mobile-friendly interface with Tailwind CSS
- 🔐 **Security** - Password hashing, JWT tokens, role-based guards
- 📧 **Email Queue** - Bull + Redis for reliable email delivery

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│              React + TypeScript + Tailwind CSS               │
│  (Admin Dashboard, Event Management, QR Scanner Interface)   │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API + WebSocket
┌────────────────────────┴────────────────────────────────────┐
│                        Backend Layer                         │
│                   NestJS + TypeScript                        │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │   Auth   │  Events  │   Reg    │ Check-in │  Admin   │  │
│  │  Module  │  Module  │  Module  │  Module  │  Module  │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                        Data Layer                            │
│              MongoDB + Redis + File Storage                  │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Tech Stack

### Backend
- **Framework**: NestJS 10
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport JWT + bcrypt
- **Real-time**: Socket.io
- **Queue**: Bull + Redis
- **Email**: Nodemailer
- **File Upload**: Multer
- **QR Generation**: qrcode (Node)
- **Validation**: class-validator, class-transformer

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Routing**: React Router v6
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **QR Scanner**: html5-qrcode
- **QR Display**: qrcode.react
- **Charts**: Recharts
- **Forms**: React Hook Form

### DevOps & Tools
- **API Testing**: Postman
- **Version Control**: Git
- **Package Manager**: npm
- **Code Quality**: ESLint, Prettier
- **Containerization**: Docker (optional)

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB v5+
- Redis v6+ (optional, for email queue)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd event-registration-system
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
mkdir uploads
npm run start:dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
echo "REACT_APP_API_URL=http://localhost:3000/api" > .env
npm start
```

4. **Database Setup**
```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas cloud database
```

📖 **Detailed setup instructions**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## 📚 Documentation

- [Setup Guide](./SETUP_GUIDE.md) - Complete installation and configuration
- [API Documentation](./docs/API_DOCUMENTATION.md) - REST API endpoints
- [User Guide](./docs/USER_GUIDE.md) - Feature documentation
- [Implementation Progress](./IMPLEMENTATION_PROGRESS.md) - Development status
- [Postman Collection](./postman/) - API testing collection

## 🎯 Project Structure

```
event-registration-system/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── events/         # Event management
│   │   ├── registrations/  # Registration & tickets
│   │   ├── check-ins/      # QR scanning & check-in
│   │   ├── admin/          # Admin operations
│   │   └── notifications/  # Email notifications
│   ├── uploads/            # File storage
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # State management
│   │   └── routes/         # Route guards
│   └── package.json
├── postman/                # API collections
├── docs/                   # Documentation
└── README.md
```

## 🔑 User Roles & Permissions

### Admin
- Full system access
- User management (create, update, delete, role assignment)
- System analytics and reports
- Data export (CSV/Excel)
- All event operations

### Organizer
- Create and manage events
- View event registrations
- Check-in attendees (QR scanner)
- Event-specific analytics
- Send event notifications

### Attendee (Default)
- Browse and search events
- Register for events
- View personal tickets
- Access QR codes
- Cancel registrations

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Events
- `GET /api/events` - List all events (with filters)
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (Organizer/Admin)
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Registrations
- `POST /api/registrations` - Register for event
- `GET /api/registrations/user/:userId` - User's registrations
- `GET /api/registrations/:id/ticket` - Get ticket with QR
- `DELETE /api/registrations/:id` - Cancel registration

### Check-ins
- `POST /api/check-ins/scan` - Scan QR code
- `POST /api/check-ins/manual` - Manual check-in
- `GET /api/check-ins/event/:eventId` - Event check-ins
- `GET /api/check-ins/event/:eventId/statistics` - Check-in stats

### Admin
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/statistics` - System statistics
- `GET /api/admin/export/events` - Export events
- `GET /api/admin/export/registrations` - Export registrations

📖 **Full API documentation**: See [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run test:cov      # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm test              # Run tests
npm run test:coverage # Coverage report
```

### API Testing with Postman
1. Import collection from `postman/Event-Registration-API.postman_collection.json`
2. Import environment from `postman/Environment.postman_environment.json`
3. Run collection tests

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Role-based access control (RBAC)
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Rate limiting (recommended for production)
- ✅ Secure file upload validation
- ✅ SQL injection prevention (NoSQL)
- ✅ XSS protection

## 🌐 Deployment

### Backend Deployment
- Deploy to: Heroku, AWS, DigitalOcean, Railway
- Environment variables required
- MongoDB Atlas for database
- Redis Cloud for queue (optional)

### Frontend Deployment
- Deploy to: Vercel, Netlify, AWS S3 + CloudFront
- Build command: `npm run build`
- Set environment variables

### Docker Deployment (Optional)
```bash
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work*

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- React team for the frontend library
- MongoDB for the database
- All open-source contributors

## 📞 Support

For support, email support@eventregistration.com or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Payment integration (Stripe)
- [ ] Calendar integration (Google Calendar, iCal)
- [ ] Social media sharing
- [ ] Multi-language support
- [ ] Event categories and tags
- [ ] Waitlist functionality
- [ ] Recurring events
- [ ] Event templates
- [ ] Advanced analytics dashboard

---

**Made with ❤️ using NestJS, React, and MongoDB**

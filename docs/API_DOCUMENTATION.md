# API Documentation

Complete API documentation for the Event Registration & QR Scanner System.

## Base URL

```
Development: http://localhost:3001
Production: https://your-api-domain.com
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## User Roles

- **Admin**: Full system access, user management
- **Organizer**: Create/manage events, check-in attendees
- **Attendee**: Register for events, view tickets

---

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "attendee",
  "phone": "+1234567890",
  "company": "Tech Corp"
}
```

**Response:** `201 Created`
```json
{
  "_id": "user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "attendee",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Login

Authenticate user and receive JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "attendee"
  }
}
```

### Get Profile

Get current user profile.

**Endpoint:** `GET /auth/profile`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "_id": "user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "attendee",
  "phone": "+1234567890",
  "company": "Tech Corp"
}
```

---

## Event Endpoints

### Get All Events

Retrieve all events with optional filters.

**Endpoint:** `GET /events`

**Query Parameters:**
- `search` (optional): Search in title/description
- `startDate` (optional): Filter by start date
- `endDate` (optional): Filter by end date
- `location` (optional): Filter by location

**Response:** `200 OK`
```json
[
  {
    "_id": "event_id",
    "title": "Tech Conference 2024",
    "description": "Annual technology conference",
    "date": "2024-12-31T10:00:00.000Z",
    "location": "Convention Center",
    "capacity": 500,
    "organizerId": "organizer_id",
    "imageUrl": "https://example.com/image.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Event by ID

Retrieve a specific event.

**Endpoint:** `GET /events/:id`

**Response:** `200 OK`
```json
{
  "_id": "event_id",
  "title": "Tech Conference 2024",
  "description": "Annual technology conference",
  "date": "2024-12-31T10:00:00.000Z",
  "location": "Convention Center",
  "capacity": 500,
  "organizerId": "organizer_id",
  "registeredCount": 150
}
```

### Create Event

Create a new event (Organizer/Admin only).

**Endpoint:** `POST /events`

**Headers:** `Authorization: Bearer <organizer_token>`

**Request Body:**
```json
{
  "title": "Tech Conference 2024",
  "description": "Annual technology conference",
  "date": "2024-12-31T10:00:00.000Z",
  "location": "Convention Center",
  "capacity": 500,
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response:** `201 Created`

### Update Event

Update an existing event (Organizer/Admin only).

**Endpoint:** `PUT /events/:id`

**Headers:** `Authorization: Bearer <organizer_token>`

**Request Body:**
```json
{
  "title": "Updated Event Title",
  "capacity": 600
}
```

**Response:** `200 OK`

### Delete Event

Delete an event (Organizer/Admin only).

**Endpoint:** `DELETE /events/:id`

**Headers:** `Authorization: Bearer <organizer_token>`

**Response:** `200 OK`

---

## Registration Endpoints

### Register for Event

Register current user for an event.

**Endpoint:** `POST /registrations`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "eventId": "event_id"
}
```

**Response:** `201 Created`
```json
{
  "_id": "registration_id",
  "eventId": "event_id",
  "userId": "user_id",
  "ticketCode": "TICKET-UUID-12345",
  "qrCodeUrl": "data:image/png;base64,...",
  "status": "confirmed",
  "registeredAt": "2024-01-01T00:00:00.000Z"
}
```

### Get User Registrations

Get all registrations for a user.

**Endpoint:** `GET /registrations/user/:userId`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
[
  {
    "_id": "registration_id",
    "eventId": {
      "_id": "event_id",
      "title": "Tech Conference 2024",
      "date": "2024-12-31T10:00:00.000Z"
    },
    "ticketCode": "TICKET-UUID-12345",
    "status": "confirmed"
  }
]
```

### Get Ticket

Get ticket details with QR code.

**Endpoint:** `GET /registrations/:id/ticket`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "registration": {
    "_id": "registration_id",
    "ticketCode": "TICKET-UUID-12345",
    "status": "confirmed"
  },
  "event": {
    "title": "Tech Conference 2024",
    "date": "2024-12-31T10:00:00.000Z",
    "location": "Convention Center"
  },
  "qrCodeUrl": "data:image/png;base64,..."
}
```

### Cancel Registration

Cancel a registration.

**Endpoint:** `DELETE /registrations/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

## Check-in Endpoints

### Scan QR Code

Check-in attendee by scanning QR code (Organizer/Admin only).

**Endpoint:** `POST /check-ins/scan`

**Headers:** `Authorization: Bearer <organizer_token>`

**Request Body:**
```json
{
  "ticketCode": "TICKET-UUID-12345",
  "eventId": "event_id"
}
```

**Response:** `201 Created`
```json
{
  "_id": "checkin_id",
  "registrationId": "registration_id",
  "scannedBy": "organizer_id",
  "scannedAt": "2024-01-01T10:00:00.000Z",
  "method": "qr",
  "attendee": {
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

### Manual Check-in

Manually check-in attendee (Organizer/Admin only).

**Endpoint:** `POST /check-ins/manual`

**Headers:** `Authorization: Bearer <organizer_token>`

**Request Body:**
```json
{
  "registrationId": "registration_id"
}
```

**Response:** `201 Created`

### Get Check-in History

Get all check-ins for an event.

**Endpoint:** `GET /check-ins/event/:eventId`

**Headers:** `Authorization: Bearer <organizer_token>`

**Response:** `200 OK`
```json
[
  {
    "_id": "checkin_id",
    "registrationId": "registration_id",
    "scannedBy": "organizer_id",
    "scannedAt": "2024-01-01T10:00:00.000Z",
    "method": "qr",
    "attendee": {
      "name": "John Doe",
      "email": "user@example.com"
    }
  }
]
```

### Get Check-in Statistics

Get check-in statistics for an event.

**Endpoint:** `GET /check-ins/stats/:eventId`

**Headers:** `Authorization: Bearer <organizer_token>`

**Response:** `200 OK`
```json
{
  "totalRegistrations": 500,
  "totalCheckIns": 350,
  "checkInRate": 70,
  "pendingCheckIns": 150,
  "recentCheckIns": [...]
}
```

---

## Admin Endpoints

### Get All Users

Get all users in the system (Admin only).

**Endpoint:** `GET /admin/users`

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** `200 OK`
```json
[
  {
    "_id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "attendee",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Update User Role

Update a user's role (Admin only).

**Endpoint:** `PUT /admin/users/:id/role`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "role": "organizer"
}
```

**Response:** `200 OK`

### Delete User

Delete a user (Admin only).

**Endpoint:** `DELETE /admin/users/:id`

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** `200 OK`

### Get System Statistics

Get system-wide statistics (Admin only).

**Endpoint:** `GET /admin/stats`

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** `200 OK`
```json
{
  "totalUsers": 1000,
  "totalEvents": 50,
  "totalRegistrations": 5000,
  "totalCheckIns": 3500,
  "usersByRole": {
    "admin": 5,
    "organizer": 45,
    "attendee": 950
  }
}
```

### Export Events

Export all events to CSV (Admin only).

**Endpoint:** `GET /admin/events/export`

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** `200 OK` (CSV file download)

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": ["email must be a valid email"]
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "User already registered for this event"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## WebSocket Events

### Connection

Connect to WebSocket for real-time updates:

```javascript
const socket = io('http://localhost:3001', {
  auth: {
    token: 'your_jwt_token'
  }
});
```

### Join Event Room

```javascript
socket.emit('joinEvent', { eventId: 'event_id' });
```

### Listen for Check-ins

```javascript
socket.on('checkInCreated', (data) => {
  console.log('New check-in:', data);
});
```

### Listen for Statistics Updates

```javascript
socket.on('statisticsUpdated', (data) => {
  console.log('Updated stats:', data);
});
```

---

## Rate Limiting

- **General endpoints**: 100 requests per 15 minutes
- **Authentication endpoints**: 5 requests per 15 minutes
- **Admin endpoints**: 200 requests per 15 minutes

## Pagination

For endpoints returning lists, use query parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Example: `GET /events?page=2&limit=20`

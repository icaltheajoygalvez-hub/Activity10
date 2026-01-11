# QRentry Event Registration System - API Documentation

**Version:** 1.0  
**Last Updated:** January 12, 2026  
**Base URL:** `http://localhost:3001/api`

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [Rate Limiting](#rate-limiting)
5. [Authentication Endpoints](#authentication-endpoints)
6. [Event Endpoints](#event-endpoints)
7. [Registration Endpoints](#registration-endpoints)
8. [Check-in Endpoints](#check-in-endpoints)
9. [Admin Endpoints](#admin-endpoints)
10. [Common Response Formats](#common-response-formats)

---

## Overview

The QRentry API is a RESTful service that provides endpoints for:
- User authentication and management
- Event creation and discovery
- Event registration and ticketing
- Attendee check-in management
- Administrative operations

**Key Features:**
- JWT-based authentication
- Role-based access control (RBAC)
- Real-time event management
- QR code ticket generation
- Comprehensive error handling

---

## Authentication

### JWT Token

The API uses JWT (JSON Web Tokens) for authentication. 

**Token Format:**
```
Authorization: Bearer <your_jwt_token>
```

**Token Includes:**
- User ID
- User role
- Issue timestamp
- Expiration time (24 hours)

**How to Get a Token:**
1. Register or login via `/api/auth/register` or `/api/auth/login`
2. Receive JWT token in response
3. Include in all subsequent requests in the `Authorization` header

**Token Expiration:**
- Tokens expire after 24 hours
- Expired tokens will return 401 Unauthorized
- Users must re-login to get a new token

---

## Error Handling

All API errors follow a consistent format:

```json
{
  "statusCode": 400,
  "message": "Error message describing what went wrong",
  "error": "BadRequest"
}
```

### Common HTTP Status Codes

| Status | Meaning |
|--------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server issue |

---

## Rate Limiting

- **Rate Limit:** 100 requests per 15 minutes per IP
- **Headers:**
  - `X-RateLimit-Limit`: 100
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Time until limit resets

If you exceed the rate limit, you'll receive a 429 (Too Many Requests) error.

---

## Authentication Endpoints

### 1. Register User

Create a new user account.

**Endpoint:**
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "attendee",
  "phone": "1234567890",
  "company": "Tech Corp"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | Yes | Full name (min 2 chars) |
| email | string | Yes | Valid email address |
| password | string | Yes | Min 6 characters |
| role | string | Yes | `attendee`, `organizer`, or `admin` |
| phone | string | No | Contact phone number |
| company | string | No | Company name |

**Success Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "attendee",
  "phone": "1234567890",
  "company": "Tech Corp",
  "createdAt": "2026-01-12T10:30:00Z"
}
```

**Error Response (400):**
```json
{
  "statusCode": 400,
  "message": "Email already registered",
  "error": "BadRequest"
}
```

---

### 2. Login User

Authenticate user and get JWT token.

**Endpoint:**
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | Yes | User email |
| password | string | Yes | User password |

**Success Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "attendee"
  }
}
```

**Error Response (401):**
```json
{
  "statusCode": 401,
  "message": "Invalid email or password",
  "error": "Unauthorized"
}
```

---

### 3. Logout User

Invalidate current session.

**Endpoint:**
```
POST /api/auth/logout
```

**Headers Required:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## Event Endpoints

### 4. Get All Events

Retrieve list of all events.

**Endpoint:**
```
GET /api/events
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10, max: 100) |
| search | string | Search by event name |
| status | string | Filter by status: `upcoming`, `ongoing`, `past` |
| category | string | Filter by category |

**Example Request:**
```
GET /api/events?page=1&limit=20&status=upcoming&search=bootcamp
```

**Success Response (200):**
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Web Development Bootcamp",
      "description": "Learn web development from scratch",
      "date": "2026-02-15T09:00:00Z",
      "location": "IT Building, Cavite State University",
      "capacity": 100,
      "registrations": 45,
      "organizer": {
        "_id": "507f1f77bcf86cd799439001",
        "name": "John Smith"
      },
      "status": "upcoming",
      "createdAt": "2026-01-12T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

---

### 5. Get Event Details

Retrieve detailed information about a specific event.

**Endpoint:**
```
GET /api/events/:id
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Event ID (MongoDB ObjectId) |

**Example Request:**
```
GET /api/events/507f1f77bcf86cd799439012
```

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Web Development Bootcamp",
  "description": "Learn web development from scratch",
  "date": "2026-02-15T09:00:00Z",
  "endDate": "2026-02-15T17:00:00Z",
  "location": "IT Building, Cavite State University",
  "capacity": 100,
  "registrations": 45,
  "status": "upcoming",
  "organizer": {
    "_id": "507f1f77bcf86cd799439001",
    "name": "John Smith",
    "email": "john@example.com"
  },
  "image": "https://example.com/event-image.jpg",
  "category": "education",
  "createdAt": "2026-01-12T10:30:00Z",
  "updatedAt": "2026-01-12T10:30:00Z"
}
```

**Error Response (404):**
```json
{
  "statusCode": 404,
  "message": "Event not found",
  "error": "NotFound"
}
```

---

### 6. Create Event

Create a new event. **Requires: Organizer or Admin role**

**Endpoint:**
```
POST /api/events
```

**Headers Required:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Web Development Bootcamp",
  "description": "Learn web development from scratch including HTML, CSS, JavaScript, React, and Node.js",
  "date": "2026-02-15T09:00:00Z",
  "endDate": "2026-02-15T17:00:00Z",
  "location": "IT Building, Cavite State University",
  "capacity": 100,
  "category": "education",
  "image": "https://example.com/event-image.jpg"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| title | string | Yes | Event name (min 3, max 100 chars) |
| description | string | Yes | Event description (min 10 chars) |
| date | ISO8601 | Yes | Event start date/time |
| endDate | ISO8601 | Yes | Event end date/time |
| location | string | Yes | Event venue |
| capacity | number | Yes | Max attendees (min 1) |
| category | string | No | Event category |
| image | string | No | Event image URL |

**Success Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Web Development Bootcamp",
  "description": "Learn web development from scratch...",
  "date": "2026-02-15T09:00:00Z",
  "endDate": "2026-02-15T17:00:00Z",
  "location": "IT Building, Cavite State University",
  "capacity": 100,
  "registrations": 0,
  "organizer": "507f1f77bcf86cd799439001",
  "status": "upcoming",
  "createdAt": "2026-01-12T10:30:00Z"
}
```

**Error Response (403):**
```json
{
  "statusCode": 403,
  "message": "Only organizers can create events",
  "error": "Forbidden"
}
```

---

### 7. Update Event

Update event details. **Requires: Event organizer or Admin**

**Endpoint:**
```
PUT /api/events/:id
```

**Headers Required:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:** (All fields optional)
```json
{
  "title": "Advanced Web Development Bootcamp",
  "capacity": 150,
  "location": "New Building, Campus"
}
```

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Advanced Web Development Bootcamp",
  "capacity": 150,
  "location": "New Building, Campus",
  ...
}
```

---

### 8. Delete Event

Delete an event. **Requires: Event organizer or Admin**

**Endpoint:**
```
DELETE /api/events/:id
```

**Headers Required:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "message": "Event deleted successfully"
}
```

---

## Registration Endpoints

### 9. Create Registration

Register for an event.

**Endpoint:**
```
POST /api/registrations
```

**Headers Required:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "eventId": "507f1f77bcf86cd799439012"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| eventId | string | Yes | Event ID to register for |

**Success Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439050",
  "eventId": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "ticketCode": "5b54dcd9-e8f9-4a61-8f69-c547776d8b88",
  "status": "confirmed",
  "registeredAt": "2026-01-12T10:30:00Z"
}
```

**Error Response (409):**
```json
{
  "statusCode": 409,
  "message": "You are already registered for this event",
  "error": "Conflict"
}
```

---

### 10. Get My Registrations

Get all registrations for logged-in user.

**Endpoint:**
```
GET /api/registrations/user/:userId
```

**Headers Required:**
```
Authorization: Bearer <your_jwt_token>
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| userId | string | User ID |

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439050",
    "eventId": {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Web Development Bootcamp",
      "date": "2026-02-15T09:00:00Z",
      "location": "IT Building, Cavite State University"
    },
    "ticketCode": "5b54dcd9-e8f9-4a61-8f69-c547776d8b88",
    "status": "confirmed",
    "registeredAt": "2026-01-12T10:30:00Z"
  }
]
```

---

### 11. Get Event Registrations

Get all registrations for a specific event. **Requires: Event organizer or Admin**

**Endpoint:**
```
GET /api/registrations/event/:eventId
```

**Headers Required:**
```
Authorization: Bearer <your_jwt_token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter by status: `confirmed`, `cancelled` |
| page | number | Page number |
| limit | number | Items per page |

**Success Response (200):**
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439050",
      "userId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "ticketCode": "5b54dcd9-e8f9-4a61-8f69-c547776d8b88",
      "status": "confirmed",
      "registeredAt": "2026-01-12T10:30:00Z",
      "checkedInAt": "2026-02-15T09:15:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 10
}
```

---

### 12. Get Ticket

Get ticket details by registration ID.

**Endpoint:**
```
GET /api/registrations/:id/ticket
```

**Headers Required:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439050",
  "eventId": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Web Development Bootcamp",
    "date": "2026-02-15T09:00:00Z",
    "location": "IT Building, Cavite State University"
  },
  "ticketCode": "5b54dcd9-e8f9-4a61-8f69-c547776d8b88",
  "status": "confirmed",
  "registeredAt": "2026-01-12T10:30:00Z"
}
```

---

### 13. Cancel Registration

Cancel event registration and delete ticket.

**Endpoint:**
```
DELETE /api/registrations/:id
```

**Headers Required:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "message": "Registration cancelled successfully"
}
```

**Error Response (404):**
```json
{
  "statusCode": 404,
  "message": "Registration not found",
  "error": "NotFound"
}
```

---

## Check-in Endpoints

### 14. Check-in Attendee

Mark an attendee as checked in using ticket code. **Requires: Organizer or Admin**

**Endpoint:**
```
POST /api/check-in
```

**Headers Required:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "ticketCode": "5b54dcd9-e8f9-4a61-8f69-c547776d8b88",
  "eventId": "507f1f77bcf86cd799439012"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| ticketCode | string | Yes | Ticket QR code value |
| eventId | string | Yes | Event ID for validation |

**Success Response (200):**
```json
{
  "message": "Check-in successful",
  "attendee": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "checkedInAt": "2026-02-15T09:15:00Z"
}
```

**Error Response (404):**
```json
{
  "statusCode": 404,
  "message": "Invalid ticket code",
  "error": "NotFound"
}
```

---

### 15. Get Event Statistics

Get attendance and registration stats. **Requires: Event organizer or Admin**

**Endpoint:**
```
GET /api/registrations/event/:eventId/statistics
```

**Headers Required:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "eventId": "507f1f77bcf86cd799439012",
  "eventTitle": "Web Development Bootcamp",
  "totalCapacity": 100,
  "totalRegistrations": 45,
  "confirmedRegistrations": 44,
  "cancelledRegistrations": 1,
  "checkedInCount": 32,
  "percentageCheckedIn": 72.7,
  "registrationRate": 45,
  "lastUpdated": "2026-02-15T10:30:00Z"
}
```

---

## Admin Endpoints

### 16. Get All Users

Get list of all users. **Requires: Admin**

**Endpoint:**
```
GET /api/admin/users
```

**Headers Required:**
```
Authorization: Bearer <admin_jwt_token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| role | string | Filter by role: `attendee`, `organizer`, `admin` |
| search | string | Search by name or email |
| page | number | Page number |
| limit | number | Items per page |

**Success Response (200):**
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "attendee",
      "createdAt": "2026-01-12T10:30:00Z",
      "updatedAt": "2026-01-12T10:30:00Z"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 10
}
```

---

### 17. Update User

Update user details. **Requires: Admin**

**Endpoint:**
```
PUT /api/admin/users/:id
```

**Headers Required:**
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "role": "organizer",
  "name": "John Smith"
}
```

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Smith",
  "email": "john@example.com",
  "role": "organizer",
  "updatedAt": "2026-01-12T11:00:00Z"
}
```

---

### 18. Delete User

Delete a user account. **Requires: Admin**

**Endpoint:**
```
DELETE /api/admin/users/:id
```

**Headers Required:**
```
Authorization: Bearer <admin_jwt_token>
```

**Success Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

---

### 19. Get Dashboard Statistics

Get system-wide statistics. **Requires: Admin**

**Endpoint:**
```
GET /api/admin/dashboard
```

**Headers Required:**
```
Authorization: Bearer <admin_jwt_token>
```

**Success Response (200):**
```json
{
  "totalUsers": 350,
  "totalEvents": 25,
  "totalRegistrations": 1250,
  "activeEvents": 5,
  "upcomingEvents": 8,
  "pastEvents": 12,
  "usersByRole": {
    "attendee": 300,
    "organizer": 40,
    "admin": 10
  },
  "registrationTrend": {
    "thisMonth": 450,
    "lastMonth": 380,
    "growth": 18.4
  },
  "lastUpdated": "2026-01-12T10:30:00Z"
}
```

---

## Common Response Formats

### Success Response Format

```json
{
  "data": {},
  "message": "Operation successful"
}
```

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Error message describing the issue",
  "error": "ErrorType"
}
```

### Paginated Response Format

```json
{
  "data": [],
  "total": 100,
  "page": 1,
  "limit": 10,
  "pages": 10
}
```

---

## Example Complete Flow

### 1. User Registration

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "SecurePass123",
    "role": "attendee"
  }'
```

### 2. User Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "SecurePass123"
  }'
```

Response includes `access_token`

### 3. Browse Events

```bash
curl -X GET "http://localhost:3001/api/events?status=upcoming" \
  -H "Authorization: Bearer <access_token>"
```

### 4. Register for Event

```bash
curl -X POST http://localhost:3001/api/registrations \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "507f1f77bcf86cd799439012"
  }'
```

### 5. Get My Tickets

```bash
curl -X GET "http://localhost:3001/api/registrations/user/507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer <access_token>"
```

---

## Best Practices

1. **Always include Authorization header** for protected endpoints
2. **Validate input** before sending to API
3. **Handle errors gracefully** with proper error messages
4. **Cache responses** when appropriate
5. **Implement retry logic** for failed requests
6. **Keep tokens secure** - never expose in client-side code
7. **Use appropriate HTTP methods** (GET, POST, PUT, DELETE)
8. **Test endpoints** with Postman or similar tools before integration

---

## Support

For API issues or questions:
- Check error messages and status codes
- Review this documentation
- Check server logs for detailed error information
- Contact development team if issue persists

---

**Last Updated:** January 12, 2026  
**Status:** Production Ready

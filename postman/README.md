# Postman API Collection

This directory contains the Postman collection for testing the Event Registration & QR Scanner API.

## Setup Instructions

### 1. Import Collection

1. Open Postman
2. Click "Import" button
3. Select `Event-Registration-API.postman_collection.json`
4. The collection will be imported with all endpoints

### 2. Configure Environment Variables

The collection uses the following variables:

- `base_url`: API base URL (default: `http://localhost:3001`)
- `admin_token`: JWT token for admin user
- `organizer_token`: JWT token for organizer user
- `attendee_token`: JWT token for attendee user
- `event_id`: ID of a test event
- `registration_id`: ID of a test registration

### 3. Testing Workflow

#### Step 1: Register Users

1. Use "Register User" endpoint to create users with different roles:
   - Admin: `{ "role": "admin" }`
   - Organizer: `{ "role": "organizer" }`
   - Attendee: `{ "role": "attendee" }`

#### Step 2: Login and Save Tokens

1. Use "Login" endpoint for each user
2. Copy the `access_token` from response
3. Save tokens in collection variables:
   - Admin token → `admin_token`
   - Organizer token → `organizer_token`
   - Attendee token → `attendee_token`

#### Step 3: Test Event Management

1. Use organizer token to create an event
2. Save the event `_id` to `event_id` variable
3. Test other event endpoints (get, update, delete)

#### Step 4: Test Registrations

1. Use attendee token to register for an event
2. Save registration `_id` to `registration_id` variable
3. Get ticket with QR code
4. Test cancellation

#### Step 5: Test Check-ins

1. Use organizer token to scan QR codes
2. Test manual check-in
3. View check-in statistics

#### Step 6: Test Admin Features

1. Use admin token to manage users
2. Update user roles
3. View system statistics
4. Export events to CSV

## API Endpoints Overview

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile

### Events
- `GET /events` - Get all events
- `GET /events/:id` - Get event by ID
- `POST /events` - Create event (Organizer)
- `PUT /events/:id` - Update event (Organizer)
- `DELETE /events/:id` - Delete event (Organizer)

### Registrations
- `POST /registrations` - Register for event
- `GET /registrations/user/:userId` - Get user registrations
- `GET /registrations/:id/ticket` - Get ticket with QR code
- `DELETE /registrations/:id` - Cancel registration

### Check-ins
- `POST /check-ins/scan` - Scan QR code (Organizer)
- `POST /check-ins/manual` - Manual check-in (Organizer)
- `GET /check-ins/stats/:eventId` - Get statistics (Organizer)

### Admin
- `GET /admin/users` - Get all users (Admin)
- `PUT /admin/users/:id/role` - Update user role (Admin)
- `GET /admin/stats` - Get system statistics (Admin)
- `GET /admin/events/export` - Export events CSV (Admin)

## Tips

1. **Authorization**: Most endpoints require Bearer token authentication
2. **Role-Based Access**: Ensure you use the correct token for each endpoint
3. **IDs**: Save important IDs (event_id, registration_id) as variables for easy reuse
4. **Error Handling**: Check response status codes and error messages
5. **Testing Order**: Follow the workflow above for comprehensive testing

## Common Issues

### 401 Unauthorized
- Token expired or invalid
- Solution: Login again and update token

### 403 Forbidden
- Insufficient permissions
- Solution: Use correct role token (admin/organizer/attendee)

### 404 Not Found
- Resource doesn't exist
- Solution: Verify IDs in variables

### 400 Bad Request
- Invalid request data
- Solution: Check request body format and required fields

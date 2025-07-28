# User Profile Update API

## Endpoint

**PUT** `/api/user/profile`

## Description

Updates the current user's profile information. Users can only update their own profile.

## Authentication

Required. User must be authenticated with a valid Firebase JWT token.

## Request Headers

```
Content-Type: application/json
Authorization: Bearer <firebase-jwt-token>
```

## Request Body

```json
{
  "firstName": "string (required)",
  "lastName": "string (required)", 
  "email": "string (required, must be valid email)",
  "phoneNumber": "string (required, E.164 format)",
  "dateOfBirth": "string (required, ISO date format YYYY-MM-DD)"
}
```

### Validation Rules

- `firstName`: Required, non-empty string
- `lastName`: Required, non-empty string  
- `email`: Required, valid email format, must be unique across all users
- `phoneNumber`: Required, valid international phone format (E.164)
- `dateOfBirth`: Required, valid date format

## Response

### Success Response (200 OK)

```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phoneNumber": "string",
  "dateOfBirth": "string",
  "status": "string",
  "role": {
    "id": "string",
    "name": "string",
    "description": "string"
  }
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "email must be an email"
    }
  ]
}
```

#### 401 Unauthorized
```json
{
  "message": "Missing or invalid Authorization header"
}
```

#### 403 Forbidden
```json
{
  "message": "You are not authorized to update user profiles"
}
```

#### 409 Conflict
```json
{
  "message": "Email already exists"
}
```

#### 500 Internal Server Error
```json
{
  "message": "Failed to update profile"
}
```

## Business Logic

1. **Authentication Check**: Verifies the user is authenticated via Firebase JWT
2. **Authorization**: Uses CASL to ensure user can only update their own profile
3. **Validation**: Validates all input fields according to the rules above
4. **Email Uniqueness**: Checks that the email is not already taken by another user
5. **Database Update**: Updates the user record in the database
6. **Response**: Returns the updated user object with role information

## Security Considerations

- Input sanitization is handled by class-validator decorators
- SQL injection prevention via Prisma ORM
- CASL-based authorization ensures users can only update their own profile
- Email uniqueness check prevents conflicts

## Example Usage

### cURL
```bash
curl -X PUT http://localhost:3000/user/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-firebase-jwt-token>" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "phoneNumber": "+38761234568",
    "dateOfBirth": "1995-05-15"
  }'
```

### JavaScript/Fetch
```javascript
const response = await fetch('/user/profile', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${firebaseToken}`
  },
  body: JSON.stringify({
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phoneNumber: '+38761234568',
    dateOfBirth: '1995-05-15'
  })
});

const updatedUser = await response.json();
```

## Testing

The endpoint includes comprehensive e2e tests covering:
- Successful profile updates
- Duplicate email validation
- Authentication requirements
- Authorization checks

Run tests with:
```bash
npm run test:e2e
``` 
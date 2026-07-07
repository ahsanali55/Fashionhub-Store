Authentication Flow

Now your backend works like this:

User Input
    |
    ↓
Zod Validation as well as Validate with middleware
    |
    ↓
Controller
    |
    ↓
Service
    |
    ↓
MongoDB
    |
    ↓
Response

JWT Authentication Middleware
Goal

Create middleware that verifies JWT tokens and protects private routes.

New flow:

Client Request
      |
      ↓
JWT Token
      |
      ↓
Authentication Middleware
      |
      ↓
Verify Token
      |
      ↓
Find User
      |
      ↓
req.user
      |
      ↓
Controller
# Authentication Flow

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

# JWT Authentication Middleware
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

# Difference b/w

Authentication answers "Who are you?"

Authorization answers "What are you allowed to do?"

# Role-Based Authorization Middleware

Create middleware that restricts access based on the authenticated user's role.

Flow:

Request
   │
   ▼
JWT Authentication (protect)
   │
   ▼
Role Authorization
   │
   ▼
Controller

/customer/*

will only be accessible to customers.

/supplier/*

will only be accessible to suppliers.

/admin/*

will only be accessible to admins.

This same middleware will protect:

Product Management
Orders
Analytics
User Management
Reports
Reviews

without duplicating authorization logic.

# At this point, you've built:

✅ User Registration
✅ User Login
✅ Password Hashing
✅ JWT Authentication
✅ Protected Routes
✅ Role-Based Authorization
✅ Zod Validation
✅ Global Error Handling

This is already a solid authentication foundation.

# One Important Change
we've been building a REST API backend, which is great. But your frontend is:

✅ Next.js App Router
✅ MERN Stack
✅ Redux Toolkit

For this stack, the most secure and production-ready approach is:

Access Token → Short-lived (stored in an HttpOnly cookie)
Refresh Token → Long-lived (also stored in an HttpOnly cookie)
Redux → Stores only user information (never JWTs)

This is more secure than storing tokens in localStorage because it helps protect against XSS attacks.

# Access Token & Refresh Token (Production Authentication)
Login
   │
   ▼
Generate Access Token (15 min)
   │
   ▼
Generate Refresh Token (7 days)
   │
   ▼
Store Refresh Token in Database
   │
   ▼
Send Both as HttpOnly Cookies

src/
├── utils/
│   ├── generateAccessToken.ts
│   └── generateRefreshToken.ts
│
├── controllers/
│   └── auth.controller.ts (updated)
│
├── routes/
│   └── auth.routes.ts (updated)
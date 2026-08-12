Architecture becomes:

Login Page
     ↓
Redux Auth
     ↓
auth.service.ts
     ↓
lib/axios.ts
     ↓
FashionHub Backend



Login Form
    ↓
dispatch(login())
    ↓
Redux Auth Thunk
    ↓
auth.service.ts
    ↓
Axios
    ↓
Backend /auth/login
    ↓
HttpOnly Cookies
    ↓
Redux stores Customer
    ↓
/customer/dashboard

Register Page
      ↓
Redux register()
      ↓
auth.service.ts
      ↓
Axios
      ↓
POST /auth/register
      ↓
Backend
      ↓
MongoDB
      ↓
Customer created
      ↓
Authentication cookie
      ↓
Redux user

Your final authentication architecture

You'll now have:

                    Browser
                       │
                       │ Refresh
                       ↓
                Next.js Application
                       │
                       ↓
                 AuthProvider
                       │
                       ↓
             fetchCurrentUser()
                       │
                       ↓
                 Axios API
                       │
                Cookie automatically
                       │
                       ↓
                 GET /auth/me
                       │
                       ↓
                    Backend
                       │
                       ↓
              Verify Access Token
                       │
                       ↓
                Return Customer
                       │
                       ↓
                    Redux
                       │
                       ↓
              isAuthenticated=true
                       │
                       ↓
              Customer Dashboard
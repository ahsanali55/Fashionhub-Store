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
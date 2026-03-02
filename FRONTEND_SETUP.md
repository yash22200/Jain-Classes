# Frontend Setup & Dashboard Guide

## What's New

✅ **Authentication System** implemented with JWT
✅ **Admin Dashboard** - Protected route for admin users
✅ **Student Dashboard** - Protected route for student users
✅ **Auth Context** - Global authentication state management
✅ **Protected Routes** - Role-based access control
✅ **Login/Signup Forms** - Connected to backend API
✅ **Updated Navbar** - Shows dashboard/logout when logged in

## Frontend Structure

### New Files Created

```
src/
├── context/
│   └── AuthContext.tsx              # Auth state & functions
├── components/
│   └── ProtectedRoute.tsx           # Route protection wrapper
├── pages/
│   ├── AdminDashboard.tsx           # Admin dashboard
│   ├── StudentDashboard.tsx         # Student dashboard
│   ├── Login.tsx                    # Updated login form
│   └── Signup.tsx                   # Updated signup form
```

## Features

### 1. Authentication Context (`AuthContext.tsx`)

- Manages user login/logout state
- Stores token and user data in localStorage
- Provides `useAuth()` hook for any component

```typescript
const { user, token, login, register, logout } = useAuth();
```

### 2. Protected Routes (`ProtectedRoute.tsx`)

- Redirect unauthenticated users to `/login`
- Redirect users from wrong role to home page
- Optional role-based protection

```typescript
<ProtectedRoute role="admin">
  <AdminDashboard />
</ProtectedRoute>
```

### 3. Updated Navbar

- Shows "Login" & "Sign Up" for guest users
- Shows "Dashboard" & "Logout" for logged-in users
- Dashboard link based on user role (admin/student)

## How to Test

### Prerequisites

1. **Backend running** on `http://localhost:5000`
   ```bash
   cd backend
   npm run dev
   ```

2. **Frontend running** on `http://localhost:5173`
   ```bash
   npm run dev
   ```

### Sample Credentials

#### Option A: Create New Accounts

1. Go to **Sign Up** page
2. Fill in the form
3. You'll automatically be logged in as a **student**

#### Option B: Use Pre-seeded Admin Account

To create an admin account, follow these steps:

1. First, register a user account normally via sign-up
2. Open MongoDB Compass or MongoDB Atlas
3. Connect to your database
4. Find the `users` collection
5. Edit one user document and change `role` from `"student"` to `"admin"`

Or use MongoDB CLI:
```bash
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

#### Sample Test Accounts (after setup)

**Student Account:**
```
Email: student@example.com
Password: password123
Role: student
```

To create: Sign up with these credentials

**Admin Account:**
```
Email: admin@example.com
Password: password123
Role: admin
```

To create:
1. Sign up with email `admin@example.com`
2. Update role to "admin" in database

## User Flow

### Unauthenticated User

```
Home Page
  ↓
Click "Login" → Login Page
  ↓
Enter credentials
  ↓
Authenticated ✓
  ↓
Redirect based on role:
  - Admin → /admin
  - Student → /student
```

### Signup Flow

```
Sign Up Page
  ↓
Fill form (name, email, password)
  ↓
Submit
  ↓
Automatically logged in as "student"
  ↓
Redirect to /student dashboard
```

### Protected Routes

```
Try to access /admin
  ↓
Not authenticated → Redirect to /login
  ↓
Not admin role → Redirect to home (/)
  ↓
Admin role → Access allowed ✓
```

## Testing Dashboard Access

### Try as Student

1. Sign up new account
2. Automatically redirected to `/student` dashboard
3. Click "Dashboard" in navbar goes to student dashboard
4. Click "Logout" clears session

### Try as Admin

1. Sign up account
2. Update role in MongoDB to "admin"
3. Login with that account
4. Automatically redirected to `/admin` dashboard
5. Try to access `/student` → redirects home (wrong role)

## API Endpoints Used

### Register
```
POST http://localhost:5000/api/auth/register
Body: { name, email, password, confirmPassword }
```

### Login
```
POST http://localhost:5000/api/auth/login
Body: { email, password }
Response: { success, token, user }
```

### Get Current User (Protected)
```
GET http://localhost:5000/api/auth/me
Headers: { Authorization: Bearer <token> }
```

## Token Management

- **Stored**: `localStorage.getItem('token')`
- **Duration**: 7 days expiration
- **Auto-load**: Token loads from localStorage on page refresh
- **Sent**: Authorization header as `Bearer <token>`

## Local Storage

```javascript
localStorage.setItem('token', 'jwt_token_here');
localStorage.setItem('user', JSON.stringify({
  id: '...',
  name: 'User Name',
  email: 'user@example.com',
  role: 'student' | 'admin'
}));
```

## Error Handling

Login/Signup errors display as:
```
"Invalid credentials"
"Email already registered"
"Passwords do not match"
"Please provide all required fields"
```

## Next Steps (Enhancement Ideas)

- [ ] Implement profile page
- [ ] Add refresh token mechanism
- [ ] Create admin panel with user management
- [ ] Add student course enrollment
- [ ] Implement password reset
- [ ] Add email verification
- [ ] Create student result view
- [ ] Implement admin analytics dashboard

## Troubleshooting

### "Cannot reach backend"
- Ensure backend runs on `http://localhost:5000`
- Check CORS is enabled
- Verify `.env` in backend has correct MongoDB URI

### "Token is undefined"
- Check browser DevTools → Application → LocalStorage
- Verify token exists after login
- Login again if token expired (7 days)

### "Wrong role redirect"
- Ensure MongoDB has correct role field
- Login again after changing role
- Check localStorage for correct user data

### "Form not submitting"
- Fill all required fields
- Check console for error messages
- Verify backend is running

## File Changes Summary

| File | Changes |
|------|---------|
| `App.tsx` | Added AuthProvider, routes for /admin & /student |
| `Login.tsx` | Form handling, API integration, role-based redirect |
| `Signup.tsx` | Form handling, API integration, auto-login |
| `Navbar.tsx` | Conditional render (login/signup vs dashboard/logout) |
| **New** | AuthContext.tsx, ProtectedRoute.tsx, dashboards |

---

**Ready to test?** Start backend, start frontend, and visit `http://localhost:5173`!

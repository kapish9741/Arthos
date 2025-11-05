# Routing Structure

This application uses **React Router DOM** for client-side routing.

## Available Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | HomePage | Landing page with options to login or signup |
| `/login` | LoginPage | Sign-in page with email and verification code flow |
| `/signup` | SignupPage | Registration page with signup form |
| `/dashboard` | DashboardPage | Protected dashboard page (after successful authentication) |

## Navigation Flow

### User Journey
1. **Home Page (`/`)** 
   - User lands on the home page
   - Can choose to Login or Sign Up

2. **Login Page (`/login`)**
   - Step 1: Enter email
   - Step 2: Enter 6-digit verification code
   - Step 3: Success screen → redirects to `/dashboard`

3. **Signup Page (`/signup`)**
   - Fill out registration form (Name, Email, Password, Confirm Password)
   - Success screen → redirects to `/dashboard`

4. **Dashboard Page (`/dashboard`)**
   - Main application dashboard (after authentication)

## Component Structure

### Main Routing Component
- **App.tsx**: Contains the main `BrowserRouter` and route definitions

### Page Components
- **HomePage.tsx**: Landing page
- **LoginPage.tsx**: Wrapper for the SignInPage component
- **SignupPage.tsx**: Signup form with animations
- **DashboardPage.tsx**: Dashboard view

### Shared Components
- **sign-in-flow-1.tsx**: Contains SignInPage component and CanvasRevealEffect
- **SignInPage.tsx**: UI wrapper (deprecated, use pages instead)

## Key Features

✅ React Router DOM v7 integration  
✅ Animated page transitions with Framer Motion  
✅ Canvas reveal effects on form submission  
✅ Navigation buttons in navbar  
✅ Programmatic navigation with `useNavigate()`  
✅ Responsive design for mobile and desktop  

## How to Navigate Programmatically

```tsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/dashboard');
  };
  
  return <button onClick={handleClick}>Go to Dashboard</button>;
}
```

## Testing the Routes

Run the development server:
```bash
npm run dev
```

Then visit:
- Home: http://localhost:5174/
- Login: http://localhost:5174/login
- Signup: http://localhost:5174/signup
- Dashboard: http://localhost:5174/dashboard

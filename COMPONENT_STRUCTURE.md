# Component Structure Overview

## 📁 File Structure

```
client/src/
├── App.jsx
│   └── Routes configured for: /, /auth, /home
│
├── routes/
│   ├── authentication/
│   │   ├── landing-page.jsx        ✨ NEW - Hero section with CTA
│   │   ├── auth-page.jsx           ✨ NEW - Auth wrapper with back button
│   │   └── login-page.jsx          🔄 UPDATED - Better layout
│   │
│   ├── home/
│   │   └── home.jsx                (Protected route with time tracking)
│   │
│   └── navigation/
│       └── navigation.jsx          (Top nav for authenticated users)
│
├── components/
│   ├── signin.component.jsx        🔄 UPDATED - Modern form design
│   ├── signup.component.jsx        🔄 UPDATED - Modern form design
│   ├── hours.component.jsx         (Analytics chart)
│   ├── salary.component.jsx        (Pay calculation)
│   └── home.components/
│       └── clock.component.jsx     (Clock in/out button)
│
└── contexts/
    └── userContext.jsx             (State management - unchanged)
```

## 🔄 Component Hierarchy

```
App
├── Landing Page (Route: /)
│   └── Hero Section
│       ├── Logo + Tagline
│       ├── Feature Cards (3 cards with icons)
│       └── Get Started Button → Navigate to /auth
│
├── Auth Page (Route: /auth)
│   ├── Back Button → Navigate to /
│   ├── Header (Timely branding)
│   └── Login Page
│       ├── Sign In Form (Default)
│       │   ├── Email input
│       │   ├── Password input (with toggle)
│       │   └── Sign In button
│       │
│       ├── Sign Up Form (Hidden, slides left)
│       │   ├── Name input
│       │   ├── Email input
│       │   ├── Password input (with toggle)
│       │   ├── Hourly Rate input
│       │   └── Sign Up button
│       │
│       └── Toggle Button (switches between forms)
│
└── Home (Route: /home, Protected)
    ├── Navigation
    ├── Clock Component
    ├── Hours Chart
    └── Salary Display
```

## 📊 Data Flow

```
Landing Page
    │
    └──[Get Started Button]──→ Auth Page
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
              Sign In Form    Sign Up Form      Back Button
                    │               │               │
                    └───────────────┼───────────────┘
                                    │
                        [Form Submission]
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
            [Success Response]             [Error Response]
            (token + user)                 (stay on form)
                    │
            [Store in localStorage]
            [Dispatch SET_USER]
            [Update userContext]
                    │
            [setTimeout - wait 100ms]
                    │
            [Navigate to /home]
                    │
              Home Page Renders
              (with currentUser loaded)
```

## 🎯 Key Component Props & State

### Landing Page
```jsx
Props: None (uses useNavigate hook)
State: None (static presentation)
```

### Auth Page
```jsx
Props: None
State: None (child component handles it)
```

### Login Page
```jsx
Props: None
State: 
  - signup: boolean (toggles between signin/signup)
Events:
  - handleSignup: toggles signup state
```

### Sign In Form
```jsx
Props: None
State:
  - visible: boolean (password visibility)
Events:
  - handleSubmit: POST to /login
  - handleVisibility: toggle password view
Context:
  - dispatchUser: update userContext
  - navigate: redirect to /home
```

### Sign Up Form
```jsx
Props: None
State:
  - visible: boolean (password visibility)
Events:
  - handleSubmit: POST to /signup
  - handleVisibility: toggle password view
Context:
  - dispatchUser: update userContext
  - navigate: redirect to /home
```

## 🔐 Authentication Flow

```
User Action: Submit Form (Sign In or Sign Up)
    │
    ├──→ [POST to backend: /login or /signup]
    │
    ├──→ [Backend validates & generates JWT token]
    │
    ├──→ [Response: { token, user, message }]
    │
    ├──→ [Frontend: dispatchUser({ type: 'SET_USER', payload: { token, user } })]
    │
    ├──→ [Reducer stores token in localStorage.authToken]
    ├──→ [Reducer stores user in localStorage.user]
    ├──→ [Reducer updates currentUser state]
    │
    ├──→ [setTimeout 100ms to allow state update]
    │
    ├──→ [Navigate to /home]
    │
    └──→ [Home component checks: currentUser && localStorage.authToken]
         ├─→ If valid: Render home page ✓
         └─→ If invalid: Redirect to / (login)
```

## 🎨 CSS Classes Used

### Landing Page
```jsx
// Hero container
"flex flex-col justify-center items-center bg-gradient-to-br from-purple-50 to-blue-50 h-screen px-4"

// Feature cards
"grid grid-cols-1 md:grid-cols-3 gap-6"
"bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"

// CTA Button
"inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg"
```

### Form Inputs
```jsx
// Input fields
"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"

// Labels
"block text-sm font-medium text-gray-700 mb-2"
```

### Buttons
```jsx
// Submit buttons (gradient)
"w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105"

// Toggle button (plain text)
"text-purple-600 font-semibold hover:text-purple-700 transition"
```

## 🚀 Performance Considerations

✅ **Code Splitting**
- Landing page is lightweight (no heavy forms until needed)
- Auth page loads separately

✅ **Lazy Loading** (Can implement)
- Home page components could be lazy loaded
- Currently all in memory due to small app size

✅ **Animations**
- CSS transforms (hardware accelerated)
- No JavaScript-heavy animations

✅ **State Management**
- Context API used (no Redux overhead)
- localStorage for persistence (minimal re-renders)

## 🧪 Testing Checklist

- [ ] Landing page loads on `/`
- [ ] Get Started button works
- [ ] Auth page loads on `/auth`
- [ ] Back button returns to landing
- [ ] Sign in form submits correctly
- [ ] Sign up form submits correctly
- [ ] Swivel animation is smooth
- [ ] Toggle button switches forms
- [ ] Password visibility toggle works
- [ ] Form validation (required fields)
- [ ] Error messages display
- [ ] Token is stored in localStorage
- [ ] User is auto-logged in after signup
- [ ] Navigation to /home works
- [ ] Home page renders with user data
- [ ] Page refresh keeps user logged in (RESTORE_USER)
- [ ] Logout clears localStorage and redirects


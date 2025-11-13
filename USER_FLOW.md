# Timely App - New User Flow & UI Structure

## 📱 User Journey

```
┌─────────────────────────────────────────────────────────┐
│                  START: Landing Page                     │
│                        Route: /                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Logo: Timely                                      │  │
│  │  Tagline: Track Your Time, Maximize Your Earnings  │  │
│  │                                                    │  │
│  │  [Features Grid - 3 Cards]                        │  │
│  │    ⏱️ Clock In/Out   📊 View Analytics  💰 Pay    │  │
│  │                                                    │  │
│  │         [🚀 Get Started Button]                   │  │
│  └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         │
                         │ Click "Get Started"
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  Auth Page                               │
│                 Route: /auth                             │
│  ┌──────────────────────────────────────────────────┐   │
│  │  [⬅️ Back Button]                                │   │
│  │                                                  │   │
│  │  Timely                                         │   │
│  │  Tag: Track your hours...                       │   │
│  │                                                  │   │
│  │  ┌────────────────────────────────────────────┐ │   │
│  │  │ SIGN IN (Default View)                     │ │   │
│  │  │  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ │ │   │
│  │  │ Email:      [input field]                 │ │   │
│  │  │ Password:   [input field] [👁️ icon]      │ │   │
│  │  │            [Sign In Button - Gradient]    │ │   │
│  │  └────────────────────────────────────────────┘ │   │
│  │                  (Swivel Left)                  │   │
│  │  ┌────────────────────────────────────────────┐ │   │
│  │  │ SIGN UP                                    │ │   │
│  │  │  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ │ │   │
│  │  │ Name:        [input field]                │ │   │
│  │  │ Email:       [input field]                │ │   │
│  │  │ Password:    [input field] [👁️ icon]     │ │   │
│  │  │ Hourly Rate: [input field]                │ │   │
│  │  │             [Sign Up Button - Gradient]   │ │   │
│  │  └────────────────────────────────────────────┘ │   │
│  │                                                  │   │
│  │  "Already have account?" / "Sign In"            │   │
│  │  (Toggle Button)                                │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
         │                                    ▲
         │ User Submits Form                 │ "Back" Button
         │ OR                                 │
         │ (Already logged in)               │
         ▼                                    │
    [Token Generated]          [Returns to Landing Page]
    [User Stored]
    [Auto-Login]
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│                   Home Page                              │
│                  Route: /home                            │
│  (Time tracking, analytics, salary calculation)         │
└─────────────────────────────────────────────────────────┘
```

## 🎨 Design System

### Colors
- **Primary Purple**: `#a855f7` (500), `#9333ea` (600)
- **Secondary Blue**: `#3b82f6` (500), `#2563eb` (600)
- **Text**: Gray-800 for headers, Gray-600 for descriptions
- **Backgrounds**: White forms, Gray-100 pages, Gradient on landing

### Typography
- **Headings**: Font weight 600-700, size 3xl-6xl
- **Body**: Font weight 400-500, size sm-lg
- **Forms**: Smaller labels (sm) with descriptive placeholders

### Spacing
- **Form fields**: 5 units (1.25rem) between each
- **Sections**: Consistent padding of 8 (2rem)
- **Buttons**: 8-10 (2-2.5rem) padding

### Interactions
- **Focus state**: 2px purple ring (ring-2 ring-purple-500)
- **Hover**: Color shift + scale(1.05) on buttons
- **Transitions**: 500ms for swivel animation
- **Smooth**: ease-in-out on all transitions

## 🔄 Animation Details

### Swivel Animation
- **Trigger**: Toggle button click
- **Duration**: 500ms
- **Easing**: ease-in-out
- **Method**: CSS transform translateX
- **Direction**: 
  - Sign In (default): 0% (left)
  - Sign Up: -100% (right)

## ✅ Functionality Checklist

- ✅ Landing page displays on first visit
- ✅ "Get Started" button navigates to /auth
- ✅ Back button on auth page returns to landing
- ✅ Sign in form accepts email and password
- ✅ Sign up form accepts name, email, password, hourly_rate
- ✅ Swivel animation works smoothly between forms
- ✅ Toggle button switches between sign in and sign up
- ✅ Token generation and storage intact
- ✅ Auto-login after signup works
- ✅ localStorage persistence maintained
- ✅ Protected routes still functional
- ✅ Navigation after auth works correctly


# Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Navigate to project directory:**
   ```powershell
   cd d:\Projects\FYP
   ```

2. **Environment is already set up!** All dependencies are installed.

3. **Start the development server:**
   ```powershell
   npm run dev
   ```

4. **Open your browser:**
   - Visit: `http://localhost:3000`

## 📖 User Journey & Page Flow

### 1. Landing Page (`/`)
**What users see:**
- Hero section with engaging headline
- Three feature cards (RL Learning, MCQ Based, Smart Reports)
- Benefits checklist section
- CTA buttons: "Get Started" and "Sign In"

**Actions:**
- Click "Get Started" → Goes to `/register`
- Click "Sign In" → Goes to `/login`

---

### 2. Registration (`/register`)
**What users see:**
- Left side: Illustration with graduation cap
- Right side: Registration form
  - Name field
  - Email field
  - Password field
  - Confirm Password field
  - Submit button
  - Link to login page

**Actions:**
- Fill form → Click "Create Account" → Redirects to `/dashboard`

---

### 3. Login (`/login`)
**What users see:**
- Left side: Book illustration
- Right side: Login form
  - Email field
  - Password field
  - "Forgot password?" link
  - Submit button
  - Link to registration

**Actions:**
- Fill form → Click "Sign In" → Redirects to `/dashboard`

---

### 4. Dashboard (`/dashboard`)
**What users see:**
- **Top:** Navbar with logo and theme toggle
- **Left:** Sidebar navigation (Dashboard, My Learnings, Settings, Logout)
- **Main Area:**
  - Welcome header
  - 4 stat cards (Active Paths, Total Topics, Avg Accuracy, Languages)
  - Existing learning path cards (if any)
  - "Create New Learning Path" section:
    - Language selection (Python, JavaScript, C++, Java, TypeScript, Go)
    - Difficulty selection (Easy, Medium, Hard)
    - "Create Learning Path" button

**Actions:**
- Select language → Select difficulty → Click "Create Learning Path"
  - Adds new learning card to the list
- Click "Open Learning Dashboard" on any card → Goes to `/learnings/[id]`
- Click "My Learnings" in sidebar → Goes to `/learnings`

---

### 5. My Learnings (`/learnings`)
**What users see:**
- Navbar and Sidebar
- Summary stats (Active Paths, Total Progress, Avg Accuracy)
- Grid of all active learning path cards showing:
  - Language and difficulty
  - Progress percentage
  - Topics completed
  - Accuracy
  - Last activity time
- "Add New" card to create more paths

**Actions:**
- Click any card → Goes to that learning's detail page `/learnings/[id]`
- Click "Add Learning Path" → Goes to `/dashboard`

---

### 6. Individual Learning Dashboard (`/learnings/[id]`)
**What users see:**
- Header with language name and difficulty badge
- 4 stat cards:
  - Total Topics
  - Completed Topics (with progress bar)
  - Accuracy percentage
  - Last Activity time
- **Demo Test Prompt** (if first time):
  - Yellow card suggesting to take demo test first
  - "Take Demo Test" button
- **Core Topics** section with cards for each topic:
  - Topic name
  - Completion status (checkmark if done)
  - Subtopics list
  - Accuracy (if completed)
  - "Practice This Topic" button

**When topic is selected:**
- Input field for "Number of MCQs"
- "Start Test" button

**Actions:**
- Click "Take Demo Test" → Goes to `/test/[id]?demo=true`
- Click "Practice This Topic" → Expands to show test configuration
- Enter number of questions → Click "Start Test" → Goes to `/test/[id]?topic=X&questions=Y`

---

### 7. MCQ Test Interface (`/test/[id]`)
**What users see:**
- Navbar (no sidebar during test)
- Header:
  - Test title (e.g., "Python Assessment")
  - Timer (30:00 countdown in top-right)
- Progress bar showing question X of Y
- **Question Card:**
  - Question number
  - Question text
  - 4 radio button options
- Navigation:
  - "Previous" button (left)
  - "Next" button (right, or "Submit Test" on last question)
- **Question Navigator:**
  - Grid of numbered buttons (1-10)
  - Color coding:
    - Blue: Current question
    - Green: Answered
    - Gray: Not answered
  - Click any number to jump to that question

**During test:**
- Timer counts down
- Can navigate between questions
- Select answers by clicking options
- When time runs out → Auto-submits

**Submit Confirmation Modal:**
- Shows how many questions answered
- Warning if questions unanswered
- "Review" or "Submit" buttons

**Actions:**
- Click option → Selects answer
- Click "Next" → Goes to next question
- Click "Previous" → Goes to previous question
- Click question number → Jumps to that question
- Click "Submit Test" → Shows confirmation modal
- Confirm submit → Goes to `/results/[id]`

---

### 8. Exam Results (`/results/[id]`)
**What users see:**
- Navbar
- Trophy icon and "Test Completed!" message
- **Overall Score Card:**
  - Grade (A+, A, B, C, D)
  - Score (e.g., 8/10)
  - Accuracy percentage
  - Time taken
  - Progress bar
- **Two side-by-side cards:**
  - **Strong Topics** (green): Topics with high accuracy
  - **Areas to Improve** (red): Topics needing practice
- **Detailed Question Review:**
  - Each question card shows:
    - Question text
    - Checkmark (correct) or X (incorrect)
    - Click to expand/collapse
  - **When expanded:**
    - All 4 options with color coding:
      - Green border: Correct answer
      - Red border: Your wrong answer (if incorrect)
    - Explanation section
- **Action buttons:**
  - "Back to Dashboard" → Returns to `/learnings/[id]`
  - "Retake Test" → Goes to `/test/[id]`

---

### 9. Settings (`/settings`)
**What users see:**
- Navbar and Sidebar
- **Profile Information card:**
  - Name, Username, Email fields
  - "Save Changes" button
- **Appearance card:**
  - Theme toggle button (light/dark)
  - Color preview (Primary, Secondary, Accent)
- **Notifications card:**
  - Toggle switches for:
    - Email Notifications
    - Test Reminders
    - Weekly Progress Report
    - Achievement Alerts
- **Security card:**
  - "Change Password" button
  - "Enable 2FA" button
  - "Delete Account" button (red)

**Actions:**
- Edit profile fields → Click "Save Changes"
- Click theme toggle → Switches between light/dark mode
- Toggle notification switches → Updates preferences
- Click any security action buttons → (Placeholder for future implementation)

---

## 🎨 Theme Toggle

**How it works:**
- Click sun/moon icon in navbar
- Theme changes instantly
- Preference saved in localStorage
- Persists across page reloads

**Default behavior:**
- Follows system preference on first visit
- User selection overrides system preference

---

## 🧭 Navigation Structure

```
Landing (/)
├── Register (/register) → Dashboard
├── Login (/login) → Dashboard
└── Dashboard (/dashboard)
    ├── My Learnings (/learnings)
    │   └── Learning Detail (/learnings/[id])
    │       └── Test (/test/[id])
    │           └── Results (/results/[id])
    └── Settings (/settings)
```

---

## 📱 Responsive Behavior

### Desktop (≥768px)
- Sidebar always visible
- Grid layouts (2-3 columns)
- Larger cards and spacing

### Tablet (640px - 767px)
- Sidebar collapses, hamburger menu appears
- Grid layouts (2 columns)
- Medium-sized cards

### Mobile (<640px)
- Sidebar hidden behind hamburger menu
- Single column layouts
- Stack all elements vertically
- Touch-friendly button sizes

---

## 🎯 Mock Data

All current data is placeholder:

### Mock Learning Paths
- Python (Medium) - 65% progress
- JavaScript (Easy) - 40% progress

### Mock Topics
- Variables & Data Types
- Control Flow
- Functions
- Object-Oriented Programming
- File Handling

### Mock Questions
- 10 sample MCQs about Python basics
- Each with 4 options
- Correct answers and explanations provided

**Note:** Replace these with real API calls when backend is ready.

---

## 🔧 Customization

### Change Site Name
Edit `.env.local`:
```
NEXT_PUBLIC_SITE_NAME=YourAppName
```

### Change Colors
Edit `app/globals.css` in the `@theme` block:
```css
--color-primary: #YOUR_COLOR;
--color-secondary: #YOUR_COLOR;
--color-accent: #YOUR_COLOR;
```

### Add New Language Options
Edit `app/dashboard/page.tsx`:
```typescript
const languages = [
  { name: "YourLanguage", icon: "🔵", color: "from-blue-500 to-blue-600" },
  // ... add more
]
```

---

## 🐛 Troubleshooting

### Port already in use
```powershell
# Kill process on port 3000
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```

### Dark mode not working
- Check if theme toggle is imported in navbar
- Ensure ThemeProvider wraps app in layout.tsx
- Clear browser localStorage and reload

### Styles not applying
```powershell
# Restart dev server
# Press Ctrl+C
npm run dev
```

---

## 📞 Need Help?

- Check `README.md` for full documentation
- See `STRUCTURE.md` for project architecture
- Review component files for implementation details

---

**Ready to build? Run `npm run dev` and start coding!** 🚀

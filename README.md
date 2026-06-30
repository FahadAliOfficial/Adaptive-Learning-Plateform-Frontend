# E-Learning Reinforcement Learning Web App - Frontend

A modern, responsive, and beautifully designed frontend UI for an AI-powered programming learning platform built with Next.js 14, TypeScript, and Tailwind CSS.

## 🎨 Design Features

- **Modern UI/UX**: Clean, professional design with smooth animations and transitions
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Dark Mode**: Built-in light/dark theme toggle with localStorage persistence
- **Custom Color Scheme**:
  - Primary: `#3B82F6` (Blue)
  - Secondary: `#10B981` (Green)
  - Background: `#F8FAFC` (Off-white)
  - Text: `#0F172A` (Dark Navy)
  - Accent: `#FACC15` (Yellow)

## 🚀 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components built with Radix UI primitives
- **Icons**: Lucide React
- **Fonts**: Inter (Google Fonts)

## 📁 Project Structure

```
FYP/
├── app/
│   ├── dashboard/           # Main student dashboard
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── learnings/          # Learning paths overview
│   │   ├── [id]/          # Individual learning dashboard
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── login/             # Login page
│   │   └── page.tsx
│   ├── register/          # Registration page
│   │   └── page.tsx
│   ├── results/           # Test results page
│   │   └── [id]/
│   │       └── page.tsx
│   ├── settings/          # User settings page
│   │   └── page.tsx
│   ├── test/              # MCQ test interface
│   │   └── [id]/
│   │       └── page.tsx
│   ├── globals.css        # Global styles with CSS variables
│   ├── layout.tsx         # Root layout with theme provider
│   └── page.tsx           # Landing page
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── progress.tsx
│   │   └── radio-group.tsx
│   ├── navbar.tsx         # Navigation bar component
│   ├── sidebar.tsx        # Sidebar navigation
│   ├── theme-provider.tsx # Theme context provider
│   └── theme-toggle.tsx   # Theme toggle button
├── lib/
│   └── utils.ts           # Utility functions (cn helper)
├── .env.local             # Environment variables
└── .env.example           # Example environment file
```

## 📄 Pages Overview

### 1. Landing Page (`/`)
- Hero section with engaging headline
- Feature cards highlighting key benefits
- Benefits section with checklist
- Call-to-action sections
- Fully responsive layout

### 2. Authentication Pages
- **Registration** (`/register`): Beautiful form with illustration
- **Login** (`/login`): Clean login interface with forgot password link

### 3. Student Dashboard (`/dashboard`)
- Language selection (Python, JavaScript, C++, Java, TypeScript, Go)
- Difficulty level selection (Easy, Medium, Hard)
- Active learning cards with progress tracking
- Statistics overview

### 4. My Learnings (`/learnings`)
- Overview of all active learning paths
- Progress tracking for each path
- Quick access to individual learning dashboards

### 5. Individual Learning Dashboard (`/learnings/[id]`)
- Detailed stats (total topics, completed, accuracy, last activity)
- Demo test prompt for first-time users
- Core topics list with subtopics
- MCQ configuration and test start
- Progress visualization

### 6. MCQ Test Interface (`/test/[id]`)
- Clean question panel with radio button options
- Timer display (30 minutes default)
- Progress indicator
- Question navigator grid
- Previous/Next navigation
- Submit confirmation modal

### 7. Exam Results (`/results/[id]`)
- Overall score card with grade
- Accuracy percentage and time taken
- Strong vs weak topics analysis
- Detailed question review with explanations
- Color-coded correct/incorrect answers
- Expandable question details

### 8. Settings (`/settings`)
- Profile information management
- Theme toggle (light/dark mode)
- Color preview
- Notification preferences (toggles)
- Security settings (password, 2FA, delete account)

## 🎯 Key Features

### Theme System
- System preference detection
- Manual theme toggle
- Persistent theme selection in localStorage
- Smooth transitions between themes

### Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile
- Adaptive grid layouts
- Touch-friendly controls

### Component Library
- Reusable UI components
- Consistent design language
- Accessibility-focused
- Type-safe with TypeScript

### Navigation
- Sticky navbar
- Sidebar with active state indicators
- Breadcrumb-like navigation
- Smooth page transitions

## 🛠️ Installation & Setup

1. **Navigate to project directory**
   ```bash
   cd d:\Projects\FYP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Update `NEXT_PUBLIC_SITE_NAME` if needed
   ```
   NEXT_PUBLIC_SITE_NAME=LearnRL
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3000`

## 📦 Dependencies

### Core Dependencies
- `next`: ^16.0.3
- `react`: ^19.2.0
- `react-dom`: ^19.2.0

### UI & Styling
- `tailwindcss`: ^4
- `lucide-react`: Latest (icons)
- `class-variance-authority`: Latest (component variants)
- `clsx`: Latest (conditional classes)
- `tailwind-merge`: Latest (merge Tailwind classes)

### Radix UI Primitives
- `@radix-ui/react-slot`
- `@radix-ui/react-dialog`
- `@radix-ui/react-label`
- `@radix-ui/react-radio-group`
- `@radix-ui/react-progress`

## 🎨 Customization

### Color Theme
Edit `app/globals.css` to customize colors in the `@theme` block.

### Site Name
Update `.env.local`:
```
NEXT_PUBLIC_SITE_NAME=YourSiteName
```

### Fonts
Modify `app/layout.tsx` to change fonts:
```typescript
import { YourFont } from "next/font/google";
```

## 🧩 Component Usage Examples

### Button
```tsx
import { Button } from "@/components/ui/button"

<Button variant="default" size="lg">Click Me</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
```

### Card
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

### Theme Toggle
```tsx
import { ThemeToggle } from "@/components/theme-toggle"

<ThemeToggle />
```

## 📱 Responsive Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🔒 Note on Backend

This is a **frontend-only** implementation. The following are NOT included:
- Authentication logic
- API integrations
- Database connections
- MCQ generation logic
- Reinforcement learning algorithms
- User session management

All data shown is mock/placeholder data for UI demonstration purposes.

## 🚧 Future Integration Points

When integrating with backend:
1. Replace mock data with API calls
2. Implement authentication with JWT or similar
3. Connect theme persistence to user preferences API
4. Add form validation and error handling
5. Implement real-time updates for test timer
6. Add WebSocket for live progress tracking

## 📝 Development Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🎯 Best Practices Implemented

- ✅ TypeScript for type safety
- ✅ Component composition
- ✅ Responsive design
- ✅ Accessibility considerations
- ✅ Clean code structure
- ✅ Consistent naming conventions
- ✅ Reusable components
- ✅ SEO-friendly metadata
- ✅ Performance optimizations

## 📄 License

MIT License

Copyright (c) 2026 Fahad Ali


## 🤝 Contributing

This is a frontend UI implementation. Contributions for UI improvements are welcome:
- Bug fixes
- Design enhancements
- New component variants
- Accessibility improvements
- Performance optimizations

---

**Built with ❤️ using Next.js 14 and Tailwind CSS**

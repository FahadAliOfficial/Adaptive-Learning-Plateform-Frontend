# Project Structure Overview

## Complete File Tree

```
d:\Projects\FYP\
│
├── .env.local                      # Environment variables (site name)
├── .env.example                    # Example environment file
├── README.md                       # Project documentation
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── next.config.ts                  # Next.js configuration
├── postcss.config.mjs              # PostCSS configuration
├── eslint.config.mjs               # ESLint configuration
│
├── app/                            # Next.js 14 App Router
│   ├── globals.css                 # Global styles with theme variables
│   ├── layout.tsx                  # Root layout with ThemeProvider
│   ├── page.tsx                    # Landing page
│   │
│   ├── login/
│   │   └── page.tsx                # Login page with form
│   │
│   ├── register/
│   │   └── page.tsx                # Registration page with form
│   │
│   ├── dashboard/
│   │   ├── layout.tsx              # Dashboard layout
│   │   └── page.tsx                # Main dashboard (language/difficulty selection)
│   │
│   ├── learnings/
│   │   ├── page.tsx                # All learning paths overview
│   │   └── [id]/
│   │       └── page.tsx            # Individual learning dashboard
│   │
│   ├── test/
│   │   └── [id]/
│   │       └── page.tsx            # MCQ test interface
│   │
│   ├── results/
│   │   └── [id]/
│   │       └── page.tsx            # Test results page
│   │
│   └── settings/
│       └── page.tsx                # User settings page
│
├── components/                     # React components
│   ├── navbar.tsx                  # Navigation bar (with logo, theme toggle)
│   ├── sidebar.tsx                 # Sidebar navigation (for dashboard pages)
│   ├── theme-provider.tsx          # Theme context provider
│   ├── theme-toggle.tsx            # Light/dark mode toggle button
│   │
│   └── ui/                         # Reusable UI components
│       ├── button.tsx              # Button component with variants
│       ├── card.tsx                # Card components (Card, CardHeader, etc.)
│       ├── input.tsx               # Input field component
│       ├── label.tsx               # Label component
│       ├── progress.tsx            # Progress bar component
│       └── radio-group.tsx         # Radio button group
│
├── lib/
│   └── utils.ts                    # Utility functions (cn helper)
│
└── public/                         # Static assets (images, icons, etc.)
```

## Page Routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Landing page |
| `/login` | `app/login/page.tsx` | Login page |
| `/register` | `app/register/page.tsx` | Registration page |
| `/dashboard` | `app/dashboard/page.tsx` | Main dashboard |
| `/learnings` | `app/learnings/page.tsx` | Learning paths overview |
| `/learnings/[id]` | `app/learnings/[id]/page.tsx` | Individual learning dashboard |
| `/test/[id]` | `app/test/[id]/page.tsx` | MCQ test interface |
| `/results/[id]` | `app/results/[id]/page.tsx` | Test results |
| `/settings` | `app/settings/page.tsx` | User settings |

## Component Hierarchy

### Layout Components
- `app/layout.tsx` (Root)
  - `ThemeProvider`
    - `Navbar` (used on all pages)
    - `Sidebar` (used on dashboard, learnings, settings)

### Page Components
Each page imports and uses:
- UI components from `components/ui/`
- Icons from `lucide-react`
- Layout components (Navbar, Sidebar)

## Styling Architecture

### Tailwind CSS v4
- Theme variables defined in `app/globals.css`
- Custom colors for light and dark modes
- Utility-first approach
- Responsive design using Tailwind breakpoints

### CSS Variables (Tailwind v4 Theme)
```css
@theme {
  --color-background: #F8FAFC;
  --color-foreground: #0F172A;
  --color-primary: #3B82F6;
  --color-secondary: #10B981;
  --color-accent: #FACC15;
  /* ... and more */
}
```

## Data Flow (Mock Data)

Currently, all data is mocked within page components:
- Learning paths data in dashboard
- Topics and subtopics in learning dashboard
- MCQ questions in test page
- Results data in results page

**For production**: Replace these with API calls to your backend.

## Key Features by File

### `components/theme-provider.tsx`
- React Context for theme management
- localStorage persistence
- System preference detection
- Theme toggle between light/dark

### `components/navbar.tsx`
- Responsive navigation
- Logo with gradient
- Theme toggle button
- Mobile menu trigger

### `components/sidebar.tsx`
- Dashboard navigation
- Active route highlighting
- Mobile responsive (slide-in)
- Logout link

### `app/dashboard/page.tsx`
- Language selection cards
- Difficulty selection
- Create learning path
- Display existing learning cards

### `app/learnings/[id]/page.tsx`
- Learning stats overview
- Topic cards with subtopics
- Demo test prompt
- MCQ count input
- Start test button

### `app/test/[id]/page.tsx`
- Question display
- Radio button options
- Timer countdown
- Question navigator
- Progress tracking
- Submit modal

### `app/results/[id]/page.tsx`
- Score card with grade
- Strong/weak topics
- Detailed question review
- Explanations
- Expandable answers

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SITE_NAME=LearnRL
```

Used throughout the app for branding.

## TypeScript Types

All components use TypeScript for type safety:
- Props interfaces
- State types
- Mock data structures
- Component return types

## Responsive Design Strategy

1. **Mobile First**: Tailwind classes default to mobile
2. **Breakpoint Modifiers**: `md:`, `lg:`, `xl:`
3. **Sidebar**: Hidden on mobile, visible on desktop
4. **Grid Layouts**: Column count changes with screen size
5. **Cards**: Stack on mobile, grid on desktop

## Future Backend Integration Points

1. **Authentication**:
   - Replace console.log in login/register with API calls
   - Add JWT token management
   - Implement protected routes

2. **Data Fetching**:
   - Replace mock data with fetch/axios calls
   - Add loading states
   - Implement error handling

3. **State Management**:
   - Consider Redux/Zustand for global state
   - Manage user session
   - Cache learning progress

4. **Real-time Features**:
   - WebSocket for test timer sync
   - Live progress updates
   - Notification system

## Development Workflow

1. Start dev server: `npm run dev`
2. Edit components in `components/`
3. Add new pages in `app/`
4. Styles auto-reload with Tailwind
5. TypeScript checks on save
6. Build for production: `npm run build`

## Best Practices Followed

- ✅ Server and Client Components separated
- ✅ "use client" directive only where needed
- ✅ Reusable component library
- ✅ Consistent naming conventions
- ✅ TypeScript for type safety
- ✅ Responsive design patterns
- ✅ Accessibility considerations
- ✅ SEO-friendly metadata

---

**Last Updated**: November 2024

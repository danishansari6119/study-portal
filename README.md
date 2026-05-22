# 🎓 Student Study Portal

A full-stack modern academic management platform built with Next.js 15, MongoDB, and Prisma.

---

## 📁 Complete Folder Structure

```
study-portal/
├── app/
│   ├── auth/
│   │   ├── layout.tsx              # Auth pages layout (dark themed)
│   │   ├── login/
│   │   │   └── page.tsx            # Login page with credentials + Google
│   │   └── register/
│   │       └── page.tsx            # Register page with role selection
│   ├── dashboard/
│   │   ├── layout.tsx              # Dashboard shell (sidebar + header)
│   │   ├── loading.tsx             # Dashboard loading skeleton
│   │   ├── error.tsx               # Error boundary
│   │   ├── student/
│   │   │   ├── page.tsx            # Student dashboard
│   │   │   ├── notes/
│   │   │   │   └── page.tsx        # Browse & download notes
│   │   │   ├── assignments/
│   │   │   │   └── page.tsx        # View & submit assignments
│   │   │   ├── quizzes/
│   │   │   │   ├── page.tsx        # Quiz listing + leaderboard
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx    # Take quiz (with timer)
│   │   │   ├── attendance/
│   │   │   │   └── page.tsx        # Attendance tracker + charts
│   │   │   ├── timetable/
│   │   │   │   └── page.tsx        # Weekly schedule grid
│   │   │   └── profile/
│   │   │       └── page.tsx        # Profile & password settings
│   │   └── admin/
│   │       ├── page.tsx            # Admin dashboard
│   │       ├── students/
│   │       │   └── page.tsx        # Student management table
│   │       ├── notes/
│   │       │   └── page.tsx        # Upload/delete notes
│   │       ├── assignments/
│   │       │   └── page.tsx        # Create/delete assignments
│   │       ├── quizzes/
│   │       │   └── page.tsx        # Quiz management
│   │       ├── attendance/
│   │       │   └── page.tsx        # Mark attendance
│   │       └── announcements/
│   │           └── page.tsx        # Post announcements
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/
│   │   │   │   └── route.ts        # NextAuth handler
│   │   │   └── register/
│   │   │       └── route.ts        # User registration
│   │   ├── notes/
│   │   │   ├── route.ts            # GET all, POST create
│   │   │   └── [id]/
│   │   │       ├── route.ts        # DELETE, PATCH
│   │   │       └── download/
│   │   │           └── route.ts    # Increment download count
│   │   ├── assignments/
│   │   │   ├── route.ts            # GET all, POST create
│   │   │   ├── [id]/
│   │   │   │   └── route.ts        # DELETE
│   │   │   └── submit/
│   │   │       └── route.ts        # Submit assignment
│   │   ├── quizzes/
│   │   │   └── [id]/
│   │   │       └── submit/
│   │   │           └── route.ts    # Auto-evaluate quiz
│   │   ├── attendance/
│   │   │   └── route.ts            # GET student, POST mark
│   │   ├── announcements/
│   │   │   ├── route.ts            # GET, POST
│   │   │   └── [id]/
│   │   │       └── route.ts        # DELETE
│   │   └── profile/
│   │       └── route.ts            # PATCH update profile
│   ├── globals.css                 # Tailwind + custom CSS vars
│   ├── layout.tsx                  # Root layout (providers, fonts)
│   ├── page.tsx                    # Landing page
│   └── not-found.tsx               # 404 page
├── components/
│   ├── ui/
│   │   ├── page-header.tsx         # Page title + subtitle
│   │   ├── search-input.tsx        # Debounced search input
│   │   └── toaster.tsx             # Toast notifications
│   ├── layout/
│   │   ├── sidebar.tsx             # Collapsible sidebar with nav
│   │   ├── header.tsx              # Top bar with theme + user menu
│   │   ├── theme-provider.tsx      # next-themes wrapper
│   │   └── session-provider.tsx    # NextAuth session wrapper
│   ├── charts/
│   │   ├── attendance-chart.tsx    # Weekly bar chart (Recharts)
│   │   ├── attendance-month-chart.tsx # Monthly line chart
│   │   └── performance-chart.tsx   # Radial quiz performance
│   └── dashboard/
│       ├── stats-grid.tsx          # 4-card metric grid
│       ├── recent-assignments.tsx  # Dashboard assignment widget
│       ├── upcoming-quizzes.tsx    # Dashboard quiz widget
│       ├── announcements-list.tsx  # Dashboard announcements widget
│       ├── note-card.tsx           # Note card with download
│       ├── assignment-card.tsx     # Assignment with submission
│       ├── quiz-card.tsx           # Quiz card with status
│       ├── quiz-taker.tsx          # Full quiz UI with timer
│       ├── leaderboard.tsx         # Quiz leaderboard
│       ├── profile-form.tsx        # Profile update form
│       ├── timetable-grid.tsx      # Weekly timetable
│       ├── attendance-subject-card.tsx # Per-subject attendance
│       ├── admin-recent-activity.tsx   # Admin dashboard widgets
│       ├── admin-notes-list.tsx        # Admin notes CRUD
│       ├── admin-assignments-client.tsx # Admin assignments CRUD
│       ├── admin-attendance-client.tsx  # Bulk attendance marking
│       └── admin-announcements-client.tsx # Announcements CRUD
├── lib/
│   ├── auth.ts                     # NextAuth v5 config
│   ├── prisma.ts                   # Prisma singleton
│   ├── utils.ts                    # cn(), formatDate(), helpers
│   └── validations.ts              # All Zod schemas
├── actions/
│   └── auth.ts                     # Server Actions for auth
├── hooks/
│   ├── use-debounce.ts             # Debounce hook
│   └── use-quiz-timer.ts           # Quiz countdown timer hook
├── store/
│   └── ui-store.ts                 # Zustand UI state
├── types/
│   └── next-auth.d.ts              # TypeScript type extensions
├── prisma/
│   └── schema.prisma               # Database schema (all models)
├── middleware.ts                    # Route protection
├── next.config.mjs                 # Next.js config
├── tailwind.config.ts              # Tailwind + custom theme
├── tsconfig.json                   # TypeScript config
├── postcss.config.js               # PostCSS
├── package.json                    # Dependencies
└── .env.example                    # Environment template
```

---

## 🚀 Setup Instructions (Step by Step)

### Prerequisites
- Node.js 18+ installed → https://nodejs.org
- MongoDB Atlas account (free) → https://mongodb.com/atlas
- Git installed

---

### Step 1: Create the Project from Scratch

```bash
# Create Next.js project
npx create-next-app@latest study-portal --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"

cd study-portal
```

---

### Step 2: Install All Dependencies

```bash
npm install @auth/prisma-adapter @prisma/client next-auth@beta \
  bcryptjs framer-motion react-hook-form @hookform/resolvers zod \
  recharts zustand next-themes date-fns \
  @radix-ui/react-avatar @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu @radix-ui/react-label \
  @radix-ui/react-progress @radix-ui/react-select \
  @radix-ui/react-separator @radix-ui/react-slot \
  @radix-ui/react-switch @radix-ui/react-tabs \
  @radix-ui/react-toast @radix-ui/react-tooltip \
  class-variance-authority clsx tailwind-merge tailwindcss-animate \
  lucide-react mongodb

npm install -D prisma @types/bcryptjs
```

---

### Step 3: Set Up MongoDB Atlas (Free)

1. Go to → https://mongodb.com/atlas → Create free account
2. Create a **free M0 cluster** (any region)
3. Click **Connect** → **Connect your application**
4. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/study-portal?retryWrites=true&w=majority
   ```
5. In Atlas → **Database Access** → Add a database user with password
6. In Atlas → **Network Access** → Add `0.0.0.0/0` (allow all IPs for dev)

---

### Step 4: Set Up Google OAuth (for Google Sign-In)

1. Go to → https://console.cloud.google.com
2. Create a new project
3. Enable **Google+ API** (or OAuth API)
4. Go to **Credentials** → **Create OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Copy the **Client ID** and **Client Secret**

---

### Step 5: Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
DATABASE_URL="mongodb+srv://youruser:yourpass@cluster0.xxxxx.mongodb.net/study-portal?retryWrites=true&w=majority"

NEXTAUTH_SECRET="run-openssl-rand-base64-32-to-generate"
NEXTAUTH_URL="http://localhost:3000"

GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="StudyPortal"
```

Generate NEXTAUTH_SECRET:
```bash
# On Mac/Linux:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

---

### Step 6: Set Up Prisma

```bash
# Initialize Prisma (if not already done)
npx prisma init

# Push schema to MongoDB (creates all collections)
npx prisma db push

# Generate Prisma client
npx prisma generate
```

---

### Step 7: Copy All Project Files

Copy all files from this project into your `study-portal/` folder maintaining the exact folder structure shown above.

**Key files to copy:**
- `prisma/schema.prisma` → Database models
- `app/` → All pages and API routes
- `components/` → All UI components
- `lib/` → Utilities, auth config, Prisma client
- `middleware.ts` → Route protection
- `tailwind.config.ts` → Theme config
- `app/globals.css` → Custom CSS

---

### Step 8: Run the Development Server

```bash
npm run dev
```

Open → http://localhost:3000

---

### Step 9: Create Your First Admin Account

1. Go to → http://localhost:3000/auth/register
2. Select **Admin** role
3. Fill in name, email, password
4. Sign in at `/auth/login`
5. You'll be redirected to the Admin dashboard

---

### Step 10: Seed Sample Data (Optional)

Create `prisma/seed.ts`:
```typescript
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@studyportal.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@studyportal.com",
      password: await bcrypt.hash("Admin@123", 12),
      role: "ADMIN",
    },
  });
  await prisma.admin.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: { userId: adminUser.id, department: "Computer Science" },
  });

  // Create student
  const studentUser = await prisma.user.upsert({
    where: { email: "student@studyportal.com" },
    update: {},
    create: {
      name: "Jane Student",
      email: "student@studyportal.com",
      password: await bcrypt.hash("Student@123", 12),
      role: "STUDENT",
    },
  });
  await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      rollNumber: "CS2024001",
      branch: "Computer Science",
      semester: 3,
    },
  });

  // Sample note
  await prisma.note.create({
    data: {
      title: "Introduction to Algorithms",
      subject: "Computer Science",
      semester: 3,
      fileUrl: "https://example.com/notes/algorithms.pdf",
      uploadedBy: adminUser.id,
      tags: ["algorithms", "sorting", "chapter1"],
    },
  });

  console.log("✅ Seed data created");
  console.log("Admin: admin@studyportal.com / Admin@123");
  console.log("Student: student@studyportal.com / Student@123");
}

main().catch(console.error).finally(() => prisma.$disconnect());
```

Add to `package.json`:
```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

Run:
```bash
npm install -D ts-node
npx prisma db seed
```

---

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio GUI to view/edit data
npx prisma db push   # Push schema changes to database
npx prisma generate  # Regenerate Prisma client
```

---

## 🌐 Production Deployment (Vercel)

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo at → https://vercel.com

**Environment variables to add in Vercel dashboard:**
```
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL          (set to your production URL)
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

**Update Google OAuth redirect URI:**
- Add `https://yourdomain.vercel.app/api/auth/callback/google`

---

## 🔑 Default Test Credentials (after seeding)

| Role    | Email                       | Password    |
|---------|-----------------------------|-------------|
| Admin   | admin@studyportal.com       | Admin@123   |
| Student | student@studyportal.com     | Student@123 |

---

## 📐 Tech Stack Summary

| Tech             | Purpose                    |
|------------------|----------------------------|
| Next.js 15       | Framework (App Router)      |
| TypeScript       | Type safety                |
| Tailwind CSS     | Styling                    |
| NextAuth v5      | Authentication + OAuth     |
| Prisma ORM       | Database access layer      |
| MongoDB          | NoSQL database             |
| Framer Motion    | Animations                 |
| React Hook Form  | Form management            |
| Zod              | Schema validation          |
| Recharts         | Data visualization         |
| Zustand          | Global UI state            |
| Lucide React     | Icons                      |

---

## 🐛 Common Issues & Fixes

**"Module not found: @/lib/auth"**
→ Make sure `tsconfig.json` has `"@/*": ["./*"]` in paths

**"PrismaClientInitializationError"**
→ Run `npx prisma generate` and check your `DATABASE_URL`

**"NEXTAUTH_SECRET is not set"**
→ Add it to `.env.local` (never commit this file!)

**Google OAuth not working**
→ Check your redirect URI in Google Console matches `http://localhost:3000/api/auth/callback/google`

**MongoDB connection refused**
→ Check Atlas Network Access → add your IP or `0.0.0.0/0`


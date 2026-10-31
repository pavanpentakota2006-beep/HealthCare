# 🎨 HealthCare Frontend (Port 5508)

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.9-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Port-5508-success?style=for-the-badge" alt="Port 5508" />
  <img src="https://img.shields.io/badge/Turbopack-Enabled-F59E0B?style=for-the-badge" alt="Turbopack" />
</p>

The official client application for the **HealthCare Platform**, built with modern **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **Shadcn UI**.

---

## 🚀 Running the Frontend on Port 5508

The frontend is configured to run on **Port 5508**:

```bash
# From the frontend directory:
npm run dev

# Or from the project root:
npm run dev --prefix frontend
```

Once started, open your browser and navigate to:
👉 **[http://localhost:5508](http://localhost:5508)**

### 🔑 Demo Login Credentials
- **Email:** `demo@healthcare.ai`
- **Password:** `Health1234!`
*(Contains pre-seeded meals, hydration logs, sleep logs, workouts, active challenges, badges, and orders!)*

---

## 🛠 Available Scripts

In the `frontend` directory, you can run:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the Next.js dev server on **port 5508** using Turbopack |
| `npm run build` | Compiles an optimized production build |
| `npm run start` | Runs the production server on **port 5508** |
| `npm run lint` | Runs ESLint to check for code issues |

---

## 📂 Architecture & Routing

The frontend utilizes Next.js App Router route groups:

```text
src/
├── app/
│   ├── (auth)/                    # Public Authentication Flow
│   │   ├── login/page.tsx         # User login form
│   │   └── register/page.tsx      # User registration form
│   ├── (dashboard)/               # Protected Dashboard Views
│   │   ├── layout.tsx             # Shared navigation sidebar & header
│   │   ├── page.tsx               # Primary dashboard overview & metrics
│   │   ├── meals/page.tsx         # Meal & macronutrient tracking
│   │   ├── water/page.tsx         # Water intake logger
│   │   ├── sleep/page.tsx         # Sleep hours & quality monitor
│   │   ├── workouts/page.tsx      # Fitness activity tracker
│   │   ├── ai-nutritionist/page.tsx # Conversational AI nutritionist
│   │   ├── challenges/page.tsx    # Gamification, quests & rewards
│   │   ├── directory/page.tsx     # Telemedicine doctors & booking
│   │   ├── store/page.tsx         # Health products e-commerce store
│   │   ├── community/page.tsx     # Social fitness feed
│   │   └── profile/page.tsx       # User profile & clinical records
│   ├── layout.tsx                 # Root layout, dark theme & providers
│   └── globals.css                # Tailwind CSS v4 styling & theme tokens
├── components/ui/                 # Accessible UI components (Card, Button, Dialog...)
├── context/
│   └── UserContext.tsx            # Global user authentication & sync state
└── lib/
    ├── api.ts                     # API client connected to backend (Port 4001)
    └── utils.ts                   # Class name merger (clsx + tailwind-merge)
```

---

## 🔗 Backend API Connection

The frontend connects to the backend API via `src/lib/api.ts`:
- **Default Backend URL:** `http://localhost:4001`
- **Configurable via:** `NEXT_PUBLIC_API_URL` environment variable

Example:
```typescript
import { apiRequest } from '@/lib/api';

// Authenticated request
const data = await apiRequest('/health/sync');
```

---

## 🎨 Design System

- **Styling:** Tailwind CSS v4 with custom dark mode theme variables.
- **Components:** Built using accessible primitives from `@base-ui/react` and styled with `shadcn`.
- **Icons:** High-quality Lucide icons (`lucide-react`).
- **Animations:** Fluid transitions powered by `framer-motion` and `tw-animate-css`.
- **Charts:** Visual health progress rendered using `recharts`.

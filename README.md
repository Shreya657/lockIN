# Lock In — Proof of Work Tracker

**Lock In** is a full-stack productivity engine designed for developers who want to turn their daily "sweat" into data. Stop yapping, start shipping, and visualize your consistency with a high-fidelity contribution heatmap and streak tracking.

![Lock In Dashboard Preview](https://github.com/user-attachments/assets/31606f6b-9441-4677-9a1f-c0b63117d5a0) ## 🚀 Live Demo
[Check out the App](https://lock-in-sable-one.vercel.app)

## ✨ Features
- **📊 Activity Heatmap:** A custom-built contribution graph (inspired by GitHub) to visualize your daily progress.
- **🔥 Streak Engine:** Smart logic that tracks your current and longest streaks, normalized to IST.
- **📱 Mobile-First UI:** Optimized navigation and card-based activity logs for logging on the go.
- **🔍 Intelligent Search:** Filter your proof-of-work by title, category, or even specific dates.
- **🔐 Secure Auth:** Seamless authentication powered by Better Auth.
- **⚡ Performance Optimized:** Grouped timelines and paginated logs using `useMemo` and Server Actions for a buttery-smooth experience.

## 🛠️ Tech Stack
- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (Hosted on Neon)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [Better Auth](https://better-auth.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Date Handling:** [date-fns](https://date-fns.org/) & [date-fns-tz](https://github.com/marnusw/date-fns-tz)

## 🏗️ Architecture
The app follows a modern server-client architecture:
- **Server Components:** High-performance initial data fetching.
- **Server Actions:** Secure database mutations and paginated data fetching.
- **Optimized Client State:** Efficient re-rendering and data grouping using React hooks.

## 🏁 Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/Shreya657/lockIN

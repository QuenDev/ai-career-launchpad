# 🚀 AI Career Launchpad

**AI-powered resume analysis SaaS** — AI Career Launchpad helps you land more interviews by turning your resume into structured AI feedback.
Upload your resume → compare against any job description → get instant ATS score, keyword gaps, and actionable improvements in seconds.

## 🎯 Why I Built This

Most job seekers struggle with:

- Not knowing why they get rejected
- ATS filters blocking their resume
- Generic career advice that doesn’t help

This tool turns resumes into clear, structured, actionable feedback instantly using AI.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://ai-career-launchpad.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

---

## ✨ Features

| Feature                       | Description                                                          |
| ----------------------------- | -------------------------------------------------------------------- |
| 🤖 **AI Resume Analysis**     | Groq-powered LLM analyzes your resume against any job description    |
| 📊 **Match Scoring**          | Get an overall score + breakdowns for Skills, Experience & Education |
| 🔑 **Keyword Insights**       | See matched and missing keywords to beat ATS filters                 |
| 💡 **Actionable Suggestions** | Receive numbered, specific improvements to boost your match          |
| 📄 **PDF Upload**             | Upload your resume as a PDF — text is extracted automatically        |
| 📋 **Copy & Share**           | Copy your full analysis to clipboard or share via native share API   |
| 📜 **Analysis History**       | All past analyses are saved and viewable anytime                     |
| 🔐 **Authentication**         | Secure JWT-based signup, login & protected routes                    |
| 🌗 **Dark Mode**              | Full dark/light theme support with system preference detection       |
| 📱 **Responsive**             | Works beautifully on desktop, tablet, and mobile                     |

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** — React framework with App Router
- **Tailwind CSS v4** — Utility-first styling
- **Framer Motion** — Smooth animations & transitions
- **Shadcn/ui** — Accessible, composable UI components
- **Lucide Icons** — Beautiful, consistent iconography

### Backend

- **Express 5** — Minimal, fast Node.js API server
- **Groq SDK** — Ultra-fast LLM inference (Llama models)
- **pdf-parse v2** — PDF text extraction
- **Multer** — File upload handling
- **Helmet + CORS** — Security headers & cross-origin protection
- **express-rate-limit** — API rate limiting

### Infrastructure

- **Supabase** — PostgreSQL database + authentication
- **Vercel** — Frontend deployment & CDN
- **Render** — Backend API hosting
- **Google Analytics** — User analytics & tracking

---

## 📁 Project Structure

```
ai-career-launchpad/
├── client/                    # Next.js frontend
│   ├── app/
│   │   ├── dashboard/         # Main analysis page
│   │   │   ├── page.tsx       # Dashboard UI
│   │   │   └── useDashboard.ts # Logic hook
│   │   ├── history/           # Past analyses
│   │   ├── profile/           # User profile
│   │   ├── login/             # Login page
│   │   ├── signup/            # Signup page
│   │   ├── auth/callback/     # OAuth callback
│   │   ├── layout.tsx         # Root layout + SEO
│   │   └── page.tsx           # Landing page
│   ├── components/            # Reusable UI components
│   ├── lib/                   # Utilities (auth, api helpers)
│   └── public/                # Static assets
│
├── server/                    # Express backend
│   └── src/
│       ├── controllers/       # Request handlers
│       │   ├── authController.ts
│       │   ├── historyController.ts
│       │   └── uploadController.ts
│       ├── routes/            # API route definitions
│       ├── middleware/         # Auth middleware
│       ├── services/          # AI analysis service
│       ├── config/            # Supabase config
│       └── index.ts           # Server entry point
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **npm** or **yarn**
- [Supabase](https://supabase.com/) account (free tier works)
- [Groq](https://console.groq.com/) API key (free tier available)

### 1. Clone the repository

```bash
git clone https://github.com/QuenDevc/ai-career-launchpad.git
cd ai-career-launchpad
```

### 2. Setup the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

Start the dev server:

```bash
npm run dev
```

### 3. Setup the frontend

```bash
cd client
npm install
```

Create a `.env.local` file in the `client/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX  # optional
```

Start the dev server:

```bash
npm run dev
```

### 4. Open in browser

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔒 API Endpoints

| Method   | Endpoint         | Auth | Description                 |
| -------- | ---------------- | ---- | --------------------------- |
| `POST`   | `/auth/register` | ❌   | Create new account          |
| `POST`   | `/auth/login`    | ❌   | Login & get JWT             |
| `POST`   | `/analyze`       | ✅   | Run AI resume analysis      |
| `POST`   | `/upload/pdf`    | ✅   | Upload & extract PDF text   |
| `POST`   | `/history/save`  | ✅   | Save analysis to history    |
| `GET`    | `/history`       | ✅   | Get user's analysis history |
| `DELETE` | `/history/:id`   | ✅   | Delete a history entry      |
| `GET`    | `/profile`       | ✅   | Get user profile            |

---

## 🌐 Deployment

### Frontend (Vercel)

1. Connect your GitHub repo to [Vercel](https://vercel.com)
2. Set root directory to `client`
3. Add environment variables in Vercel dashboard
4. Deploy — automatic on every push

### Backend (Render)

1. Connect your GitHub repo to [Render](https://render.com)
2. Set root directory to `server`
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Add environment variables in Render dashboard

---

## 📊 Rate Limits

| Endpoint   | Limit                 |
| ---------- | --------------------- |
| Global     | 100 requests / 15 min |
| `/analyze` | 10 requests / hour    |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Built with ❤️ as a full-stack SaaS portfolio project.

---

> **⭐ If you found this useful, give it a star on GitHub!**

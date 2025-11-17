# Arthos – Smart Finance & Digital Asset Management Platform

> A unified platform for financial tracking and digital asset management

---

## 📋 Overview

**Arthos** provides a unified dashboard where users can track daily expenses, manage budgets, and monitor digital art assets or NFT investments — all in one place.

### Problem Statement

Managing both traditional finances and digital assets (like NFTs or online artwork sales) is often fragmented across multiple platforms. Arthos solves this by bringing everything together.

---

## 🏗️ System Architecture

```
Frontend → Backend (REST API) → Database
```

### Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React.js, React Router, Axios, TailwindCSS |
| **Backend** | Node.js, Express.js |
| **Database** | NeonDB Postgres |
| **Authentication** | JWT Authentication |
| **AI Integration** | OpenAI API for insights |
| **Web3 Integration** | Ethereum/Polygon (for NFT metadata management) |
| **Cloud Services** | AWS (for image/file storage and email notifications) |
| **Hosting** | Vercel (Frontend), Render/Railway (Backend) |

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- Secure user registration, login, logout
- Role-based access (User/Admin)

### 💰 Expense Management (CRUD)
- Add, view, edit, and delete expenses
- Filter by date, category, or type

### 🎨 Digital Asset Management (CRUD)
- Upload, list, and track NFT or art asset metadata

### 📊 Analytics & Visualization
- Interactive charts showing spending patterns and asset growth
- Uses Recharts / Chart.js

### 🤖 AI Financial Insights
- Generate automatic spending summaries
- Smart saving tips via OpenAI API

### 🔍 Search, Filter, Sort, Pagination
- Available for both expense records and asset lists

### 🔔 Notifications
- Email alerts for expense thresholds
- New asset activity notifications

### 🌐 Fully Deployed
- Public URLs for frontend, backend, and database

---

## 🔌 API Endpoints

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/auth/signup` | POST | Register a new user | Public |
| `/api/auth/login` | POST | User login and token generation | Public |
| `/api/expenses` | GET | Fetch all expenses (with filters & pagination) | Authenticated |
| `/api/expenses` | POST | Add a new expense | Authenticated |
| `/api/assets` | GET | Get list of digital/NFT assets | Authenticated |
| `/api/assets/:id` | PUT | Update asset details | Authenticated |
| `/api/insights` | GET | Fetch AI-based financial insights | Authenticated |

---

## 🚀 Future Enhancements

- **Payment Integration**: Stripe or mock banking APIs for transaction simulation
- **Smart Contracts**: Solidity for NFT ownership verification
- **Mobile App**: React Native version
- **Advanced AI**: Investment forecasting models
- **Marketplace**: NFT and Stocks trading platform

---

## 📦 Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/arthos.git

# Install frontend dependencies
cd Frontend
npm install

# Install backend dependencies
cd ../Backend
npm install
```

### Environment Variables

**Backend `.env`:**
```env
DATABASE_URL=your_neon_db_url
JWT_SECRET=your_secret_key
PORT=3000
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:3000/api
```

### Run Locally

```bash
# Start backend
cd Backend
npm start

# Start frontend
cd Frontend
npm run dev
```

---

## 🌐 Deployment

- **Frontend**: Deployed on [Vercel](https://vercel.com)
- **Backend**: Deployed on [Render](https://render.com)
- **Database**: Hosted on [NeonDB](https://neon.tech)

---

## 📄 License

MIT License

---

**Built with ❤️ using React, Node.js, and PostgreSQL**




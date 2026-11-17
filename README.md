# 🧭 JobTrail — Job Application Tracker

> A fullstack web application to track your job applications, manage interview stages, and stay on top of your job search — all in one place.

---

## 📸 Preview

> *(Add a screenshot here after deployment)*

---

## ✨ Features

- 🔐 **Authentication** — Register & Login with JWT-based auth
- 📋 **Application Tracking** — Add, edit, delete job applications
- 📊 **Dashboard & Stats** — Visual overview of your application statuses
- 📅 **Interview Management** — Track upcoming interviews
- 🏷️ **Status Management** — Update application status (Applied, Interview, Offer, Rejected, etc.)
- 📈 **Weekly Chart** — See your weekly application activity
- 🛡️ **Protected Routes** — Only authenticated users can access the app

---

## 🛠️ Tech Stack

### Frontend (client/)
| Technology | Purpose |
|---|---|
| React 19 | UI Framework |
| Vite | Build tool & Dev server |
| Redux Toolkit | State management |
| React Router v7 | Client-side routing |
| Material UI (MUI) | Component library |
| Tailwind CSS v4 | Utility-first styling |
| Axios | HTTP client |
| Zod | Form validation |

### Backend (server/)
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express v5 | Web framework |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Tokens (JWT) | Authentication |
| bcryptjs | Password hashing |
| Zod | Schema validation |
| dotenv | Environment config |

---

## 📁 Project Structure

```
jobtrail/
├── client/                   # React + Vite frontend
│   ├── public/
│   └── src/
│       ├── api/              # Axios API calls (auth, applications)
│       ├── components/       # Reusable components
│       │   ├── common/       # Shared UI (Layout, ProtectedRoute, etc.)
│       │   └── dashboard/    # Dashboard widgets
│       ├── context/          # Auth context
│       ├── pages/            # Page components (Login, Register, AppList, etc.)
│       ├── store/            # Redux store & slices
│       └── utils/            # Utility helpers
│
└── server/                   # Node.js + Express backend
    ├── config/               # Env & MongoDB config
    ├── controllers/          # Route handler logic
    ├── middleware/           # Auth middleware
    ├── repositories/         # Database layer (MongoDB)
    ├── routes/               # API route definitions
    ├── schemas/              # Mongoose schemas
    ├── services/             # Business logic
    └── utils/                # Error classes & helpers
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- [MongoDB](https://www.mongodb.com/) — local instance **or** a free [MongoDB Atlas](https://cloud.mongodb.com) cluster

---

### 1. Clone the Repository

```bash
git clone https://github.com/priyanklko1-eng/JOB_TRAIL-APPLICATION.git
cd JOB_TRAIL-APPLICATION
```

---

### 2. Setup the Server (Backend)

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder:

```bash
# server/.env

PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobtrail
JWT_SECRET=your_super_secret_key_minimum_32_characters
CLIENT_ORIGIN=http://localhost:5173
AUTH_REQUIRED=true
DB_TYPE=mongodb
```

> ⚠️ Replace `MONGODB_URI` with your **MongoDB Atlas connection string** if you're not running MongoDB locally.

Start the server:

```bash
npm run dev       # development (with nodemon)
# or
npm start         # production
```

The server will run on **http://localhost:5000**

---

### 3. Setup the Client (Frontend)

Open a **new terminal** and run:

```bash
cd client
npm install
npm run dev
```

The client will run on **http://localhost:5173**

---

### ✅ App is Running!

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |

Open **http://localhost:5173** in your browser, register an account, and start tracking your applications!

---

## 🔌 API Endpoints

### Auth Routes — `/api/auth`
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | ❌ |
| POST | `/api/auth/login` | Login & get JWT token | ❌ |
| GET | `/api/auth/me` | Get current user info | ✅ |

### Application Routes — `/api/applications`
> All application routes require a valid JWT token (Bearer auth)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/applications` | Get all applications |
| POST | `/api/applications` | Create new application |
| GET | `/api/applications/stats` | Get application statistics |
| GET | `/api/applications/:id` | Get single application |
| PATCH | `/api/applications/:id` | Update application |
| PATCH | `/api/applications/:id/status` | Update application status |
| DELETE | `/api/applications/:id` | Delete application |

---

## 🌍 Environment Variables Reference

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Server port |
| `MONGODB_URI` | `mongodb://localhost:27017/jobtrail` | MongoDB connection string |
| `JWT_SECRET` | — | Secret key for signing JWTs (required) |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Frontend URL (for CORS) |
| `AUTH_REQUIRED` | `true` | Enable/disable auth enforcement |
| `DB_TYPE` | `mongodb` | Database type |

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**priyanklko1-eng**  
[GitHub Profile](https://github.com/priyanklko1-eng)

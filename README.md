# ✂️ TrimLink — URL Shortener

A full-stack URL shortener built with React and Express. Paste a long URL, get a short one.

## 🔗 Live Demo

- **Frontend:** [urlshortner177209.netlify.app](https://urlshortner177209.netlify.app)
- **Backend:** [url-shortner-dvuj.onrender.com](https://url-shortner-dvuj.onrender.com)

## ⚙️ Tech Stack

| Layer    | Tech                                          |
| -------- | --------------------------------------------- |
| Frontend | React, Vite, Tailwind CSS, React Query, Axios |
| Backend  | Express, Mongoose, nanoid                     |
| Database | MongoDB                                       |
| Hosting  | Netlify (frontend), Render (backend)          |

## ✨ Features

- Shorten any URL with a unique short ID (nanoid)
- One-click copy to clipboard
- Click tracking — see how many times each link was visited
- Paginated list of recent links
- Rate limiting (100 requests per 15 min)
- Security headers via Helmet

## 📁 Project Structure

```
url-shortner/
├── Backend/
│   ├── controllers/    # Route handlers
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routes
│   ├── db/             # DB connection
│   ├── app.js          # Express app setup
│   └── index.js        # Server entry point
└── frontend/
    └── src/
        └── App.jsx     # Main React component
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB connection string

### Backend

```bash
cd Backend
npm install
```

Create a `.env` file:

```env
PORT=3000
MONGO_URL=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
```

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📡 API Endpoints

| Method | Endpoint          | Description                |
| ------ | ----------------- | -------------------------- |
| POST   | `/api/v1`         | Create a shortened URL     |
| GET    | `/api/v1`         | Get all URLs (paginated)   |
| GET    | `/api/v1/:shortId`| Redirect to original URL   |

### Create Short URL

```bash
POST /api/v1
Content-Type: application/json

{ "redirectUrl": "https://example.com" }
```

### Get All URLs

```
GET /api/v1?page=1&limit=5
```

## 📄 License

MIT

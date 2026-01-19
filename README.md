# 🌍 Smart Itinerary Generator

An end‑to‑end **AI‑powered full‑stack travel planning application** that generates **personalized, budget‑aware, day‑wise itineraries** based on user preferences. The system integrates **AI, authentication, database storage, PDF generation**, and a modern responsive UI.

This project is designed to demonstrate **real‑world full‑stack development skills**, API integration, authentication flows, and clean project architecture.

---

## 📌 Problem Statement

Planning a trip manually requires researching destinations, activities, costs, and daily schedules, which is time‑consuming and inefficient. Most travel apps lack **true personalization** and **AI‑driven planning**.

### Solution

The **Smart Itinerary Generator** automates trip planning using AI to generate:

* Personalized itineraries
* Day‑wise structured plans
* Budget‑conscious recommendations
* Exportable itineraries

---

## 🚀 Core Features

### 🔐 Authentication & Authorization

* Firebase Authentication
* Email & Password login
* Google OAuth login
* Secure token‑based backend authentication

### 🧠 AI Itinerary Generation

* Destination selection (country / city)
* Number of travel days
* Interest‑based filtering:

  * Beaches
  * History
  * Food
  * Adventure
  * Nature
* AI‑generated itinerary using structured prompts

### 📅 Day‑Wise Travel Plan

Each day includes:

* Morning activity
* Afternoon activity
* Evening activity
* Estimated budget
* Key places to visit

### 💾 Trip Management

* Save itineraries to database
* Fetch all user trips
* View trip details anytime

### 📄 PDF Export

* Generate itinerary PDF on demand
* Server‑side PDF generation using PDFKit
* Clean, printable layout

### 🎨 UI & UX

* Responsive design (mobile + desktop)
* Modern card‑based layout
* Smooth navigation
* Loading states & error handling

---

## 🧩 System Architecture

```
Client (Next.js)
   |
   |  Firebase Auth Token
   v
Backend (Node + Express)
   |
   |  MongoDB Queries
   v
Database (MongoDB Atlas)
   |
   |  AI Prompt
   v
AI Service (Gemini / GPT)
```

---

## 🛠️ Tech Stack

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Axios
* Firebase Authentication

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* PDFKit
* JWT

### AI & APIs

* Gemini / GPT API
* Google Maps Links

### Deployment

* Frontend: Vercel
* Backend: Render / Railway
* Database: MongoDB Atlas

---

## 📁 Complete Project Structure

```
smart-itinerary-generator/
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Landing page
│   │   ├── login/               # Login page
│   │   ├── register/            # Signup page
│   │   ├── dashboard/           # User dashboard
│   │   ├── generate/            # Itinerary generator
│   │   ├── trips/               # Saved trips
│   │   └── api/                 # Next.js API routes (if any)
│   │
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── TripCard.tsx
│   │   ├── ItineraryDay.tsx
│   │   ├── Button.tsx
│   │   └── Loader.tsx
│   │
│   ├── context/
│   │   └── AuthContext.tsx      # Global auth state
│   │
│   ├── lib/
│   │   ├── firebase.ts          # Firebase config
│   │   ├── axios.ts             # Axios instance
│   │   └── api.ts               # API helpers
│   │
│   ├── public/
│   │   └── images/
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   ├── tripController.js    # Trip CRUD
│   │   └── pdfController.js     # PDF generation
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── tripRoutes.js
│   │   └── pdfRoutes.js
│   │
│   ├── models/
│   │   └── Trip.js              # Mongoose schema
│   │
│   ├── services/
│   │   └── aiService.js         # AI prompt logic
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

```
PORT=5000
MONGO_URI=your_mongodb_uri
AI_API_KEY=your_ai_key
JWT_SECRET=your_secret
```

### Frontend (`frontend/.env.local`)

```
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

---

## ⚙️ Installation & Running Locally

### 1️⃣ Clone Repository

```
git clone https://github.com/your-username/smart-itinerary-generator.git
cd smart-itinerary-generator
```

### 2️⃣ Backend Setup

```
cd backend
npm install
npm start
```

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 🔄 Authentication Flow

1. User logs in using Firebase
2. Firebase returns ID Token
3. Token sent to backend
4. Backend verifies token
5. User session created

---

## 📄 PDF Export Flow

1. Frontend sends itinerary JSON
2. Backend generates PDF using PDFKit
3. PDF streamed as response
4. Browser downloads PDF

---

## 🧪 Error Handling & Security

* Protected routes
* Token verification
* API error responses
* Environment variable protection

---

## 📌 Future Enhancements

* Hotel & flight booking integration
* Real‑time map embedding
* Cost comparison APIs
* Multi‑language support
* Group trip collaboration

---

## 👨‍💻 Author

**Shanidhya Kumar**
Full‑Stack Developer | AI & Web Development Enthusiast

---

## ⭐ Acknowledgements

* Firebase
* MongoDB
* Google APIs
* OpenAI / Gemini

---

If you found this project useful, don’t forget to ⭐ the repository!

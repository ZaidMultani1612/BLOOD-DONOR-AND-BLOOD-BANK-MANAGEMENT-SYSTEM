# HealthTech – Blood Donor & Blood Bank Management System

A complete, modern, responsive, and functional **Blood Donor & Blood Bank Management System** developed using the full **MERN stack** (MongoDB, Express.js, React.js with Vite, and Node.js) with Tailwind CSS, Lucide Icons, Leaflet interactive maps, and Recharts analytics.

Designed strictly around the **HealthTech UI design reference**, featuring a teal/green curved sidebar, white overview cards, 8 blood group inventory badges, interactive geolocation stock maps, and real-time MongoDB REST APIs.

---

## 🚀 Key Features

### 1. Four User Roles & Role-Based Access Control (RBAC)
- **Admin**: Full system visibility, overview metric cards, blood inventory control, donor/recipient management, emergency SOS broadcasts, donation camps, and analytics.
- **Blood Bank**: Center stock management across all 8 blood groups, incoming request approvals/fulfillments, appointment slot logs, donation camp creation, and hospital messaging.
- **Donor**: Profile management, donation history, upcoming appointments, donation camp registrations, reward points, and milestone badges.
- **Recipient**: Search available blood banks by blood group and city, submit blood requests, and live request tracking (`Pending` ➔ `Approved` ➔ `Processing` ➔ `Fulfilled`).
- **Hospital**: Emergency blood requests, real-time inventory queries, and direct chat communication with blood banks.

### 2. Admin Dashboard (Matching HealthTech Reference)
- **Overview Cards**:
  - Total Blood Units (1,250)
  - Donors This Month (320)
  - Available Blood Units (980)
  - Low Stock Groups (2 - Alert)
  - Pending Requests (18)
  - Active Emergencies (3 - Urgent)
  - Upcoming Appointments (45)
  - Expiring Blood Units (22 - 7 Days)
- **Blood Group Inventory**:
  - Live status for all eight blood groups: `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`
  - Available units and low-stock indicators (`Normal` / `Low Stock`).

### 3. Blood Inventory Module
- Real-time stock tracking with auto-calculated status based on threshold limits.
- Full CRUD operations: Add stock, edit units, set expiry dates, and delete expired records.
- Automatic inventory deduction upon request fulfillment.

### 4. Interactive Blood Stock Map
- Built using **Leaflet** & OpenStreetMap.
- Custom blood drop markers and popups displaying blood bank details, location, and available units.
- Search and filter by city, pincode, and blood group.

### 5. Emergency SOS Module
- High-priority urgent blood requirement broadcast.
- Visual alerts for immediate donor mobilization and hospital dispatch.
- Fast status resolution workflow.

### 6. Hospital & Blood Bank Communication
- Messaging interface between hospitals and blood banks for urgent unit queries and transfer logistics.
- Built-in Socket.IO real-time delivery with REST API message history persistence.

### 7. Donor Rewards & Leaderboard
- Verified donation points system (+50 points per verified donation).
- Honor badges: `Bronze Donor`, `Silver Hero`, `Gold Savior`, `Platinum Champion`, `Life Guardian`.
- Community leaderboard honoring top donors.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router DOM v6, Axios, Lucide React, Recharts, Leaflet & React-Leaflet, Socket.IO Client.
- **Backend**: Node.js, Express.js, Mongoose, JSON Web Tokens (JWT), bcryptjs, Morgan, Socket.IO.
- **Database**: MongoDB with automatic zero-setup In-Memory Server fallback (runs seamlessly even if local MongoDB service isn't pre-installed).

---

## 📁 Project Structure

```
BLOOD DONOR AND BLOOD BANK MANAGEMENT SYSTEM/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection & auto-fallback
│   ├── controllers/            # Business logic controllers
│   ├── middleware/             # JWT auth & RBAC authorization
│   ├── models/                 # 13 Mongoose data models
│   ├── routes/                 # Express API routes
│   ├── utils/
│   │   └── seed.js             # Realistic test dataset seeder
│   ├── server.js               # HTTP & Socket.IO server
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/         # Sidebar, Header, StatCard, BloodGroupCard, Modal
│   │   ├── context/            # AuthContext (JWT state management)
│   │   ├── layouts/            # DashboardLayout with sidebar & header
│   │   ├── pages/
│   │   │   ├── admin/          # Admin Dashboard, Inventory, Donors, Requests, Map, Analytics, etc.
│   │   │   ├── auth/           # Login, Register, Forgot Password
│   │   │   ├── bloodbank/      # Blood Bank Dashboard
│   │   │   ├── donor/          # Donor Dashboard
│   │   │   ├── hospital/       # Hospital Dashboard
│   │   │   ├── profile/        # User Profile Page
│   │   │   └── recipient/      # Recipient Dashboard
│   │   ├── services/           # Axios API service
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore
├── package.json
└── README.md
```

---

## ⚡ Installation & Execution Guide

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Step 1: Install Dependencies
Open your terminal in the project directory:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Seed Sample Dataset
The database includes a pre-configured seeder that populates the exact data from the HealthTech design reference:

```bash
cd backend
npm run seed
```

### Step 3: Start the Backend Server
```bash
cd backend
npm start
```
The server will start on `http://localhost:5000`.

### Step 4: Start the Frontend Application
In a second terminal window:

```bash
cd frontend
npm run dev
```
Open your browser and navigate to: **`http://localhost:5173`**

---

## 🔑 Pre-Seeded Test Accounts

You can log in directly using any of the accounts below:

| Role | Email | Password | Access Features |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@bloodbank.com` | `adminpassword123` | Full Admin Dashboard, Inventory, Donors, Camps, Map |
| **Blood Bank** | `suratcity@bloodbank.com` | `bankpassword123` | Stock Management, Incoming Requests, Camps |
| **Donor** | `amit@donor.com` | `donorpassword123` | Personal History, Rewards, Appointment Booking |
| **Recipient** | `john@recipient.com` | `recipientpassword123` | Search Blood, Submit Requests, Track Status |
| **Hospital** | `civil@hospital.com` | `hospitalpassword123` | Emergency Unit Orders, Blood Bank Messaging |

*Tip: The Login page also provides 1-click quick-fill buttons for rapid role switching during testing and demonstrations.*

---

## 📡 REST API Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user (Donor, Recipient, Blood Bank, Hospital) |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |
| `GET` | `/api/admin/overview` | Admin dashboard metric cards & blood group counts |
| `GET` | `/api/admin/donors` | Donor records with search, group, and location filters |
| `GET` | `/api/admin/analytics` | Chart analytics for stock distribution and trends |
| `GET` | `/api/inventory` | Blood inventory list with status filters |
| `POST` | `/api/inventory` | Add blood stock batch |
| `PUT` | `/api/inventory/:id` | Update blood stock units / expiry |
| `DELETE` | `/api/inventory/:id` | Remove inventory item |
| `GET` | `/api/requests` | List blood requests with search and urgency filters |
| `POST` | `/api/requests` | Submit new blood request |
| `PUT` | `/api/requests/:id/status`| Update status (`Approved`, `Processing`, `Fulfilled`, etc.) |
| `GET` | `/api/bloodbanks` | Blood banks list with coordinates & available units for map |
| `GET` | `/api/emergencies` | List active emergency SOS broadcasts |
| `POST` | `/api/emergencies` | Broadcast emergency SOS |
| `PUT` | `/api/emergencies/:id/resolve`| Resolve emergency alert |
| `GET` | `/api/camps` | List upcoming donation camps |
| `POST` | `/api/camps` | Schedule new donation camp |
| `POST` | `/api/camps/:id/register` | Register donor for donation camp |
| `GET` | `/api/rewards` | Donor leaderboard & achievement badges |
| `GET` | `/api/chats/conversations` | Get active hospital / blood bank message threads |
| `POST` | `/api/chats/send` | Send hospital / blood bank chat message |

---

## 🛡️ Medical Verification Notice
In accordance with professional medical software standards:
*Blood group matching alone does not establish medical suitability for transfusion. All clinical transfusions require antibody screening, cross-matching, and verification by certified medical and blood banking professionals.*

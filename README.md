# 🚨 Crime Portal

A full-stack **🚨 Crime Monitoring Portal** built with the **MERN stack**. Citizens of Karachi can register complaints about crimes (even anonymously), confirm and discuss each other's reports, follow the status of their complaints, and explore live crime statistics on charts and a map. Every number, chart and card on the site comes from the database.

---

## ✨ Features

### 📝 Complaints

- 📝 Register a complaint with title, description, region, area, category and an optional image
- ✏️ Edit and delete your own complaints
- 🕵️ **Anonymous reporting:** your name and photo are hidden from other users (hidden on the server, not only on screen)
- 📊 **Complaint status:** Pending, Under Review, Resolved (changed by an admin)
- 👀 **Confirm incident ("I also saw this"):** other users can confirm a report, and 3 confirmations mark it as *Verified by community*
- 👍 Like, 👎 dislike and 💬 comment (the comment owner or the post owner can delete a comment)
- 🔎 Search by title, description, area or name, filter by region, category and status, and sort by newest, most liked, most commented or most confirmed

---

### 📊 Live Data (No Dummy Content)

- 🏠 **Home page:** district-wise bars, recent crimes, category counts, community numbers, area safety scores and most discussed crimes
- 📈 **Crime Reports page:** pie chart (by district), line chart (by category), complaint status progress, area safety scores and live counts
- 🛡️ **Area Safety Score:** a score out of 100 for each district from the complaints of the last 30 days
- 🗺️ **Crime Map:** Karachi map using Leaflet + OpenStreetMap with a pin for each area, filters by category, status and time, and a list of the most reported areas

---

### 👤 Users

- 🔐 Register and log in (JWT authentication, passwords hashed with bcrypt)
- 🔔 **Notifications:** bell icon and notifications page for likes, comments, confirmations and status changes on your complaints
- 👤 Profile page with your photo, name, email, your own complaints and the likes/comments you received
- 🚑 **Emergency numbers page** (police, ambulances, fire, rescue) with call and copy buttons
- 🆘 Floating emergency button on every page
- 📩 Contact form saved to the database, with a "Your Messages" list showing which messages were seen
- 📧 Newsletter subscription (emails are saved to the database)

---

### 👨‍💼 Admin

- 🔄 Change the status of any complaint
- 📩 Read, mark as read/unread and delete contact messages

---

### 🎨 Design

- 📱 Responsive UI with Tailwind CSS
- ✨ Scroll animations
- 🔢 Count-up numbers
- 🖱️ Hover effects
- 💡 Mouse-follow spotlight

---

## 🛠️ Tech Stack

| Part | Technologies |
|---|---|
| 🎨 Frontend | React 18, Vite, React Router, Tailwind CSS, Axios, Chart.js, Leaflet, React Toastify, React Icons |
| ⚙️ Backend | Node.js, Express 5, Mongoose, JSON Web Token, bcryptjs, Multer, CORS, dotenv |
| 🗄️ Database | MongoDB (local or MongoDB Atlas) |

---

## 📂 Project Structure

```text
Portal/
│
├── Backend/
│   ├── index.js
│   ├── db.js
│   ├── config.js
│   ├── middleware/
│   ├── models/
│   ├── Routes/
│   ├── utils/
│   └── uploads/
│
└── Frontend/
    ├── index.html
    ├── tailwind.config.js
    └── src/
        ├── components/
        ├── pages/
        └── images/
```

---

## 🚀 Getting Started (Local)

### 📋 Requirements

- 🟢 Node.js 18 or newer
- 🟢 MongoDB running locally or a MongoDB Atlas connection string

### 1️⃣ Backend

```bash
cd Backend
npm install
```

Create a `.env` file:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/crime-portal
JWT_SECRET=write_a_long_random_text_here
CLIENT_URL=http://localhost:5173
```

Run the backend:

```bash
npm run dev
```

or:

```bash
npm start
```

The API runs on:

```text
http://localhost:4000
```

### 2️⃣ Frontend

```bash
cd Frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:4000
```

Run the frontend:

```bash
npm run dev
```

The app runs on:

```text
http://localhost:5173
```

---

## 🔑 Admin Setup

Register a normal account first. Then, in MongoDB Compass, open the `users` collection and add:

```text
isAdmin: true
```

Log out and log in again to access admin functionality.

---

## 🔌 API Overview

### 🔐 Authentication

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login and receive token |
| GET | `/api/auth/getuser` | Get logged-in user |
| PUT | `/api/auth/update_profile` | Update name and photo |

### 📝 Complaints

| Method | Route | Description |
|---|---|---|
| GET | `/get_all_post` | Get all complaints |
| GET | `/my_posts` | Get logged-in user's complaints |
| POST | `/add_post` | Add a complaint |
| PUT | `/edit_post/:id` | Edit own complaint |
| DELETE | `/delete_post/:id` | Delete own complaint |
| PUT | `/Add_Like/:id` | Like complaint |
| PUT | `/Add_disLike/:id` | Dislike complaint |
| PUT | `/confirm/:id` | Confirm incident |
| POST | `/add_comment/:id` | Add comment |
| DELETE | `/delete_comment/:postId/:commentId` | Delete comment |
| PUT | `/set_status/:id` | Change complaint status |
| GET | `/stats` | Get statistics |
| GET | `/safety` | Get safety scores |
| GET | `/map` | Get map data |

---

## 🗺️ How the Area Safety Score Works

Every district starts at **100**. Each complaint from the last 30 days lowers the score according to crime severity.

- 🔴 Murder, target killing, bomb blast and gang rape: **5 points**
- 🟠 Robbery: **3 points**
- 🟡 Snatching: **2 points**
- ✅ Resolved complaints count only half

The final score determines the district's safety level:

- 🟢 **80–100:** Safe
- 🟡 **50–79:** Moderate
- 🔴 **Below 50:** High Risk

---

## ☁️ Deployment

### 🗄️ Database
Create a free MongoDB Atlas cluster and configure the connection string.

### ⚙️ Backend
The backend can be deployed on services such as Render.

**Root directory:**
```text
Backend
```

**Build command:**
```bash
npm install
```

**Start command:**
```bash
npm start
```

### 🌐 Frontend
The frontend can be deployed on Vercel or Netlify.

**Root directory:**
```text
Frontend
```

**Build command:**
```bash
npm run build
```

**Output directory:**
```text
dist
```

---

## ⚠️ Known Limitations

- 🖼️ Uploaded images are stored on the server disk.
- 🔑 Forgot Password is currently UI only.
- 📧 Newsletter saves emails but does not send emails.
- 📍 Map pins show the approximate centre of each area.
- 🔔 Notifications refresh every 30 seconds using polling.
- 🚨 Emergency numbers were collected from public sources and can change.
- 🌐 The interface is English only.
- 📄 Privacy Policy and Terms links are placeholders.
- 🔐 Auth token is stored in `localStorage`.

---

## 👩‍💻 Author

Made by **Hisra Khan** as a class assignment.

⭐ If you find this project useful, consider giving the repository a star!
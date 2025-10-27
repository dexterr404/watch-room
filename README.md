# 🎬 WatchRoom — Real-Time Video Watch & Chat Platform

![License](https://img.shields.io/badge/license-MIT-blue) ![Node](https://img.shields.io/badge/node-v18+-green) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql\&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?logo=react\&logoColor=61DAFB) ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase\&logoColor=white) ![Mux](https://img.shields.io/badge/Mux-FF4F00?logo=mux\&logoColor=white)

![WatchRoom Banner](https://raw.githubusercontent.com/dexterr404/watch-room/main/client/src/assets/logo.svg)

> A modern and secure **video watchroom app** where friends can stream, chat, and share videos together — powered by **React, TypeScript, Node.js, Supabase, and Mux**.

**🌐 [Live Demo](https://watch-room.dexterr404.dev/)** | **📂 [GitHub Repository](https://github.com/dexterr404/watch-room)**

---

## 🚀 Overview

**WatchRoom** lets users create private or public video rooms to **watch videos together** and **chat in real time** — just like a virtual movie night.

It’s built for speed, reliability, and privacy using:

* ⚛️ **React + TypeScript** (frontend)
* 🧩 **Node.js + Express** (backend)
* 🗄️ **PostgreSQL + Supabase** (database + auth + realtime)
* 🎞️ **Mux** (secure video hosting/streaming)
* 💬 **React Player + Supabase Realtime** (live playback + chat)

Perfect for watch parties, study groups, and small communities.

---

## ✨ Key Features

### 🎥 Watch Together

* Supports YouTube, Vimeo, Mux assets, and direct video URLs
* Seamless playback powered by **React Player**

### 💬 Real-Time Chat

* Instant messaging with Supabase Realtime
* Auto-scroll for active conversations
* Timestamps and sender names

### 🔒 Private & Secure Rooms

* Room owners control who joins
* **Regenerate room keys** anytime to block unwanted users
* Kick participants instantly and refresh the room access key

### 🧍 Participant System

* Live participant list
* Owner and member roles

### 📤 Video Uploads via Mux

* Upload and encode videos securely to Mux
* Adaptive bitrate streaming (no buffering)
* Automatic thumbnail generation

### ⚡ Supabase Auth Integration

* Secure and convenient Google OAuth login
* Server-verified JWT for secure API calls
* Access control for private rooms and owner-only settings

### 🎛️ Owner Controls

* Toggle room privacy (public/private)
* Manage participants (kick users)
* Update room settings and thumbnail
* Regenerate **room keys** for access resets

---

## 🛠️ Tech Stack

**Frontend**

* ⚛️ React (Vite + TypeScript)
* 💨 Tailwind CSS
* 🧭 React Router
* 🎞️ React Player
* ⚡ React Query (TanStack) for server state

**Backend**

* 🧩 Node.js + Express
* 🗄️ PostgreSQL (via Supabase)
* 🔐 Supabase Auth (JWT validation)
* 📡 Supabase Realtime (chat + participants)
* 🎬 Mux Video API (upload + playback)
* 🧰 REST API endpoints for rooms, keys, and participants

---

## 🧩 Architecture

```
WatchRoom
│
├── Frontend (React + TypeScript)
│   ├── Pages: Landing, Rooms, WatchRoom
│   ├── Components: RoomCard, ChatBox, VideoPlayer
│   ├── Hooks: useWatchRoom (realtime messages + participants)
│
├── Backend (Express + Supabase)
│   ├── Auth middleware (JWT validation)
│   ├── Routes:
│   │   ├── POST /rooms          → create room
│   │   ├── GET /rooms/:id       → fetch room details
│   │   ├── PATCH /rooms/:id/change-key → regenerate room key
│   │   ├── DELETE /rooms/:id/kick-participant → kick user
│   │   └── ...
│
├── Database (Supabase PostgreSQL)
│   ├── Tables: users, rooms, room_participants, messages
│   ├── Row Level Security enabled
│
└── Streaming (Mux)
    ├── Secure upload endpoint
    ├── Playback ID + Asset ID stored per room
```

---

## 💬 Real-Time Chat Flow

1. User joins room → added to `room_participants`
2. Supabase Realtime listens to `messages` table
3. New message inserted → broadcast instantly to all participants
4. Owner can toggle chat visibility or clear messages

---

## 🔐 Security Highlights

* 🔑 **JWT-protected endpoints** (via Supabase Auth)
* 🕵️ **Private room access** verified via membership
* 🚫 **Kick & ban mechanism** using regenerated room keys
* 🧱 **RLS (Row Level Security)** on Supabase tables
* 🌍 HTTPS enforced in production

---

## ⚙️ Setup & Installation

### Prerequisites

Make sure you have:

* Node.js 18+
* Supabase project (with Auth + Database)
* Mux account
* PostgreSQL database linked to Supabase

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/dexterr404/watch-room.git
   cd watch-room
   ```

2. **Install dependencies**

   ```bash
   # Server
   cd server
   npm install

   # Client
   cd ../client
   npm install
   ```

3. **Configure environment variables**

   **Server `.env`:**

   ```properties
   APP_BASE_URL=your_app_base_url
   PORT=5000
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_service_key
   MUX_TOKEN=your_mux_token
   MUX_SECRET=your_mux_secret
   ```

   **Client `.env`:**

   ```properties
   VITE_API_BASE_URL=http://localhost:5000
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the app**

   Start backend:

   ```bash
   cd server
   npm run dev
   ```

   Start frontend:

   ```bash
   cd ../client
   npm run dev
   ```

5. **Access the app**

   * Frontend: [http://localhost:5173](http://localhost:5173)
   * API: [http://localhost:5000/api](http://localhost:5000/api)

---


## 🗺️ Roadmap

* [ ] Play, pause, and seek videos — all synced across participants
* [ ] Reactions/emojis in chat
* [ ] Owner-only announcements
* [ ] Improved Mux thumbnail previews

---

## 🤝 Contributing

Contributions and suggestions are welcome!

1. Fork this repository
2. Create a new branch (`git checkout -b feature/awesome-feature`)
3. Commit your changes (`git commit -m 'Add awesome feature'`)
4. Push to the branch (`git push origin feature/awesome-feature`)
5. Open a Pull Request 🚀

---

## 🧾 License

Licensed under the **MIT License**.
This project is licensed under the [MIT License](https://github.com/dexterr404/watch-room/blob/main/LICENSE).

---

## 🌐 Connect

🐙 [GitHub](https://github.com/dexterr404)
💼 [LinkedIn](https://www.linkedin.com/in/dexter-ian-javier-09397637b/)
📧 [Email](mailto:dexterr404.dev@gmail.com)

---

> *“Your Personal Watch Party Space”*
